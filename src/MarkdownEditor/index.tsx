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

import { RenderElementProps } from 'slate-react';
import { Elements } from './el';
import './index.css';

export { EditorUtils, parserMdToSchema };

export * from './editor/elements';
export * from './editor/utils';
export * from './el';

export type IFileItem = {
  cid: string;
  root?: boolean;
  children?: IFileItem[];
  expand?: boolean;
  editName?: string;
  changed?: boolean;
  refresh?: boolean;
  ghost?: boolean;
  sort: number;
  schema?: any[];
  history?: any;
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

/**
 * MarkdownEditor 的 props
 * @param props
 */
export type MarkdownEditorProps = {
  width?: string | number;
  height?: string | number;
  initValue?: string;
  readonly?: boolean;
  style?: React.CSSProperties;
  toc?: boolean;
  tabRef?: React.MutableRefObject<Tab | undefined>;
  eleItemRender?: (
    props: RenderElementProps,
    defaultDom: React.ReactNode,
  ) => React.ReactElement;
  initSchemaValue?: Elements[];
  onChange?: (value: string, schema: Elements[]) => void;
};

/**
 * MarkdownEditor
 * @param props
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
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
    if (!props.readonly) {
      list.push(EditorUtils.p);
    }
    const schema =
      props.initSchemaValue ||
      (initValue ? list : JSON.parse(JSON.stringify([EditorUtils.p])));

    const data = {
      cid: nanoid(),
      schema,
      sort: 0,
      lastOpenTime: now,
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
        minWidth: readonly ? '200px' : '400px',
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
      <EditorFrame readonly={readonly} {...rest} tab={t} />
      {t.current && mount && toc !== false && t.store?.container ? (
        <Heading note={t.current} />
      ) : null}
    </div>
  );
};
