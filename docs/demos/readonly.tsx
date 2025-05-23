﻿import {
  MARKDOWN_EDITOR_EVENTS,
  MarkdownEditor,
  MarkdownEditorInstance,
} from '@ant-design/md-editor';
import { ChartElement } from '@ant-design/md-editor/plugins/chart';
import { CodeElement } from '@ant-design/md-editor/plugins/code';
import { MermaidElement } from '@ant-design/md-editor/plugins/mermaid';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

const defaultValue = `
# 现代代码编辑器技术解析与实现示例

## html

<font color="red">Umi 科技（深圳）有限公司</font>
<font color=#FE0300>哈哈哈</font>
<sup>Umi 科技（深圳）有限公司</sup>
<sub>Umi 科技（深圳）有限公司</sub>

#  <font color=#FE0300>*我是一个正经人*</font>
##  <font color=#70AD48>*我是一个正经人*</font>
###  <font color=#F6CCAC>*我是一个正经人*</font>

[知乎](https://www.zhihu.com/favicon.ico?x-oss-process=image%2Fquality%2Cq_10)

[<font color="red">知乎</font>](https://www.zhihu.com/favicon.ico?x-oss-process=image%2Fquality%2Cq_10)



<html><table><tbody><tr><td>序号</td><td>问题</td><td>答案</td></tr><tr><td>0.0</td><td>世界上最小的鸟是什么?</td><td>蜂鸟（Hummingbird）。蜂鸟是世界上最小的鸟类，其中最小的种类是蜂鸟科中的蜂鸟属（Melli</td></tr><tr><td>1.0</td><td>地球上最高的山峰是哪座?</td><td>珠穆朗玛峰（Mount Everest）。珠穆朗玛峰位于喜马拉雅山脉，海拔8848.86米，是地球上最</td></tr><tr><td>2.0</td><td>哪种动物的睡眠时间最长?</td><td>考拉（Koala）。考拉每天大约睡18-22小时，是已知睡眠时间最长的动物之一。</td></tr></tbody></table></html>





## 1. 编辑器核心功能架构
### 1.1 基础功能模块
- 文本处理系统
  - 行缓冲区管理
  - 字符编码转换
  - 撤销/重做堆栈
- 用户界面组件
  - 多标签页管理
  - 分屏视图
  - 状态栏集成

### 1.2 高级功能实现
- 智能代码补全
- 实时语法检查
- 版本控制集成
- 插件扩展系统

---

## 2. 关键技术方案对比

| 技术方向       | 实现方案                | 优点                 | 缺点                  |
|----------------|-------------------------|----------------------|-----------------------|
| 语法高亮       | 正则表达式匹配          | 实现简单             | 性能较差              |
|                | 语法树分析              | 高准确性             | 实现复杂              |
| 文件管理       | 内存映射文件            | 大文件处理优势       | 内存消耗较大          |
|                | 分块加载机制            | 内存效率高           | 需要复杂索引          |
| 渲染引擎       | Canvas 绘制             | 高性能渲染           | 兼容性要求高          |
|                | DOM 元素渲染            | 天然支持文字样式     | 大数据量性能瓶颈      |

---

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

## 链接

<!-- {"type": "card","icon":"https://www.zhihu.com/favicon.ico?x-oss-process=image%2Fquality%2Cq_10","title":"《影之刃零》发售销量会破五百万吗？ - 知乎","description":"这游戏的名字就直接扣2分，什么日系玩意。这游戏又是古龙风格的，作为金庸粉，不减分就不错了。看了下预…" } -->
[Umi 官网](https://www.zhihu.com/question/665438199/answer/3625311124 "Umi 官网")


[Umi 官网](https://www.zhihu.com/question/665438199/answer/3625311124 "Umi 官网")


## Description


| 业务          | 2021Q1  | 2021Q2  | 2021Q3  | 2021Q4  | 2022Q1  | 2022Q2  | 2022Q3  | 2022Q4  | 2023Q1  | 2023Q2  | 2023Q3  | 2023Q4  |
| ------------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| 收入          | 135,303 | 138,259 | 142,368 | 144,188 | 135,471 | 134,034 | 140,093 | 144,954 | 149,986 | 149,208 | 154,625 | 155,200 |


## 图表

<!-- {"chartType": "bar", "x":"业务", "y":"2021Q1"} -->

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

## 图片

![](https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*9F0qRYV8EjUAAAAAAAAAAAAADml6AQ/original)

## 视频

![video:视频名](https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/A*NudQQry0ERwAAAAAAAAAAAAADtN3AQ)


## 附件

![attachment:测试附件.pdf](https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/A*NudQQry0ERwAAAAAAAAAAAAADtN3AQ)



在 Python 中遍历数组（通常指列表 \`list\`）有以下常用方法：

---

### 一、基础遍历方法
1. **直接遍历元素**  
   使用 \`for-in\` 循环直接访问每个元素：
   \`\`\`python
   arr = [1, 2, 3, 4]
   for num in arr:
       print(num)  # 输出每个元素的值
   \`\`\`  
   这是最简洁直观的方式 [^DOC_1] [^DOC_2] [^DOC_7]。

2. **通过索引遍历**  
   结合 \`range(len())\` 获取索引：
   \`\`\`python
   for i in range(len(arr)):
       print(arr[i])  # 通过索引访问元素
   \`\`\`  
   适用于需要修改元素或根据索引操作的情况 [^DOC_1] [^DOC_8]。

3. **同时获取索引和值（\`enumerate\`）**  
   \`\`\`python
   for index, value in enumerate(arr):
       print(f"索引 {index} 的值是 {value}")
   \`\`\`  
   适合需要索引和元素的场景 [^DOC_5] [^DOC_8]。

---

### 二、其他遍历方式
4. **使用 \`while\` 循环**  
   通过计数器手动控制遍历：
   \`\`\`python
   i = 0
   while i < len(arr):
       print(arr[i])
       i += 1  # 必须手动递增
   \`\`\`  
   灵活性高但需注意避免无限循环 [^DOC_1] [^DOC_9] [^DOC_10]。

5. **列表推导式**  
   快速生成新列表的同时遍历：
   \`\`\`python
   squared = [x**2 for x in arr]  # 遍历并计算平方
   \`\`\`  
   适用于需要转换元素的场景 [^DOC_4] [^DOC_7] [^DOC_9]。

---

### 三、特殊场景方法
6. **递归遍历**（不常用）  
\`\`\`python
   def traverse(arr, i=0):
       if i < len(arr):
           print(arr[i])
 \`\`\`

## 引用

上上任的武汉大学校长是李晓红。[^DOC_1][^DOC_2]

| 业务          | 2021Q1  | 2021Q2  | 2021Q3  | 2021Q4  | 2022Q1  | 
| ------------- | ------- | ------- | ------- | ------- | ------- |
| 收入          | 135,303 [^DOC_1] | 138,259 | 142,368 | 144,188 | 135,471 |
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


## 思维图

\`\`\`mermaid
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
\`\`\`

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
export default () => {
  const editorRef = React.useRef<MarkdownEditorInstance>();
  const [list, setList] = useState([
    {
      selection: {
        anchor: { path: [2, 0], offset: 283 },
        focus: { path: [2, 0], offset: 292 },
      },
      path: [2, 0],
      time: 1735924079099,
      id: 1735924079099,
      content: '你好',
      anchorOffset: 283,
      focusOffset: 292,
      refContent: '日带领Umi 在香港联',
      commentType: 'comment',
    },
    {
      id: 1,
      selection: {
        anchor: { path: [2, 0], offset: 283 },
        focus: { path: [2, 0], offset: 292 },
      },
      path: [2, 0],
      anchorOffset: 283,
      focusOffset: 292,
      user: {
        name: '张志东',
      },
      time: 1629340800000,
      content: '深圳大学是中国最好的大学之一,拥有很多优秀的学生。',
      refContent:
        '张志东在Umi 担任 CTO，并在 2014 年 9 月离职，转任Umi 公司终身荣誉顾问及Umi 学院荣誉院长等职位 。',
      commentType: 'comment',
    },
    {
      id: 2,
      selection: {
        anchor: { path: [2, 0], offset: 283 },
        focus: { path: [2, 0], offset: 292 },
      },
      path: [2, 0],
      anchorOffset: 283,
      focusOffset: 292,
      user: {
        name: '张志东',
      },
      time: 1629340800000,
      content:
        '张志东, 马化腾的同学，被称为 QQ 之父。他的计算机技术非常出色，曾是深圳大学最拔尖的学生之一。',
      refContent:
        '张志东在Umi 担任 CTO，并在 2014 年 9 月离职，转任Umi 公司终身荣誉顾问及Umi 学院荣誉院长等职位 。',
      commentType: 'comment',
    },
  ]);
  useEffect(() => {
    // @ts-ignore
    window.editorRef = editorRef;
    editorRef.current?.markdownContainerRef?.current?.addEventListener(
      MARKDOWN_EDITOR_EVENTS.SELECTIONCHANGE,
      (e) => {
        console.log('selectionchange', e);
      },
    );
  }, []);
  return (
    <MarkdownEditor
      editorRef={editorRef}
      width={'100vw'}
      height={'100vh'}
      reportMode
      readonly
      plugins={[
        {
          elements: {
            code: CodeElement,
            chart: ChartElement,
            mermaid: MermaidElement,
          },
        },
      ]}
      fncProps={{
        render: (props, _) => {
          return <Tooltip title={props.children}>{_}</Tooltip>;
        },
      }}
      onChange={(e, value) => {
        console.log(value);
      }}
      comment={{
        enable: true,
        commentList: list,
        loadMentions: async () => {
          return [
            {
              name: '张志东',
              id: '1',
              avatar:
                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            },
            {
              name: '马化腾',
              id: '2',
              avatar:
                'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            },
          ];
        },
        onDelete: async (id) => {
          setList(list.filter((i) => i.id !== id));
        },
        onSubmit: async (id, data) => {
          console.log(id, data);
          setList([
            ...list,
            {
              ...data,
              user: {
                name: '张志东',
                avatar:
                  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              },
              id: list.length + 1,
              time: new Date().getTime(),
            } as any,
          ]);
        },
      }}
      image={{
        upload: async (fileList) => {
          return new Promise((resolve) => {
            const file = fileList[0];
            if (typeof file === 'string') {
              fetch(file)
                .then((res) => res.blob())
                .then((blob) => {
                  console.log(blob);
                  const url = URL.createObjectURL(blob);
                  resolve(url);
                });
            } else {
              const url = URL.createObjectURL(file);
              resolve(url);
            }
          });
        },
      }}
      toolBar={{
        hideTools: ['H1'],
        min: true,
      }}
      insertAutocompleteProps={{
        optionsRender: (options) => {
          return options.filter((item) => {
            return item.key !== 'head1';
          });
        },
      }}
      initValue={
        process.env.NODE_ENV === 'test'
          ? defaultValue
          : defaultValue +
            `## 公式

Lift($$L$$) can be determined by Lift Coefficient ($$C_L$$) like the following
equation.

$$
L = \frac{1}{2} \rho v^2 S C_L
$$

$x^3+x^9+x^y$
`
      }
    />
  );
};
