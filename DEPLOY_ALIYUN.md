# 阿里云一键部署说明

这套脚本支持两种部署方式，另附一个 HTTPS 一键排查修复脚本：

- 服务器内执行：更适合你的场景，直接在阿里云服务器里安装并部署
- 本地发起远程部署：在你自己的电脑上执行，自动上传源码到服务器后部署
- HTTPS 一键排查修复：自动识别 `/ssl` 下证书、校验 `pem/key`、生成 `443` 配置并重载 `nginx`

无论哪种方式，都会自动完成以下动作：

- 检查并安装 `nvm`
- 安装 `Node.js 24`
- 安装并启动 `nginx`
- 构建前端产物
- 发布到 `/var/www/www.alleschen.com/bati`
- 写入 `nginx` 配置；如果服务器上存在可用证书，则自动切换为 `HTTPS`

## 先决条件

- 域名 `www.alleschen.com` 已解析到这台阿里云服务器公网 IP
- 阿里云安全组已放行 `80` 端口
- 如果使用“服务器内执行”方式：你可以登录服务器 shell
- 如果使用“本地发起”方式：你可以从本机通过 `ssh` 登录服务器
- 执行用户是 `root`，或拥有免密 `sudo`

## 方式一：服务器内执行

适合“服务器是新机，希望直接在服务器里完成安装与部署”。

### 场景 A：项目代码已经在服务器上

先进入项目根目录，然后执行：

```bash
bash scripts/deploy-aliyun-bati-on-server.sh
```

也可以在安装完 Node 后用：

```bash
npm run deploy:aliyun:server
```

### 场景 B：服务器是空机，需要脚本自己拉代码

先把这个仓库里的 `scripts/deploy-aliyun-bati-on-server.sh` 和 `scripts/deploy-aliyun-bati-remote.sh` 放到服务器任意目录，或者直接把整个项目传上去；随后执行：

```bash
bash scripts/deploy-aliyun-bati-on-server.sh https://github.com/your-name/bati_code.git main
```

也支持环境变量写法：

```bash
DEPLOY_REPO_URL=https://github.com/your-name/bati_code.git DEPLOY_REPO_BRANCH=main bash scripts/deploy-aliyun-bati-on-server.sh
```

默认会把代码拉到：

```bash
/opt/www.alleschen.com/app
```

## 方式二：本地发起远程部署

适合“项目代码只在你本机，想一条命令推到服务器”。

在项目根目录执行：

```bash
bash scripts/deploy-aliyun-bati.sh root@你的服务器公网IP
```

如果你使用密钥登录：

```bash
SSH_KEY_PATH=~/.ssh/aliyun.pem bash scripts/deploy-aliyun-bati.sh ecs-user@你的服务器公网IP
```

也可以用 `npm` 命令触发：

```bash
npm run deploy:aliyun -- root@你的服务器公网IP
```

## 默认部署参数

- 域名：`www.alleschen.com`
- 部署路径：`/bati`
- 对外访问地址：默认 `http://www.alleschen.com/bati/`，若检测到证书则自动升级为 `https://www.alleschen.com/bati/`

如需覆盖默认值：

```bash
DEPLOY_DOMAIN=www.alleschen.com DEPLOY_BASE_PATH=/bati bash scripts/deploy-aliyun-bati.sh root@你的服务器公网IP
```

## 部署后服务器上的关键位置

- nginx 配置：`/etc/nginx/conf.d/www.alleschen.com.conf`
- 静态文件目录：`/var/www/www.alleschen.com/bati`
- 最近一次上传的源码归档：`/opt/www.alleschen.com/source`
- 如果使用服务器内拉代码模式，源码目录默认为：`/opt/www.alleschen.com/app`

## HTTPS 一键排查与修复

现在部署脚本会优先尝试复用这套 HTTPS 逻辑：

- 若部署时检测到 `/ssl` 下存在证书与私钥，或显式传入 `SSL_CERT_PATH` / `SSL_KEY_PATH`，会在发布完成后自动执行 HTTPS 配置
- 若没有检测到可用证书，则保持 HTTP 部署，不会因此中断发布

你也可以显式控制：

- `DEPLOY_ENABLE_HTTPS=auto`：默认值，有证书就启用 HTTPS
- `DEPLOY_ENABLE_HTTPS=off`：本次部署强制只走 HTTP
- `DEPLOY_ENABLE_HTTPS=always`：本次部署强制执行 HTTPS 配置，若证书缺失则直接报错

如果你已经把证书放进服务器的 `/ssl` 目录，但访问 `https://` 时提示“无法访问网站”或“连接被意外终止”，可以直接在服务器项目根目录执行：

```bash
bash scripts/fix-aliyun-bati-https.sh
```

或使用 `npm` 入口：

```bash
npm run repair:https:aliyun
```

默认行为：

- 自动在 `/ssl` 下寻找 `.pem/.crt/.cer` 和 `.key`
- 校验证书和私钥是否匹配
- 将证书复制到 `/etc/nginx/ssl/<domain>/`
- 生成 `80 -> 443` 跳转和 `443 ssl` 站点配置
- 检查并重载 `nginx`
- 在服务器本机执行回环 HTTPS 验证

如果你的证书文件名比较特殊，也可以显式指定：

```bash
SSL_CERT_PATH=/ssl/fullchain.pem SSL_KEY_PATH=/ssl/privkey.key bash scripts/fix-aliyun-bati-https.sh
```

可选变量：

- `DEPLOY_DOMAIN`，默认 `www.alleschen.com`
- `DEPLOY_BASE_PATH`，默认 `/bati`
- `SSL_SEARCH_DIR`，默认 `/ssl`
- `SSL_CERT_PATH`，显式指定证书文件
- `SSL_KEY_PATH`，显式指定私钥文件

说明：

- 脚本会备份旧的 `nginx` 配置到同目录下的 `.bak.<timestamp>` 文件
- 如果脚本执行成功，但公网依然打不开，多半是阿里云安全组没有放行 `443`

## 说明

- 脚本会自动把 `Vite` 构建前缀设置为 `/bati/`，避免静态资源路径错误。
- 默认部署脚本会在检测到可用证书时自动启用 `HTTPS`；如果你只想单独修复证书或 `nginx` 配置，仍可直接执行 `scripts/fix-aliyun-bati-https.sh`。
- 重新执行同一条命令即可覆盖部署最新前端版本。
