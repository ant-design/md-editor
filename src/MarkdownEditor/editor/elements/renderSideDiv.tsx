import {
  CSSProperties,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Editor, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { addSelection } from '../plugins/selection';
import { useEditorStore } from '../store';
type ActivationType = 'none' | 'half' | 'full';
type AbstractSideDivProps = {
  index: number;
  type: 'column' | 'row';
  divStyle: CSSProperties;
  activationArr: ActivationType[];
  getTableNode: any;
  setSelCells: any;
  scrollContainerRefDom?: HTMLElement;
  [key: string]: any;
};
export function AbstractSideDiv(props: AbstractSideDivProps) {
  const { index, type, divStyle, getTableNode, setSelCells, activationArr } =
    props;
  const isColumn = type === 'column';
  const { store } = useEditorStore();
  const tableSideDivRef = useRef<HTMLDivElement | null>(null);
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
        } `}
        style={{
          ...divStyle,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
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
      ></div>
    </>
  );
}
export function RowSideDiv(props: {
  tableRef: any;
  getTableNode: any;
  setSelCells: any;
  selCells: any;
}) {
  const { tableRef, getTableNode, selCells, setSelCells } = props;
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
  return (
    <>
      <div
        className="row-div-bar-inner ignore-toggle-readonly"
        style={{
          position: 'absolute',
          display: 'block',
          borderBottom: '1px solid #DFDFDF',
          zIndex: 100,
          width: '14px',
          marginTop: '15.5px',
          marginLeft: '-16px',
        }}
        contentEditable={false}
        onMouseLeave={() => {}}
      >
        {rowDomArr?.map((tr: any, index: number) => (
          <AbstractSideDiv
            key={index}
            index={index}
            type={'row'}
            divStyle={{
              position: 'relative',
              width: '14px',
              height:
                tr?.getBoundingClientRect?.()?.height - 1 ||
                tr?.clientHeight - 1,
            }}
            getTableNode={getTableNode}
            activationArr={activationArr}
            setSelCells={setSelCells}
          />
        ))}
      </div>
    </>
  );
}
export function ColSideDiv(props: {
  tableRef: any;
  getTableNode: any;
  setSelCells: any;
  selCells: any;
}) {
  const { tableRef, getTableNode, selCells, setSelCells } = props;
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
  return (
    <div
      ref={colDivBarInnerRef}
      className="col-div-bar-inner ignore-toggle-readonly"
      style={{
        position: 'relative',
        display: 'flex',
        height: '16px',
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
            key={index}
            index={index}
            type={'column'}
            divStyle={{
              position: 'absolute',
              top: 0,
              left: leftPosition - 50.5,
              width: colRect?.width || td?.clientWidth,
              height: '14.5px',
              zIndex: 101,
              ...(index === colDomArr.length - 1 && {
                borderTopRightRadius: '7.2px',
              }),
            }}
            getTableNode={getTableNode}
            activationArr={activationArr}
            setSelCells={setSelCells}
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