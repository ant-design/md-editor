import { MarkdownEditor } from '@ant-design/md-editor';
import { Tooltip } from 'antd';
import { useState } from 'react';

const defaultValue = `<!-- {"MarkdownType": "report", "id": "8", "section_ids": " [15, 16, 17] "} -->
`;
export default () => {
  const [list, setList] = useState([
    {
      id: 1,
      selection: {
        anchor: { path: [2, 0], offset: 343 },
        focus: { path: [2, 0], offset: 398 },
      },
      path: [2, 0],
      anchorOffset: 343,
      focusOffset: 398,
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
        anchor: { path: [2, 0], offset: 343 },
        focus: { path: [2, 0], offset: 398 },
      },
      path: [2, 0],
      anchorOffset: 343,
      focusOffset: 398,
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
  return (
    <MarkdownEditor
      width={'100vw'}
      height={'100vh'}
      reportMode
      fncProps={{
        render: (props, _) => {
          return <Tooltip title={props.children}>{_}</Tooltip>;
        },
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
      initValue={defaultValue}
    />
  );
};
