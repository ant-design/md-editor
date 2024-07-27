import {
  CheckSquareOutlined,
  CodeOutlined,
  FileAddOutlined,
  FontSizeOutlined,
  OrderedListOutlined,
  PlayCircleOutlined,
  SwapRightOutlined,
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
import { KeyboardTask, Methods, keyTask$ } from '../utils/keyboard';
import { getRemoteMediaType } from '../utils/media';
import { useLocalState } from '../utils/useLocalState';

type InsertOptions = {
  label: [string, string];
  key: string;
  children: {
    label: [string, string];
    key: string;
    task: Methods<KeyboardTask> | 'attachment';
    args?: any[];
    icon?: React.ReactNode;
  }[];
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
          icon: <TableOutlined className={'text-base'} />,
        },
        {
          label: ['引用', 'Quote'],
          key: 'quote',
          task: 'insertQuote',
          icon: <SwapRightOutlined className={'text-base'} />,
        },
        {
          label: ['代码', 'Code'],
          key: 'code',
          task: 'insertCode',
          icon: <CodeOutlined className={'text-base'} />,
        },
      ],
    },
    {
      label: ['媒体', 'media'],
      key: 'media',
      children: [
<<<<<<< HEAD
        // {
        //   label: ['远程媒体', 'Media link'],
        //   task: 'image',
        //   key: 'media-link',
        //   args: ['', true],
        //   icon: <VideoCameraAddOutlined className={'text-base'} />,
        // },
=======
>>>>>>> b58106c (support auto focus)
        {
          label: ['附件', 'Attachment'],
          task: 'attachment',
          key: 'attachment',
          icon: <FileAddOutlined className={'text-base'} />,
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
          icon: <UnorderedListOutlined className={'text-base'} />,
        },
        {
          label: ['有序列表', 'Numbered list'],
          task: 'list',
          key: 'n-list',
          args: ['ordered'],
          icon: <OrderedListOutlined className={'text-base'} />,
        },
        {
          label: ['任务列表', 'Todo list'],
          task: 'list',
          key: 't-list',
          args: ['task'],
          icon: <CheckSquareOutlined className={'text-base'} />,
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
          label: ['标题 1', 'Heading 1'],
          task: 'head',
          key: 'head1',
          args: [1],
          icon: <FontSizeOutlined className={'text-base'} />,
        },
        {
          label: ['标题2', 'Heading 2'],
          task: 'head',
          key: 'head2',
          icon: <FontSizeOutlined className={'text-base'} />,
          args: [2],
        },
        {
          label: ['标题3', 'Heading 3'],
          task: 'head',
          key: 'head3',
          icon: <FontSizeOutlined className={'text-base'} />,
          args: [3],
        },
      ],
    });
  }
  return options;
};

export const InsertAutocomplete = observer(() => {
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

  const insert = useCallback((op: InsertOptions['children'][number]) => {
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
  }, []);

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
        insert(op);
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
          if (
            top >
            store.container!.scrollTop +
              store.container!.clientHeight -
              212 -
              el.clientHeight
          ) {
            setState({
              top: undefined,
              bottom: -(top - store.container!.clientHeight),
              left: getOffsetLeft(el, store.container!),
            });
          } else {
            setState({
              left: getOffsetLeft(el, store.container!),
              top: top + el.clientHeight,
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

  const baseClassName = 'insert-autocomplete';
  return (
    <div
      ref={dom}
      className={baseClassName}
      style={{
        position: 'absolute',
        zIndex: 50,
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
              {i !== 0 && (
                <Divider
                  style={{
                    margin: '4px 0',
                    color: 'rgba(0,0,0,0.1)',
                  }}
                />
              )}
              {l.children.map((el) => (
                <div
                  className={`${baseClassName}-item`}
                  key={el.key}
                  data-action={el.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    insert(state.options[state.index]);
                  }}
                  onMouseEnter={() => {
                    setState({
                      index: state.options.findIndex((op) => op.key === el.key),
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
                      el.key === selectedKey ? 'rgba(0,0,0,0.1)' : '',
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
          className={'py-3 px-1'}
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
            className={'mt-4'}
            size={'small'}
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
                      onChange={(e) => setState({ insertUrl: e.target.value })}
                    />
                    <Button
                      block={true}
                      loading={state.loading}
                      type={'primary'}
                      className={'mt-4'}
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
});
