import { MarkdownEditor } from '@ant-design/md-editor';

const defaultValue = `
<!--{"MarkdownType":"section","id":"544","order":"3","report_id":"126","section_id":"544"}-->
## 紧急功能

- [x] [Chen Shuai](?id=10)修复图片框多次点击的问题
- [ ] [Rui Ma](?id=8)支持图片url上传
- [x] [Rui Ma](?id=11) 新建任务解绑报告 id
- [x] [Neo Wu](?id=21)shadcn 换成蓝色theme
- [x] [Neo Wu](?id=21)加watch 接口和 对外网开放、对全站登录用户开放开关
- [x] [Neo Wu](?id=21)share 加接口。
- [x] [Chen Shuai](?id=10)Ai向编辑框copy
- [x] [Chen Shuai](?id=10)阅读态留言，留言底部展示。
- [x] [Chen Shuai](?id=10)静态页面上 提示可登录按钮
- [ ] [Chen Shuai](?id=10)[https://know2.co/manage/flow/137 没有登录时 404. 不要去读 /content](https://know2.co/report/137)
- [x] [Chen Shuai](?id=10)留言修改有问题。
- [x] [Chen Shuai](?id=10)左边栏点logo, 点flow 不刷新，不跳转。
- [x] [Chen Shuai](?id=10)Insert My File 不行
- [x] [Chen Shuai](?id=10)工具条上插图不行



![](x)
`;
export default () => {
  return defaultValue.split('##').map((item, index) => {
    return (
      <div
        key={index}
        style={{
          padding: 24,
          border: '1px solid #f0f0f0',
          margin: '20px auto',
          width: '100%',
        }}
      >
        <MarkdownEditor
          key={index}
          comment={{
            enable: true,
            commentList: [
              {
                anchorOffset: 7,
                commentType: 'comment',
                content: '你好？',
                focusOffset: 16,
                id: 51,
                path: [1, 3],
                refContent: '换成蓝色theme',
                selection: {
                  anchor: { offset: 7, path: [1, 3] },
                  focus: { offset: 16, path: [1, 3] },
                },
                user: {
                  name: 'Chen Shuai',
                },
                time: 1731857387451,
              },
              {
                anchorOffset: 2,
                commentType: 'comment',
                content: '你好，测试页面',
                focusOffset: 12,
                id: 36,
                path: [1, 0],
                refContent: '图片框多次点击的问题',
                selection: {
                  anchor: { offset: 2, path: [1, 0] },
                  focus: { offset: 12, path: [1, 0] },
                },
                user: {
                  name: 'Chen Shuai',
                },
                time: 1731857387451,
              },
            ],
          }}
          width={'100%'}
          height={'auto'}
          readonly
          initValue={'## ' + item}
          onChange={(e, s) => {
            console.log('onChange', s);
          }}
        />
      </div>
    );
  });
};
