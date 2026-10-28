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
    "image": "fps-v030-overview.webp",
    "imageAlt": "FPS 帧律 v0.3.0 的真实工作台界面，展示开局准备、硬件状态与待审阅的系统调校项目。",
    "subtitle": "优化有没有用，让这台电脑的实测结果回答。",
    "problem": "系统设置、驱动画质和游戏准备散落在不同入口。改了什么、是否有效、怎样恢复，都需要清楚的记录。",
    "approach": "GUI 与 CLI 共用调校引擎，逐项解释状态、权限和副作用。写入受支持的设置前保存原值，再用同机 A/B 与性能会话判断是否保留。",
    "result": "图中为 v0.3.0 工作台：系统调校、按游戏限帧、DLSS 与显示配置、开局准备和统一恢复集中在一个入口。当前版本与更新内容见发行页。",
    "boundary": "不承诺固定帧率收益。真实 FPS 需要官方 PresentMon；ICC 效果取决于应用支持。缓存清理不能还原。",
    "links": [
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/fps-tune#readme"
      ],
      [
        "下载当前稳定版",
        "https://github.com/jidekaixin2dian/fps-tune/releases/latest"
      ],
      [
        "调校目录",
        "https://github.com/jidekaixin2dian/fps-tune/blob/main/catalog/catalog.json"
      ]
    ]
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
    "result": "设置页提供全局预算、MCP 服务器增删启停与 Skill 管理；模型可通过 toolgate 工具设置当前会话的预算。预算调整无需重启。",
    "boundary": "token 数是 schema 与 Skill 描述的估算，不是模型分词器的精确值。部分在 Agent 作用域动态注册的 MCP 工具不能由该插件隐藏。独立社区插件，不代表 DeepSeek 官方产品。",
    "links": [
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/dsh-toolgate#readme"
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
    "visual": "context"
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
    "result": "以 Alpha 预览版提供安装包、兼容性 CI 与验证记录。持续验证多个 DSH 版本，包括 0.2.1-rc.4；各版本的检查范围见验证矩阵。",
    "boundary": "Alpha 预览。验证使用 Mock 推理与真实本地 Node PTC，不代表真实模型延迟或完整 Desktop UI 验收。SSH、Python PTC 与任意第三方插件组合未验证。基于 DeepSeek Harness 官方 Agent Teams，独立社区实现，非上游已合入修复。",
    "links": [
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/dsh-team-flow#readme"
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
    "visual": "team"
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
    "result": "支持默认应用打开、选择打开方式、定位、复制路径与引用、预览和另存，也提供键盘菜单操作。",
    "boundary": "用于 DSH 图形与 Web 界面。应用列表取决于系统关联；文件访问遵守宿主授权，HTML / SVG 默认静态预览并阻止脚本和外部资源。",
    "links": [
      [
        "项目文档",
        "https://github.com/jidekaixin2dian/dsh-file-actions#readme"
      ],
      [
        "当前发行版",
        "https://github.com/jidekaixin2dian/dsh-file-actions/releases/latest"
      ],
      [
        "开发与验证",
        "https://github.com/jidekaixin2dian/dsh-file-actions/blob/main/docs/development.md"
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
    "result": "自包含运行时让目标机器无需另装 Node.js。任务完成时提供通知，费用汇总在托盘里可见，Ctrl+Alt+P 可以呼出或隐藏窗口。",
    "boundary": "这是基于 agegr/pi-web 的第三方桌面外壳；AI 编码内核与 Web UI 来自上游项目。",
    "links": [
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
    "result": "不需要额外服务，通过纯指令 skill 让下一位 Agent 或同事更快找到可靠起点。",
    "boundary": "纯指令 Skill。交接时区分已验证结果、历史计划与待决定事项；不因整理交接而扩大清理或发布范围。",
    "links": [
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
    ]
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
    "result": "v1.3.0 增加 12 项只读系统空间探测，管理员只读分析可补充 DISM 等结果。交互报告将普通占用分诊与系统占用分开呈现。",
    "boundary": "原始设计、分诊体系与安全模型来自数字生命卡兹克（Khazix）。我的工作是 Windows 特化与维护。系统占用段没有删除按钮；目录尺寸与驱动未匹配数不能直接当成可回收量。",
    "links": [
      [
        "维护说明",
        "https://github.com/jidekaixin2dian/storage-analyzer#readme"
      ],
      [
        "v1.3.0 发行版",
        "https://github.com/jidekaixin2dian/storage-analyzer/releases/tag/v1.3.0"
      ],
      [
        "原始项目",
        "https://github.com/KKKKhazix/khazix-skills"
      ]
    ]
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
    "name": "pi-web · 模型发现",
    "repo": "pi-web",
    "role": "开源贡献",
    "category": "agent",
    "tags": "Provider catalog / API",
    "compact": true,
    "description": "让模型发现从 provider 目录解析端点。把配置、协议与实际请求接到一起。",
    "subtitle": "减少配置里的猜测，让请求走对入口。",
    "problem": "模型发现需要识别不同 provider 的 API 协议与端点，单一假设容易让某些 provider 请求走错路径。",
    "approach": "从 pi 的 provider catalog 解析模型发现端点，使目录里的 provider 元信息参与请求构建。",
    "result": "功能提交已通过上游 PR #1006 合入，改善模型配置流程中的发现行为。",
    "boundary": "pi-web 是 agegr 维护的 Web UI；我的参与是模型发现功能贡献。",
    "links": [
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
    "role": "Fork / 改进提案",
    "category": "interface",
    "tags": "Wallpaper / Typography",
    "compact": true,
    "description": "围绕壁纸界面与字体体验进行探索，提出让全界面文字跟随宿主字体选择的修复。",
    "subtitle": "好用的工作台，也可以有自己的气质。",
    "problem": "壁纸插件里的字族设置需要与宿主字体选择保持一致，避免界面局部使用不同字体。",
    "approach": "在 Fork 中提出字体令牌修复，让插件字族读取宿主源头令牌，并提交到上游讨论。",
    "result": "修复提案可在上游 PR #100 查看。当前为已关闭、未合入状态。",
    "boundary": "壁纸插件由 elysia395 与社区维护。这个条目是改进提案，尚未合入上游。",
    "links": [
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
    "role": "Fork / 架构研究",
    "category": "interface",
    "tags": "Plugins / Workbench",
    "compact": true,
    "description": "探索把文件预览、终端和 Git 放进同一工作台的插件架构，研究 Agent 与界面的连接方式。",
    "subtitle": "把散落的工具，放回同一个工作现场。",
    "problem": "Agent 工作流经常需要在文件、终端、版本控制和会话之间来回切换。",
    "approach": "跟进开放侧边栏底座与插件注册机制，研究文件预览、终端和工作台如何在同一界面协作。",
    "result": "保留公开 Fork 作为研究入口，可继续查看框架与上游插件接入文档。",
    "boundary": "工作台框架由 omdsh-dev 社区维护；我的参与以跟进与架构研究为主。",
    "links": [
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
