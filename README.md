# 记得开心一点 · 个人作品实验室

个人项目与能力展示。亮暗主题、滚动三维雕塑与项目详情。

网站：https://jidekaixin2dian.github.io/

项目资料集中在 `projects.js`，叙事页的对应资料在 `journey.js`。旧截图保留拍摄版本，稳定版下载使用 `releases/latest`；Alpha 项目链接到发行列表。

使用 Node.js 24 验证项目字段、图片和页面本地资源：

```text
node scripts/check-links.mjs
node scripts/check-links.mjs --online
```

`--online` 额外检查公开链接目标，可通过 `GITHUB_TOKEN` 使用 GitHub API 配额。提交和 PR 自动运行离线检查；手动运行 Site checks 会再检查外链，避免上游短暂不可用阻塞普通内容更新。
