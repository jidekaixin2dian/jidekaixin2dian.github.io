# 记得开心一点 · 个人作品实验室

个人项目与能力展示。首页提供钴蓝图纸（默认）与城市手记两种版式。可分享 `?theme=blueprint` 或 `?theme=fieldnotes`，项目深链仍使用 `#project/<id>`。

网站：https://jidekaixin2dian.github.io/

项目资料集中在 `projects.js`，叙事页的对应资料在 `journey.js`。首页、展厅和实作档案共用帧律 v0.6.0 的 1700 × 1075 原版界面。首页与设置页来自该版本的部署验收，性能会话与优化页使用同一发布版本的 WPF 程序集在隔离配置中渲染（提交 52c14d3）。图片以无损 WebP 保存，稳定版下载使用 `releases/latest`；Alpha 项目链接到发行列表。

上游贡献记录集中在 `activity.js`，范围是 `jidekaixin2dian` 向其他所有者的公开仓库提交的 PR。按上游合入、开放、关闭未合入分别展示，插件目录收录也注明在合入数内。项目版本更新对应具体发行标签。

使用 Node.js 24 验证项目字段、图片和页面本地资源。在线检查也会比对记录中的 PR 状态与 GitHub 当前状态。

```text
node scripts/check-links.mjs
node scripts/check-links.mjs --online
```

`--online` 额外检查公开链接目标，可通过 `GITHUB_TOKEN` 使用 GitHub API 配额。提交和 PR 自动运行离线检查；手动运行 Site checks 会再检查外链，避免上游短暂不可用阻塞普通内容更新。
