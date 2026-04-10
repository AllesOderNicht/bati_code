#!/usr/bin/env bash

set -euo pipefail

DOMAIN="${DEPLOY_DOMAIN:-www.alleschen.com}"
BASE_PATH="${DEPLOY_BASE_PATH:-/bati}"
REPO_URL="${1:-${DEPLOY_REPO_URL:-}}"
REPO_BRANCH="${2:-${DEPLOY_REPO_BRANCH:-main}}"
APP_DIR="${DEPLOY_APP_DIR:-/opt/${DOMAIN}/app}"
REMOTE_SCRIPT_NAME="deploy-aliyun-bati-remote.sh"
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SELF_DIR}/.." && pwd)"

if [[ "${BASE_PATH}" != "/" ]]; then
  BASE_PATH="${BASE_PATH%/}"
fi

usage() {
  cat <<EOF
用法:
  方式一：代码已在服务器当前目录
    bash scripts/deploy-aliyun-bati-on-server.sh

  方式二：服务器是空机，脚本自动拉取 Git 仓库后部署
    bash scripts/deploy-aliyun-bati-on-server.sh <repo-url> [branch]

示例:
  bash scripts/deploy-aliyun-bati-on-server.sh
  bash scripts/deploy-aliyun-bati-on-server.sh https://github.com/your-name/bati_code.git main

可选环境变量:
  DEPLOY_DOMAIN=${DOMAIN}
  DEPLOY_BASE_PATH=${BASE_PATH}
  DEPLOY_APP_DIR=${APP_DIR}
  DEPLOY_REPO_URL=https://github.com/your-name/bati_code.git
  DEPLOY_REPO_BRANCH=main
EOF
}

run_as_root() {
  if [[ "$(id -u)" -eq 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

ensure_os() {
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

ensure_package() {
  local package_name="$1"
  if ! rpm -q "${package_name}" >/dev/null 2>&1; then
    run_as_root dnf install -y "${package_name}"
  fi
}

resolve_source_dir() {
  if [[ -f "${PROJECT_ROOT}/scripts/${REMOTE_SCRIPT_NAME}" && -f "${PROJECT_ROOT}/package.json" ]]; then
    echo "${PROJECT_ROOT}"
    return 0
  fi

  if [[ -n "${REPO_URL}" ]]; then
    echo "==> 安装 Git 并拉取代码"
    ensure_package git
    run_as_root mkdir -p "$(dirname "${APP_DIR}")"
    run_as_root rm -rf "${APP_DIR}"
    run_as_root git clone --depth=1 --branch "${REPO_BRANCH}" "${REPO_URL}" "${APP_DIR}"
    run_as_root chown -R "$(id -un):$(id -gn)" "${APP_DIR}"
    echo "${APP_DIR}"
    return 0
  fi

  usage >&2
  echo >&2
  echo "未检测到可部署源码目录；请在项目根目录运行，或提供 Git 仓库地址。" >&2
  exit 1
}

ensure_remote_script() {
  local source_dir="$1"
  if [[ ! -f "${source_dir}/scripts/${REMOTE_SCRIPT_NAME}" ]]; then
    echo "缺少远程部署脚本: ${source_dir}/scripts/${REMOTE_SCRIPT_NAME}" >&2
    exit 1
  fi
}

ensure_os
ensure_package curl
ensure_package sudo

SOURCE_DIR="$(resolve_source_dir)"
ensure_remote_script "${SOURCE_DIR}"

echo "==> 开始在服务器内部署"
echo "源码目录: ${SOURCE_DIR}"
echo "域名: ${DOMAIN}"
echo "路径: ${BASE_PATH}"

bash "${SOURCE_DIR}/scripts/${REMOTE_SCRIPT_NAME}" "${SOURCE_DIR}" "${DOMAIN}" "${BASE_PATH}"
