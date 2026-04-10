#!/usr/bin/env bash

set -euo pipefail

DOMAIN="${DEPLOY_DOMAIN:-www.alleschen.com}"
BASE_PATH="${DEPLOY_BASE_PATH:-/bati}"
REMOTE_TARGET="${1:-}"
SSH_KEY_PATH="${SSH_KEY_PATH:-}"
DEPLOY_ENABLE_HTTPS="${DEPLOY_ENABLE_HTTPS:-auto}"
SSL_SEARCH_DIR="${SSL_SEARCH_DIR:-/ssl}"
SSL_CERT_PATH="${SSL_CERT_PATH:-}"
SSL_KEY_PATH="${SSL_KEY_PATH:-}"
HTTP2_MODE="${HTTP2_MODE:-auto}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
REMOTE_TMP_DIR="/tmp/bati-deploy-${TIMESTAMP}"
REMOTE_ARCHIVE="${REMOTE_TMP_DIR}/source.tar.gz"
REMOTE_SOURCE_DIR="${REMOTE_TMP_DIR}/source"

if [[ "${BASE_PATH}" != "/" ]]; then
  BASE_PATH="${BASE_PATH%/}"
fi

usage() {
  cat <<EOF
用法:
  bash scripts/deploy-aliyun-bati.sh <ssh-user@server-ip>

示例:
  bash scripts/deploy-aliyun-bati.sh root@123.56.78.90
  SSH_KEY_PATH=~/.ssh/aliyun.pem bash scripts/deploy-aliyun-bati.sh ecs-user@123.56.78.90

可选环境变量:
  DEPLOY_DOMAIN=${DOMAIN}
  DEPLOY_BASE_PATH=${BASE_PATH}
  SSH_KEY_PATH=~/.ssh/your-key.pem
  DEPLOY_ENABLE_HTTPS=${DEPLOY_ENABLE_HTTPS}
  SSL_SEARCH_DIR=${SSL_SEARCH_DIR}
  SSL_CERT_PATH=/ssl/fullchain.pem
  SSL_KEY_PATH=/ssl/privkey.key
  HTTP2_MODE=${HTTP2_MODE}

要求:
  1. 本机已安装 ssh 与 tar
  2. 服务器可通过 ssh 登录
  3. 登录用户为 root，或具备免密 sudo
EOF
}

if [[ -z "${REMOTE_TARGET}" ]]; then
  usage
  exit 1
fi

for command in ssh tar; do
  if ! command -v "${command}" >/dev/null 2>&1; then
    echo "缺少本地命令: ${command}" >&2
    exit 1
  fi
done

SSH_ARGS=()
if [[ -n "${SSH_KEY_PATH}" ]]; then
  SSH_ARGS+=(-i "${SSH_KEY_PATH}")
fi

if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
  echo "未在项目根目录找到 package.json: ${PROJECT_ROOT}" >&2
  exit 1
fi

echo "==> 检查远程连通性: ${REMOTE_TARGET}"
ssh "${SSH_ARGS[@]}" "${REMOTE_TARGET}" "echo connected >/dev/null"

echo "==> 创建远程临时目录: ${REMOTE_TMP_DIR}"
ssh "${SSH_ARGS[@]}" "${REMOTE_TARGET}" "mkdir -p '${REMOTE_SOURCE_DIR}'"

echo "==> 上传项目源码"
tar \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.cursor' \
  --exclude='.dev-changes' \
  --exclude='.DS_Store' \
  -czf - \
  -C "${PROJECT_ROOT}" . \
  | ssh "${SSH_ARGS[@]}" "${REMOTE_TARGET}" "cat > '${REMOTE_ARCHIVE}'"

echo "==> 解压源码并执行远程部署"
ssh "${SSH_ARGS[@]}" "${REMOTE_TARGET}" \
  "export DEPLOY_ENABLE_HTTPS='${DEPLOY_ENABLE_HTTPS}' SSL_SEARCH_DIR='${SSL_SEARCH_DIR}' SSL_CERT_PATH='${SSL_CERT_PATH}' SSL_KEY_PATH='${SSL_KEY_PATH}' HTTP2_MODE='${HTTP2_MODE}' && \
  tar -xzf '${REMOTE_ARCHIVE}' -C '${REMOTE_SOURCE_DIR}' && \
  bash '${REMOTE_SOURCE_DIR}/scripts/deploy-aliyun-bati-remote.sh' '${REMOTE_SOURCE_DIR}' '${DOMAIN}' '${BASE_PATH}'"

echo "==> 清理远程临时目录"
ssh "${SSH_ARGS[@]}" "${REMOTE_TARGET}" "rm -rf '${REMOTE_TMP_DIR}'"

echo "部署完成，请以上方服务器输出的最终访问地址为准。"
