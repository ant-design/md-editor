import { MarkdownEditor } from '@ant-design/md-editor';
import { useState } from 'react';

const defaultValue = `## 附件
<!-- {"updateTime":"2014-07-29","collaborators":[{"Chen Shuai":33},{"Chen Shuai":33},{"Chen Shuai":33},{"Rui Ma":39},{"Rui Ma":39},{"Rui Ma":39},{"Chen Shuai":33},{"Rui Ma":39},{"ivan.cseeing":32},{"InvRet Sales Team":34},{"Chen Shuai":33},{"Rui Ma":39},{"Rui Ma":39},{"Chen Shuai":33},{"Rui Ma":39},{"Rui Ma":39},{"Chen Shuai":33}]} -->
![attachment:测试附件.pdf](https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/A*NudQQry0ERwAAAAAAAAAAAAADtN3AQ)
`;
export default () => {
  const [typewriter, setTypewriter] = useState(true);
  return (
    <div
      style={{
        padding: 64,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 600,
        margin: '0 auto',
        backgroundColor: '#f0f0f0',
      }}
      onClick={() => setTypewriter(!typewriter)}
    >
      {defaultValue
        .split('##')
        .filter((item) => item)
        .map((item, index) => {
          return (
            <div
              key={index}
              style={{
                padding: 24,
                borderRadius: 24,
                backgroundColor: '#fff',
                border: '1px solid #f0f0f0',
                margin: '20px auto',
                width: '100%',
              }}
            >
              <MarkdownEditor
                toc={false}
                key={index}
                width={'100%'}
                typewriter={typewriter}
                height={'auto'}
                readonly
                initValue={'## ' + item.trim()}
                onChange={(e, s) => {
                  console.log('onChange', s);
                }}
              />
            </div>
          );
        })}
    </div>
  );
};
