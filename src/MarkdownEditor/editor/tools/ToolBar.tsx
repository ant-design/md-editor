import { observer } from 'mobx-react-lite';
import { BaseToolBar } from './FloatBar';

/**
 * 浮动工具栏,用于设置文本样式
 */
export const ToolBar = observer(() => {
  const baseClassName = `toolbar`;
  return (
    <div
      style={{
        padding: 4,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={baseClassName}
    >
      <BaseToolBar prefix={baseClassName} showInsertAction={true} />
    </div>
  );
});
