import {
  MARKDOWN_EDITOR_EVENTS,
  MarkdownEditor,
  MarkdownEditorInstance,
} from '@ant-design/md-editor';
import { ChartElement } from '@ant-design/md-editor/plugins/chart';
import { CodeElement } from '@ant-design/md-editor/plugins/code';
import { MermaidElement } from '@ant-design/md-editor/plugins/mermaid';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

const defaultValue = `<!-- {"MarkdownType": "report", "id": "8", "section_ids": " [15, 16, 17] "} -->

# Umi 研究报告

<!-- {"MarkdownType": "section", "id": "15" } -->

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



## 创始人

Umi 是一个可扩展的企业级前端应用框架，中文发音为「乌米」，由蚂蚁金服开发并广泛应用于复杂前端项目


## 部门

- Umi 科技（深圳）有限公司
  - Umi 学院 
  - Umi 云
- Umi 金融
- Umi 游戏
- Umi 广告
- Umi 社交网络
  - antd
  - QQ
    - QQ 音乐
    - QQ 空间
- Umi 其他业务

## 战略

- [x] [张志东](https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png?param=3&id=2) Write the press release
- [ ] Update the website 
- [ ] Contact the media

<!-- {"MarkdownType": "section", "id": "16" } -->

## 表格


| 业务          | 2021Q1  | 2021Q2  | 2021Q3  | 2021Q4  | 2022Q1  | 2022Q2  | 2022Q3  | 2022Q4  | 2023Q1  | 2023Q2  | 2023Q3  | 2023Q4  |
| ------------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| 收入          | 135,303 | 138,259 | 142,368 | 144,188 | 135,471 | 134,034 | 140,093 | 144,954 | 149,986 | 149,208 | 154,625 | 155,200 |
| 社交网络收入增值服务     | 72,443  | 72,013  | 75,203  | 71,913  | 72,738  | 71,683  | 72,727  | 70,417  | 79,337  | 74,211  | 75,748  | 69,100  |
| 网络游戏     | 43,600  | 43,000  | 44,900  | 42,800  | 43,600  | 42,500  | na      | na      | na      | 44,500  | 46,000  | 40,900  |
| 社交网络收入 | 28,800  | 29,000  | 30,300  | 29,100  | 29,100  | 29,200  | na      | na      | na      | 29,700  | 29,700  | 28,200  |
| 网络广告      | 21,820  | 22,833  | 22,495  | 21,518  | 17,988  | 18,638  | 21,443  | 24,660  | 20,964  | 25,003  | 25,721  | 29,794  |
| 其他          | 41,040  | 43,413  | 44,670  | 50,757  | 44,745  | 43,713  | 45,923  | 49,877  | 49,685  | 49,994  | 53,156  | 54,379  |
| 金融科技     | 39,028  | 41,892  | 43,317  | 47,958  | 42,768  | 42,208  | 44,844  | 47,244  | 48,701  | 48,635  | 52,048  | 52,435  |
| 云           | 62,012   | 1,521   | 1,353   | 2,799   | 1,977   | 1,505   | 1,079   | 2,633   | 984     | 1,359   | 1,108   | 1,944   |


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
~~Umi 六大事业群Umi 六大事业群Umi 六大事业群~~

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
