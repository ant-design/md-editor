import { observable } from 'mobx';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';
import { EditorFrame } from './editor/EditorFrame';
import { parserMdToSchema } from './editor/parser/parser';
import { EditorStore } from './editor/store';
import { EditorUtils } from './editor/utils/editorUtils';
import { useSystemKeyboard } from './editor/utils/keyboard';
import './index.css';

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
}> = (props) => {
  const t = useMemo(() => {
    const now = Date.now();
    const list = parserMdToSchema(props.initValue!)?.schema;
    list.push(EditorUtils.p);
    const data = {
      cid: nanoid(),
      filePath: 'new.md',
      folder: false,
      schema: props.initValue
        ? list
        : JSON.parse(JSON.stringify([EditorUtils.p])),
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

  useSystemKeyboard(t.store);

  return (
    <div
      ref={(dom) => {
        t.store.setState((state) => (state.container = dom));
      }}
      style={{
        contentVisibility: 'inherit',
        width: props.width || '400px',
        minWidth: 300,
        height: props.height || 'auto',
        padding: '12px 24px',
        display: 'flex',
        maxHeight: '100%',
        overflow: 'auto',
        gap: 24,
      }}
      key={t.id}
    >
      <EditorFrame tab={t} />
    </div>
  );
};
