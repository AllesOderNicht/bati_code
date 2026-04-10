#!/usr/bin/env bash

set -euo pipefail

SOURCE_DIR="${1:-}"
DOMAIN="${2:-www.alleschen.com}"
BASE_PATH="${3:-/bati}"
NODE_MAJOR_VERSION="${NODE_MAJOR_VERSION:-24}"
NVM_VERSION="${NVM_VERSION:-v0.40.3}"
if [[ "${BASE_PATH}" != "/" ]]; then
  BASE_PATH="${BASE_PATH%/}"
fi
BUILD_BASE="${BASE_PATH%/}/"
DEPLOY_ROOT="/var/www/${DOMAIN}"
DEPLOY_DIR="${DEPLOY_ROOT}${BASE_PATH}"
NGINX_CONF_PATH="/etc/nginx/conf.d/${DOMAIN}.conf"
APP_SOURCE_ARCHIVE_DIR="/opt/${DOMAIN}/source"
CURRENT_USER="${SUDO_USER:-$(id -un)}"
CURRENT_GROUP="$(id -gn "${CURRENT_USER}")"
NVM_DIR="${NVM_DIR:-${HOME}/.nvm}"

if [[ -z "${SOURCE_DIR}" || ! -d "${SOURCE_DIR}" ]]; then
  echo "远程源码目录不存在: ${SOURCE_DIR}" >&2
  exit 1
fi

if [[ "${BASE_PATH}" != /* ]]; then
  echo "部署路径必须以 / 开头，例如 /bati" >&2
  exit 1
fi

run_as_root() {
  if [[ "$(id -u)" -eq 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

ensure_supported_os() {
  if [[ ! -f /etc/os-release ]]; then
    echo "无法识别当前系统，缺少 /etc/os-release" >&2
    exit 1
  fi

  # shellcheck disable=SC1091
  source /etc/os-release

  if [[ "${PRETTY_NAME:-}" != *"Alibaba Cloud Linux 3"* && "${NAME:-}" != *"Alibaba Cloud Linux"* ]]; then
    echo "当前脚本仅针对 Alibaba Cloud Linux 3 做过验证，当前系统为: ${PRETTY_NAME:-unknown}" >&2
    exit 1
  fi
}

ensure_dnf_package() {
  local package_name="$1"
  if ! rpm -q "${package_name}" >/dev/null 2>&1; then
    run_as_root dnf install -y "${package_name}"
  fi
}

ensure_nvm() {
  if [[ ! -s "${NVM_DIR}/nvm.sh" ]]; then
    echo "==> 安装 nvm ${NVM_VERSION}"
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash
  fi

  # shellcheck disable=SC1090
  source "${NVM_DIR}/nvm.sh"
}

ensure_node() {
  local required_major="v${NODE_MAJOR_VERSION}."

  if ! command -v node >/dev/null 2>&1 || [[ "$(node -v 2>/dev/null)" != ${required_major}* ]]; then
    echo "==> 安装 Node.js ${NODE_MAJOR_VERSION}"
    nvm install "${NODE_MAJOR_VERSION}"
  fi

  nvm alias default "${NODE_MAJOR_VERSION}" >/dev/null
  nvm use "${NODE_MAJOR_VERSION}" >/dev/null

  if [[ "$(node -v)" != ${required_major}* ]]; then
    echo "Node.js 版本校验失败，当前版本: $(node -v)" >&2
    exit 1
  fi
}

write_nginx_conf() {
  local conf_tmp
  conf_tmp="$(mktemp)"

  cat > "${conf_tmp}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${DEPLOY_ROOT};
    index index.html;

    location = / {
        return 301 ${BASE_PATH}/;
    }

    location = ${BASE_PATH} {
        return 301 ${BASE_PATH}/;
    }

    location ^~ ${BASE_PATH}/assets/ {
        try_files \$uri =404;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    location ^~ ${BASE_PATH}/ {
        try_files \$uri \$uri/ ${BASE_PATH}/index.html;
    }
}
EOF

  run_as_root mkdir -p "$(dirname "${NGINX_CONF_PATH}")"
  run_as_root cp "${conf_tmp}" "${NGINX_CONF_PATH}"
  rm -f "${conf_tmp}"
}

echo "==> 检查系统依赖"
ensure_supported_os
ensure_dnf_package curl
ensure_dnf_package nginx
ensure_dnf_package tar
ensure_dnf_package gzip
ensure_dnf_package git

echo "==> 检查 nvm 与 Node.js ${NODE_MAJOR_VERSION}"
ensure_nvm
ensure_node

echo "==> 安装前端依赖"
cd "${SOURCE_DIR}"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

echo "==> 构建前端资源"
VITE_APP_BASE="${BUILD_BASE}" npm run build

echo "==> 归档本次部署源码"
run_as_root mkdir -p "${APP_SOURCE_ARCHIVE_DIR}"
run_as_root rm -rf "${APP_SOURCE_ARCHIVE_DIR:?}"/*
run_as_root cp -R "${SOURCE_DIR}/". "${APP_SOURCE_ARCHIVE_DIR}/"
run_as_root chown -R "${CURRENT_USER}:${CURRENT_GROUP}" "${APP_SOURCE_ARCHIVE_DIR}"

echo "==> 发布静态资源到 ${DEPLOY_DIR}"
run_as_root mkdir -p "${DEPLOY_ROOT}"
run_as_root rm -rf "${DEPLOY_DIR}"
run_as_root mkdir -p "${DEPLOY_DIR}"
run_as_root cp -R "${SOURCE_DIR}/dist/". "${DEPLOY_DIR}/"
run_as_root chown -R nginx:nginx "${DEPLOY_ROOT}"

echo "==> 生成 nginx 配置"
write_nginx_conf

echo "==> 启动并重载 nginx"
run_as_root systemctl enable nginx
run_as_root nginx -t
run_as_root systemctl restart nginx

if command -v firewall-cmd >/dev/null 2>&1 && run_as_root systemctl is-active --quiet firewalld; then
  echo "==> 放通 firewalld 的 HTTP 端口"
  run_as_root firewall-cmd --permanent --add-service=http >/dev/null
  run_as_root firewall-cmd --reload >/dev/null
fi

echo "==> 部署完成"
echo "访问地址: http://${DOMAIN}${BASE_PATH}/"
echo "部署目录: ${DEPLOY_DIR}"
