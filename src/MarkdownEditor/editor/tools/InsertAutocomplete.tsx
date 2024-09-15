import {
  CheckSquareOutlined,
  CodeOutlined,
  FontSizeOutlined,
  OrderedListOutlined,
  PlayCircleOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Divider, Input, Tabs } from 'antd';
import isHotkey from 'is-hotkey';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Editor, Element, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { useSubject } from '../../hooks/subscribe';
import { selChange$ } from '../plugins/useOnchange';
import { useEditorStore } from '../store';
import { getOffsetLeft, getOffsetTop } from '../utils/dom';
import { EditorUtils } from '../utils/editorUtils';
import { keyTask$ } from '../utils/keyboard';
import { getRemoteMediaType } from '../utils/media';
import { useLocalState } from '../utils/useLocalState';

const ImageIcon = () => {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" width="1em" height="1em">
      <path
        fill="currentColor"
        d="M0 128l0 768 1024 0L1024 128 0 128zM944 816 80 816 80 208l864 0L944 816zM704 368c0 53.024 42.976 96 96 96 53.024 0 96-42.976 96-96 0-53.024-42.976-96-96-96C746.976 272 704 314.976 704 368M888 760l-192-288-128 96-240-304-192 496L888 760z"
      />
    </svg>
  );
};

const Quote = () => {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" width="1em" height="1em">
      <path
        d="M128 472.896h341.344v341.344H128zM128 472.896L272.096 192h110.08l-144.128 280.896z"
        fill="currentColor"
      ></path>
      <path
        d="M544 472.896h341.344v341.344H544zM544 472.896L688.096 192h110.08l-144.128 280.896z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

const ColumnIcon = () => {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" width="1em" height="1em">
      <path
        fill="currentColor"
        d="M880 112c17.7 0 32 14.3 32 32v736c0 17.7-14.3 32-32 32H144c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32z m-404 72H184v656h292V184z m364 0H548v656h292V184z"
      />
    </svg>
  );
};

export type InsertAutocompleteItem = {
  label: string[];
  key: string;
  task: any;
  icon: React.ReactNode;
  args?: any[];
};

export type InsertOptions = {
  label: [string, string];
  key: string;
  children: InsertAutocompleteItem[];
};

const replaceUrl = [
  {
    reg: /https?:\/\/youtu.be\/([\w-]+)(\?si=\w+)?/i,
    replace: (match: RegExpMatchArray) => {
      return `https://www.youtube.com/embed/${match[1]}${match[2] || ''}`;
    },
  },
  {
    reg: /https?:\/\/www.bilibili.com\/video\/([\w-]+)\/?/,
    replace: (match: RegExpMatchArray) => {
      return `https://player.bilibili.com/player.html?isOutside=true&bvid=${match[1]}`;
    },
  },
  {
    reg: /src=["']([^"\n]+)["']/i,
    replace: (match: RegExpMatchArray) => {
      return match[1];
    },
  },
];

export const getInsertOptions: (ctx: { isTop: boolean }) => InsertOptions[] = (
  ctx,
) => {
  const options: InsertOptions[] = [
    {
      label: ['元素', 'Elements'],
      key: 'element',
      children: [
        {
          label: ['表格', 'Table'],
          key: 'table',
          task: 'insertTable',
          icon: <TableOutlined />,
        },
        {
          label: ['分栏', 'Column'],
          key: 'column',
          task: 'insertColumn',
          icon: <ColumnIcon />,
        },
        {
          label: ['引用', 'Quote'],
          key: 'quote',
          task: 'insertQuote',
          icon: <Quote />,
        },
        {
          label: ['代码', 'Code'],
          key: 'code',
          task: 'insertCode',
          icon: <CodeOutlined />,
        },
      ],
    },
    {
      label: ['媒体', 'media'],
      key: 'media',
      children: [
        {
          label: ['本地图片', 'Local image'],
          task: 'uploadImage',
          key: 'localeImage',
          args: ['', true],
          icon: <ImageIcon />,
        },
      ],
    },
    {
      label: ['列表', 'List'],
      key: 'list',
      children: [
        {
          label: ['无序列表', 'Bulleted list'],
          task: 'list',
          key: 'b-list',
          args: ['unordered'],
          icon: <UnorderedListOutlined />,
        },
        {
          label: ['有序列表', 'Numbered list'],
          task: 'list',
          key: 'n-list',
          args: ['ordered'],
          icon: <OrderedListOutlined />,
        },
        {
          label: ['任务列表', 'Todo list'],
          task: 'list',
          key: 't-list',
          args: ['task'],
          icon: <CheckSquareOutlined />,
        },
      ],
    },
  ];
  if (ctx.isTop) {
    options.splice(2, 0, {
      label: ['标题', 'Heading'],
      key: 'head',
      children: [
        {
          label: ['主标题', 'Heading 1'],
          task: 'head',
          key: 'head1',
          args: [1],
          icon: <FontSizeOutlined />,
        },
        {
          label: ['段标题', 'Heading 2'],
          task: 'head',
          key: 'head2',
          icon: <FontSizeOutlined />,
          args: [2],
        },
        {
          label: ['小标题', 'Heading 3'],
          task: 'head',
          key: 'head3',
          icon: <FontSizeOutlined />,
          args: [3],
        },
      ],
    });
  }
  return options;
};

/**
 * 插入自动完成组件的属性接口。
 *
 * @interface InsertAutocompleteProps
 * @property {InsertAutocompleteItem[]} [insertOptions] - 可选的插入选项数组。
 * @property {(task: InsertAutocompleteItem) => Promise<boolean>} [runInsertTask] - 执行插入任务的函数，接受一个插入选项作为参数，返回一个 Promise，表示任务是否成功。
 */
export interface InsertAutocompleteProps {
  /**
   * 可选的插入选项数组。
   */
  insertOptions?: InsertAutocompleteItem[];
  /**
   * 执行插入任务的函数，接受一个插入选项作为参数，返回一个 Promise，表示任务是否成功。
   * @param task
   * @returns
   */
  runInsertTask?: (
    task: InsertAutocompleteItem,
    offset: {
      x: number;
      y: number;
    },
  ) => Promise<boolean>;
}

export const InsertAutocomplete: React.FC<InsertAutocompleteProps> = observer(
  (props) => {
    const store = useEditorStore();
    const dom = useRef<HTMLDivElement>(null);
    const ctx = useRef<{
      path: number[];
      isTop: boolean;
    }>({ path: [], isTop: true });
    const [state, setState] = useLocalState({
      index: 0,
      filterOptions: [] as InsertOptions[],
      options: [] as InsertOptions['children'],
      left: 0,
      insertLink: false,
      insertAttachment: false,
      loading: false,
      insertUrl: '',
      top: 0 as number | undefined,
      bottom: 0 as number | undefined,
      text: '',
    });
    const selectedKey = useMemo(() => {
      return state.options[state.index]?.key;
    }, [state.index, state.options, state.text]);

    const clickClose = useCallback((e: Event) => {
      if (!dom.current?.contains(e.target as HTMLElement)) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        close();
      }
    }, []);

    const close = useCallback(() => {
      setState({
        filterOptions: [],
        options: [],
        index: 0,
        text: '',
        insertLink: false,
        insertAttachment: false,
        insertUrl: '',
      });
      window.removeEventListener('click', clickClose);
    }, []);

    const runInsertTask = useCallback(
      async (
        op: InsertOptions['children'][number],
        params?: {
          isCustom?: boolean;
        },
      ) => {
        if (params?.isCustom) {
          Transforms.delete(store.editor, {
            at: ctx.current.path,
          });
          await props.runInsertTask?.(op, {
            x: state.left,
            y: state.top || state.bottom || 0,
          });
          runInAction(() => {
            store.openInsertCompletion = false;
          });
          close();
          return;
        }
        //@ts-ignore
        if (op.task === 'image' || op.task === 'attachment') {
          //@ts-ignore
          if (op.task === 'image') {
            setState({ insertLink: true });
            setTimeout(() => {
              dom.current?.querySelector('input')?.focus();
            }, 30);
          } else {
            setState({ insertAttachment: true });
          }
        } else if (op) {
          Transforms.insertText(store.editor, '', {
            at: {
              anchor: Editor.start(store.editor, ctx.current.path),
              focus: Editor.end(store.editor, ctx.current.path),
            },
          });
          keyTask$.next({
            key: op.task,
            args: op.args,
          });
          runInAction(() => {
            store.openInsertCompletion = false;
          });
          close();
        }
      },
      [],
    );

    const insertAttachByLink = useCallback(async () => {
      setState({ loading: true });
      try {
        let url = state.insertUrl;
        let size = 0;
        let name = url;
        if (/^https?:\/\//.test(url)) {
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error();
          }
          size = Number(res.headers.get('content-length') || 0);
          const match = url.match(/([\w_-]+)\.\w+$/);
          if (match) {
            name = match[1];
          }
        }
        Transforms.insertText(store.editor, '', {
          at: {
            anchor: Editor.start(store.editor, ctx.current.path),
            focus: Editor.end(store.editor, ctx.current.path),
          },
        });
        const node = {
          type: 'attach',
          name,
          url,
          size,
          children: [{ text: '' }],
        };
        Transforms.setNodes(store.editor, node, { at: ctx.current.path });
        EditorUtils.focus(store.editor);
        const next = Editor.next(store.editor, { at: ctx.current.path });
        if (next?.[0].type === 'paragraph' && !Node.string(next[0])) {
          Transforms.delete(store.editor, { at: next[1] });
        }
        const [m] = Editor.nodes(store.editor, {
          match: (n) => !!n.type,
          mode: 'lowest',
        });
        selChange$.next({ node: m, sel: store.editor.selection });
        close();
      } finally {
        setState({ loading: false });
      }
    }, []);

    const keydown = useCallback((e: KeyboardEvent) => {
      if (
        state.options.length &&
        (e.key === 'ArrowUp' || e.key === 'ArrowDown')
      ) {
        e.preventDefault();
        if (e.key === 'ArrowUp' && state.index > 0) {
          setState({ index: state.index - 1 });
          const key = state.options[state.index].key;
          const target = document.querySelector(
            `[data-action="${key}"]`,
          ) as HTMLDivElement;
          if (target && dom.current!.scrollTop > target.offsetTop) {
            dom.current!.scroll({
              top: dom.current!.scrollTop - 160 + 30,
            });
          }
        }
        if (e.key === 'ArrowDown' && state.index < state.options.length - 1) {
          setState({ index: state.index + 1 });
          const key = state.options[state.index].key;
          const target = document.querySelector(
            `[data-action="${key}"]`,
          ) as HTMLDivElement;
          if (
            target &&
            target.offsetTop >
              dom.current!.scrollTop + dom.current!.clientHeight - 30
          ) {
            dom.current!.scroll({
              top: target.offsetTop - 30,
            });
          }
        }
      }
      if (e.key === 'Enter' && store.openInsertCompletion) {
        const op = state.options[state.index];
        if (op) {
          e.preventDefault();
          e.stopPropagation();
          runInsertTask(op);
        }
      }
      if (isHotkey('esc', e)) {
        runInAction(() => {
          store.openInsertCompletion = false;
        });
        EditorUtils.focus(store.editor);
      }
    }, []);

    /**
     * 插入媒体
     */
    const insertMedia = useCallback(async () => {
      setState({ loading: true });
      try {
        let url = state.insertUrl;
        for (const r of replaceUrl) {
          const m = url.match(r.reg);
          if (m) {
            url = r.replace(m);
            break;
          }
        }
        if (!/^(\w+:)?\/\//.test(url)) {
          throw new Error();
        }
        const type = await getRemoteMediaType(url);
        if (!type) {
          throw new Error();
        }
        Transforms.insertText(store.editor, '', {
          at: {
            anchor: Editor.start(store.editor, ctx.current.path),
            focus: Editor.end(store.editor, ctx.current.path),
          },
        });
        const node = { type: 'media', url, children: [{ text: '' }] };
        Transforms.setNodes(store.editor, node, { at: ctx.current.path });
        EditorUtils.focus(store.editor);
        const [n] = Editor.nodes(store.editor, {
          match: (n) => !!n.type,
          mode: 'lowest',
        });
        selChange$.next({
          sel: store.editor.selection,
          node: n,
        });
        close();
      } finally {
        setState({ loading: false });
      }
    }, []);

    useSubject(store.insertCompletionText$, (text) => {
      let tempText = text || '';
      const insertOptions = getInsertOptions({
        isTop: ctx.current.isTop,
      });
      let filterOptions: InsertOptions[] = [];
      let options: InsertOptions['children'] = [];
      if (tempText) {
        for (let item of insertOptions) {
          const ops = item.children.filter((op) => {
            return op.label.some((l) =>
              l.toLowerCase().includes(tempText.toLowerCase()),
            );
          });
          options.push(...ops);
          if (ops.length) {
            filterOptions.push({
              ...item,
              children: ops,
            });
          }
        }
      } else {
        filterOptions = insertOptions;
        options = insertOptions.reduce(
          (a, b) => a.concat(b.children),
          [] as InsertOptions['children'],
        );
      }
      if (props.insertOptions && props?.insertOptions?.length) {
        filterOptions.unshift({
          label: ['快捷设置', 'My Quick'],
          key: 'quick',
          children: props.insertOptions,
        });
      }
      setState({
        index: 0,
        text: tempText,
        options,
        filterOptions,
      });
    });

    useEffect(() => {
      if (store.openInsertCompletion) {
        const [node] = Editor.nodes<any>(store.editor, {
          match: (n) => Element.isElement(n),
          mode: 'lowest',
        });
        ctx.current = {
          path: node[1],
          isTop: EditorUtils.isTop(store.editor, node[1]),
        };
        window.addEventListener('keydown', keydown);
        if (node[0].type === 'paragraph') {
          const el = ReactEditor.toDOMNode(store.editor, node[0]);
          if (el) {
            let top = getOffsetTop(el, store.container!);
            console.log(top - store.container!.scrollTop);

            if (
              top >
              store.container!.scrollTop +
                store.container!.scrollHeight -
                212 -
                el.clientHeight
            ) {
              setState({
                top: undefined,
                bottom: -(top - store.container!.scrollTop),
                left: getOffsetLeft(el, store.container!),
              });
            } else {
              setState({
                left: getOffsetLeft(el, store.container!),
                top: top - store.container!.scrollTop,
                bottom: undefined,
              });
            }
          }
        }
        setTimeout(() => {
          dom.current?.scroll({ top: 0 });
        });
        window.addEventListener('click', clickClose);
      } else {
        window.removeEventListener('keydown', keydown);
        close();
      }
    }, [store.openInsertCompletion]);

    const baseClassName = 'md-editor-insert-autocomplete';

    return (
      <div
        ref={dom}
        className={baseClassName}
        style={{
          position: 'absolute',
          zIndex: 50,
          backdropFilter: 'blur(4px)',
          display:
            !store.openInsertCompletion || !state.filterOptions.length
              ? 'none'
              : 'flex',
          width: state.insertLink || state.insertAttachment ? 320 : 160,
          maxHeight: 212,
          overflowY: 'auto',
          padding: 4,
          borderRadius: 4,
          paddingTop: 2,
          color: 'rgba(0,0,0,0.9)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(0,0,0,0.1)',
          left: state.left,
          top: state.top,
          bottom: state.bottom,
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        {!state.insertLink && !state.insertAttachment && (
          <>
            <div
              className={`${baseClassName}-title`}
              style={{
                color: 'rgba(0,0,0,0.8)',
                fontSize: 12,
                marginBottom: 4,
              }}
            >
              快速插入
            </div>
            {state.filterOptions.map((l, i) => (
              <React.Fragment key={l.key}>
                {i !== 0 &&
                  l.children.filter((o) => {
                    if (!store.editorProps?.image && o.task === 'uploadImage') {
                      return false;
                    }
                    return true;
                  }).length > 0 && (
                    <Divider
                      style={{
                        margin: '4px 0',
                        color: 'rgba(0,0,0,0.1)',
                      }}
                    />
                  )}
                {l.children
                  .filter((o) => {
                    if (!store.editorProps?.image && o.task === 'uploadImage') {
                      return false;
                    }
                    return true;
                  })
                  .map((el) => (
                    <div
                      className={`${baseClassName}-item`}
                      key={el.key}
                      data-action={el.key}
                      onClick={(e) => {
                        e.stopPropagation();
                        const task = state.options[state.index];
                        if (!task) {
                          const myInsertOptions = props?.insertOptions?.find?.(
                            (o) => o.key === el.key,
                          );
                          if (!myInsertOptions) return;
                          runInsertTask(myInsertOptions, {
                            isCustom: true,
                          });
                          return;
                        }
                        runInsertTask(task);
                      }}
                      onMouseEnter={() => {
                        setState({
                          index: state.options.findIndex(
                            (op) => op.key === el.key,
                          ),
                        });
                      }}
                      style={{
                        borderRadius: 4,
                        padding: '4px 8px',
                        color: 'rgba(0,0,0,0.8)',
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        backgroundColor:
                          el.key === selectedKey
                            ? 'rgb(229 231 235 / 0.65)'
                            : '',
                      }}
                    >
                      {el.icon}
                      <span>{el.label[0]}</span>
                    </div>
                  ))}
              </React.Fragment>
            ))}
          </>
        )}
        {state.insertLink && (
          <div
            style={{
              padding: 8,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: 'rgba(0,0,0,0.8)',
                marginBottom: 4,
                display: 'flex',
                alignContent: 'center',
                gap: 4,
              }}
            >
              <PlayCircleOutlined />
              <span>Embed media links</span>
            </div>
            <Input
              placeholder={'Paste media link'}
              onMouseDown={(e) => e.stopPropagation()}
              value={state.insertUrl}
              onKeyDown={(e) => {
                if (isHotkey('enter', e)) {
                  insertMedia();
                }
              }}
              onChange={(e) => setState({ insertUrl: e.target.value })}
            />
            <Button
              block={true}
              loading={state.loading}
              type={'primary'}
              size={'small'}
              style={{
                marginTop: '1em',
              }}
              onClick={insertMedia}
              disabled={!state.insertUrl}
            >
              Embed
            </Button>
          </div>
        )}
        {state.insertAttachment && (
          <div
            style={{
              width: 320,
              padding: 8,
            }}
          >
            <Tabs
              size={'small'}
              items={[
                {
                  label: 'Local',
                  key: 'local',
                  children: (
                    <div>
                      <Button
                        block={true}
                        size={'small'}
                        type={'primary'}
                        onClick={() => {
                          Transforms.insertText(store.editor, '', {
                            at: {
                              anchor: Editor.start(
                                store.editor,
                                ctx.current.path,
                              ),
                              focus: Editor.end(store.editor, ctx.current.path),
                            },
                          });
                          setState({ insertUrl: '' });
                          insertAttachByLink();
                        }}
                      >
                        Choose a file
                      </Button>
                    </div>
                  ),
                },
                {
                  label: 'Embed Link',
                  key: 'embed',
                  children: (
                    <div>
                      <Input
                        placeholder={'Paste attachment link'}
                        onMouseDown={(e) => e.stopPropagation()}
                        value={state.insertUrl}
                        onKeyDown={(e) => {
                          if (isHotkey('enter', e)) {
                            insertAttachByLink();
                          }
                        }}
                        onChange={(e) =>
                          setState({ insertUrl: e.target.value })
                        }
                      />
                      <Button
                        block={true}
                        loading={state.loading}
                        type={'primary'}
                        style={{
                          marginTop: '1em',
                        }}
                        size={'small'}
                        onClick={insertAttachByLink}
                        disabled={!state.insertUrl}
                      >
                        Embed
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    );
  },
);
