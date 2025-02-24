import {
  MARKDOWN_EDITOR_EVENTS,
  MarkdownEditor,
  MarkdownEditorInstance,
} from '@ant-design/md-editor';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
const defaultValue = `<!-- {"MarkdownType": "report", "id": "8", "section_ids": " [15, 16, 17] "} -->

# 腾讯研究报告

<!-- {"MarkdownType": "section", "id": "15" } -->

## html

<font color="red">腾讯科技（深圳）有限公司</font>
<sup>腾讯科技（深圳）有限公司</sup>
<sub>腾讯科技（深圳）有限公司</sub>

<html><table><tbody><tr><td>序号</td><td>问题</td><td>答案</td></tr><tr><td>0.0</td><td>世界上最小的鸟是什么?</td><td>蜂鸟（Hummingbird）。蜂鸟是世界上最小的鸟类，其中最小的种类是蜂鸟科中的蜂鸟属（Melli</td></tr><tr><td>1.0</td><td>地球上最高的山峰是哪座?</td><td>珠穆朗玛峰（Mount Everest）。珠穆朗玛峰位于喜马拉雅山脉，海拔8848.86米，是地球上最</td></tr><tr><td>2.0</td><td>哪种动物的睡眠时间最长?</td><td>考拉（Koala）。考拉每天大约睡18-22小时，是已知睡眠时间最长的动物之一。</td></tr></tbody></table></html>


## 创始人

腾讯，全称深圳市腾讯计算机系统有限公司，是由五位创始人共同创立的，他们是马化腾、张志东、许晨晔、陈一丹和曾李青。 以下是关于这些创始人的详细信息： 马化腾 马化腾，1971 年 10 月 29 日出生于广东省东方县（现海南省东方市）八所港，广东汕头人，汉族，无党派人士。他毕业于深圳大学电子工程系计算机专业。马化腾是腾讯科技（深圳）有限公司的创始人、董事会主席、首席执行官，并曾是中华人民共和国第十二、十三届全国人民代表大会代表 。马化腾在 1998 年 11 月 11 日与合伙人共同注册成立了腾讯，并在 2004 年 6 月 16 日带领腾讯在香港联合交易所有限公司主板上市。 张志东 张志东，马化腾的同学，被称为 QQ 之父。他的计算机技术非常出色，曾是深圳大学最拔尖的学生之一。张志东在腾讯担任 CTO，并在 2014 年 9 月离职，转任腾讯公司终身荣誉顾问及腾讯学院荣誉院长等职位 。


## 部门

- 腾讯科技（深圳）有限公司
  - 腾讯学院 
  - 腾讯云
- 腾讯金融
- 腾讯游戏
- 腾讯广告
- 腾讯社交网络
  - 微信
  - QQ
    - QQ 音乐
    - QQ 空间
- 腾讯其他业务

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
[腾讯官网](https://www.zhihu.com/question/665438199/answer/3625311124 "腾讯官网")


[腾讯官网](https://www.zhihu.com/question/665438199/answer/3625311124 "腾讯官网")


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
~~腾讯六大事业群腾讯六大事业群腾讯六大事业群~~

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
      refContent: '日带领腾讯在香港联',
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
        '张志东在腾讯担任 CTO，并在 2014 年 9 月离职，转任腾讯公司终身荣誉顾问及腾讯学院荣誉院长等职位 。',
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
        '张志东在腾讯担任 CTO，并在 2014 年 9 月离职，转任腾讯公司终身荣誉顾问及腾讯学院荣誉院长等职位 。',
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
`
      }
    />
  );
};
