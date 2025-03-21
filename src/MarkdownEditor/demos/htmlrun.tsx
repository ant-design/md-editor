import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';
import { Tooltip } from 'antd';
import React from 'react';
const defaultValue = `以下是使用HTML、CSS和JavaScript实现的七色旋转背景，并带有速度控制滑块的代码：

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            overflow: hidden;
        }

        #color-wheel {
            width: 150vmax;
            height: 150vmax;
            background: conic-gradient(
                #ff0000 0deg 51.4deg,
                #ff7f00 51.4deg 102.8deg,
                #ffff00 102.8deg 154.2deg,
                #00ff00 154.2deg 205.6deg,
                #0000ff 205.6deg 257deg,
                #4b0082 257deg 308.4deg,
                #8f00ff 308.4deg 360deg
            );
            animation: rotate 10s linear infinite;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        #speed-control {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 100;
            width: 200px;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px;
            border-radius: 20px;
        }

        #speed-control input {
            width: 100%;
        }

        #speed-label {
            color: white;
            font-family: Arial;
            font-size: 14px;
            text-align: center;
            display: block;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div id="color-wheel"></div>
    
    <div id="speed-control">
        <input type="range" id="speed" min="0.1" max="2" value="1" step="0.1">
        <span id="speed-label">速度: 1x</span>
    </div>

    <script>
        const wheel = document.getElementById('color-wheel');
        const speedControl = document.getElementById('speed');
        const speedLabel = document.getElementById('speed-label');

        function updateSpeed() {
            const speed = speedControl.value;
            wheel.style.animationDuration = \`\${2 / speed}s\`;
            speedLabel.textContent = \`速度: \${speed}x\`;
        }

        speedControl.addEventListener('input', updateSpeed);
        updateSpeed(); // 初始化速度
    </script>
</body>
</html>
\`\`\`

主要特点：

1. 使用圆锥渐变(conic-gradient)创建七色环形背景
2. 通过CSS动画实现旋转效果
3. 速度控制滑块范围从0.1x到2x
4. 动态更新动画速度（数值越小越慢，越大越快）
5. 自动适应屏幕尺寸
6. 包含速度显示标签
7. 半透明控制面板设计

使用方法：
- 拖动滑块即可实时调整旋转速度
- 滑块值范围：0.1（最慢）到 2（最快）
- 背景会自动填满整个视口并保持居中

颜色排列顺序为标准的彩虹七色：
红色 → 橙色 → 黄色 → 绿色 → 蓝色 → 靛色 → 紫色

可以通过修改以下CSS代码中的颜色值来改变颜色组合：
\`\`\`css
background: conic-gradient(
    #ff0000 0deg 51.4deg,        /* 红色 */
    #ff7f00 51.4deg 102.8deg,    /* 橙色 */
    #ffff00 102.8deg 154.2deg,   /* 黄色 */
    #00ff00 154.2deg 205.6deg,   /* 绿色 */
    #0000ff 205.6deg 257deg,     /* 蓝色 */
    #4b0082 257deg 308.4deg,     /* 靛色 */
    #8f00ff 308.4deg 360deg      /* 紫色 */
);
\`\`\``;
export default () => {
  const editorRef = React.useRef<MarkdownEditorInstance>();

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
      initValue={defaultValue}
    />
  );
};
