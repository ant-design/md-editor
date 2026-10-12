export const searchData = {
  '404': {
    id: '404',
    path: '*',
    parentId: 'DocLayout',
  },
  'dumi-context-layout': {
    id: 'dumi-context-layout',
    path: '/',
    isLayout: true,
  },
  DocLayout: {
    id: 'DocLayout',
    path: '/',
    parentId: 'dumi-context-layout',
    isLayout: true,
  },
  DemoLayout: {
    id: 'DemoLayout',
    path: '/',
    parentId: 'dumi-context-layout',
    isLayout: true,
  },
  'demo-render': {
    id: 'demo-render',
    path: '~demos/:id',
    parentId: 'DemoLayout',
  },
  'docs/components/chat-flow-container': {
    path: 'components/chat-flow-container',
    id: 'docs/components/chat-flow-container',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'ChatLayout - 对话流容器组件',
        toc: 'menu',
        filename: 'docs/components/chat-flow-container.md',
        lastUpdated: 1765857003000,
        atomId: 'ChatLayout',
        group: {
          title: '布局',
          order: 2,
        },
        description:
          '该组件提供了一个完整的对话流容器，包含头部区域、内容区域和底部区域。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/markdownInputField': {
    path: 'components/markdown-input-field',
    id: 'docs/components/markdownInputField',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'MarkdownInputField - 输入框',
        toc: 'menu',
        filename: 'docs/components/markdownInputField.md',
        lastUpdated: 1766724356000,
        nav: {
          order: 1,
        },
        atomId: 'MarkdownInputField',
        group: {
          title: '意图输入',
          order: 3,
        },
        description:
          'MarkdownInputField 是一个带发送功能的 Markdown 输入字段组件，允许用户编辑 Markdown 内容并通过按钮或快捷键发送。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/ThoughtChainList': {
    path: 'components/thought-chain-list',
    id: 'docs/components/ThoughtChainList',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'ThoughtChainList 思维链',
        toc: 'menu',
        filename: 'docs/components/ThoughtChainList.md',
        lastUpdated: 1761624066000,
        nav: {
          order: 1,
        },
        atomId: 'ThoughtChainList',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          '一个用于可视化 AI 思考过程和推理链的 React 组件，具有可折叠、交互式格式。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/chart-statistic': {
    path: 'components/chart-statistic',
    id: 'docs/components/chart-statistic',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'ChartStatistic 指标卡',
        toc: 'menu',
        filename: 'docs/components/chart-statistic.md',
        lastUpdated: 1760934813000,
        atomId: 'ChartStatistic',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '用于显示单个关键指标数据的卡片组件，支持自定义格式化、主题切换、尺寸调整和弹性布局等功能。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/file-attachment': {
    path: 'components/file-attachment',
    id: 'docs/components/file-attachment',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'FileAttachment 文件附件',
        toc: 'menu',
        filename: 'docs/components/file-attachment.md',
        lastUpdated: 1766664493000,
        atomId: 'FileAttachment',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '文件附件是 Bubble 组件的内置功能，用于在对话气泡中展示和处理多种类型的文件，支持图片预览、文档展示和文件下载。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/SuggestionList': {
    path: 'components/suggestion-list',
    id: 'docs/components/SuggestionList',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'SuggestionList 追问建议',
        toc: 'menu',
        filename: 'docs/components/SuggestionList.md',
        lastUpdated: 1761624066000,
        atomId: 'SuggestionList',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          '一个轻量的追问建议列表组件，支持图标、提示、不同布局与三种样式类型。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/agentic-layout': {
    path: 'components/agentic-layout',
    id: 'docs/components/agentic-layout',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'AgenticLayout 智能体布局组件',
        toc: 'menu',
        filename: 'docs/components/agentic-layout.md',
        lastUpdated: 1761100263000,
        atomId: 'AgenticLayout',
        group: {
          title: '布局',
          order: 1,
        },
        description:
          'AgenticLayout 是一个专为智能体应用设计的三栏布局组件，支持左中右三个区域的灵活配置。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/scatter-chart': {
    path: 'components/scatter-chart',
    id: 'docs/components/scatter-chart',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'ScatterChart 散点图',
        toc: 'menu',
        filename: 'docs/components/scatter-chart.md',
        lastUpdated: 1762074244000,
        atomId: 'ScatterChart',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '用于展示二维坐标的离散点分布，支持分类与二级筛选，含响应式优化。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/SchemaEditor': {
    path: 'components/schema-editor',
    id: 'docs/components/SchemaEditor',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'SchemaEditor - schema 编辑工具',
        toc: 'menu',
        filename: 'docs/components/SchemaEditor.md',
        lastUpdated: 1760934813000,
        nav: {
          title: '组件',
          order: 1,
        },
        atomId: 'SchemaEditor',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          'SchemaEditor 是一个强大的 schema 编辑和预览工具，提供 HTML 模板和 JSON schema 的实时编辑功能，底层使用 AceEditor 来编辑 schema 中的 HTML 内容。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/answer-alert': {
    path: 'components/answer-alert',
    id: 'docs/components/answer-alert',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'AnswerAlert 应答中断提示',
        toc: 'menu',
        filename: 'docs/components/answer-alert.md',
        lastUpdated: 1761624066000,
        atomId: 'AnswerAlert',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          'AnswerAlert 是一个用于展示系统状态和用户提示的组件，特别适用于 AI 对话场景中的应答中断、错误提示、成功反馈等场景。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/funnel-chart': {
    path: 'components/funnel-chart',
    id: 'docs/components/funnel-chart',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'FunnelChart 漏斗图',
        toc: 'menu',
        filename: 'docs/components/funnel-chart.md',
        lastUpdated: 1763952334000,
        atomId: 'FunnelChart',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '支持阶段排序、居中对称显示、内置筛选与主题配置，风格与其他图表一致。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/task-running': {
    path: 'components/task-running',
    id: 'docs/components/task-running',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'TaskRunning 任务运行状态',
        toc: 'menu',
        filename: 'docs/components/task-running.md',
        lastUpdated: 1761624066000,
        atomId: 'TaskRunning',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          '用于展示任务的运行状态，包括运行时长、当前状态和操作按钮。支持多种状态切换和交互操作。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/text-loading': {
    path: 'components/text-loading',
    id: 'docs/components/text-loading',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'TextLoading 文字加载',
        toc: 'menu',
        filename: 'docs/components/text-loading.md',
        lastUpdated: 1766664493000,
        atomId: 'TextLoading',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          '一个轻量级的文字加载组件，通过纯CSS动画展示优雅的光泽流动效果。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/tool-use-bar': {
    path: 'components/tool-use-bar',
    id: 'docs/components/tool-use-bar',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'ToolUseBar 工具使用栏',
        toc: 'menu',
        filename: 'docs/components/tool-use-bar.md',
        lastUpdated: 1761624066000,
        atomId: 'ToolUseBar',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          'ToolUseBar 是一个用于显示工具调用列表的组件，支持工具状态显示和交互功能。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/FileMapView': {
    path: 'components/file-map-view',
    id: 'docs/components/FileMapView',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'FileMapView - 文件预览组件',
        toc: 'menu',
        filename: 'docs/components/FileMapView.md',
        lastUpdated: 1763020790000,
        nav: {
          title: '组件',
          order: 1,
        },
        atomId: 'FileMapView',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          'FileMapView 是一个强大的文件预览组件,支持多种文件类型的展示和预览功能,提供友好的文件列表视图。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/donut-chart': {
    path: 'components/donut-chart',
    id: 'docs/components/donut-chart',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'DonutChart 环形图',
        toc: 'menu',
        filename: 'docs/components/donut-chart.md',
        lastUpdated: 1762244572000,
        atomId: 'DonutChart',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '支持单值/多值、自动分类、中心文本、筛选与工具栏，移动端优化良好。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/radar-chart': {
    path: 'components/radar-chart',
    id: 'docs/components/radar-chart',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'RadarChart 雷达图',
        toc: 'menu',
        filename: 'docs/components/radar-chart.md',
        lastUpdated: 1762244572000,
        atomId: 'RadarChart',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '用于展示多指标对比的雷达图，支持分类与二级筛选，移动端自适应。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/VisualList': {
    path: 'components/visual-list',
    id: 'docs/components/VisualList',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'VisualList 视觉列表',
        toc: 'menu',
        filename: 'docs/components/VisualList.md',
        lastUpdated: 1761552753000,
        atomId: 'VisualList',
        group: {
          title: '通用',
          order: 1,
        },
        description:
          '一个灵活的图片列表组件，支持多种尺寸、形状和自定义渲染。基于 css-in-js 样式系统，提供良好的主题支持和样式隔离。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/area-chart': {
    path: 'components/area-chart',
    id: 'docs/components/area-chart',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'AreaChart 面积图',
        toc: 'menu',
        filename: 'docs/components/area-chart.md',
        lastUpdated: 1762074244000,
        atomId: 'AreaChart',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '用于渲染分类型、多序列的面积图，支持筛选、图例、主题与响应式。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/line-chart': {
    path: 'components/line-chart',
    id: 'docs/components/line-chart',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'LineChart 折线图',
        toc: 'menu',
        filename: 'docs/components/line-chart.md',
        lastUpdated: 1762074244000,
        atomId: 'LineChart',
        group: {
          title: '图文输出',
          order: 4,
        },
        description: '支持多序列、筛选、图例与网格线配置，含移动端响应式优化。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/bar-chart': {
    path: 'components/bar-chart',
    id: 'docs/components/bar-chart',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'BarChart 柱状图',
        toc: 'menu',
        filename: 'docs/components/bar-chart.md',
        lastUpdated: 1763952334000,
        atomId: 'BarChart',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '支持垂直/水平、堆叠、多序列以及筛选，含响应式与主题配置。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/chat-boot': {
    path: 'components/chat-boot',
    id: 'docs/components/chat-boot',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'ChatBootPage - 对话启动页',
        toc: 'menu',
        filename: 'docs/components/chat-boot.md',
        lastUpdated: 1762165454000,
        atomId: 'ChatBootPage',
        group: {
          title: '入口',
          order: 1,
        },
        description:
          '对话启动相关组件，包含标题、推荐卡片、按钮标签组等，用于构建对话界面的初始状态。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/task-list': {
    path: 'components/task-list',
    id: 'docs/components/task-list',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'TaskList 任务列表',
        toc: 'menu',
        filename: 'docs/components/task-list.md',
        lastUpdated: 1761624066000,
        atomId: 'TaskList',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          '用于展示任务列表的组件，支持折叠/展开、加载状态和不同的任务状态。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/workspace': {
    path: 'components/workspace',
    id: 'docs/components/workspace',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Workspace 工作空间',
        toc: 'menu',
        filename: 'docs/components/workspace.md',
        lastUpdated: 1765857003000,
        atomId: 'Workspace',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          'Workspace 是一个功能强大的工作空间组件，提供了标签页式的内容管理界面。支持多种内容类型的展示，包括实时跟随、任务管理、文件预览、浏览器内容等，为用户提供统一的工作环境。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/ai-label': {
    path: 'components/ai-label',
    id: 'docs/components/ai-label',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'AILabel AI 标签',
        toc: 'menu',
        filename: 'docs/components/ai-label.md',
        lastUpdated: 1766664493000,
        atomId: 'AILabel',
        group: {
          title: '入口',
          order: 1,
        },
        description:
          'AILabel 是一个用于明确标识 AI 生成内容的组件，在原有非 AI 对话界面中，通过视觉标记、水印或标签，清晰区分人工创建与 AI 生成的内容，增强透明度并帮助用户识别内容来源，确保合规性。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/footnote': {
    path: 'components/footnote',
    id: 'docs/components/footnote',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Footnote 脚注',
        toc: 'menu',
        filename: 'docs/components/footnote.md',
        lastUpdated: 1766664493000,
        atomId: 'Footnote',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '脚注是 Bubble 组件的内置功能，用于在 Markdown 内容中添加引用标记和补充说明，支持弹框预览和来源汇总展示。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/back-to': {
    path: 'components/back-to',
    id: 'docs/components/back-to',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'BackTo 回到顶部/底部',
        toc: 'menu',
        filename: 'docs/components/back-to.md',
        lastUpdated: 1761552753000,
        atomId: 'BackTo',
        group: {
          title: '入口',
          order: 1,
        },
        description:
          'BackTo 是一个用于快速滚动到页面顶部或底部的浮动按钮组件，适用于长内容页面的导航场景。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/history': {
    path: 'components/history',
    id: 'docs/components/history',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'History 历史记录',
        toc: 'menu',
        filename: 'docs/components/history.md',
        lastUpdated: 1763952334000,
        atomId: 'History',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          'History 组件用于显示和管理聊天历史记录，支持两种显示模式：下拉菜单模式和独立菜单模式。组件提供历史会话的查看、选择和删除功能。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/loading': {
    path: 'components/loading',
    id: 'docs/components/loading',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Loading 加载',
        toc: 'menu',
        filename: 'docs/components/loading.md',
        lastUpdated: 1766664493000,
        atomId: 'Loading',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          '一套优雅的加载动画组件集合，提供多种加载动画效果，适用于各种加载场景。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/mermaid': {
    path: 'components/mermaid',
    id: 'docs/components/mermaid',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Mermaid 图',
        toc: 'menu',
        filename: 'docs/components/mermaid.md',
        lastUpdated: 1761587257000,
        atomId: 'Mermaid',
        group: {
          title: '图文输出',
          order: 4,
        },
        description:
          '用于渲染 Mermaid 图表，支持流程图、时序图、甘特图、类图等多种图表类型。基于 Mermaid 库实现，提供美观的图表渲染和交互功能。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/welcome': {
    path: 'components/welcome',
    id: 'docs/components/welcome',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'WelcomeMessage 欢迎语',
        toc: 'menu',
        filename: 'docs/components/welcome.md',
        lastUpdated: 1762165426000,
        atomId: 'WelcomeMessage',
        group: {
          title: '入口',
          order: 1,
        },
        description: '通过简短友好的欢迎语引入使用场景。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/bubble': {
    path: 'components/bubble',
    id: 'docs/components/bubble',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Bubble 气泡组件',
        toc: 'menu',
        filename: 'docs/components/bubble.md',
        lastUpdated: 1766465775000,
        atomId: 'Bubble',
        group: {
          title: '对话流',
          order: 3,
        },
        description:
          'Bubble 组件是一个功能丰富的聊天消息气泡组件，为现代化对话界面提供完整的解决方案。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/schema': {
    path: 'components/schema',
    id: 'docs/components/schema',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Schema - 低代码渲染',
        toc: 'menu',
        filename: 'docs/components/schema.md',
        lastUpdated: 1761552753000,
        nav: {
          title: '组件',
          order: 1,
        },
        atomId: 'Schema',
        group: {
          title: '图文输出',
          order: 4,
        },
        description: '本文档介绍如何使用 Schema 系统来创建和配置组件。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/quote': {
    path: 'components/quote',
    id: 'docs/components/quote',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Quote 引用组件',
        toc: 'menu',
        filename: 'docs/components/quote.md',
        lastUpdated: 1760672984000,
        atomId: 'Quote',
        group: {
          title: '对话流',
          order: 6,
        },
        description:
          'Quote 组件是一个现代化的文件引用卡片组件，为代码引用和文档引用场景提供完整的展示解决方案。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/robot': {
    path: 'components/robot',
    id: 'docs/components/robot',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Robot 机器人形象',
        toc: 'menu',
        filename: 'docs/components/robot.md',
        lastUpdated: 1760672984000,
        atomId: 'Robot',
        group: {
          title: '入口',
          order: 1,
        },
        description:
          '机器人形象组件，提供多种动画状态的机器人图标，支持自定义大小、状态和图标。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/components/api': {
    path: 'components/api',
    id: 'docs/components/api',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'MarkdownEditor API 文档',
        toc: 'menu',
        filename: 'docs/components/api.md',
        lastUpdated: 1762848503000,
        nav: {
          order: 1,
        },
        atomId: 'MarkdownEditor',
        group: {
          title: '意图输入',
          order: 3,
        },
        description:
          'MarkdownEditor 是一个功能强大的 Markdown 编辑器组件，基于 React + TypeScript 构建，提供丰富的编辑功能、实时预览、插件系统等特性。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/demos-pages/content-types': {
    path: 'demos-pages/content-types',
    id: 'docs/demos-pages/content-types',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '内容类型',
        toc: 'menu',
        filename: 'docs/demos-pages/content-types.md',
        lastUpdated: 1763020790000,
        nav: {
          title: 'Demo',
          order: 2,
        },
        group: {
          title: '通用',
          order: 10,
        },
        description:
          '支持两种方式展示 AI 的思考过程：使用 <think> 标签格式或代码块格式。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/demos-pages/workspace': {
    path: 'demos-pages/workspace',
    id: 'docs/demos-pages/workspace',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '工作空间',
        toc: 'menu',
        filename: 'docs/demos-pages/workspace.md',
        lastUpdated: 1765506859000,
        nav: {
          title: 'Demo',
          order: 3,
        },
        group: {
          title: '通用',
          order: 9,
        },
      },
      toc: [],
      texts: [],
    },
  },
  'docs/demos-pages/editor': {
    path: 'demos-pages/editor',
    id: 'docs/demos-pages/editor',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '编辑器基础功能',
        toc: 'menu',
        filename: 'docs/demos-pages/editor.md',
        lastUpdated: 1760672984000,
        nav: {
          title: 'Demo',
          order: 1,
        },
        group: {
          title: '通用',
          order: 8,
        },
      },
      toc: [],
      texts: [],
    },
  },
  'docs/demos-pages/chart': {
    path: 'demos-pages/chart',
    id: 'docs/demos-pages/chart',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '原子图表',
        toc: 'menu',
        filename: 'docs/demos-pages/chart.md',
        lastUpdated: 1760672984000,
        nav: {
          title: 'Demo',
          order: 2,
        },
        group: {
          title: '通用',
          order: 7,
        },
        description:
          '用于显示单个关键指标数据的卡片组件，支持自定义格式化、主题切换、尺寸调整和弹性布局等功能。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/demos-pages/index': {
    path: 'demos-pages',
    id: 'docs/demos-pages/index',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '基础交互',
        toc: 'menu',
        filename: 'docs/demos-pages/index.md',
        lastUpdated: 1766133854000,
        nav: {
          title: 'Demo',
          order: 1,
        },
        group: {
          title: '通用',
          order: 5,
        },
      },
      toc: [],
      texts: [],
    },
  },
  'docs/demos-pages/video': {
    path: 'demos-pages/video',
    id: 'docs/demos-pages/video',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '视频支持',
        toc: 'menu',
        filename: 'docs/demos-pages/video.md',
        lastUpdated: 1761906538000,
        nav: {
          title: 'Demo',
          order: 5,
        },
        group: {
          title: '通用',
          order: 11,
        },
        description:
          'Markdown Editor 支持在 Markdown 中嵌入视频元素，支持多种视频格式和属性。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/demos-pages/chat': {
    path: 'demos-pages/chat',
    id: 'docs/demos-pages/chat',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '对话流',
        toc: 'menu',
        filename: 'docs/demos-pages/chat.md',
        lastUpdated: 1765164352000,
        nav: {
          title: 'Demo',
          order: 5,
        },
        group: {
          title: '通用',
          order: 6,
        },
      },
      toc: [],
      texts: [],
    },
  },
  'docs/development/component-development-guide': {
    path: 'development/component-development-guide',
    id: 'docs/development/component-development-guide',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '组件开发规范',
        toc: 'menu',
        filename: 'docs/development/component-development-guide.md',
        lastUpdated: 1761794241000,
        nav: {
          title: '项目研发',
          order: 1,
        },
        group: {
          title: '开发指南',
          order: 1,
        },
        description:
          '基于 agentic-ui 项目的实际开发经验，定义完整的组件开发规范。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/development/pull-request-guide': {
    path: 'development/pull-request-guide',
    id: 'docs/development/pull-request-guide',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Pull Request 提交指南',
        toc: 'menu',
        filename: 'docs/development/pull-request-guide.md',
        lastUpdated: 1761553053000,
        nav: {
          title: '项目研发',
          order: 3,
        },
        group: {
          title: '开发指南',
          order: 3,
        },
        description:
          '本指南将帮助您了解如何正确地向 agentic-ui 项目提交 Pull Request (PR)，包括从分支创建到合并的完整流程。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/development/development-guide': {
    path: 'development/development-guide',
    id: 'docs/development/development-guide',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '开发指南与最佳实践',
        toc: 'menu',
        filename: 'docs/development/development-guide.md',
        lastUpdated: 1761553053000,
        nav: {
          title: '项目研发',
          order: 3,
        },
        group: {
          title: '开发指南',
          order: 2,
        },
        description:
          '本指南涵盖了 agentic-ui 项目的开发流程、最佳实践、性能优化和常见问题解决方案。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/development/project-overview': {
    path: 'development/project-overview',
    id: 'docs/development/project-overview',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '项目技术栈与架构说明',
        toc: 'menu',
        filename: 'docs/development/project-overview.md',
        lastUpdated: 1761797279000,
        nav: {
          title: '项目研发',
          order: 1,
        },
        group: {
          title: '开发指南',
          order: 5,
        },
        description:
          '项目简介：agentic-ui 是一个基于 React + TypeScript 的现代化 Markdown 编辑器，提供丰富的编辑功能和插件系统，支持实时预览、语法高亮、数学公式渲染等特性。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/development/css-in-js-guide': {
    path: 'development/css-in-js-guide',
    id: 'docs/development/css-in-js-guide',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'CSS-in-JS 方案指南',
        toc: 'menu',
        filename: 'docs/development/css-in-js-guide.md',
        lastUpdated: 1761797279000,
        nav: {
          title: '项目研发',
          order: 3,
        },
        group: {
          title: '开发指南',
          order: 6,
        },
        description:
          '方案简介：agentic-ui 项目采用 @ant-design/cssinjs 作为 CSS-in-JS 解决方案，提供类型安全、主题定制、动态样式等现代化样式管理能力。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/development/release-guide': {
    path: 'development/release-guide',
    id: 'docs/development/release-guide',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '发布测试版本指南',
        toc: 'menu',
        filename: 'docs/development/release-guide.md',
        lastUpdated: 1761552753000,
        nav: {
          title: '项目研发',
          order: 3,
        },
        group: {
          title: '开发指南',
          order: 4,
        },
        description:
          '本指南详细介绍了如何发布 agentic-ui 的测试版本，包括版本管理、发布流程和测试验证。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/html-to-markdown-utils': {
    path: 'utils/html-to-markdown-utils',
    id: 'docs/utils/html-to-markdown-utils',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'HTML 到 Markdown 转换工具',
        toc: 'menu',
        filename: 'docs/utils/html-to-markdown-utils.md',
        lastUpdated: 1761552753000,
        nav: {
          title: '高级功能',
          order: 4,
        },
        group: {
          title: '工具函数',
          order: 7,
        },
        description:
          '这个模块提供了一套无依赖的 HTML 到 Markdown 转换工具，可以独立使用。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/markdownToHtml': {
    path: 'utils/markdown-to-html',
    id: 'docs/utils/markdownToHtml',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'markdownToHtml 工具函数',
        toc: 'menu',
        filename: 'docs/utils/markdownToHtml.md',
        lastUpdated: 1763047969000,
        nav: {
          title: '工具函数',
          order: 5,
        },
        group: {
          title: '工具函数',
          order: 3,
        },
        description:
          'markdownToHtml 是一个用于将 Markdown 内容转换为 HTML 的工具函数集合。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/chart-config': {
    path: 'utils/chart-config',
    id: 'docs/utils/chart-config',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '图表配置文档',
        toc: 'menu',
        filename: 'docs/utils/chart-config.md',
        lastUpdated: 1760672984000,
        nav: {
          title: '高级功能',
          order: 4,
        },
        group: {
          title: '工具函数',
          order: 2,
        },
        description: '图表配置通过 Markdown 注释的方式添加，格式如下：',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/editorUtils': {
    path: 'utils/editor-utils',
    id: 'docs/utils/editorUtils',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'EditorUtils 工具类',
        toc: 'menu',
        filename: 'docs/utils/editorUtils.md',
        lastUpdated: 1760672984000,
        nav: {
          title: '工具函数',
          order: 5,
        },
        group: {
          title: '工具函数',
          order: 4,
        },
        description:
          'EditorUtils 是一个提供编辑器操作工具方法的静态类，封装了常用的 Slate 编辑器操作。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/isMarkdown': {
    path: 'utils/is-markdown',
    id: 'docs/utils/isMarkdown',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'isMarkdown 工具函数',
        toc: 'menu',
        filename: 'docs/utils/isMarkdown.md',
        lastUpdated: 1761552753000,
        nav: {
          title: '工具函数',
          order: 5,
        },
        group: {
          title: '工具函数',
          order: 6,
        },
        description:
          'isMarkdown 是一个用于检测字符串是否包含 Markdown 格式的工具函数。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/sandbox': {
    path: 'utils/sandbox',
    id: 'docs/utils/sandbox',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '沙箱系统 (ProxySandbox)',
        toc: 'menu',
        filename: 'docs/utils/sandbox.md',
        lastUpdated: 1763717278000,
        nav: {
          title: '工具函数',
          order: 5,
        },
        group: {
          title: '工具函数',
          order: 8,
        },
        description:
          'ProxySandbox 是一个强大的 JavaScript 代码执行沙箱系统，提供安全、受控的代码执行环境。它支持多种安全特性，包括代码注入防护、访问控制、资源限制和自定义参数注入等功能。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/index': {
    path: 'utils',
    id: 'docs/utils/index',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '工具函数总览',
        toc: 'menu',
        filename: 'docs/utils/index.md',
        lastUpdated: 1762309151000,
        nav: {
          title: '工具函数',
          order: 5,
        },
        group: {
          title: '工具函数',
          order: 1,
        },
        description:
          'agentic-ui 提供了丰富的工具函数，用于支持编辑器的各种功能。这些工具函数都是模块化设计的，可以独立使用。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/i18n': {
    path: 'utils/i18n',
    id: 'docs/utils/i18n',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '国际化 (I18n)',
        toc: 'menu',
        filename: 'docs/utils/i18n.md',
        lastUpdated: 1762309151000,
        nav: {
          title: '工具函数',
          order: 5,
        },
        group: {
          title: '工具函数',
          order: 1,
        },
        description:
          '@ant-design/agentic-ui 提供了完整的国际化解决方案，支持中英文切换，自动检测用户语言偏好，并与 Ant Design 的国际化系统无缝集成。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/utils/dom': {
    path: 'utils/dom',
    id: 'docs/utils/dom',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'DOM 工具函数',
        toc: 'menu',
        filename: 'docs/utils/dom.md',
        lastUpdated: 1761552753000,
        nav: {
          title: '工具函数',
          order: 5,
        },
        group: {
          title: '工具函数',
          order: 5,
        },
        description: 'dom.ts 提供了一系列用于 DOM 操作和处理的工具函数。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/markdown-syntax.en-US': {
    path: 'markdown-syntax/en--us',
    id: 'docs/markdown-syntax.en-US',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Markdown Syntax Guide',
        toc: 'menu',
        filename: 'docs/markdown-syntax.en-US.md',
        lastUpdated: 1766664626000,
        order: 10,
        description:
          'This document introduces common Markdown syntax to help you get started with writing documentation quickly.',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/markdown-syntax': {
    path: 'markdown-syntax',
    id: 'docs/markdown-syntax',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Markdown 语法指南',
        toc: 'menu',
        filename: 'docs/markdown-syntax.md',
        lastUpdated: 1766664626000,
        order: 10,
        description:
          '本文档介绍了常用的 Markdown 语法，帮助你快速上手编写文档。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/plugin/index': {
    path: 'plugin',
    id: 'docs/plugin/index',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '插件',
        toc: 'menu',
        filename: 'docs/plugin/index.md',
        lastUpdated: 1763717278000,
        nav: {
          title: '插件',
          order: 2,
        },
        group: {
          title: '通用',
          order: 3,
        },
        description:
          'Markdown 编辑器插件系统提供了灵活的方式来扩展编辑器的功能。它允许你自定义节点渲染、实现 Markdown 双向转换，以及扩展编辑器行为。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/plugin/demo': {
    path: 'plugin/demo',
    id: 'docs/plugin/demo',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Demo',
        toc: 'menu',
        filename: 'docs/plugin/demo.md',
        lastUpdated: 1760672984000,
        nav: {
          title: '插件',
          order: 2,
        },
        group: {
          title: '通用',
          order: 12,
        },
      },
      toc: [],
      texts: [],
    },
  },
  'docs/faq/lazy': {
    path: 'faq/lazy',
    id: 'docs/faq/lazy',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '性能优化',
        toc: 'menu',
        filename: 'docs/faq/lazy.md',
        lastUpdated: 1762337298000,
        nav: {
          title: '常见问题',
          order: 6,
        },
        group: {
          title: '通用',
          order: 3,
        },
        description:
          'BaseMarkdownEditor 支持懒加载渲染模式，通过 IntersectionObserver API 实现按需渲染，显著提升大型文档的渲染性能。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/faq/faq': {
    path: 'faq/faq',
    id: 'docs/faq/faq',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: '常见问题与故障排除',
        toc: 'menu',
        filename: 'docs/faq/faq.md',
        lastUpdated: 1761552753000,
        nav: {
          title: '常见问题',
          order: 6,
        },
        group: {
          title: '通用',
          order: 3,
        },
        description:
          '本页面整理了使用 agentic-ui 过程中经常遇到的问题和解决方案。',
      },
      toc: [],
      texts: [],
    },
  },
  'docs/index': {
    path: '',
    id: 'docs/index',
    parentId: 'DocLayout',
    meta: {
      frontmatter: {
        title: 'Docs',
        toc: 'menu',
        filename: 'docs/index.md',
        lastUpdated: 1761552753000,
        hero: {
          title: 'Agentic UI',
          description:
            '面向智能体的 UI 组件库，从"回答一句话"到"完成一件事"，让 AI 的思考过程透明化',
          actions: [
            {
              text: '快速开始',
              link: '/components/api',
            },
            {
              text: '查看 GitHub',
              link: 'https://github.com/ant-design/agentic-ui',
              type: 'primary',
            },
          ],
        },
        group: {
          title: '通用',
          order: 0,
        },
        features: [
          {
            title: '多步推理可视化',
            emoji: '🤖',
            description:
              '展示智能体的思考、行动、观察过程，让 AI 决策过程透明化、可理解',
          },
          {
            title: '工具调用展示',
            emoji: '🔧',
            description:
              '可视化工具编排与执行状态，实时展示 API 调用、数据查询等操作过程',
          },
          {
            title: '人在回路机制',
            emoji: '👤',
            description:
              '支持人工审批、干预或纠偏，在关键节点介入智能体决策流程',
          },
          {
            title: '任务执行协同',
            emoji: '📊',
            description:
              '从单轮问答升级为端到端任务协同，支持多步骤、多目标的复杂任务执行',
          },
          {
            title: '富文本编辑能力',
            emoji: '📝',
            description:
              '基于 Slate.js 的强大 Markdown 编辑器，支持流式输出、打字机效果、语法高亮',
          },
          {
            title: '开箱即用组件',
            emoji: '📦',
            description:
              '预设样式与交互，提供 Bubble、TaskList、ThoughtChainList 等专业组件，快速集成',
          },
        ],
      },
      toc: [],
      texts: [],
    },
  },
};
