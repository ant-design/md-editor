import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React, {
  CSSProperties,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Editor, Path } from 'slate';
import { addSelection } from '../plugins/selection';
import { ReactEditor } from '../slate-react';
import { useEditorStore } from '../store';
type ActivationType = 'none' | 'half' | 'full';

/**
 * 抽象侧边栏 Div 组件的属性接口
 * @interface AbstractSideDivProps
 * @property {number} index - 当前项的索引
 * @property {'column' | 'row'} type - 侧边栏类型，可以是列('column')或行('row')
 * @property {CSSProperties} divStyle - Div 的 CSS 样式属性
 * @property {ActivationType[]} activationArr - 激活状态数组
 * @property {any} getTableNode - 获取表格节点的函数
 * @property {any} setSelCells - 设置选中单元格的函数
 * @property {HTMLElement} [scrollContainerRefDom] - 可选的滚动容器 DOM 引用
 * @property {any} tableDom - 表格 DOM 元素
 * @property {string | null} activeDeleteBtn - 当前激活的删除按钮标识
 * @property {any} setActiveDeleteBtn - 设置激活删除按钮的函数
 * @property {() => void} [onDelete] - 可选的删除回调函数
 */
type AbstractSideDivProps = {
  index: number;
  type: 'column' | 'row';
  divStyle: CSSProperties;
  activationArr: ActivationType[];
  getTableNode: any;
  selCells: any;
  setSelCells: any;
  scrollContainerRefDom?: HTMLElement;
  [key: string]: any;
  tableDom: any;
  activeDeleteBtn: string | null;
  setActiveDeleteBtn: any;
  onDelete: (index: number) => void;
};

/**
 * 表格侧边栏的抽象组件，用于渲染行或列的控制按钮
 *
 * @param props - 组件属性
 * @param props.index - 当前行或列的索引
 * @param props.type - 侧边栏类型，可以是 'row' 或 'column'
 * @param props.divStyle - div 的样式对象
 * @param props.getTableNode - 获取表格节点的函数
 * @param props.setSelCells - 设置选中单元格的函数
 * @param props.activationArr - 激活状态数组，控制侧边栏的激活状态
 * @param props.tableDom - 表格 DOM 元素
 * @param props.activeDeleteBtn - 当前激活的删除按钮
 * @param props.setActiveDeleteBtn - 设置激活删除按钮的函数
 *
 * @remarks
 * 该组件包含以下功能：
 * - 显示添加行/列的按钮
 * - 显示删除行/列的按钮
 * - 处理单元格的选择
 * - 根据鼠标位置动态调整按钮位置
 * - 响应鼠标悬停事件
 *
 * @example
 * ```tsx
 * <AbstractSideDiv
 *   index={0}
 *   type="row"
 *   divStyle={{width: '20px'}}
 *   getTableNode={() => tableNode}
 *   setSelCells={setCells}
 *   activationArr={['full', 'none']}
 *   tableDom={document.querySelector('.table')}
 *   activeDeleteBtn={null}
 *   setActiveDeleteBtn={setActiveBtn}
 * />
 * ```
 */
export function AbstractSideDiv(props: AbstractSideDivProps) {
  const {
    index,
    type,
    divStyle,
    getTableNode,
    selCells,
    setSelCells,
    activationArr,
    tableDom,
    activeDeleteBtn,
    setActiveDeleteBtn,
    onDelete,
  } = props;

  const isColumn = type === 'column';
  const { store } = useEditorStore();
  const tableSideDivRef = useRef<HTMLDivElement | null>(null);
  const [deleteBtnHover, setDeleteBtnHover] = useState(false);
  const [addBtnHover, setAddBtnHover] = useState(false);

  const [overlayPos, setOverlayPos] = useState({
    left: -999999999,
    top: -999999999,
  });
  const [addBtnPos, setAddBtnPos] = useState({
    left: -999999999,
    top: -999999999,
  });

  useEffect(() => {
    if (!store.editor) return;
    const selectedCells = tableDom.querySelectorAll('.selected-cell-td');
    if (deleteBtnHover) {
      selectedCells.forEach(
        (cell: { classList: { add: (arg0: string) => void } }) => {
          cell.classList.add('delete-btn-hover');
        },
      );
    } else {
      selectedCells.forEach(
        (cell: { classList: { remove: (arg0: string) => void } }) => {
          cell.classList.remove('delete-btn-hover');
        },
      );
    }
  }, [deleteBtnHover]);

  useEffect(() => {
    if (!tableSideDivRef?.current || !activeDeleteBtn) return;

    const { left, top, right } =
      tableSideDivRef.current.getBoundingClientRect();

    const domPos = isColumn
      ? { left: (right + left) / 2 - 74, top: top - 64 }
      : { left: right - 36, top: top - 70 };

    setOverlayPos(domPos);
  }, [deleteBtnHover, activeDeleteBtn]);

  useEffect(() => {
    if (!tableSideDivRef?.current) return;

    const { left, top, right, bottom } =
      tableSideDivRef.current.getBoundingClientRect();

    const handleMouseMove = (e: MouseEvent) => {
      let newAddPos: { left: number; top: number } | undefined;

      if (isColumn) {
        const middle = left + (right - left) / 2;
        const isLeftZone = e.clientX < middle;
        newAddPos = isLeftZone
          ? { left: (right + left) / 2 - 118, top: top - 64 } // 左
          : { left: (right + left) / 2 - 30, top: top - 64 }; // 右
      } else if (type === 'row') {
        const middle = top + (bottom - top) / 2;
        const isTopZone = e.clientY < middle;
        newAddPos = isTopZone
          ? { left: right - 90, top: top - 64 } // 上
          : { left: right - 90, top: top - 34 }; // 下
      }

      if (newAddPos) {
        setAddBtnPos(newAddPos);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tableSideDivRef, isColumn, type, setAddBtnPos]);

  return (
    <>
      <div
        ref={tableSideDivRef}
        key={index}
        contentEditable={false}
        suppressContentEditableWarning
        className={`table-side-div ignore-toggle-readonly ${
          activationArr[index] === 'full'
            ? 'full-active'
            : activationArr[index] === 'half'
              ? 'half-active'
              : 'none-active'
        } ${deleteBtnHover ? 'delete-btn-hover' : ''} `}
        style={{
          ...divStyle,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setActiveDeleteBtn(`${type}-${index}`);
          const tableSlateNode = getTableNode();
          if (tableSlateNode && index !== -1) {
            const tablePath = ReactEditor.findPath(
              store.editor,
              tableSlateNode,
            );
            const tableEntry = Editor.node(store.editor, tablePath);
            const len = isColumn
              ? (tableSlateNode.children as Array<any>).length
              : (tableSlateNode.children as Array<any>)[0].children.length;
            const startPath = isColumn
              ? [...tablePath, 0, index]
              : [tablePath[0], 1, index, 0];
            const endPath = isColumn
              ? [...tablePath, len - 1, index]
              : [tablePath[0], 1, index, len - 1];
            addSelection(store, tableEntry, startPath, endPath, setSelCells);
          }
        }}
        onMouseEnter={() => setAddBtnHover(true)}
        onMouseLeave={() => setAddBtnHover(false)}
      ></div>
      {activeDeleteBtn === `${type}-${index}` && (
        <Button
          className="table-delete-btn"
          id="delete-btn"
          onMouseEnter={() => setDeleteBtnHover(true)}
          onMouseLeave={() => setDeleteBtnHover(false)}
          style={{
            position: 'absolute',
            height: '2em',
            width: '2em',
            left: overlayPos.left,
            top: overlayPos.top,
          }}
        >
          <Popconfirm
            title="Confirm to delete?"
            onConfirm={() => {
              const index = isColumn
                ? selCells[0]?.[1]?.[3]
                : selCells[0]?.[1]?.[2];
              onDelete?.(index);
              setActiveDeleteBtn(null);
              setDeleteBtnHover(false);
              setSelCells([]);
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
        </Button>
      )}
      {addBtnHover && (
        <Button
          className="table-add-row-btn"
          style={{
            position: 'absolute',
            zIndex: 101,
            height: '2em',
            width: '2em',
            left: addBtnPos.left,
            top: addBtnPos.top,
          }}
        >
          <PlusOutlined />
        </Button>
      )}
    </>
  );
}
export function RowSideDiv(props: {
  tableRef: any;
  getTableNode: any;
  setSelCells: any;
  selCells: any;
  activeDeleteBtn: string | null;
  setActiveDeleteBtn: any;
  onDelete?: (index: number) => void;
}) {
  const {
    tableRef,
    getTableNode,
    selCells,
    setSelCells,
    activeDeleteBtn,
    setActiveDeleteBtn,
    onDelete,
  } = props;
  const [activationArr, setActivationArr] = useState<ActivationType[]>([]);
  const tableDom = (tableRef as any)?.current?.childNodes[0];
  const [rowDomArr, setRowDomArr] = useState(
    Array.from(tableDom?.children || []),
  );

  useEffect(() => {
    const rowMap: { [key: number]: number } = {};
    const arr: SetStateAction<ActivationType[]> = [];
    const tableSlateNode = getTableNode();
    selCells.forEach((cellEntry: [any, any]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, path] = cellEntry;
      const rowIndex = path[2];
      if (rowMap[rowIndex]) {
        rowMap[rowIndex]++;
      } else {
        rowMap[rowIndex] = 1;
      }
    });
    for (let i in rowMap) {
      if (rowMap.hasOwnProperty(i)) {
        arr[i] =
          rowMap[i] === tableSlateNode.children[0].children.length
            ? 'full'
            : rowMap[i] === 0
              ? 'none'
              : 'half';
      }
    }
    setActivationArr(arr);
  }, [JSON.stringify(selCells.map((cell: Path) => cell[1]))]);
  useEffect(() => {
    if (tableDom) {
      setRowDomArr(Array.from(tableDom.children || []));
    }
  }, [tableDom]);
  useEffect(() => {
    if (tableDom) {
      const observer = new MutationObserver(() => {
        setRowDomArr(Array.from(tableDom.children || []));
      });

      observer.observe(tableDom, { childList: true });

      setRowDomArr(Array.from(tableDom.children || []));

      return () => {
        observer.disconnect();
      };
    }
  }, [tableDom]);

  return (
    <div
      className="row-div-bar-inner ignore-toggle-readonly"
      style={{
        position: 'absolute',
        display: 'block',
        zIndex: 200,
        width: '0.9em',
        marginTop: '16px',
        marginLeft: '-16px',
      }}
      contentEditable={false}
    >
      {rowDomArr?.map((tr: any, index: number) => (
        <AbstractSideDiv
          tableDom={tableDom}
          key={index}
          index={index}
          type={'row'}
          divStyle={{
            position: 'relative',
            width: '14px',
            height:
              index === 0
                ? tr?.getBoundingClientRect?.()?.height - 1.66 ||
                  tr?.clientHeight - 2
                : tr?.getBoundingClientRect?.()?.height - 0.66 ||
                  tr?.clientHeight - 1,
            ...(index === rowDomArr.length - 1 && {
              borderBottomLeftRadius: '0.5em',
            }),
          }}
          getTableNode={getTableNode}
          activationArr={activationArr}
          selCells={selCells}
          setSelCells={setSelCells}
          activeDeleteBtn={activeDeleteBtn}
          setActiveDeleteBtn={setActiveDeleteBtn}
          onDelete={(index) => {
            onDelete?.(index);
          }}
        />
      ))}
    </div>
  );
}
interface ColSideDivProps {
  activeDeleteBtn: string | null;
  setActiveDeleteBtn: any;
  tableRef: any;
  getTableNode: any;
  setSelCells: any;
  selCells: any;
  onDelete?: (index: number) => void;
}

/**
 * 表格列选择控制组件
 *
 * @component ColSideDiv
 * @param {Object} props
 * @param {React.RefObject<HTMLDivElement>} props.tableRef - 表格DOM引用
 * @param {Function} props.getTableNode - 获取表格节点的函数
 * @param {Array<[any, Path]>} props.selCells - 已选中的单元格数组
 * @param {Function} props.setSelCells - 设置选中单元格的函数
 * @param {boolean} props.activeDeleteBtn - 删除按钮激活状态
 * @param {Function} props.onDelete - 删除操作处理函数
 * @param {Function} props.setActiveDeleteBtn - 设置删除按钮激活状态的函数
 *
 * @description
 * 该组件用于渲染表格列选择的侧边控制栏，提供以下功能：
 * - 显示列选择状态（全选/部分选择/未选择）
 * - 支持列选择操作
 * - 跟随表格水平滚动
 * - 提供列删除功能
 *
 * @example
 * ```tsx
 * <ColSideDiv
 *   tableRef={tableRef}
 *   getTableNode={getTableNode}
 *   selCells={selectedCells}
 *   setSelCells={setSelectedCells}
 *   activeDeleteBtn={isDeleteActive}
 *   onDelete={handleDelete}
 *   setActiveDeleteBtn={setIsDeleteActive}
 * />
 * ```
 */
export function ColSideDiv(props: ColSideDivProps) {
  const {
    tableRef,
    getTableNode,
    selCells,
    setSelCells,
    activeDeleteBtn,
    onDelete,
    setActiveDeleteBtn,
  } = props;
  const colDivBarInnerRef = useRef<HTMLDivElement | null>(null);
  const [activationArr, setActivationArr] = useState<ActivationType[]>([]);
  const tableDom = (tableRef as any)?.current?.childNodes[0];
  const [colDomArr, setColDomArr] = useState(
    tableDom ? Array.from(tableDom?.firstChild?.children || []) : [],
  );
  const [scrollOffset, setScrollOffset] = useState(0);
  useEffect(() => {
    const colMap: { [key: number]: number } = {};
    const arr: SetStateAction<ActivationType[]> = [];
    const tableSlateNode = getTableNode();
    selCells.forEach((cellEntry: [any, any]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, path] = cellEntry;
      const colIndex = path[3];
      if (colMap[colIndex]) {
        colMap[colIndex]++;
      } else {
        colMap[colIndex] = 1;
      }
    });
    for (let i in colMap) {
      if (colMap.hasOwnProperty(i)) {
        arr[i] =
          colMap[i] === tableSlateNode.children.length
            ? 'full'
            : colMap[i] === 0
              ? 'none'
              : 'half';
      }
    }
    setActivationArr(arr);
  }, [JSON.stringify(selCells.map((cell: Path) => cell[1]))]);
  useEffect(() => {
    if (tableDom) {
      setColDomArr(Array.from(tableDom.firstChild.children || []));
    }
  }, [tableDom]);
  useEffect(() => {
    if (!tableRef.current) return;
    const tableElement = tableRef.current;
    const handleScroll = () => {
      setScrollOffset(tableElement.scrollLeft);
    };
    tableElement.addEventListener('scroll', handleScroll);
    return () => {
      tableElement.removeEventListener('scroll', handleScroll);
    };
  }, [tableRef]);

  useEffect(() => {
    if (tableDom) {
      const observer = new MutationObserver(() => {
        setColDomArr(Array.from(tableDom.firstChild?.children || []));
      });

      observer.observe(tableDom.firstChild, { childList: true });

      setColDomArr(Array.from(tableDom.firstChild?.children || []));

      return () => {
        observer.disconnect();
      };
    }
  }, [tableDom]);

  return (
    <div
      ref={colDivBarInnerRef}
      className="col-div-bar-inner ignore-toggle-readonly"
      style={{
        position: 'absolute',
        display: 'flex',
        height: '1rem',
        zIndex: 100,
        transform: `translateX(${scrollOffset / 9999}px)`,
      }}
      contentEditable={false}
    >
      {colDomArr?.map((td: any, index: number) => {
        const colRect = td?.getBoundingClientRect();
        const leftPosition = colRect?.left || 0;
        return (
          <AbstractSideDiv
            tableDom={tableDom}
            key={index}
            index={index}
            type={'column'}
            divStyle={{
              position: 'absolute',
              top: 0,
              left: leftPosition - 59,
              width: colRect?.width || td?.clientWidth,
              height: '0.9em',
              zIndex: 101,
              ...(index === colDomArr.length - 1 && {
                borderTopRightRadius: '0.5em',
              }),
            }}
            getTableNode={getTableNode}
            activationArr={activationArr}
            selCells={selCells}
            setSelCells={setSelCells}
            activeDeleteBtn={activeDeleteBtn}
            setActiveDeleteBtn={setActiveDeleteBtn}
            onDelete={(index) => {
              onDelete?.(index);
            }}
          />
        );
      })}
    </div>
  );
}

export function IntersectionPointDiv(props: {
  getTableNode: any;
  setSelCells: any;
  selCells: any;
}) {
  const { getTableNode, setSelCells, selCells } = props;
  const { store } = useEditorStore();
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    let act = false;
    const tableSlateNode = getTableNode();
    const total =
      tableSlateNode.children.length *
      tableSlateNode.children[0].children.length;
    if (selCells.length === total) {
      act = true;
    }
    setActive(act);
  }, [JSON.stringify(selCells.map((cell: Path) => cell[1]))]);
  return (
    <div
      contentEditable={false}
      suppressContentEditableWarning
      className={`intersection-point ignore-toggle-readonly ${
        active ? 'active' : ''
      }`}
      style={{
        display: 'flex',
        zIndex: 102,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        const tableSlateNode = getTableNode();
        if (tableSlateNode) {
          const tablePath = ReactEditor.findPath(store.editor, tableSlateNode);
          const tableEntry = Editor.node(store.editor, tablePath);
          const colLen = (tableSlateNode.children as Array<any>).length;
          const rowLen = (tableSlateNode.children as Array<any>)[0].children
            .length;
          const startPath = [tablePath[0], 1, 0, 0];
          const endPath = [tablePath[0], 1, colLen - 1, rowLen - 1];
          addSelection(store, tableEntry, startPath, endPath, setSelCells);
        }
      }}
    ></div>
  );
}
