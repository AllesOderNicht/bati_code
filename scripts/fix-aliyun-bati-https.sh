#!/usr/bin/env bash

set -euo pipefail

DOMAIN="${DEPLOY_DOMAIN:-www.alleschen.com}"
BASE_PATH="${DEPLOY_BASE_PATH:-/bati}"
SSL_SEARCH_DIR="${SSL_SEARCH_DIR:-/ssl}"
SSL_CERT_PATH="${SSL_CERT_PATH:-}"
SSL_KEY_PATH="${SSL_KEY_PATH:-}"
HTTP2_MODE="${HTTP2_MODE:-auto}"
DEPLOY_ROOT="/var/www/${DOMAIN}"
DEPLOY_DIR="${DEPLOY_ROOT}${BASE_PATH}"
NGINX_CONF_PATH="/etc/nginx/conf.d/${DOMAIN}.conf"
NGINX_SSL_DIR="/etc/nginx/ssl/${DOMAIN}"
INSTALLED_CERT_PATH="${NGINX_SSL_DIR}/server.pem"
INSTALLED_KEY_PATH="${NGINX_SSL_DIR}/server.key"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
NGINX_CONF_BACKED_UP=0

if [[ "${BASE_PATH}" != "/" ]]; then
  BASE_PATH="${BASE_PATH%/}"
fi

usage() {
  cat <<EOF
用法:
  bash scripts/fix-aliyun-bati-https.sh

可选环境变量:
  DEPLOY_DOMAIN=${DOMAIN}
  DEPLOY_BASE_PATH=${BASE_PATH}
  SSL_SEARCH_DIR=${SSL_SEARCH_DIR}
  SSL_CERT_PATH=/ssl/fullchain.pem
  SSL_KEY_PATH=/ssl/privkey.key
  HTTP2_MODE=${HTTP2_MODE}

示例:
  bash scripts/fix-aliyun-bati-https.sh
  DEPLOY_DOMAIN=www.alleschen.com DEPLOY_BASE_PATH=/bati bash scripts/fix-aliyun-bati-https.sh
  SSL_CERT_PATH=/ssl/www.alleschen.com.pem SSL_KEY_PATH=/ssl/www.alleschen.com.key bash scripts/fix-aliyun-bati-https.sh

脚本会自动完成:
  1. 检查 nginx / openssl / firewalld 状态
  2. 在 /ssl 中自动寻找 pem/crt 与 key
  3. 校验证书与私钥是否匹配
  4. 将证书复制到 /etc/nginx/ssl/<domain>/
  5. 生成并并存 80 / 443 站点配置（HTTP 不自动跳转 HTTPS）
  6. 重载 nginx 并验证本机 HTTPS 可用性

HTTP2_MODE 可选值:
  auto    自动选择兼容写法
  modern  使用 "http2 on;"
  legacy  使用 "listen 443 ssl http2;"
  off     不启用 HTTP/2
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

run_as_root() {
  if [[ "$(id -u)" -eq 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

ensure_command() {
  local command_name="$1"
  local package_name="${2:-$1}"

  if command -v "${command_name}" >/dev/null 2>&1; then
    return 0
  fi

  if command -v dnf >/dev/null 2>&1; then
    echo "==> 安装缺失依赖: ${package_name}"
    run_as_root dnf install -y "${package_name}"
  fi

  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "缺少命令: ${command_name}" >&2
    exit 1
  fi
}

pick_ssl_pair() {
  local cert_candidate=""
  local key_candidate=""

  if [[ -n "${SSL_CERT_PATH}" || -n "${SSL_KEY_PATH}" ]]; then
    if [[ -z "${SSL_CERT_PATH}" || -z "${SSL_KEY_PATH}" ]]; then
      echo "当显式指定证书路径时，必须同时提供 SSL_CERT_PATH 和 SSL_KEY_PATH" >&2
      exit 1
    fi

    echo "${SSL_CERT_PATH}|${SSL_KEY_PATH}"
    return 0
  fi

  if [[ ! -d "${SSL_SEARCH_DIR}" ]]; then
    echo "证书目录不存在: ${SSL_SEARCH_DIR}" >&2
    exit 1
  fi

  shopt -s nullglob
  local cert_candidates=("${SSL_SEARCH_DIR}"/*.pem "${SSL_SEARCH_DIR}"/*.crt "${SSL_SEARCH_DIR}"/*.cer)
  local key_candidates=("${SSL_SEARCH_DIR}"/*.key)
  shopt -u nullglob

  if [[ "${#cert_candidates[@]}" -eq 0 ]]; then
    echo "未在 ${SSL_SEARCH_DIR} 中找到 pem/crt/cert 证书文件" >&2
    exit 1
  fi

  if [[ "${#key_candidates[@]}" -eq 0 ]]; then
    echo "未在 ${SSL_SEARCH_DIR} 中找到 key 私钥文件" >&2
    exit 1
  fi

  local domain_compact="${DOMAIN//./}"
  local cert_file=""
  local key_file=""

  for cert_file in "${cert_candidates[@]}"; do
    local cert_base
    cert_base="$(basename "${cert_file}")"

    if [[ "${cert_base}" == *"${DOMAIN}"* || "${cert_base}" == *"${domain_compact}"* ]]; then
      for key_file in "${key_candidates[@]}"; do
        local key_base
        key_base="$(basename "${key_file}")"
        if [[ "${key_base}" == *"${DOMAIN}"* || "${key_base}" == *"${domain_compact}"* ]]; then
          cert_candidate="${cert_file}"
          key_candidate="${key_file}"
          break 2
        fi
      done
    fi
  done

  if [[ -z "${cert_candidate}" && "${#cert_candidates[@]}" -eq 1 && "${#key_candidates[@]}" -eq 1 ]]; then
    cert_candidate="${cert_candidates[0]}"
    key_candidate="${key_candidates[0]}"
  fi

  if [[ -z "${cert_candidate}" ]]; then
    for cert_file in "${cert_candidates[@]}"; do
      local cert_stem
      cert_stem="$(basename "${cert_file}")"
      cert_stem="${cert_stem%.*}"

      for key_file in "${key_candidates[@]}"; do
        local key_stem
        key_stem="$(basename "${key_file}")"
        key_stem="${key_stem%.*}"
        if [[ "${cert_stem}" == "${key_stem}" ]]; then
          cert_candidate="${cert_file}"
          key_candidate="${key_file}"
          break 2
        fi
      done
    done
  fi

  if [[ -z "${cert_candidate}" || -z "${key_candidate}" ]]; then
    echo "自动识别证书失败，请显式指定 SSL_CERT_PATH 和 SSL_KEY_PATH" >&2
    exit 1
  fi

  echo "${cert_candidate}|${key_candidate}"
}

validate_ssl_pair() {
  local cert_path="$1"
  local key_path="$2"

  if [[ ! -s "${cert_path}" ]]; then
    echo "证书文件不存在或为空: ${cert_path}" >&2
    exit 1
  fi

  if [[ ! -s "${key_path}" ]]; then
    echo "私钥文件不存在或为空: ${key_path}" >&2
    exit 1
  fi

  local cert_pubkey_hash
  local key_pubkey_hash

  cert_pubkey_hash="$(
    openssl x509 -in "${cert_path}" -noout -pubkey \
      | openssl pkey -pubin -outform der 2>/dev/null \
      | openssl dgst -sha256 \
      | awk '{print $2}'
  )"

  key_pubkey_hash="$(
    openssl pkey -in "${key_path}" -pubout -outform der 2>/dev/null \
      | openssl dgst -sha256 \
      | awk '{print $2}'
  )"

  if [[ -z "${cert_pubkey_hash}" ]]; then
    echo "无法解析证书文件，请确认它是合法 PEM/X509 文件: ${cert_path}" >&2
    exit 1
  fi

  if [[ -z "${key_pubkey_hash}" ]]; then
    echo "无法解析私钥文件，请确认它是合法 PEM 私钥: ${key_path}" >&2
    exit 1
  fi

  if [[ "${cert_pubkey_hash}" != "${key_pubkey_hash}" ]]; then
    echo "证书与私钥不匹配: ${cert_path} <-> ${key_path}" >&2
    exit 1
  fi
}

install_ssl_files() {
  local cert_path="$1"
  local key_path="$2"

  echo "==> 安装证书到 nginx 标准目录"
  run_as_root mkdir -p "${NGINX_SSL_DIR}"
  run_as_root cp "${cert_path}" "${INSTALLED_CERT_PATH}"
  run_as_root cp "${key_path}" "${INSTALLED_KEY_PATH}"
  run_as_root chmod 644 "${INSTALLED_CERT_PATH}"
  run_as_root chmod 600 "${INSTALLED_KEY_PATH}"
}

backup_nginx_conf_once() {
  if [[ "${NGINX_CONF_BACKED_UP}" -eq 0 ]] && run_as_root test -f "${NGINX_CONF_PATH}"; then
    run_as_root cp "${NGINX_CONF_PATH}" "${NGINX_CONF_PATH}.bak.${TIMESTAMP}"
    NGINX_CONF_BACKED_UP=1
  fi
}

resolve_http2_snippets() {
  local listen_suffix=""
  local http2_directive=""

  case "${HTTP2_MODE}" in
    auto|modern)
      http2_directive="    http2 on;"
      ;;
    legacy)
      listen_suffix=" http2"
      ;;
    off)
      ;;
    *)
      echo "不支持的 HTTP2_MODE: ${HTTP2_MODE}" >&2
      exit 1
      ;;
  esac

  printf '%s|%s\n' "${listen_suffix}" "${http2_directive}"
}

write_nginx_conf_with_base_path() {
  local conf_tmp
  local http2_config
  local listen_443_suffix=""
  local http2_directive=""
  conf_tmp="$(mktemp)"
  http2_config="$(resolve_http2_snippets)"
  listen_443_suffix="${http2_config%%|*}"
  http2_directive="${http2_config#*|}"

  cat > "${conf_tmp}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${DEPLOY_ROOT};
    index index.html;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml
        image/x-icon
        font/woff
        font/woff2
        application/font-woff2
        application/vnd.ms-fontobject;

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
 
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
        add_header X-Content-Type-Options "nosniff" always;
        access_log off;

        location ~* \.(?:png|jpe?g|gif|webp|avif|ico)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            add_header X-Content-Type-Options "nosniff" always;
            try_files \$uri =404;
            access_log off;
        }

        location ~* \.(?:woff2?|ttf|otf|eot)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            add_header Access-Control-Allow-Origin "*";
            add_header X-Content-Type-Options "nosniff" always;
            try_files \$uri =404;
            access_log off;
        }
    }

    location ^~ ${BASE_PATH}/ {
        try_files \$uri \$uri/ ${BASE_PATH}/index.html;
        add_header Cache-Control "no-cache";
    }
}

server {
    listen 443 ssl${listen_443_suffix};
    listen [::]:443 ssl${listen_443_suffix};
    server_name ${DOMAIN};
${http2_directive}

    root ${DEPLOY_ROOT};
    index index.html;

    ssl_certificate ${INSTALLED_CERT_PATH};
    ssl_certificate_key ${INSTALLED_KEY_PATH};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_prefer_server_ciphers off;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml
        image/x-icon
        font/woff
        font/woff2
        application/font-woff2
        application/vnd.ms-fontobject;

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    # add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

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
        add_header X-Content-Type-Options "nosniff" always;
        access_log off;

        location ~* \.(?:png|jpe?g|gif|webp|avif|ico)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            add_header X-Content-Type-Options "nosniff" always;
            try_files \$uri =404;
            access_log off;
        }

        location ~* \.(?:woff2?|ttf|otf|eot)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            add_header Access-Control-Allow-Origin "*";
            add_header X-Content-Type-Options "nosniff" always;
            try_files \$uri =404;
            access_log off;
        }
    }

    location ^~ ${BASE_PATH}/ {
        try_files \$uri \$uri/ ${BASE_PATH}/index.html;
        add_header Cache-Control "no-cache";
    }
}
EOF

  backup_nginx_conf_once
  run_as_root mkdir -p "$(dirname "${NGINX_CONF_PATH}")"
  run_as_root cp "${conf_tmp}" "${NGINX_CONF_PATH}"
  rm -f "${conf_tmp}"
}

write_nginx_conf_root_path() {
  local conf_tmp
  local http2_config
  local listen_443_suffix=""
  local http2_directive=""
  conf_tmp="$(mktemp)"
  http2_config="$(resolve_http2_snippets)"
  listen_443_suffix="${http2_config%%|*}"
  http2_directive="${http2_config#*|}"

  cat > "${conf_tmp}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${DEPLOY_ROOT};
    index index.html;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml
        image/x-icon
        font/woff
        font/woff2
        application/font-woff2
        application/vnd.ms-fontobject;

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location ^~ /assets/ {
        try_files \$uri =404;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Content-Type-Options "nosniff" always;
        access_log off;

        location ~* \.(?:png|jpe?g|gif|webp|avif|ico)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            add_header X-Content-Type-Options "nosniff" always;
            try_files \$uri =404;
            access_log off;
        }

        location ~* \.(?:woff2?|ttf|otf|eot)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            add_header Access-Control-Allow-Origin "*";
            add_header X-Content-Type-Options "nosniff" always;
            try_files \$uri =404;
            access_log off;
        }
    }

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}

server {
    listen 443 ssl${listen_443_suffix};
    listen [::]:443 ssl${listen_443_suffix};
    server_name ${DOMAIN};
${http2_directive}

    root ${DEPLOY_ROOT};
    index index.html;

    ssl_certificate ${INSTALLED_CERT_PATH};
    ssl_certificate_key ${INSTALLED_KEY_PATH};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_prefer_server_ciphers off;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml
        image/x-icon
        font/woff
        font/woff2
        application/font-woff2
        application/vnd.ms-fontobject;

    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    # add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    location ^~ /assets/ {
        try_files \$uri =404;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Content-Type-Options "nosniff" always;
        access_log off;

        location ~* \.(?:png|jpe?g|gif|webp|avif|ico)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            add_header X-Content-Type-Options "nosniff" always;
            try_files \$uri =404;
            access_log off;
        }

        location ~* \.(?:woff2?|ttf|otf|eot)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            add_header Access-Control-Allow-Origin "*";
            add_header X-Content-Type-Options "nosniff" always;
            try_files \$uri =404;
            access_log off;
        }
    }

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
EOF

  backup_nginx_conf_once
  run_as_root mkdir -p "$(dirname "${NGINX_CONF_PATH}")"
  run_as_root cp "${conf_tmp}" "${NGINX_CONF_PATH}"
  rm -f "${conf_tmp}"
}

write_nginx_conf() {
  echo "==> 生成 nginx HTTPS 配置: ${NGINX_CONF_PATH}"

  if [[ "${BASE_PATH}" == "/" ]]; then
    write_nginx_conf_root_path
  else
    write_nginx_conf_with_base_path
  fi
}

validate_nginx_conf() {
  local output=""

  if output="$(run_as_root nginx -t 2>&1)"; then
    echo "${output}"
    return 0
  fi

  if [[ "${HTTP2_MODE}" == "auto" && "${output}" == *'unknown directive "http2"'* ]]; then
    echo "==> 当前 nginx 不支持 \"http2 on;\"，回退到旧版 HTTP/2 语法"
    HTTP2_MODE="legacy"
    write_nginx_conf
    if output="$(run_as_root nginx -t 2>&1)"; then
      echo "${output}"
      return 0
    fi
  fi

  if [[ "${HTTP2_MODE}" == "legacy" && ( "${output}" == *'invalid parameter "http2"'* || "${output}" == *'unknown parameter "http2"'* ) ]]; then
    echo "==> 当前 nginx 未启用 HTTP/2 模块，回退为纯 HTTPS"
    HTTP2_MODE="off"
    write_nginx_conf
    if output="$(run_as_root nginx -t 2>&1)"; then
      echo "${output}"
      return 0
    fi
  fi

  echo "${output}" >&2
  return 1
}

ensure_firewall() {
  if command -v firewall-cmd >/dev/null 2>&1 && run_as_root systemctl is-active --quiet firewalld; then
    echo "==> 放通 firewalld 的 HTTP/HTTPS 端口"
    run_as_root firewall-cmd --permanent --add-service=http >/dev/null
    run_as_root firewall-cmd --permanent --add-service=https >/dev/null
    run_as_root firewall-cmd --reload >/dev/null
  fi
}

verify_local_https() {
  local target_url=""

  if [[ "${BASE_PATH}" == "/" ]]; then
    target_url="https://${DOMAIN}/"
  else
    target_url="https://${DOMAIN}${BASE_PATH}/"
  fi

  echo "==> 本机回环验证 HTTPS: ${target_url}"
  curl --silent --show-error --fail --resolve "${DOMAIN}:443:127.0.0.1" "${target_url}" -k -I >/dev/null
}

report_certificate() {
  echo "==> 证书信息"
  openssl x509 -in "${INSTALLED_CERT_PATH}" -noout -subject -issuer -dates
}

ensure_command openssl openssl
ensure_command nginx nginx
ensure_command curl curl
ensure_command awk gawk

SSL_PAIR="$(pick_ssl_pair)"
CERT_PATH="${SSL_PAIR%%|*}"
KEY_PATH="${SSL_PAIR##*|}"

echo "==> 检测到证书文件: ${CERT_PATH}"
echo "==> 检测到私钥文件: ${KEY_PATH}"

validate_ssl_pair "${CERT_PATH}" "${KEY_PATH}"
install_ssl_files "${CERT_PATH}" "${KEY_PATH}"
write_nginx_conf

echo "==> 校验 nginx 配置"
validate_nginx_conf

echo "==> 启动并重载 nginx"
run_as_root systemctl enable nginx >/dev/null
run_as_root systemctl restart nginx

ensure_firewall
verify_local_https
report_certificate

echo "==> HTTPS 修复完成"
echo "站点目录: ${DEPLOY_DIR}"
echo "访问地址: https://${DOMAIN}${BASE_PATH}/"
echo "如果公网仍无法访问，请额外检查阿里云安全组是否已放行 443 端口。"
