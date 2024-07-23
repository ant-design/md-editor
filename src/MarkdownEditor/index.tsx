import { observable } from 'mobx';
import { nanoid } from 'nanoid';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { EditorFrame } from './editor/EditorFrame';
import { parserMdToSchema } from './editor/parser/parser';
import { EditorStore } from './editor/store';
import { Heading } from './editor/tools/Leading';
import { EditorUtils } from './editor/utils/editorUtils';
import { useSystemKeyboard } from './editor/utils/keyboard';
import './index.css';

export { EditorUtils, parserMdToSchema };

export * from './editor/elements';
export * from './el';

export type IFileItem = {
  cid: string;
  filePath: string;
  root?: boolean;
  ext: string;
  filename: string;
  spaceId?: string;
  folder: boolean;
  parent?: IFileItem;
  children?: IFileItem[];
  expand?: boolean;
  editName?: string;
  changed?: boolean;
  refresh?: boolean;
  ghost?: boolean;
  sort: number;
  schema?: any[];
  history?: any;
  lastOpenTime?: number;
  hidden?: boolean;
  links?: { path: number[]; target: string }[];
};
export interface Tab {
  get current(): IFileItem | undefined;
  history: IFileItem[];
  index: number;
  hasNext: boolean;
  hasPrev: boolean;
  range?: Range;
  store: EditorStore;
  id: string;
}

export const MarkdownEditor: React.FC<{
  width?: string | number;
  height?: string | number;
  initValue?: string;
  readonly?: boolean;
  style?: React.CSSProperties;
  toc?: boolean;
  tabRef?: React.MutableRefObject<Tab | undefined>;
}> = (props) => {
  const {
    initValue,
    width,
    tabRef,
    toc = true,
    readonly,
    style,
    height,
    ...rest
  } = props;

  // 初始化 tab
  const t = useMemo(() => {
    const now = Date.now();
    const list = parserMdToSchema(initValue!)?.schema;
    list.push(EditorUtils.p);
    const data = {
      cid: nanoid(),
      filePath: 'new.md',
      folder: false,
      schema: initValue ? list : JSON.parse(JSON.stringify([EditorUtils.p])),
      sort: 0,
      lastOpenTime: now,
      spaceId: undefined,
      ext: 'md',
      filename: '腾讯报告',
    };
    return observable(
      {
        get current() {
          return this.history[this.index];
        },
        history: [data],
        index: 0,
        id: nanoid(),
        get hasPrev() {
          return false;
        },
        store: new EditorStore(),
        get hasNext() {
          return false;
        },
      } as Tab,
      { range: false, id: false },
    );
  }, []);

  const [mount, setMount] = useState(false);

  // 初始化快捷键
  useSystemKeyboard(t.store);

  // 导入外部 hooks
  useImperativeHandle(tabRef, () => t, [t]);

  useEffect(() => {
    t.store.readonly = readonly || false;
  }, [readonly]);

  return (
    <div
      ref={(dom) => {
        t.store.setState((state) => (state.container = dom));
        setMount(true);
      }}
      className="markdown-editor"
      style={{
        width: width || '400px',
        minWidth: readonly ? '200px' : '800px',
        height: height || '80vh',
        padding: props.readonly ? '8px' : '24px 48px',
        display: 'flex',
        maxHeight: '100%',
        overflow: 'auto',
        gap: 24,
        ...style,
      }}
      key={t.id}
    >
      <EditorFrame tab={t} {...rest} />
      {t.current && mount && toc !== false && t.store?.container ? (
        <Heading note={t.current} />
      ) : null}
    </div>
  );
};
