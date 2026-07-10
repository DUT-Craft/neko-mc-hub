# 猫娘社 MC 主站前端

大学 Minecraft 社团服务器主站的 Nuxt 4 前端。当前版本使用 Naive UI 和结构化演示数据，GitHub Pages 只用于前端预览，不包含真实后端提交或服务器状态查询。

## 本地开发

```bash
npm ci
npm run dev
```

质量检查：

```bash
npm run typecheck
npm run build
npm run generate
```

## 数据边界

- `types/view-models.ts`：页面使用的前端 ViewModel。
- `data/demo-content.ts`：服务器、活动、公告和联系人演示数据。
- `composables/useDemoContent.ts`：在线优先、活动优先等前端排序逻辑。
- 申请表目前只做前端校验，不会发送或保存个人信息。

后端接口文档确定后，应新增独立适配层，将接口响应转换为现有 ViewModel；页面组件不直接依赖后端字段。

## GitHub Pages

推送到 `main` 后，`.github/workflows/pages.yml` 会以 `/neko-mc-hub/` 为基础路径生成并部署静态预览。
