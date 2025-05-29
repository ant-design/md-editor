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
import { defaultValue } from './shared/defaultValue';

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
