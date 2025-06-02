export const defaultValue = `<!-- {"MarkdownType": "report", "id": "demo-doc", "section_ids": "[1, 2, 3, 4, 5]"} -->

# Markdown 完整功能演示

<!-- {"MarkdownType": "section", "id": "1"} -->
## 1. 基础文本格式

### 1.1 文本样式
普通文本
**粗体文本**# 现代代码编辑器技术解析与实现示例

## 现代代码编辑器技术解析与实现示例

### 一、核心架构设计

现代代码编辑器的核心架构围绕**高性能渲染**、**状态管理**和**扩展性**三大支柱构建，通过精密的模块化解耦实现桌面级的开发体验：

1. **渲染机制优化**
   - **行级渲染与虚拟滚动**：Ace Editor采用最小渲染单元为行的策略，仅重绘受光标移动或文本变化影响的行，避免整屏重排。结合虚拟滚动技术，只保留可视区周围若干屏的DOM节点，其余部分用占位符维持滚动高度，使编辑器能流畅处理高达400万行的文件。
   - **语法解析与主题分离**：通过解耦**语法模式（Mode）** 和**主题（Theme）**，Ace允许独立扩展语言支持（120+语言）和界面样式（20+主题），用户可灵活组合二者。
   - **GPU加速与高DPI适配**：如ecode编辑器针对现代硬件设计，利用GPU加速渲染，并根据屏幕DPI动态调整行高，提升文本显示精度。

2. **状态管理模型**
   - **事务（Transaction）驱动**：ProseMirror采用基于事务的状态管理机制，每次编辑操作产生一个描述状态变更的事务（如插入范围、文本内容），通过\`applyTransaction\`更新状态，而非直接修改文档。这种机制天然支持撤销历史与协作编辑。
   - **分层状态结构**：  
     \`\`\`mermaid
     graph LR
     A[文档模型] --> B[编辑器状态]
     B --> C[视图渲染]
     C --> D[用户交互]
     D --> A
     \`\`\`
     - **Model层**（prosemirror-model）：定义文档树结构
     - **State层**（prosemirror-state）：管理选区、事务
     - **View层**（prosemirror-view）：处理DOM渲染与事件

3. **扩展系统设计**
   - **插件化架构**：通过插件注入功能（如自动补全、LSP支持），Ace将复杂操作（如代码提示）移交Web Worker执行，避免主线程阻塞。
   - **语言智能解耦**：
     - **LSP模式**：编辑器仅保留Token序列，语义分析交给独立进程（如VS Code），适合轻量级前端。
     - **JB模式**：编辑器内置AST解析器（如IntelliJ IDEA），直接操作语法树，支持深度静态分析但需完整读取文件。

---

### 二、主流编辑器实现方案对比

| 编辑器      | 核心技术特点                     | 性能边界             | 适用场景                     |
|-------------|----------------------------------|----------------------|------------------------------|
| **Ace**     | 行级渲染+虚拟滚动，无依赖嵌入    | 支持400万行文件      | 在线IDE（如Cloud9）、运维面板|
| **ProseMirror**| 事务状态机，文档树模型         | 依赖DOM复杂度        | 富文本编辑（如Confluence）  |
| **ecode**   | 自研GUI框架eepp，GPU加速         | 需SSD/高性能硬件     | 原生桌面应用                 |
| **灵码IDE** | 基于VS Code，集成AI编程助手      | 依赖LSP响应延迟      | 智能补全/团队协作            |

- **Ace**：启动速度与内存占用优势显著，BSD许可允许商业闭源使用，但移动端体验较弱。
- **ProseMirror**：提供Lego式模块化（model/state/view/transform），需配合插件实现完整功能，适合深度定制。
- **Monaco**：VS Code内核，强于TypeScript智能感知，但体积较大。

---

### 三、实现示例：从基础到高级

#### 1. 基础编辑器实现（ProseMirror）
\`\`\`javascript
// 1. 初始化模式与状态
import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

// 2. 创建文档树
const doc = schema.node("doc", null, [
  schema.node("paragraph", null, [schema.text("Hello, world!")])
]);

// 3. 挂载编辑器视图
const state = EditorState.create({ schema, doc });
const view = new EditorView(document.body, { state });
\`\`\`
此代码创建了一个支持基础文本编辑的ProseMirror实例，包含文档模型和视图渲染。

#### 2. 状态管理与插件扩展
\`\`\`javascript
// 添加撤销历史与快捷键
import { history, undo, redo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";

const state = EditorState.create({
  schema,
  plugins: [
    history(), // 历史记录插件
    keymap({ "Mod-z": undo, "Mod-y": redo }) // 快捷键绑定
  ]
});

// 事务拦截示例
view.dispatchTransaction = (tr) => {
  console.log("文档变更:", tr.doc.content.size);
  view.updateState(view.state.apply(tr));
};
\`\`\`
此扩展使编辑器支持\`Ctrl+Z\`撤销操作，并通过事务监听实现状态跟踪。

#### 3. 高级功能：网页内代码执行器
基于CodeMirror实现实时执行效果：
\`\`\`javascript
// 重写console.log捕获输出
const originalConsoleLog = console.log;
console.log = (...args) => {
  outputDiv.innerHTML += args.join(" ") + "<br>"; // 输出到页面
};

// 执行用户代码
function executeCode(code) {
  try {
    eval(code); // 实际项目需沙箱隔离
  } catch (e) {
    outputDiv.innerHTML = \`Error: \${e.message}\`;
  }
}

// 绑定CodeMirror编辑器
const editor = CodeMirror(document.getElementById("editor"), {
  theme: "xcode", 
  mode: "javascript"
});
\`\`\`
此方案常用于技术教程（如算法演示），允许用户修改代码并即时查看运行结果。

---

### 四、前沿趋势与新兴方案

1. **智能编码支持**
   - **灵码IDE**集成AI编程助手，支持行间会话、多文件修改和个性化记忆，显著减少调试时间。

2. **云计算与协作**
   - **Ace + 服务器代理**：Cloud9通过此方案实现多人实时协作（共享光标、终端）。
   - **Operational Transform（OT）**：ProseMirror-collab使用OT算法解决协同编辑冲突。

3. **新兴编辑器探索**
   - **ecode**：基于自研GUI框架eepp构建，支持LSP和Minimap，目标为高性能原生应用，但尚未稳定。
   - **WebAssembly编译**：实验性方案将语言编译器（如Rust）编译为WASM，实现浏览器内原生级代码分析。

---

### 五、结语：技术选型建议

现代代码编辑器的技术演进呈现出**渲染精细化**（虚拟滚动/GPU加速）、**分析智能化**（LSP/AI集成）与**协作云端化**三大趋势。选型时需权衡：
- **轻量嵌入**：Ace的无依赖性与BSD许可使其成为在线教育、运维后台的首选。
- **深度定制**：ProseMirror的Lego式架构适合需要自主控制文档模型的场景。
- **智能协作**：基于VS Code的生态（如灵码IDE）或Cloud9协作方案，更适合现代团队开发。

未来编辑器将更紧密融合**本地性能**与**云端智能**，而新兴框架如ecode的eepp、WebAssembly的引入，可能进一步模糊本地与Web编辑器的边界。

## 3. 语法高亮实现示例

\`\`\`javascript
// 使用有限状态机实现基础语法高亮
class SyntaxHighlighter {
  constructor(rules) {
    this.states = [];
    this.rules = rules;
  }

  parse(text) {
    let currentState = 'initial';
    const tokens = [];
    
    while (text.length > 0) {
      let matched = false;
      for (const rule of this.rules[currentState]) {
        const match = text.match(rule.regex);
        if (match) {
          tokens.push({
            type: rule.tokenType,
            value: match[0]
          });
          text = text.substr(match[0].length);
          currentState = rule.nextState || currentState;
          matched = true;
          break;
        }
      }
      if (!matched) {
        text = text.substr(1);
      }
    }
    return tokens;
  }
}
\`\`\`

---

## 4. 性能优化策略
### 4.1 渲染优化技巧
1. 视窗区域计算
   - 动态加载可见区域内容
   - 使用图层化渲染策略
2. 增量更新机制
   - 差异对比算法
   - 局部重绘技术

### 4.2 内存管理方案
\`\`\`python
# 文件分块加载示例
class FileBuffer:
    BLOCK_SIZE = 4096
    
    def __init__(self, filename):
        self.blocks = []
        with open(filename, 'r') as f:
            while True:
                block = f.read(self.BLOCK_SIZE)
                if not block:
                    break
                self.blocks.append(block)
                
    def get_line(self, line_num):
        cumulative = 0
        for block in self.blocks:
            lines = block.split('\n')
            if line_num < cumulative + len(lines):
                return lines[line_num - cumulative]
            cumulative += len(lines)
        return None
\`\`\`

---SW

## 5. 扩展功能开发指南
### 5.1 插件系统架构

\`\`\`mermaid
graph TD
    A[开始] --> B[处理]
    B --> C[完成]
    C --> D[结束]
\`\`\`


### 5.2 API接口设计
\`\`\`typescript
interface EditorPlugin {
  name: string;
  activate(editor: EditorCore): void;
  deactivate?(): void;
}

class EditorCore {
  registerPlugin(plugin: EditorPlugin): boolean {
    // 实现插件注册逻辑
  }
  
  // 其他核心方法...
}
\`\`\`

---


![](https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*9F0qRYV8EjUAAAAAAAAAAAAADml6AQ/original)

## 视频

![video:视频名](https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/A*NudQQry0ERwAAAAAAAAAAAAADtN3AQ)


## 附件

![attachment:测试附件.pdf](https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/A*NudQQry0ERwAAAAAAAAAAAAADtN3AQ)


## 引用

上上任的武汉大学校长是李晓红。[^1][^2]

| 业务          | 2021Q1  | 2021Q2  | 2021Q3  | 2021Q4  | 2022Q1  | 
| ------------- | ------- | ------- | ------- | ------- | ------- |
| 收入          | 135,303 | 138,259 | 142,368 | 144,188 | 135,471 |
| 增值服务      | 72,443  | 72,013  | 75,203  | 71,913  | 72,738  | 
| 网络游戏     | 43,600  | 43,000  | 44,900  | 42,800  | 43,600  | 
| 社交网络收入 | 28,800  | 29,000  | 30,300  | 29,100  | 29,100  |
| 网络广告      | 21,820  | 22,833  | 22,495  | 21,518  | 17,988  | 
| 其他          | 41,040  | 43,413  | 44,670  | 50,757  | 44,745  |
| 金融科技     | 39,028  | 41,892  | 43,317  | 47,958  | 42,768  | 
| 云           | 162,012   | 111,521   | 111,353   | 112,799   | 111,977   |
> 数据来自 [^3]


[^1]:remarkjs.md
[^2]:remarkjs.md


## 表单

\`\`\`schema
[
  {
    "title": "标题",
    "dataIndex": "title",
    "formItemProps": {
      "rules": [{ "required": true, "message": "此项为必填项" }]
    },
    "width": "md"
  }
]
\`\`\`

## 删除线
~~插件系统架构~~

`;
