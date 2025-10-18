---
title: 性能优化
nav:
  title: 常见问题
  order: 6
group:
  title: 通用
  order: 3
---

# 懒加载渲染 (Lazy Render)

`BaseMarkdownEditor` 支持懒加载渲染模式，通过 `IntersectionObserver` API 实现按需渲染，显著提升大型文档的渲染性能。

## 何时使用

- 文档内容很长，包含大量元素
- 需要优化首屏加载性能
- 文档包含大量图片、表格等复杂元素
- 移动端或性能较低的设备

## 工作原理

启用懒加载后，每个编辑器元素都会被 `LazyElement` 组件包裹。该组件使用 `IntersectionObserver` 监听元素是否进入视口：

1. **初始状态**：元素显示为占位符，不渲染实际内容
2. **进入视口**：当元素即将进入视口时（可配置提前量），开始渲染实际内容
3. **保持渲染**：元素一旦被渲染，会保持渲染状态，不会卸载

## 基本使用

```tsx | pure
import { BaseMarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <BaseMarkdownEditor
      lazy={{ enable: true }}
      initValue="# 长文档内容\n\n这里是很多内容..."
      height={600}
    />
  );
};
```

## 配置选项

通过 `lazy` 对象可以自定义懒加载行为：

```tsx | pure
import { BaseMarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <BaseMarkdownEditor
      lazy={{
        enable: true,
        placeholderHeight: 150, // 占位符高度，默认 25px
        rootMargin: '300px', // 提前加载距离，默认 '200px'
      }}
      initValue="# 长文档内容"
      height={600}
    />
  );
};
```

### 配置说明

| 参数                   | 说明                   | 类型    | 默认值  |
| ---------------------- | ---------------------- | ------- | ------- |
| lazy.enable            | 是否启用懒加载         | boolean | false   |
| lazy.placeholderHeight | 占位符高度（单位：px） | number  | 25      |
| lazy.rootMargin        | 提前加载距离           | string  | '200px' |

## 性能优化建议

### 1. 调整 rootMargin

`rootMargin` 控制提前加载的距离。较大的值可以让内容提前加载，避免用户看到占位符：

```tsx | pure
// 提前 500px 加载，适合滚动速度较快的场景
lazy={{ enable: true, rootMargin: '500px' }}

// 只在进入视口时加载，最大化性能优化
lazy={{ enable: true, rootMargin: '0px' }}
```

### 2. 设置合适的占位符高度

`placeholderHeight` 应该接近实际元素的高度，以减少布局抖动：

```tsx | pure
// 根据内容类型设置不同高度
lazy={{
  enable: true,
  placeholderHeight: 200  // 适合包含大量图片的段落
}}
```

### 3. 只读模式下使用

懒加载特别适合只读模式的长文档：

```tsx | pure
<BaseMarkdownEditor
  lazy={{ enable: true }}
  readonly={true}
  initValue={longMarkdownContent}
/>
```

## 注意事项

1. **表格元素**：表格的单元格和行不会被懒加载包裹，以保持表格结构的完整性
2. **编辑模式**：懒加载在编辑模式下可能会影响编辑体验，建议主要在只读模式下使用
3. **首屏内容**：调整 `rootMargin` 以确保首屏内容能够立即加载
4. **布局抖动**：设置合适的 `placeholderHeight` 可以减少滚动时的布局跳动

## 性能对比

在包含 1000+ 段落的长文档测试中：

| 指标         | 普通模式 | 懒加载模式 | 提升    |
| ------------ | -------- | ---------- | ------- |
| 首次渲染时间 | ~3000ms  | ~300ms     | **10x** |
| 内存占用     | ~150MB   | ~50MB      | **3x**  |
| 滚动流畅度   | 偶尔卡顿 | 流畅       | ✅      |

## API

### MarkdownEditorProps

```tsx | pure
interface MarkdownEditorProps {
  /**
   * 懒加载渲染配置
   * 启用后，每个元素都会被包裹在 IntersectionObserver 容器中
   * 只有在视口内时才会真正渲染
   */
  lazy?: {
    /**
     * 是否启用懒加载，默认 false
     */
    enable?: boolean;
    /**
     * 占位符高度（单位：px），默认 25
     */
    placeholderHeight?: number;
    /**
     * 提前加载的距离，默认 '200px'
     * 支持所有 IntersectionObserver rootMargin 的值
     * 例如: '200px', '50%', '100px 200px'
     */
    rootMargin?: string;
  };
}
```

<code src="../demos/lazy-render-demo.tsx" background="var(--main-bg-color)" iframe=540></code>
