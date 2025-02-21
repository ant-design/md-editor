import {
  DeleteOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  PicCenterOutlined,
  PicLeftOutlined,
  PicRightOutlined,
} from '@ant-design/icons';
import { ConfigProvider, Popconfirm, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useStyle } from '../tableAttrStyle';

const AlignmentButton: React.FC<{
  title: string;
  icon: React.ReactNode;
  baseCls: string;
  hashId: string;
  onClick: () => void;
  setOverlayPos: (pos: { left: number; top: number }) => void;
}> = ({ title, icon, baseCls, hashId, onClick, setOverlayPos }) => (
  <Tooltip title={title}>
    <div
      className={classNames(`${baseCls}-item`, hashId)}
      style={{ zIndex: 100 }}
      onClick={() => {
        onClick();
        setOverlayPos({ left: -999999999, top: -999999999 });
      }}
    >
      {icon}
    </div>
  </Tooltip>
);

const InsertButton: React.FC<{
  title: string;
  icon: React.ReactNode;
  baseCls: string;
  hashId: string;
  onClick: () => void;
}> = ({ title, icon, baseCls, hashId, onClick }) => (
  <Tooltip title={title}>
    <div
      className={classNames(`${baseCls}-item`, hashId)}
      style={{ zIndex: 100 }}
      onClick={onClick}
    >
      {icon}
    </div>
  </Tooltip>
);
interface ToolbarOverlayProps {
  overlayPos: { left: number; top: number };
  isColumn: boolean;
  opIndex: number;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  setOverlayPos: (pos: { left: number; top: number }) => void;
}

const ToolbarOverlay: React.FC<ToolbarOverlayProps> = ({
  overlayPos,
  isColumn,
  opIndex,
  setData,
  setOverlayPos,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-editor-toolbar-attributions');
  const { wrapSSR, hashId } = useStyle(baseCls);

  const handleColumnAlignment = (align: 'left' | 'center' | 'right') => {
    const table = document.querySelector('.Spreadsheet__table');
    if (!table || typeof opIndex === 'undefined') return;

    try {
      const dataBody = table.children[1];
      if (dataBody) {
        Array.from(dataBody.children).forEach((row, rowIndex) => {
          if (rowIndex === 0) return;
          const dataCell = row.children[opIndex + 1] as HTMLElement;
          if (dataCell) dataCell.style.textAlign = align;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return wrapSSR(
    <div
      style={{
        position: 'fixed',
        left: overlayPos.left,
        top: overlayPos.top,
        display: 'flex',
        gap: '0.2em',
        zIndex: 200,
      }}
      className={classNames(`${baseCls}`, hashId)}
    >
      <Tooltip title={isColumn ? '删除列' : '删除行'}>
        <div
          id="delete-btn"
          className={classNames(`${baseCls}-item`, hashId, {
            [`${baseCls}-item-delete`]: true,
          })}
        >
          <Popconfirm
            title="Confirm to delete?"
            onConfirm={() => {
              if (isColumn) {
                setData((prev) =>
                  prev.map((row) =>
                    row.filter((_: any, colIdx: number) => colIdx !== opIndex),
                  ),
                );
              } else {
                setData((prev) =>
                  prev.filter((_, rowIdx) => rowIdx !== opIndex),
                );
              }
              setOverlayPos({ left: -999999999, top: -999999999 });
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
      </Tooltip>

      {isColumn ? (
        <>
          <AlignmentButton
            title="左对齐"
            icon={<PicRightOutlined />}
            onClick={() => handleColumnAlignment('left')}
            {...{ baseCls, hashId, setOverlayPos }}
          />
          <AlignmentButton
            title="居中对齐"
            icon={<PicCenterOutlined />}
            onClick={() => handleColumnAlignment('center')}
            {...{ baseCls, hashId, setOverlayPos }}
          />
          <AlignmentButton
            title="右对齐"
            icon={<PicLeftOutlined />}
            onClick={() => handleColumnAlignment('right')}
            {...{ baseCls, hashId, setOverlayPos }}
          />
          <InsertButton
            title="左侧插入列"
            icon={<InsertRowLeftOutlined />}
            onClick={() => {
              setData((prev) =>
                prev.map((row) => [
                  ...row.slice(0, opIndex),
                  { value: '' },
                  ...row.slice(opIndex),
                ]),
              );
              setOverlayPos({ left: -999999999, top: -999999999 });
            }}
            {...{ baseCls, hashId }}
          />
          <InsertButton
            title="右侧插入列"
            icon={<InsertRowRightOutlined />}
            onClick={() => {
              setData((prev) =>
                prev.map((row) => [
                  ...row.slice(0, opIndex + 1),
                  { value: '' },
                  ...row.slice(opIndex + 1),
                ]),
              );
              setOverlayPos({ left: -999999999, top: -999999999 });
            }}
            {...{ baseCls, hashId }}
          />
        </>
      ) : (
        <>
          <InsertButton
            title="上侧插入行"
            icon={<InsertRowAboveOutlined />}
            onClick={() => {
              setData((prev) => [
                ...prev.slice(0, opIndex),
                new Array(prev[0]?.length || 0).fill({ value: '' }),
                ...prev.slice(opIndex),
              ]);
              setOverlayPos({ left: -999999999, top: -999999999 });
            }}
            {...{ baseCls, hashId }}
          />
          <InsertButton
            title="下侧插入行"
            icon={<InsertRowBelowOutlined />}
            onClick={() => {
              setData((prev) => [
                ...prev.slice(0, opIndex + 1),
                new Array(prev[0]?.length || 0).fill({ value: '' }),
                ...prev.slice(opIndex + 1),
              ]);
              setOverlayPos({ left: -999999999, top: -999999999 });
            }}
            {...{ baseCls, hashId }}
          />
        </>
      )}
    </div>,
  );
};

export default ToolbarOverlay;
