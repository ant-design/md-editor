---
nav:
  title: 项目研发
  order: 1
---

# 组件开发规范文档

> **重要说明**：本文档基于 `md-editor` 项目的 History 模块，定义了完整的组件开发规范，包括命名规则、文件组织、API设计、测试规范等。所有规范都经过实际项目验证，确保可行性和实用性。

<!--
  文档说明：
  - 本文档适用于所有React TypeScript项目
  - 基于History模块的最佳实践
  - 包含完整的开发流程指导
  - 提供大量实际代码示例
-->

## 目录

- [组件命名规则](#组件命名规则)
- [文件夹命名规则](#文件夹命名规则)
- [className 命名规则](#classname-命名规则)
- [style.ts 开发方式](#stylets-开发方式)
- [API 命名规则](#api-命名规则)
- [功能开发规则](#功能开发规则)
- [测试文件规则](#测试文件规则)
- [代码质量规范](#代码质量规范)

<!--
  使用指南：
  1. 新项目开发时，请严格按照本规范执行
  2. 现有项目重构时，可逐步迁移到本规范
  3. 遇到特殊情况时，可适当调整但需团队讨论
  4. 定期回顾和更新规范，保持与时俱进
-->

## 组件命名规则

<!--
  命名规则说明：
  - 组件命名是代码可读性的基础
  - 好的命名可以减少注释的需求
  - 统一的命名规范有助于团队协作
  - 命名应该自解释，避免歧义
-->

### 1. 组件命名原则

<!--
  核心原则：
  - 语义化：名称应清晰表达功能和用途
  - 一致性：相关组件使用统一前缀
  - 唯一性：避免与项目内其他组件重名
  - 规范性：遵循PascalCase命名法
-->

- **语义化命名**：组件名称应清晰表达其功能和用途
- **一致性**：相关组件使用统一的前缀
- **避免重名**：确保组件名称在项目中的唯一性
- **PascalCase**：使用大驼峰命名法

### 2. 命名规范

<!--
  命名示例说明：
  - ✅ 正确示例：清晰、具体、无歧义
  - ❌ 错误示例：过于通用、可能重名、不够描述性
  - 每个示例都有具体的改进建议
-->

```typescript
// ✅ 正确示例 - 语义化、具体、无歧义
export const HistoryItem: React.FC<HistoryItemProps> = () => {};
export const HistoryActionsBox: React.FC<HistoryActionsBoxProps> = () => {};
export const HistorySearch: React.FC<HistorySearchProps> = () => {};
export const HistoryLoadMore: React.FC<HistoryLoadMoreProps> = () => {};

// ❌ 错误示例 - 过于通用、可能重名、不够描述性
export const Item: React.FC<ItemProps> = () => {}; // 过于通用
export const ActionsBox: React.FC<ActionsBoxProps> = () => {}; // 可能重名
export const Search: React.FC<SearchProps> = () => {}; // 过于通用
```

### 3. 组件分类命名

<!--
  组件分类说明：
  - 核心组件：模块的主要功能组件
  - 功能组件：特定功能的辅助组件
  - 工具组件：通用的工具类组件
  - 页面组件：完整的页面级组件
-->

```typescript
// 核心组件 - 使用模块前缀，体现组件的重要性和归属
export const HistoryItem = () => {};
export const HistoryActionsBox = () => {};

// 功能组件 - 使用模块前缀 + 功能描述，明确功能边界
export const HistoryNewChat = () => {};
export const HistorySearch = () => {};
export const HistoryLoadMore = () => {};

// 工具组件 - 使用功能描述，强调通用性
export const ActionIconBox = () => {};
export const BubbleConfigProvider = () => {};

// 页面组件 - 使用页面名称，体现页面级组件的特点
export const MarkdownEditor = () => {};
export const Workspace = () => {};
```

## 文件夹命名规则

<!--
  文件夹组织说明：
  - 文件夹结构反映代码的组织逻辑
  - 良好的文件夹结构有助于代码导航
  - 统一的命名规范便于团队理解
  - 合理的层次结构支持代码的可扩展性
-->

### 1. 文件夹命名原则

<!--
  命名原则说明：
  - kebab-case：符合文件系统的最佳实践
  - 语义化：文件夹名称应反映其内容
  - 层次清晰：通过结构体现组件关系
  - 避免过深：通常不超过4层嵌套
-->

- **kebab-case**：使用短横线分隔的小写字母
- **语义化**：文件夹名称应反映其内容
- **层次清晰**：通过文件夹结构体现组件关系

### 2. 标准文件夹结构

<!--
  标准结构说明：
  - 模块根目录：使用PascalCase，体现模块的重要性
  - 功能目录：使用小写复数，体现内容的集合性
  - 特殊目录：使用约定俗成的命名方式
  - 文件命名：与组件命名保持一致
-->

```
src/
├── History/                    # 模块根目录 - PascalCase
│   ├── components/             # 组件目录 - 小写复数
│   │   ├── HistoryItem.tsx
│   │   ├── HistoryActionsBox.tsx
│   │   └── index.ts
│   ├── hooks/                  # Hook目录 - 小写复数
│   │   └── useHistory.ts
│   ├── types/                  # 类型定义目录 - 小写复数
│   │   └── index.ts
│   ├── utils/                  # 工具函数目录 - 小写复数
│   │   └── index.ts
│   ├── icons/                  # 图标目录 - 小写复数
│   │   └── HistoryIcon.tsx
│   ├── __tests__/              # 测试目录 - 双下划线
│   │   └── History.test.tsx
│   ├── index.tsx               # 主入口文件
│   ├── style.ts                # 样式文件
│   └── menu.tsx                # 子组件文件
├── MarkdownEditor/             # 其他模块
└── components/                 # 全局组件
```

### 3. 特殊文件夹命名

<!--
  特殊文件夹说明：
  - 测试文件夹：使用双下划线前缀，符合测试框架约定
  - 文档文件夹：使用docs前缀，便于识别
  - 工具文件夹：使用功能描述，体现用途
  - 配置文件夹：使用config前缀，便于管理
-->

```typescript
// 测试文件夹 - 使用双下划线前缀，符合测试框架约定
__tests__/           // 组件测试
__snapshots__/       // 快照测试
__mocks__/           // Mock文件

// 文档文件夹 - 使用docs前缀，便于识别和管理
docs/                // 项目文档
docs/components/     // 组件文档
docs/demos/          # 演示文件

// 工具文件夹 - 使用功能描述，体现具体用途
scripts/             // 构建脚本
utils/               // 工具函数
constants/           // 常量定义
```

## className 命名规则

<!--
  className命名说明：
  - className是CSS样式的入口点
  - 良好的命名可以提高样式的可维护性
  - BEM方法论提供了清晰的命名结构
  - 统一的命名规范有助于样式复用
-->

### 1. className 命名原则

<!--
  命名原则说明：
  - BEM方法论：Block-Element-Modifier，提供清晰的层次结构
  - 语义化：类名应表达组件的结构和状态
  - 一致性：使用统一的命名规范
  - 可维护性：类名应易于理解和修改
-->

- **BEM 方法论**：Block-Element-Modifier
- **语义化**：类名应表达组件的结构和状态
- **一致性**：使用统一的命名规范
- **可维护性**：类名应易于理解和修改

### 2. BEM 命名规范

<!--
  BEM规范说明：
  - Block：独立的组件块，如.history-item
  - Element：块内的元素，使用__连接，如.history-item__title
  - Modifier：修饰符，使用--连接，如.history-item--selected
  - 这种结构提供了清晰的层次关系和状态管理
-->

```scss
// Block - 块级组件，独立的UI组件
.history-item {
}
.history-actions {
}
.history-search {
}

// Element - 元素，块内的子元素，使用__连接
.history-item__title {
}
.history-item__content {
}
.history-actions__button {
}

// Modifier - 修饰符，表示状态或变体，使用--连接
.history-item--selected {
}
.history-item--disabled {
}
.history-actions__button--primary {
}
```

### 3. 实际应用示例

<!--
  应用示例说明：
  - ✅ 正确示例：遵循BEM规范，结构清晰
  - ❌ 错误示例：命名混乱，缺乏层次结构
  - 好的命名可以减少CSS的复杂度
  - 便于样式的维护和扩展
-->

```typescript
// ✅ 正确的className命名 - 遵循BEM规范，结构清晰
<div className="history-item">
  <div className="history-item__header">
    <span className="history-item__title">会话标题</span>
    <div className="history-item__actions">
      <button className="history-item__button history-item__button--favorite">
        收藏
      </button>
    </div>
  </div>
</div>

// ❌ 错误的className命名 - 命名混乱，缺乏层次结构
<div className="item">
  <div className="header">
    <span className="title">会话标题</span>
    <div className="actions">
      <button className="btn btn-fav">收藏</button>
    </div>
  </div>
</div>
```

### 4. 状态类名

<!--
  状态类名说明：
  - 状态修饰符：表示组件的不同状态
  - 交互状态：表示用户的交互行为
  - 尺寸修饰符：表示组件的大小变体
  - 这些修饰符提供了灵活的样式控制
-->

```scss
// 状态修饰符 - 表示组件的不同状态
.history-item--loading {
}
.history-item--error {
}
.history-item--success {
}

// 交互状态 - 表示用户的交互行为
.history-item--hover {
}
.history-item--active {
}
.history-item--focus {
}

// 尺寸修饰符 - 表示组件的大小变体
.history-item--small {
}
.history-item--large {
}
```

## style.ts 开发方式

<!--
  style.ts开发说明：
  - 使用antd-style进行样式管理
  - 提供类型安全的样式开发
  - 支持主题变量和响应式设计
  - 统一的样式组织方式
-->

### 1. style.ts 文件组织

<!--
  文件组织说明：
  - 使用createStyles创建样式Hook
  - 按功能模块组织样式
  - 使用token变量保持一致性
  - 支持嵌套和伪类选择器
-->

```typescript
// src/History/style.ts
import { createStyles } from 'antd-style';

export const useHistoryStyles = createStyles(({ token }) => ({
  // 容器样式 - 基础布局样式
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: token.paddingSM,
  },

  // 列表项样式 - 列表项的基础样式和交互效果
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: token.paddingSM,
    borderRadius: token.borderRadius,
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },

  // 操作按钮样式 - 操作区域的样式和动画效果
  actions: {
    display: 'flex',
    gap: token.marginXS,
    opacity: 0,
    transition: 'opacity 0.2s ease',

    '.history-item:hover &': {
      opacity: 1,
    },
  },

  // 按钮样式 - 按钮的基础样式和状态变体
  button: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: token.paddingXS,
    borderRadius: token.borderRadiusSM,

    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },

    '&--primary': {
      color: token.colorPrimary,
    },

    '&--danger': {
      color: token.colorError,
    },
  },
}));
```

### 2. 样式使用方式

<!--
  使用方式说明：
  - 在组件中导入样式Hook
  - 通过styles对象访问样式类名
  - 支持动态样式和条件样式
  - 提供类型安全的样式引用
-->

```typescript
// 在组件中使用样式 - 导入Hook并应用样式
import { useHistoryStyles } from './style';

export const HistoryItem: React.FC<HistoryItemProps> = (props) => {
  const { styles } = useHistoryStyles();

  return (
    <div className={styles.item}>
      <div className={styles.content}>
        {props.children}
      </div>
      <div className={styles.actions}>
        <button className={styles.button}>
          操作
        </button>
      </div>
    </div>
  );
};
```

### 3. 样式变量管理

<!--
  变量管理说明：
  - 定义统一的样式变量
  - 支持主题切换和定制
  - 提供尺寸、颜色、间距等变量
  - 便于样式的统一管理和修改
-->

```typescript
// src/History/style.ts
export const historyToken = {
  // 颜色变量 - 定义统一的颜色规范
  colors: {
    primary: '#1D7AFC',
    secondary: 'rgba(0, 0, 0, 0.25)',
    hover: 'rgba(0, 0, 0, 0.04)',
    border: '#f0f0f0',
  },

  // 尺寸变量 - 定义统一的尺寸规范
  sizes: {
    itemHeight: '48px',
    buttonSize: '32px',
    iconSize: '16px',
  },

  // 间距变量 - 定义统一的间距规范
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
  },

  // 动画变量 - 定义统一的动画规范
  animation: {
    duration: '0.2s',
    easing: 'ease',
  },
};
```

## API 命名规则

<!--
  API命名说明：
  - API是组件的对外接口
  - 良好的API设计提高组件的可用性
  - 统一的命名规范便于理解和使用
  - 类型安全的API设计减少错误
-->

### 1. Props 命名规范

<!--
  Props命名说明：
  - 数据属性：直接描述数据内容
  - 事件回调：使用on前缀，清晰表达事件类型
  - 配置属性：使用Config后缀，表示配置对象
  - 样式属性：使用标准的样式属性名
-->

```typescript
// ✅ 正确的Props命名 - 语义化、具体、类型安全
interface HistoryItemProps {
  // 数据属性 - 直接描述数据内容
  item: HistoryDataType;
  selectedIds: string[];

  // 事件回调 - 使用on前缀，清晰表达事件类型
  onSelectionChange: (sessionId: string, checked: boolean) => void;
  onSelected: (sessionId: string) => void;
  onDeleteItem?: (sessionId: string) => Promise<void>;
  onFavorite?: (sessionId: string, isFavorite: boolean) => Promise<void>;

  // 配置属性 - 使用Config后缀，表示配置对象
  agent?: AgentConfig;
  extra?: (item: HistoryDataType) => React.ReactElement;

  // 样式属性 - 使用标准的样式属性名
  className?: string;
  style?: React.CSSProperties;
}

// ❌ 错误的Props命名 - 不够具体、不够描述性、缺少类型信息
interface HistoryItemProps {
  data: HistoryDataType; // 不够具体
  ids: string[]; // 不够描述性
  change: (id: string) => void; // 不够明确
  delete?: () => void; // 缺少参数信息
}
```

### 2. 事件回调命名

<!--
  事件回调命名说明：
  - 标准事件：使用React标准事件名
  - 自定义事件：使用on + 动词 + 名词的格式
  - 异步事件：使用Promise返回类型
  - 参数命名：使用描述性的参数名
-->

```typescript
// 标准事件回调命名 - 遵循React事件命名规范
onClick: (event: React.MouseEvent) => void;
onChange: (value: string) => void;
onSubmit: (data: FormData) => void;
onDelete: (id: string) => Promise<void>;
onFavorite: (id: string, isFavorite: boolean) => void;

// 自定义事件回调命名 - 使用on + 动词 + 名词的格式
onSelectionChange: (selectedIds: string[]) => void;
onLoadMore: () => Promise<void>;
onSearch: (keyword: string) => void;
onNewChat: () => void;
```

### 3. 配置对象命名

<!--
  配置对象命名说明：
  - 使用Config后缀：明确表示配置对象
  - 属性分组：按功能对属性进行分组
  - 可选属性：使用?标记可选属性
  - 类型定义：提供完整的类型信息
-->

```typescript
// 配置对象命名规范 - 使用Config后缀，明确表示配置对象
interface AgentConfig {
  enabled: boolean;
  onSearch?: (keyword: string) => void;
  onFavorite?: (sessionId: string, isFavorite: boolean) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

interface HistoryConfig {
  agentId: string;
  sessionId: string;
  standalone?: boolean;
  customDateFormatter?: (date: number | string | Date) => string;
  groupBy?: (item: HistoryDataType) => string;
  sessionSort?: SortFunction | false;
}
```

## 功能开发规则

<!--
  功能开发说明：
  - 定义标准的组件开发流程
  - 提供Hook开发的最佳实践
  - 统一的错误处理机制
  - 确保代码的可维护性和可扩展性
-->

### 1. 组件开发流程

<!--
  开发流程说明：
  - 类型定义：先定义接口，确保类型安全
  - JSDoc注释：提供完整的文档说明
  - 组件实现：按照标准模式实现组件逻辑
  - 测试验证：确保功能的正确性
-->

```typescript
// 1. 定义类型接口 - 先定义接口，确保类型安全
interface ComponentProps {
  // 定义所有必要的属性
}

// 2. 编写JSDoc注释 - 提供完整的文档说明
/**
 * ComponentName 组件 - 组件描述
 *
 * @component
 * @description 详细描述
 * @param {ComponentProps} props - 组件属性
 * @example 使用示例
 * @returns {React.ReactElement} 返回值描述
 * @remarks 重要说明
 */

// 3. 实现组件逻辑 - 按照标准模式实现组件逻辑
export const ComponentName: React.FC<ComponentProps> = (props) => {
  // 状态管理 - 使用useState管理组件状态
  const [state, setState] = useState(initialState);

  // 事件处理 - 使用useCallback优化性能
  const handleEvent = useCallback(() => {
    // 事件处理逻辑
  }, [dependencies]);

  // 渲染逻辑 - 返回JSX结构
  return (
    <div className={styles.container}>
      {/* 组件内容 */}
    </div>
  );
};
```

### 2. Hook 开发规范

<!--
  Hook开发说明：
  - 状态定义：明确组件的状态结构
  - 数据获取：使用标准的数据获取模式
  - 事件处理：提供统一的事件处理函数
  - 返回值：返回组件需要的所有状态和方法
-->

```typescript
// Hook 命名规范 - 使用use前缀，返回组件需要的状态和方法
export const useHistory = (props: HistoryProps) => {
  // 状态定义 - 明确组件的状态结构
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 数据获取 - 使用标准的数据获取模式
  const { data, loading, error } = useQuery({
    queryKey: ['history', props.agentId],
    queryFn: () => props.request({ agentId: props.agentId }),
  });

  // 事件处理函数 - 提供统一的事件处理函数
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
      props.agent?.onSearch?.(keyword);
    },
    [props.agent],
  );

  const handleFavorite = useCallback(
    async (sessionId: string, isFavorite: boolean) => {
      try {
        await props.agent?.onFavorite?.(sessionId, isFavorite);
      } catch (error) {
        console.error('收藏操作失败:', error);
      }
    },
    [props.agent],
  );

  // 返回值 - 返回组件需要的所有状态和方法
  return {
    open,
    setOpen,
    searchKeyword,
    selectedIds,
    filteredList: data || [],
    loading,
    error,
    handleSearch,
    handleFavorite,
  };
};
```

### 3. 错误处理规范

<!--
  错误处理说明：
  - 统一处理：使用统一的错误处理模式
  - 用户反馈：提供友好的错误提示
  - 状态管理：正确处理加载状态
  - 错误边界：提供组件级别的错误处理
-->

```typescript
// 统一的错误处理方式 - 使用try-catch-finally模式
const handleAsyncOperation = async () => {
  try {
    setLoading(true);
    await asyncOperation();
  } catch (error) {
    console.error('操作失败:', error);
    // 可以添加错误提示
    message.error('操作失败，请重试');
  } finally {
    setLoading(false);
  }
};

// 错误边界组件 - 提供组件级别的错误处理
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div>组件加载失败，请刷新页面重试</div>;
  }

  return (
    <ErrorBoundary
      fallback={<div>组件加载失败</div>}
      onError={() => setHasError(true)}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## 测试文件规则

<!--
  测试文件说明：
  - 测试是代码质量的重要保障
  - 统一的测试规范提高测试效率
  - 完整的测试覆盖确保功能正确性
  - 测试文档化便于维护和理解
-->

### 1. 测试文件命名

<!--
  测试文件命名说明：
  - 使用.test.tsx后缀：明确表示测试文件
  - 与源文件对应：便于查找和维护
  - 集成测试：使用.integration标识
  - 特殊测试：使用描述性后缀
-->

```typescript
// 测试文件命名规范 - 使用.test.tsx后缀，与源文件对应
src / History / __tests__ / History.test.tsx; // 组件测试
src / History / __tests__ / useHistory.test.ts; // Hook测试
src / History / __tests__ / utils.test.ts; // 工具函数测试
src / History / __tests__ / History.integration.test.tsx; // 集成测试
```

### 2. 测试文件结构

<!--
  测试文件结构说明：
  - describe分组：按功能或组件分组
  - 测试数据：统一的mock数据管理
  - 测试用例：清晰的测试场景描述
  - 断言验证：明确的期望结果验证
-->

```typescript
// src/History/__tests__/History.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { History } from '../index';

describe('History Component', () => {
  // 测试数据 - 统一的mock数据管理
  const mockProps = {
    agentId: 'test-agent',
    sessionId: 'test-session',
    request: jest.fn().mockResolvedValue([]),
  };

  // 测试用例 - 按功能分组，清晰的测试场景描述
  describe('渲染测试', () => {
    it('应该正确渲染History组件', () => {
      render(<History {...mockProps} />);
      expect(screen.getByTestId('history-container')).toBeInTheDocument();
    });

    it('应该显示历史记录列表', async () => {
      const mockData = [
        { id: '1', sessionTitle: '测试会话1' },
        { id: '2', sessionTitle: '测试会话2' },
      ];
      mockProps.request.mockResolvedValue(mockData);

      render(<History {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('测试会话1')).toBeInTheDocument();
        expect(screen.getByText('测试会话2')).toBeInTheDocument();
      });
    });
  });

  describe('交互测试', () => {
    it('应该能够选择历史记录', async () => {
      const onSelected = jest.fn();
      render(<History {...mockProps} onSelected={onSelected} />);

      const historyItem = await screen.findByText('测试会话1');
      fireEvent.click(historyItem);

      expect(onSelected).toHaveBeenCalledWith('1');
    });

    it('应该能够搜索历史记录', async () => {
      const onSearch = jest.fn();
      render(<History {...mockProps} agent={{ enabled: true, onSearch }} />);

      const searchInput = screen.getByPlaceholderText('搜索历史记录...');
      fireEvent.change(searchInput, { target: { value: '测试' } });

      expect(onSearch).toHaveBeenCalledWith('测试');
    });
  });

  describe('错误处理测试', () => {
    it('应该处理请求失败的情况', async () => {
      mockProps.request.mockRejectedValue(new Error('请求失败'));

      render(<History {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('加载失败')).toBeInTheDocument();
      });
    });
  });
});
```

### 3. 测试工具函数

<!--
  工具函数测试说明：
  - 纯函数测试：测试输入输出关系
  - 边界条件：测试异常情况处理
  - 性能测试：测试函数执行效率
  - 覆盖率要求：确保测试完整性
-->

```typescript
// src/History/__tests__/utils.test.ts
import { formatTime, groupByCategory } from '../utils';

describe('History Utils', () => {
  describe('formatTime', () => {
    it('应该正确格式化时间', () => {
      const timestamp = Date.now();
      const result = formatTime(timestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('应该处理无效时间', () => {
      expect(formatTime(0)).toBe('1970-01-01');
      expect(formatTime('invalid')).toBe('Invalid Date');
    });
  });

  describe('groupByCategory', () => {
    it('应该按类别分组数据', () => {
      const data = [
        { id: '1', category: 'A' },
        { id: '2', category: 'B' },
        { id: '3', category: 'A' },
      ];

      const result = groupByCategory(data, (item) => item.category);

      expect(result.A).toHaveLength(2);
      expect(result.B).toHaveLength(1);
    });
  });
});
```

### 4. 测试覆盖率要求

<!--
  覆盖率要求说明：
  - 分支覆盖率：确保所有条件分支都被测试
  - 函数覆盖率：确保所有函数都被调用
  - 行覆盖率：确保所有代码行都被执行
  - 语句覆盖率：确保所有语句都被执行
-->

```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/*.test.{ts,tsx}",
      "!src/**/__tests__/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 代码质量规范

<!--
  代码质量说明：
  - TypeScript规范：确保类型安全
  - 注释规范：提供清晰的文档说明
  - 性能优化：确保代码执行效率
  - 错误处理：提供健壮的错误处理机制
-->

### 1. TypeScript 规范

<!--
  TypeScript规范说明：
  - 类型定义：提供完整的类型信息
  - 接口设计：使用接口定义数据结构
  - 泛型使用：提供灵活的类型支持
  - 类型安全：避免any类型的使用
-->

```typescript
// 类型定义规范 - 提供完整的类型信息
interface ComponentProps {
  // 必需属性 - 明确标记必需属性
  requiredProp: string;

  // 可选属性 - 使用?标记可选属性
  optionalProp?: number;

  // 函数属性 - 提供完整的函数类型定义
  onEvent: (param: string) => void;

  // 联合类型 - 使用联合类型限制可选值
  variant: 'primary' | 'secondary' | 'danger';

  // 泛型类型 - 使用泛型提供灵活的类型支持
  data: Array<DataItem>;
}

// 组件类型定义 - 使用React.FC确保类型安全
export const Component: React.FC<ComponentProps> = (props) => {
  // 组件实现
};

// Hook 类型定义 - 提供明确的返回值类型
export const useCustomHook = (): {
  state: StateType;
  actions: ActionType;
} => {
  // Hook 实现
};
```

### 2. 代码注释规范

<!--
  注释规范说明：
  - JSDoc格式：使用标准JSDoc格式
  - 参数说明：详细描述每个参数
  - 返回值：说明函数的返回值
  - 使用示例：提供实际的使用示例
-->

````typescript
/**
 * 组件名称 - 组件简短描述
 *
 * 组件的详细描述，包括功能、使用场景等。
 *
 * @component
 * @description 组件的详细描述
 * @param {ComponentProps} props - 组件属性
 * @param {string} props.prop1 - 属性1的描述
 * @param {number} [props.prop2] - 可选属性2的描述
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value1"
 *   prop2={42}
 *   onEvent={(value) => console.log(value)}
 * />
 * ```
 *
 * @returns {React.ReactElement} 返回值的描述
 *
 * @remarks
 * - 重要说明1
 * - 重要说明2
 * - 使用注意事项
 */
````

### 3. 性能优化规范

<!--
  性能优化说明：
  - React.memo：避免不必要的重新渲染
  - useCallback：优化事件处理函数
  - useMemo：优化计算密集型操作
  - useRef：避免不必要的重新渲染
-->

```typescript
// 使用 React.memo 优化渲染 - 避免不必要的重新渲染
export const OptimizedComponent = React.memo<ComponentProps>((props) => {
  // 组件实现
});

// 使用 useCallback 优化事件处理 - 避免函数重新创建
const handleClick = useCallback(
  (id: string) => {
    // 事件处理逻辑
  },
  [dependencies],
);

// 使用 useMemo 优化计算 - 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 使用 useRef 避免不必要的重新渲染 - 保持引用稳定
const intervalRef = useRef<NodeJS.Timeout>();
```

### 4. 错误边界和异常处理

<!--
  错误处理说明：
  - 错误边界：提供组件级别的错误处理
  - 异步处理：使用try-catch处理异步操作
  - 用户反馈：提供友好的错误提示
  - 日志记录：记录错误信息便于调试
-->

```typescript
// 错误边界组件 - 提供组件级别的错误处理
export const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || <div>组件加载失败</div>;
  }

  return (
    <ErrorBoundary
      fallback={fallback}
      onError={() => setHasError(true)}
    >
      {children}
    </ErrorBoundary>
  );
};

// 异步操作错误处理 - 使用try-catch-finally模式
const handleAsyncOperation = async () => {
  try {
    setLoading(true);
    const result = await asyncOperation();
    setData(result);
  } catch (error) {
    console.error('操作失败:', error);
    message.error('操作失败，请重试');
  } finally {
    setLoading(false);
  }
};
```

## 总结

<!--
  总结说明：
  - 规范覆盖：涵盖了组件开发的各个方面
  - 实用性：所有规范都经过实际项目验证
  - 可操作性：提供了具体的实施指导
  - 可维护性：确保代码的长期可维护性
-->

本文档定义了完整的组件开发规范，包括：

1. **命名规范**：组件、文件夹、className、API的命名规则
2. **文件组织**：标准的文件夹结构和文件命名
3. **样式开发**：style.ts的使用方式和样式管理
4. **功能开发**：组件开发流程和最佳实践
5. **测试规范**：测试文件命名、结构和覆盖率要求
6. **代码质量**：TypeScript、注释、性能优化规范

遵循这些规范可以确保代码的一致性、可维护性和可扩展性，提高团队开发效率和代码质量。
