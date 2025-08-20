---
nav:
  title: 项目研发
  order: 1
---

# 组件开发规范

> 基于 `md-editor` 项目的实际开发经验，定义完整的组件开发规范。

## 目录

- [命名规范](#命名规范)
- [文件组织](#文件组织)
- [样式开发](#样式开发)
- [API设计](#api设计)
- [功能开发](#功能开发)
- [测试规范](#测试规范)
- [代码质量](#代码质量)
- [开发检查列表](#开发检查列表)

## 命名规范

### 组件命名

- 使用 PascalCase
- 语义化命名，避免通用名称
- 相关组件使用统一前缀

```tsx
// ✅ 正确
export const HistoryItem = () => {};
export const HistoryActionsBox = () => {};

// ❌ 错误
export const Item = () => {}; // 过于通用
export const ActionsBox = () => {}; // 可能重名
```

### 文件夹命名

- 使用 kebab-case
- 模块根目录使用 PascalCase
- 功能目录使用小写复数

```
src/
├── History/                    # 模块根目录
│   ├── components/             # 组件目录
│   ├── hooks/                  # Hook目录
│   ├── types/                  # 类型定义
│   ├── utils/                  # 工具函数
│   ├── __tests__/              # 测试目录
│   └── index.tsx               # 主入口
```

### className 命名

- 遵循 BEM 方法论
- Block: `.history-item`
- Element: `.history-item__title`
- Modifier: `.history-item--selected`

## 文件组织

### 标准结构

```
ComponentName/
├── components/          # 子组件
├── hooks/              # 自定义Hook
├── types/              # 类型定义
├── utils/              # 工具函数
├── __tests__/          # 测试文件
├── index.tsx           # 主组件
├── style.ts            # 样式文件
└── README.md           # 组件文档
```

### 文件命名

- 组件文件：`ComponentName.tsx`
- 样式文件：`style.ts`
- 测试文件：`ComponentName.test.tsx`
- 类型文件：`types.ts`

## 样式开发

### 使用 @ant-design/theme-token

```tsx
import { createStyles } from '@ant-design/theme-token';

export const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    gap: token.paddingSM,
  },
  item: {
    padding: token.paddingSM,
    borderRadius: token.borderRadius,
    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
}));
```

### 使用项目自定义样式

```tsx
import { useEditorStyleRegister, ChatTokenType } from '../hooks/useStyle';

const genStyle: GenerateStyle<ChatTokenType> = (token) => ({
  [token.componentCls]: {
    width: '100%',
    '&-item': {
      display: 'flex',
      padding: token.paddingSM,
    },
  },
});

export function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('ComponentName', (token: ChatTokenType) => {
    const componentToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [genStyle(componentToken)];
  });
}
```

## API设计

### Props 命名规范

```tsx
interface ComponentProps {
  // 数据属性
  data: DataType;
  selectedIds: string[];

  // 事件回调 - 使用on前缀
  onSelect: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;

  // 配置属性 - 使用Config后缀
  config?: ComponentConfig;

  // 样式属性
  className?: string;
  style?: React.CSSProperties;
}
```

### 事件回调命名

```tsx
// 标准事件
onClick: (event: React.MouseEvent) => void;
onChange: (value: string) => void;

// 自定义事件
onSelectionChange: (selectedIds: string[]) => void;
onLoadMore: () => Promise<void>;
```

## 功能开发

### 组件开发流程

```tsx
// 1. 定义类型
interface ComponentProps {
  // 类型定义
}

// 2. 编写JSDoc
/**
 * ComponentName 组件
 * @param {ComponentProps} props - 组件属性
 * @returns {React.ReactElement} 组件
 */

// 3. 实现组件
export const ComponentName: React.FC<ComponentProps> = (props) => {
  const [state, setState] = useState(initialState);

  const handleEvent = useCallback(() => {
    // 事件处理
  }, [dependencies]);

  return <div>{/* 组件内容 */}</div>;
};
```

### Hook 开发规范

```tsx
export const useComponent = (props: ComponentProps) => {
  // 状态定义
  const [state, setState] = useState(initialState);

  // 数据获取
  const { data, loading } = useQuery({
    queryKey: ['key'],
    queryFn: () => props.request(),
  });

  // 事件处理
  const handleEvent = useCallback(() => {
    // 处理逻辑
  }, [dependencies]);

  // 返回值
  return {
    state,
    data,
    loading,
    handleEvent,
  };
};
```

## 测试规范

### 测试文件结构

```tsx
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '../index';

describe('ComponentName', () => {
  const mockProps = {
    // 测试数据
  };

  describe('渲染测试', () => {
    it('应该正确渲染', () => {
      render(<ComponentName {...mockProps} />);
      expect(screen.getByTestId('component')).toBeInTheDocument();
    });
  });

  describe('交互测试', () => {
    it('应该处理点击事件', () => {
      const onSelect = jest.fn();
      render(<ComponentName {...mockProps} onSelect={onSelect} />);

      fireEvent.click(screen.getByTestId('button'));
      expect(onSelect).toHaveBeenCalled();
    });
  });
});
```

### 测试覆盖率要求

- 分支覆盖率：≥ 80%
- 函数覆盖率：≥ 80%
- 行覆盖率：≥ 80%

## 代码质量

### TypeScript 规范

- 提供完整的类型定义
- 避免使用 `any` 类型
- 使用接口定义数据结构
- 提供泛型支持

### 性能优化

```tsx
// 使用 React.memo
export const Component = React.memo<ComponentProps>((props) => {
  // 组件实现
});

// 使用 useCallback
const handleEvent = useCallback(() => {
  // 事件处理
}, [dependencies]);

// 使用 useMemo
const expensiveValue = useMemo(() => {
  return computeValue(data);
}, [data]);
```

### 错误处理

```tsx
// 异步操作错误处理
const handleAsync = async () => {
  try {
    setLoading(true);
    await asyncOperation();
  } catch (error) {
    console.error('操作失败:', error);
    message.error('操作失败');
  } finally {
    setLoading(false);
  }
};
```

## Demo 开发规范

### Demo 文件组织

```
docs/demos/
├── component-name/
│   ├── basic.tsx              # 基础用法
│   ├── advanced.tsx           # 高级用法
│   └── custom.tsx             # 自定义用法
```

### Demo 内容要求

- 完整的组件代码
- 清晰的交互示例
- 详细的API说明
- 使用 `@ant-design/md-editor` 组件

## 开发检查列表

### ✅ 命名规范检查

- [ ] 组件使用 PascalCase 命名
- [ ] 组件名称语义化，避免通用名称
- [ ] 相关组件使用统一前缀
- [ ] 文件夹使用 kebab-case 命名
- [ ] className 遵循 BEM 规范

### ✅ 文件组织检查

- [ ] 创建标准的文件夹结构
- [ ] 组件文件命名为 `ComponentName.tsx`
- [ ] 样式文件命名为 `style.ts`
- [ ] 测试文件命名为 `ComponentName.test.tsx`
- [ ] 类型文件命名为 `types.ts`

### ✅ 样式开发检查

- [ ] 使用 `@ant-design/theme-token` 或项目自定义样式
- [ ] 样式函数使用 `GenerateStyle` 类型
- [ ] 使用 `useEditorStyleRegister` 注册样式
- [ ] 样式变量使用 token 系统
- [ ] 支持主题切换和响应式设计

### ✅ API设计检查

- [ ] Props 接口定义完整
- [ ] 事件回调使用 `on` 前缀
- [ ] 配置对象使用 `Config` 后缀
- [ ] 所有属性都有类型定义
- [ ] 可选属性使用 `?` 标记

### ✅ 功能开发检查

- [ ] 组件有完整的 JSDoc 注释
- [ ] 使用 `React.FC` 定义组件类型
- [ ] 状态管理使用 `useState`
- [ ] 事件处理使用 `useCallback`
- [ ] 数据获取使用 `useQuery` 或类似方案

### ✅ Hook开发检查

- [ ] Hook 使用 `use` 前缀命名
- [ ] 返回组件需要的所有状态和方法
- [ ] 使用 `useCallback` 优化事件处理
- [ ] 使用 `useMemo` 优化计算
- [ ] 提供完整的类型定义

### ✅ 测试规范检查

- [ ] 创建测试文件 `ComponentName.test.tsx`
- [ ] 测试文件放在 `__tests__` 目录
- [ ] 包含渲染测试和交互测试
- [ ] 使用 `@testing-library/react` 进行测试
- [ ] 测试覆盖率达到 80% 以上

### ✅ 代码质量检查

- [ ] 所有代码都有 TypeScript 类型
- [ ] 避免使用 `any` 类型
- [ ] 使用 `React.memo` 优化渲染
- [ ] 实现错误边界和异常处理
- [ ] 代码通过 ESLint 检查

### ✅ Demo开发检查

- [ ] Demo 文件放在 `docs/demos` 目录
- [ ] Demo 文件名以 `demo-` 开头
- [ ] 包含完整的组件使用示例
- [ ] 使用 `@ant-design/md-editor` 组件
- [ ] 提供详细的 API 说明

### ✅ 文档检查

- [ ] 组件有 README.md 文档
- [ ] API 文档完整且准确
- [ ] 提供使用示例
- [ ] 说明组件的功能和限制
- [ ] 文档通过拼写检查

### ✅ 最终检查

- [ ] 所有检查项都已完成
- [ ] 代码可以正常运行
- [ ] 测试全部通过
- [ ] 文档完整准确
- [ ] 提交代码前进行最终审查

---

**注意**：完成所有检查项后，组件开发才算完成。如有特殊情况，请在团队中讨论后决定。
