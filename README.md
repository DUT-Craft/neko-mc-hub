# 猫娘社 MC 主站前端

大学 Minecraft 社团主站的 Nuxt 4 前端。首页优先展示本周活动、长期活动、当前在线服务器和完整服务器列表；管理后台通过 Spring Boot 后端维护服务器、活动、公告、Wiki、历史记录和图片。

## 环境要求

- Node.js 22 或更高版本
- npm 10 或更高版本
- 已启动的猫娘社主站后端

## 本地开发

```powershell
npm ci
$env:NUXT_PUBLIC_API_BASE = ""
$env:NUXT_API_BASE_INTERNAL = "http://127.0.0.1:8080"
npm run dev -- --port 3000
```

玩家端：`http://127.0.0.1:3000/home`

管理端：`http://127.0.0.1:3000/admin/login`

浏览器请求同源 `/api`，Nuxt 再通过 `NUXT_API_BASE_INTERNAL` 转发到后端，因此本机不安装 Nginx 也能用一个前端网址完成联调。需要让浏览器直接请求后端时，可将 `NUXT_PUBLIC_API_BASE` 改为 `http://127.0.0.1:8080`。只有明确设置 `NUXT_PUBLIC_ENABLE_DEMO_FALLBACK=true` 时才会使用演示数据；正式部署必须保持关闭。

## 推荐生产结构

推荐让前后端使用同一个 HTTPS 域名：

- `https://mc.example.com/api/**` 由 Nginx 转发到 Spring Boot `127.0.0.1:8080`
- 其他请求由 Nginx 转发到 Nuxt `127.0.0.1:3000`
- 浏览器使用同域 `/api`，无需暴露后端监听端口
- Nuxt 服务端渲染通过 `NUXT_API_BASE_INTERNAL` 直接访问后端
- 如果 Nginx 未配置 `/api/`，Nuxt 内置的备用代理仍会把 `/api/**` 转发到 `NUXT_API_BASE_INTERNAL`

将 `.env.example` 复制为 `.env`，并按服务器环境调整：

```dotenv
NUXT_PUBLIC_API_BASE=
NUXT_API_BASE_INTERNAL=http://127.0.0.1:8080
NUXT_PUBLIC_ENABLE_DEMO_FALLBACK=false
NUXT_APP_BASE_URL=/
NITRO_HOST=127.0.0.1
NITRO_PORT=3000
```

`NUXT_PUBLIC_API_BASE` 留空表示浏览器使用当前域名。推荐的 Nginx 配置会直接把 `/api/**` 转发给 Spring Boot；没有 Nginx 的本地或简易部署则由 Nuxt 备用代理转发。只有前后端分属不同域名时，才填写完整公开地址，例如 `https://api.example.com`。

## 构建与启动

```bash
npm ci
npm run typecheck
npm run build
npm run start
```

`npm run start` 会读取项目根目录的 `.env`。正式服务应由 systemd、Supervisor 或容器平台托管，不要长期运行在临时终端中。

## Nginx 示例

先配置域名证书，再在对应的 HTTPS `server` 块中加入：

```nginx
client_max_body_size 32m;

location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /actuator/health {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

生产后端的 `PUBLIC_BASE_URL` 和 `CORS_ALLOWED_ORIGINS` 应填写同一个公开 HTTPS 域名，例如 `https://mc.example.com`。

## 前后端使用同站点子域名

如果前端是 `https://www.example.com`，后端是同一站点下的 `https://api.example.com`：

```dotenv
NUXT_PUBLIC_API_BASE=https://api.example.com
NUXT_API_BASE_INTERNAL=https://api.example.com
```

后端应设置：

```dotenv
CORS_ALLOWED_ORIGINS=https://www.example.com
PUBLIC_BASE_URL=https://api.example.com
```

不要使用 `*` 作为 CORS 来源；带凭据请求也不支持通配来源。认证 Cookie 固定使用 `SameSite=Strict`，因此前后端必须使用同一个 HTTPS 域名，或使用同一注册域名下的 HTTPS 子域名。完全不同站点的两个域名不支持成员登录和后台操作。

## 质量检查

每次交付前运行：

```bash
npm ci
npm run typecheck
npm run build
```

然后检查：

- `/home` 能读取真实服务器和活动
- `/admin/login` 可以登录
- 草稿可以保存、预览、发布和下线
- 正文中的标题、列表、链接和图片能正常往返保存
- 手机端无横向滚动和文字溢出
- 浏览器网络请求不包含 `127.0.0.1` 或旧域名

## 目录边界

- `composables/useDemoContent.ts`：首页聚合数据和排序
- `composables/usePublicApi.ts`：玩家端详情接口
- `composables/useAdminApi.ts`：管理员接口和上传
- `components/admin/`：后台编辑器、裁剪器和管理组件
- `utils/richText.ts`：Word 风格正文与结构化内容互转
- `components/ContentBlocksRenderer.vue`：玩家端正文渲染
- `types/`：前后端数据契约

## GitHub Pages

`.github/workflows/pages.yml` 只用于无后端的静态演示，会显式启用演示数据。真实站点和管理后台应使用上面的 Nuxt Node 服务部署方式。
