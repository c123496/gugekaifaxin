# 金达外贸开发信工具

选地区 + 点分类卡片 → Tavily 联网搜公司+抓官网邮箱 → DeepSeek 生成定制英文开发信 → 导出 Excel。

## 环境变量（见 .env.example）
- DATABASE_URL — Neon PostgreSQL 连接串
- DEEPSEEK_API_KEY / DEEPSEEK_MODEL — 写开发信（默认 deepseek-chat，2026-07-24 后改 deepseek-v4-flash）
- TAVILY_API_KEY — 联网搜索
- APP_ACCESS_KEY — URL 访问密码

## 本地运行
1. npm install
2. 复制 .env.example 为 .env.local 并填值
3. npm run dev
4. 首次访问 /api/init?key=<APP_ACCESS_KEY> 建表
5. 访问 /?key=<APP_ACCESS_KEY> 使用

## 部署到 Vercel
1. 推送到 GitHub，导入 Vercel
2. 在 Vercel 项目 Settings → Environment Variables 配置上述 4 个变量
3. 部署后访问 /api/init?key=... 建表一次
4. 把 /?key=... 网址发给同事

## 注意
- 无登录，靠 URL 的 key 参数保护，请勿外泄网址
- 开发信不声称已获第三方认证，仅"可按 ANSI/CE 标准生产"
