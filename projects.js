'use strict';
window.PORTFOLIO_PROJECTS = [
  {
    "id": "fps",
    "name": "FPS 帧律",
    "repo": "fps-tune",
    "role": "原创项目",
    "category": "windows",
    "tags": "C# / WPF / .NET 10",
    "description": "把系统调校变成有依据的选择。从检测、审阅到实测与还原，开局前一次准备好。",
    "image": "images/01-overview.webp",
    "imageAlt": "FPS 帧律项目文档中的工作台界面",
    "subtitle": "这项调校值不值得留，用同一台电脑做一次 A/B 对照。",
    "problem": "系统设置、驱动画质和游戏准备散落在不同入口。改了什么、是否有效、怎样恢复，都需要清楚的记录。",
    "approach": "GUI 与 CLI 共用调校引擎，逐项解释状态、权限和副作用。写入受支持的设置前保存原值，再用同机 A/B 与性能会话判断是否保留。",
    "result": "v0.5.0 新增前后对照、收益档案与卡顿取证。v0.6.0 细分帧采样失败原因，将 A/B 高级入口移到「优化 → 对照一下」旁，设置保存失败时恢复真实状态。",
    "boundary": "不承诺固定帧率收益。真实 FPS 需要官方 PresentMon；ICC 效果取决于应用支持。缓存清理不能还原。",
    "links": [
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/fps-tune#readme"
      ],
      [
        "前后对照与收益档案 · v0.5.0",
        "https://github.com/jidekaixin2dian/fps-tune/releases/tag/v0.5.0"
      ],
      [
        "下载当前稳定版",
        "https://github.com/jidekaixin2dian/fps-tune/releases/latest"
      ],
      [
        "调校目录",
        "https://github.com/jidekaixin2dian/fps-tune/blob/main/catalog/catalog.json"
      ],
      [
        "截图来源 · v0.6.0 文档",
        "https://github.com/jidekaixin2dian/fps-tune/tree/v0.6.0/assets/screenshots"
      ]
    ],
    "release": {
      "version": "0.6.0",
      "summary": "帧采样失败时区分权限不足、图形事件丢失和目标未渲染。",
      "date": "2026-11-18"
    }
  },
  {
    "id": "context",
    "name": "Toolgate · 工具闸门",
    "repo": "dsh-toolgate",
    "role": "原创插件",
    "category": "agent",
    "tags": "DSH / MCP / JavaScript",
    "description": "让下一轮只带需要的工具。按 MCP 服务器管理工具 schema，同时照看服务器配置与 Skill。",
    "subtitle": "工具可以很多，这一轮只带需要的。",
    "problem": "MCP 服务器越装越多，每个工具的完整 schema 都会进入请求。还没开始对话，上下文已被工具说明占去一部分。",
    "approach": "把配置与暴露分开：按服务器分组，在 prompt 组装前隐藏不需要的工具 schema；MCP 进程继续运行，组可以随时恢复。",
    "result": "v0.2.2 让设置页和模型工具共用分组、逐工具开关、预设和规则。设置保存成功后才生效，写入失败会保留原配置。",
    "boundary": "token 数是 schema 与 Skill 描述的估算，不是模型分词器的精确值。部分在 Agent 作用域动态注册的 MCP 工具不能由该插件隐藏。独立社区插件，不代表 DeepSeek 官方产品。",
    "links": [
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/dsh-toolgate#readme"
      ],
      [
        "Desktop 市场与 Web CLI 安装说明 · #19",
        "https://github.com/jidekaixin2dian/dsh-toolgate/pull/19"
      ],
      [
        "设置保存与共享操作 · #18",
        "https://github.com/jidekaixin2dian/dsh-toolgate/pull/18"
      ],
      [
        "当前发行版",
        "https://github.com/jidekaixin2dian/dsh-toolgate/releases/latest"
      ],
      [
        "开发与验证",
        "https://github.com/jidekaixin2dian/dsh-toolgate/blob/main/docs/development.md"
      ]
    ],
    "visual": "context",
    "release": {
      "version": "0.2.2",
      "summary": "工具分组、逐项开关和预设共用同一套操作，保存成功后才生效。",
      "date": "2026-11-17"
    }
  },
  {
    "id": "team",
    "name": "Team Flow · 团队插话助手",
    "repo": "dsh-team-flow",
    "role": "原创插件 · Alpha",
    "category": "agent",
    "tags": "DSH / TypeScript / Agent Teams",
    "description": "主代理等队友时，也能及时接到你的新想法。结束这一次等待，队友继续工作。",
    "subtitle": "你说下一步，团队继续做。",
    "problem": "Agent Teams 的主代理停在 wait_agent 中时，新消息可能要等队友变化或等待超时后才能被下一步领取。",
    "approach": "复用宿主当版的官方 Team 工具，识别同一 Lead 的 user Steer，仅结束本次等待，再由原生 AgentLoop 领取原消息；不取消队友，也不重发消息。",
    "result": "v0.2.1 在 DSH 0.2.2-rc.1 上处理了一个时序问题。主代理收到插话时，尚未启动的前台 workflow 会稍后再跑，已运行的工作流与队友继续工作。",
    "boundary": "Alpha 预览。验证使用 Mock 推理与真实本地 Node PTC，不代表真实模型延迟或完整 Desktop UI 验收。SSH、Python PTC 与任意第三方插件组合未验证。基于 DeepSeek Harness 官方 Agent Teams，独立社区实现，非上游已合入修复。",
    "links": [
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/dsh-team-flow#readme"
      ],
      [
        "发布后的 Steer 文档与 CI 更新 · #17",
        "https://github.com/jidekaixin2dian/dsh-team-flow/pull/17"
      ],
      [
        "Alpha 发行版",
        "https://github.com/jidekaixin2dian/dsh-team-flow/releases"
      ],
      [
        "验证矩阵",
        "https://github.com/jidekaixin2dian/dsh-team-flow/blob/main/docs/verification.md"
      ],
      [
        "官方 Agent Teams",
        "https://github.com/deepseek-ai/deepseek-harness"
      ]
    ],
    "visual": "team",
    "release": {
      "version": "0.2.1",
      "summary": "主代理收到插话时，让尚未启动的前台工作流稍后再跑。",
      "date": "2026-11-10"
    }
  },
  {
    "id": "files",
    "name": "File Actions · 文件与链接操作",
    "repo": "dsh-file-actions",
    "role": "原创插件",
    "category": "interface",
    "tags": "DSH / JavaScript / 文件操作",
    "description": "从聊天里的文件引用，直接打开、预览、定位或另存。文件和链接的常用操作，放进右键菜单。",
    "subtitle": "看到文件，就能接着处理。",
    "problem": "Agent 给出文件后，复制路径、找应用、定位文件夹往往还要切换窗口。不同位置的引用也缺少统一操作入口。",
    "approach": "为聊天引用、交付卡片、工具结果和提供路径的侧栏接入右键菜单，沿用宿主的文件接口与路径授权。",
    "result": "支持打开、定位、预览、另存与键盘菜单。v0.1.23 让每个菜单独立处理取消，连续打开两个菜单时，关闭前一个不会打断后一个。",
    "boundary": "用于 DSH 图形与 Web 界面。应用列表取决于系统关联；文件访问遵守宿主授权，HTML / SVG 默认静态预览并阻止脚本和外部资源。",
    "links": [
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/dsh-file-actions#readme"
      ],
      [
        "菜单取消与缓存生命周期 · #26",
        "https://github.com/jidekaixin2dian/dsh-file-actions/pull/26"
      ],
      [
        "当前发行版",
        "https://github.com/jidekaixin2dian/dsh-file-actions/releases/latest"
      ],
      [
        "开发与验证",
        "https://github.com/jidekaixin2dian/dsh-file-actions/blob/main/docs/development.md"
      ]
    ],
    "release": {
      "version": "0.1.23",
      "summary": "连续打开两个右键菜单时，取消前一个不会再打断后一个。",
      "date": "2026-11-17"
    }
  },
  {
    "id": "desktop",
    "name": "DSH Windows MCP",
    "repo": "dsh-windows-mcp",
    "role": "上游贡献 · 已合入",
    "category": "agent",
    "tags": "DSH / Windows / MCP",
    "description": "给桌面控制开关划清会话边界，关闭时也从工具列表移除对应能力。",
    "subtitle": "给这一场对话开的桌面控制，只在这一场生效。",
    "problem": "一个宿主里可以同时跑多个会话。旧开关会影响其他窗口，关掉后请求里仍带着不可用工具。",
    "approach": "先把开关接到实际工具列表，再将授权改为按会话管理，并提供新会话默认值。",
    "result": "上游已合入 #5 和 #13，分别修复工具可见性与跨会话干扰。",
    "boundary": "这里记录我提交给社区项目的两项修改。",
    "links": [
      [
        "会话范围 · #13",
        "https://github.com/helloHub1212/dsh-windows-mcp/pull/13"
      ],
      [
        "工具列表 · #5",
        "https://github.com/helloHub1212/dsh-windows-mcp/pull/5"
      ]
    ]
  },
  {
    "id": "walk",
    "name": "出去一下 · 上海",
    "repo": "jidekaixin2dian.github.io",
    "category": "interface",
    "role": "个人项目",
    "tags": "Web / PWA / 上海",
    "description": "从上海二工大附近出发，按时间和预算挑一条短途路线。",
    "subtitle": "有半天时间，在上海可以去哪里走走？",
    "problem": "想临时出门时，查路线、算往返时间和预算往往比做决定更费劲。",
    "approach": "把出发点、可用时间和预算放进一次选择，用地点实景帮助辨认路线。",
    "result": "可以从浏览器打开，也提供单文件离线版，出门前就能把路线留在手边。",
    "boundary": "行前请核对当日交通、营业时间和天气。",
    "links": [
      [
        "打开《出去一下》",
        "https://jidekaixin2dian.github.io/go/"
      ],
      [
        "打开离线版",
        "https://jidekaixin2dian.github.io/go/出去一下-离线版.html"
      ]
    ]
  },
  {
    "id": "desk",
    "name": "PiWeb Desk",
    "repo": "piweb-desk",
    "role": "原创桌面外壳",
    "category": "windows",
    "tags": "Electron / Node.js",
    "description": "给 AI 编码工具一个桌面入口。任务通知、费用雷达和全局热键，让长任务更容易照看。",
    "image": "piweb-desk.png",
    "imageAlt": "PiWeb Desk 的真实桌面界面，显示 AI 会话与项目导航。",
    "subtitle": "任务在跑，人不用一直盯着窗口。",
    "problem": "浏览器里的 AI 编码会话容易被窗口淹没。任务完成了没有、今天花了多少、怎样快速回到项目，都需要更直接的入口。",
    "approach": "围绕 pi-web 构建 Windows 桌面外壳。监听会话结束状态、汇总 token 成本，提供系统托盘、全局热键和文件夹右键入口。",
    "result": "公开主分支已将包版本更新到 1.2.0。可按提供商拉取模型列表、比较差异、备份后合并到 models.json，也可检查并更新内核。托盘通知与 Ctrl+Alt+P 快捷入口仍可使用。",
    "boundary": "这是基于 agegr/pi-web 的第三方桌面外壳；AI 编码内核与 Web UI 来自上游项目。",
    "links": [
      [
        "主分支 · 模型列表差异与备份",
        "https://github.com/jidekaixin2dian/piweb-desk/commit/a9d5b5a3e7b6de0f068a9e4fffcdb689a7faba4c"
      ],
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/piweb-desk#readme"
      ],
      [
        "上游 pi-web",
        "https://github.com/agegr/pi-web"
      ]
    ]
  },
  {
    "id": "handoff",
    "name": "handoff",
    "repo": "handoff",
    "role": "原创 Skill",
    "category": "agent",
    "tags": "Agent Skills / Markdown",
    "description": "换个对话，项目接着做。先核实工作区，再把当前状态、下一步和证据入口交清楚。",
    "visual": "handoff",
    "subtitle": "上下文会换，项目的线索要留下。",
    "problem": "长任务换到新对话，往往要重讲背景。旧文档中的版本、已完成事项与计划又可能已经过期。",
    "approach": "先核实真实工作区，再把当前状态、下一步、关键约束和证据入口整理到轻量交接入口。原始证据保留，细节按需读取。",
    "result": "v0.2.0 可以识别换会话、换 Agent 等交接意图。先核对工作区，清理交接文档中的失效信息，再按长度、待办数量等条件决定是否拆出任务索引。",
    "boundary": "纯指令 Skill。交接时区分已验证结果、历史计划与待决定事项；不因整理交接而扩大清理或发布范围。",
    "links": [
      [
        "v0.2.0 发行记录",
        "https://github.com/jidekaixin2dian/handoff/releases/tag/v0.2.0"
      ],
      [
        "技能源码",
        "https://github.com/jidekaixin2dian/handoff/blob/main/skills/handoff/SKILL.md"
      ],
      [
        "交接示例",
        "https://github.com/jidekaixin2dian/handoff/blob/main/docs/example.md"
      ],
      [
        "使用说明",
        "https://github.com/jidekaixin2dian/handoff#readme"
      ]
    ],
    "release": {
      "version": "0.2.0",
      "summary": "换会话或换人接手时可触发交接，长交接按任务拆出索引。",
      "date": "2026-11-03"
    }
  },
  {
    "id": "storage",
    "name": "storage-analyzer",
    "repo": "storage-analyzer",
    "role": "Windows 维护分支",
    "category": "windows",
    "tags": "Python / PowerShell / HTML",
    "description": "先把空间看明白，再决定怎么清理。固定盘扫描、三级分诊与系统占用分析连成一份报告。",
    "visual": "storage",
    "subtitle": "空间从哪里来，清理之前先弄清楚。",
    "problem": "Windows 的编码、junction 和系统目录容易让磁盘报告失真。占得多，也不等于可以直接删除。",
    "approach": "基于 Khazix 的原始 skill 完成 Windows 特化：UTF-8、固定盘整机扫描、兼容链接覆盖诊断、服务状态提示与受边界约束的回收站删除。",
    "result": "v1.5.0 按固定盘检查分页文件和回收站，并探测 WSL 数据盘。新增结果写入分析 JSON，供进一步核对磁盘占用。",
    "boundary": "原始设计、分诊体系与安全模型来自数字生命卡兹克（Khazix）。我的工作是 Windows 特化与维护。系统占用段没有删除按钮；目录尺寸与驱动未匹配数不能直接当成可回收量。",
    "links": [
      [
        "维护说明",
        "https://github.com/jidekaixin2dian/storage-analyzer#readme"
      ],
      [
        "v1.5.0 发行记录",
        "https://github.com/jidekaixin2dian/storage-analyzer/releases/tag/v1.5.0"
      ],
      [
        "原始项目",
        "https://github.com/KKKKhazix/khazix-skills"
      ]
    ],
    "release": {
      "version": "1.5.0",
      "summary": "逐盘检查分页文件与回收站，并在分析结果中列出 WSL 虚拟磁盘。",
      "date": "2026-11-15"
    }
  },
  {
    "id": "codex",
    "name": "DSH Codex UI",
    "repo": "dsh-codex-ui",
    "role": "开源贡献",
    "category": "interface",
    "tags": "UI / Theme tokens",
    "compact": true,
    "description": "在社区界面插件中修复发送按钮的语义色。主题切换后，关键操作仍然清楚可见。",
    "subtitle": "一个按钮，也值得把它修对。",
    "problem": "皮肤改写颜色别名后，发送按钮可能出现黑色背景、图标看不清的问题。",
    "approach": "把发送按钮颜色改为按钮语义色，减少对容易被皮肤覆盖的通用别名令牌的依赖。",
    "result": "修复提交已通过上游 PR #33 合入。项目的侧栏、搜索与会话导航由 MichengAI 社区维护。",
    "boundary": "我的参与是具体修复贡献。DSH Codex UI 的整体开发与维护属于上游社区。",
    "links": [
      [
        "已合入的 PR #33",
        "https://github.com/MichengAI/dsh-codex-ui/pull/33"
      ],
      [
        "社区上游",
        "https://github.com/MichengAI/dsh-codex-ui"
      ]
    ]
  },
  {
    "id": "pi",
    "name": "pi-web",
    "repo": "pi-web",
    "role": "开源贡献",
    "category": "agent",
    "tags": "Provider catalog / API",
    "compact": true,
    "description": "改进模型发现端点和协议选择，修复拖选路径文字时目录窗口误关的问题。",
    "subtitle": "从读取模型列表，到选对工作目录。",
    "problem": "提供商的端点和协议各异；在目录选择器里拖选文字时，指针松在窗口外还会误关面板。",
    "approach": "从 provider 目录读取端点和协议，并让路径选择器检查拖选从哪里开始。",
    "result": "上游已合入 #1006、#1050 和 #1462，分别覆盖端点解析、协议保留和目录选择交互。",
    "boundary": "pi-web 由 agegr 维护。我参与了模型发现、协议配置和目录选择器交互的改进。",
    "links": [
      [
        "目录选择器 · #1462",
        "https://github.com/agegr/pi-web/pull/1462"
      ],
      [
        "保留 API 协议 · #1050",
        "https://github.com/agegr/pi-web/pull/1050"
      ],
      [
        "已合入的 PR #1006",
        "https://github.com/agegr/pi-web/pull/1006"
      ],
      [
        "社区上游",
        "https://github.com/agegr/pi-web"
      ]
    ]
  },
  {
    "id": "wallpaper",
    "name": "DSH Wallpaper Engine",
    "repo": "dsh-wallpaper-engine",
    "role": "上游贡献 · 已合入",
    "category": "interface",
    "tags": "Wallpaper / 场景渲染",
    "compact": true,
    "description": "修复场景壁纸装载时的模糊占位和首帧超时后的空白画面。",
    "subtitle": "场景还没渲染出来时，也能先看到清晰的壁纸。",
    "problem": "场景壁纸放大全屏后，占位图会模糊。渲染器迟迟不返回首帧时，页面还可能一直空白。",
    "approach": "全屏占位读取作者原图，壁纸库继续用缩略图。渲染超时后显示备用画面，切换场景时忽略旧请求。",
    "result": "上游已合入 #347。较早的字体提案 #100 已关闭、未合入。",
    "boundary": "壁纸引擎由 elysia395 与社区维护，我参与了加载与回退体验的修复。",
    "links": [
      [
        "场景壁纸首帧回退 · #347",
        "https://github.com/elysia395/dsh-wallpaper-engine/pull/347"
      ],
      [
        "修复提案 PR #100",
        "https://github.com/elysia395/dsh-wallpaper-engine/pull/100"
      ],
      [
        "研究分支",
        "https://github.com/jidekaixin2dian/dsh-wallpaper-engine"
      ],
      [
        "社区上游",
        "https://github.com/elysia395/dsh-wallpaper-engine"
      ]
    ]
  },
  {
    "id": "sidebar",
    "name": "DSH Better Sidebar",
    "repo": "DSH-better-sidebar",
    "role": "上游提案 · 开放中",
    "category": "interface",
    "tags": "Plugins / Workbench",
    "compact": true,
    "description": "提议让任务触发的侧栏在任务结束后自动收起，同时保留用户手动打开的面板。",
    "subtitle": "任务结束，把对话区还给正在聊天的人。",
    "problem": "子代理或后台任务会自动展开侧栏，结束后仍占用对话区。",
    "approach": "提供默认关闭的选项。当前会话的相关任务全部结束并持续空闲三秒后，收回由任务自动打开的侧栏。",
    "result": "已提交上游 PR #738。截至 2026-11-18，PR 仍开放。",
    "boundary": "此处记录公开提案的行为，合入与发行进展见上游。",
    "links": [
      [
        "查看开放中的 #738",
        "https://github.com/omdsh-dev/DSH-better-sidebar/pull/738"
      ],
      [
        "研究分支",
        "https://github.com/jidekaixin2dian/DSH-better-sidebar"
      ],
      [
        "社区上游",
        "https://github.com/omdsh-dev/DSH-better-sidebar"
      ],
      [
        "插件接入文档",
        "https://github.com/omdsh-dev/DSH-better-sidebar/blob/main/docs/external-plugin-guide.md"
      ]
    ]
  }
];
