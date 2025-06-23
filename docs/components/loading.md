---
title: Loading 加载
group:
  title: 基础组件
  order: 1
---

# Loading 加载

一个简单的加载动画组件，显示三个点的动态效果。

## 代码演示

<code src="../demos/loading.tsx">基础用法</code>

## API

### Loading

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| -    | -    | -    | -      |

### 样式定制

组件使用了以下的样式变量，可以通过 CSS-in-JS 进行样式定制：

```ts
{
  width: 20,
  height: 4,
  gap: 2,
  dotSize: 4,
  dotColor: 'rgba(0, 114, 255, 21%)',
  dotActiveColor: '#74a9fc',
  animationDuration: '1.5s'
}
```
