import { MarkdownInputField } from '@ant-design/md-editor';
import React from 'react';

export default () => {
  const [list, setList] = React.useState<Set<string>>(() => new Set());
  const send = async (value: string) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 10000);
    });
    setList((prev) => {
      const next = new Set(prev);
      console.log(value);
      next.add(value);
      return next;
    });
  };
  return (
    <div
      style={{
        padding: '20px',
        margin: 'auto',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <ul>
        {[...list].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <MarkdownInputField
        tagInputProps={{
          enable: true,
          items: ['tag1', 'tag2', 'tag3'].map((item) => ({
            key: item,
            label: item,
          })),
        }}
        onSend={send}
        onStop={() => console.log('stop...')}
        placeholder="请输入内容"
      />
      <MarkdownInputField
        tagInputProps={{
          enable: true,
          items: ['tag1', 'tag2', 'tag3'].map((item) => ({
            key: item,
            label: item,
          })),
        }}
        onSend={send}
        value="《原神》克洛琳德将于6月正式上线，官方也放出了克洛琳德的突破材料，那么克洛琳德的突破材料都是什么，又要在哪里采集呢？下面请看由“关蝎”为大家分享的《原神》克洛琳德突破材料一览，希望可以帮助到大家。《原神》克洛琳德将于6月正式上线，官方也放出了克洛琳德的突破材料，那么克洛琳德的突破材料都是什么，又要在哪里采集呢？下面请看由“关蝎”为大家分享的《原神》克洛琳德突破材料一览，希望可以帮助到大家。《原神》克洛琳德将于6月正式上线，官方也放出了克洛琳德的突破材料，那么克洛琳德的突破材料都是什么，又要在哪里采集呢？下面请看由“关蝎”为大家分享的《原神》克洛琳德突破材料一览，希望可以帮助到大家。《原神》克洛琳德将于6月正式上线，官方也放出了克洛琳德的突破材料，那么克洛琳德的突破材料都是什么，又要在哪里采集呢？下面请看由“关蝎”为大家分享的《原神》克洛琳德突破材料一览，希望可以帮助到大家。"
        onStop={() => console.log('stop...')}
        placeholder="请输入内容"
      />
      <MarkdownInputField onSend={send} disabled placeholder="请输入内容" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        fill="none"
        version="1.1"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient
            x1="2.463307335887066e-16"
            y1="0.5"
            x2="0.9838055372238159"
            y2="0.5"
            id="master_svg1_55_47405"
          >
            <stop
              offset="0%"
              stopColor="#CD36FF"
              stopOpacity="0.22383680939674377"
            >
              <animate
                attributeName="stop-color"
                values="#CD36FF; #FFD972; #5EBFFF; #6FFFA7;#CD36FF"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="33.917319774627686%"
              stopColor="#AEB6FF"
              stopOpacity="0.699999988079071"
            >
              <animate
                attributeName="stop-color"
                values="#AEB6FF; #CD36FF; #FFD972; #5EBFFF; #6FFFA7;#AEB6FF"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="51.650047302246094%"
              stopColor="#FFD972"
              stopOpacity="0.4300000071525574"
            >
              <animate
                attributeName="stop-color"
                values="#FFD972; #5EBFFF; #6FFFA7; #CD36FF; #FFD972"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="81.37043118476868%"
              stopColor="#5EBFFF"
              stopOpacity="0.6200000047683716"
            >
              <animate
                attributeName="stop-color"
                values="#5EBFFF; #6FFFA7; #CD36FF; #FFD972; #5EBFFF"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="100%"
              stopColor="#6FFFA7"
              stopOpacity="0.5468477010726929"
            >
              <animate
                attributeName="stop-color"
                values="#6FFFA7; #CD36FF; #FFD972; #5EBFFF; #6FFFA7"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <g>
          <rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            fill="url(#master_svg1_55_47405)"
          />
        </g>
      </svg>
    </div>
  );
};
