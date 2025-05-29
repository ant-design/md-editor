export const defaultValue = `<!-- {"MarkdownType": "report", "id": "demo-doc", "section_ids": "[1, 2, 3, 4, 5]"} -->

# Markdown 完整功能演示

<!-- {"MarkdownType": "section", "id": "1"} -->
## 1. 基础文本格式

### 1.1 文本样式
普通文本
**粗体文本**
*斜体文本*
***粗斜体文本***
~~删除线文本~~

### 1.2 HTML 样式文本
<font color="red">红色文本</font>
<font color=#FE0300>十六进制颜色文本</font>
<sup>上标文本</sup>
<sub>下标文本</sub>

### 1.3 标题样式
#  <font color=#FE0300>*一级标题样式*</font>
##  <font color=#70AD48>*二级标题样式*</font>
###  <font color=#F6CCAC>*三级标题样式*</font>

<!-- {"MarkdownType": "section", "id": "2"} -->
## 2. 链接与引用

### 2.1 普通链接
[Markdown 指南](https://www.markdownguide.org)

### 2.2 带样式的链接
[<font color="red">红色链接文本</font>](https://www.example.com)

### 2.3 卡片式链接
<!-- {"type": "card", "icon": "https://example.com/icon.png", "title": "示例卡片链接", "description": "这是一个卡片式链接的详细描述文本"} -->
[示例卡片](https://www.example.com "卡片提示文本")

### 2.4 引用
> 这是一段引用文本
> 可以包含多行
>> 这是嵌套引用

### 2.5 脚注引用
这是一个带有脚注的文本[^1]
这是另一个脚注[^2]

[^1]: 这是第一个脚注的解释
[^2]: 这是第二个脚注的解释

<!-- {"MarkdownType": "section", "id": "3"} -->
## 3. 列表与表格

### 3.1 无序列表
- 第一项
  - 子项 A
  - 子项 B
- 第二项
  - 子项 C
    - 更深层子项

### 3.2 有序列表
1. 第一步
2. 第二步
   1. 子步骤 1
   2. 子步骤 2
3. 第三步

### 3.3 复杂表格
| 功能 | 基础版 | 专业版 | 企业版 |
|------|:------:|:------:|-------:|
| 功能A | ✓ | ✓ | ✓ |
| 功能B | × | ✓ | ✓ |
| 功能C | × | × | ✓ |

### 3.4 带引用的表格
| 项目 | 数值 | 备注 |
|------|------|------|
| A | 100 [^note1] | 基准值 |
| B | 200 [^note2] | 对比值 |

[^note1]: 数值A的补充说明
[^note2]: 数值B的补充说明

<!-- {"MarkdownType": "section", "id": "4"} -->
## 4. 代码与图表

### 4.1 行内代码
这是一个 \`inline code\` 示例

### 4.2 代码块
\`\`\`typescript
interface User {
  name: string;
  age: number;
  roles: string[];
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

### 4.3 流程图
\`\`\`mermaid
graph TD
    A[开始] --> B{判断}
    B -->|条件1| C[处理1]
    B -->|条件2| D[处理2]
    C --> E[结束]
    D --> E
\`\`\`

### 4.4 思维导图
\`\`\`mermaid
mindmap
  root((核心))
    分支1
      子项A
      子项B
    分支2
      子项C
      子项D
        更深层1
        更深层2
\`\`\`

### 4.5 图表
<!-- {"chartType": "bar", "x": "季度", "y": "收入"} -->
| 季度 | 收入 | 支出 | 利润 |
|------|------|------|------|
| Q1 | 100 | 70 | 30 |
| Q2 | 120 | 80 | 40 |
| Q3 | 140 | 90 | 50 |
| Q4 | 160 | 100 | 60 |

<!-- {"MarkdownType": "section", "id": "5"} -->
## 5. 多媒体与卡片

### 5.1 图片
![示例图片](https://example.com/image.jpg)
![带标题的图片](https://example.com/image.jpg "图片标题")

### 5.2 视频
![video:视频标题](https://example.com/video.mp4)

### 5.3 附件
![attachment:文档.pdf](https://example.com/document.pdf)

### 5.4 卡片组件
\`\`\`agentar-card
{
  "version": "1.0.0",
  "name": "示例卡片",
  "description": "这是一个示例卡片组件",
  "component": {
    "type": "html",
    "properties": {
      "title": {
        "type": "string",
        "required": true,
        "default": "卡片标题"
      },
      "content": {
        "type": "string",
        "required": true,
        "default": "卡片内容"
      }
    },
    "schema": "<div style='padding: 20px; border: 1px solid #eee; border-radius: 8px;'><h3>{{title}}</h3><p>{{content}}</p></div>"
  }
}
\`\`\`

### 5.5 表单
\`\`\`schema
[
  {
    "title": "用户名",
    "dataIndex": "username",
    "formItemProps": {
      "rules": [{ "required": true, "message": "请输入用户名" }]
    },
    "width": "md"
  },
  {
    "title": "密码",
    "dataIndex": "password",
    "valueType": "password",
    "formItemProps": {
      "rules": [{ "required": true, "message": "请输入密码" }]
    },
    "width": "md"
  }
]
\`\`\`

## 结语
这个示例文档展示了 Markdown 支持的所有主要功能，包括基础文本格式、链接、表格、代码、图表、多媒体等内容。每个部分都提供了详细的示例，可以作为参考使用.`;
