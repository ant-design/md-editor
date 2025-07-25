﻿import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import RcResizeObserver from 'rc-resize-observer';
import { useMergedState } from 'rc-util';
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Editor, Transforms } from 'slate';
import { useRefFunction } from '../hooks/useRefFunction';
import {
  BaseMarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
} from '../MarkdownEditor';
import { ReactEditor } from '../MarkdownEditor/editor/slate-react';
import {
  AttachmentButton,
  AttachmentButtonProps,
  upLoadFileToServer,
} from './AttachmentButton';
import { SupportedFileFormats } from './AttachmentButton/AttachmentButtonPopover';
import {
  AttachmentFile,
  AttachmentFileList,
} from './AttachmentButton/AttachmentFileList';
import { SendButton } from './SendButton';
import { useStyle } from './style';
import { Suggestion } from './Suggestion';

/**
 * Markdown 输入字段的属性接口
 *
 * @interface MarkdownInputFieldProps
 * @property {string} [value] - 输入字段的当前文本值
 * @property {function} [onChange] - 当输入值改变时触发的回调函数
 * @property {string} [placeholder] - 输入字段的占位文本
 * @property {React.CSSProperties} [style] - 应用于输入字段的内联样式
 * @property {string} [className] - 应用于输入字段的 CSS 类名
 * @property {boolean} [disabled] - 是否禁用输入字段
 * @property {boolean} [typing] - 用户是否正在输入的状态标志
 * @property {'Enter' | 'Mod+Enter'} [triggerSendKey] - 触发发送操作的键盘快捷键
 * @property {function} [onSend] - 当内容发送时触发的异步回调函数
 */

export type MarkdownInputFieldProps = {
  /**
   * 当前的 markdown 文本值。
   * @example value="# Hello World"
   */
  value?: string;

  /**
   * 当输入值改变时触发的回调函数。
   * @param value The new markdown text value
   * @example onChange={(newValue) => setMarkdown(newValue)}
   */
  onChange?: (value: string) => void;

  /**
   * 输入字段的占位文本。
   * @example placeholder="Type markdown here..."
   */
  placeholder?: string;

  /**
   * 应用于输入字段的内联样式。
   * @example style={{ minHeight: '200px' }}
   */
  style?: React.CSSProperties;

  /**
   * 应用于输入字段的 CSS 类名。
   * @example className="custom-markdown-input"
   */
  className?: string;

  /**
   * 是否禁用输入字段。
   * @example disabled={isSubmitting}
   */
  disabled?: boolean;

  /**
   * 用户是否正在输入的状态标志。
   * @example typing={isComposing}
   */
  typing?: boolean;

  /**
   * 触发发送操作的键盘快捷键。
   * - 'Enter': 回车键触发发送
   * - 'Mod+Enter': 按下 Ctrl/Command + Enter 触发发送
   * @example triggerSendKey="Mod+Enter"
   */
  triggerSendKey?: 'Enter' | 'Mod+Enter';

  /**
   * 当内容发送时触发的异步回调函数。
   * 返回一个 Promise 对象，当发送成功后 resolve。
   * @param value The current markdown text value
   * @example onSend={async (text) => await submitMessage(text)}
   */
  onSend?: (value: string) => Promise<void>;

  /**
   * 正在输入中时点击发送按钮的回调函数。
   * @example onStop={() => console.log('Sending...')}
   */
  onStop?: () => void;

  tagInputProps?: MarkdownEditorProps['tagInputProps'];
  bgColorList?: [string, string, string, string];
  borderRadius?: number;

  /**
   * 附件配置
   * @description 配置附件功能，可以启用或禁用附件上传，并自定义附件按钮的属性
   * @example
   * ```tsx
   * <BubbleChat
   *   attachment={{
   *     enable: true,
   *     accept: '.pdf,.doc,.docx',
   *     maxSize: 10 * 1024 * 1024, // 10MB
   *     onUpload: async (file) => {
   *       const url = await uploadFile(file);
   *       return { url };
   *     }
   *   }}
   * />
   * ```
   */
  attachment?: {
    enable?: boolean;
  } & AttachmentButtonProps;

  /**
   * 自定义操作按钮渲染函数
   * @description 用于自定义渲染输入框右侧的操作按钮区域
   * @param {Object} props - 包含组件所有属性以及当前状态的对象
   * @param {boolean} props.isHover - 当前是否处于悬停状态
   * @param {boolean} props.isLoading - 当前是否处于加载状态
   * @param {'uploading' | 'done' | 'error'} props.fileUploadStatus - 文件上传状态
   * @param {React.ReactNode[]} defaultActions - 默认的操作按钮列表
   * @returns {React.ReactNode[]} 返回要渲染的操作按钮节点数组
   * @example
   * ```tsx
   * <MarkdownInputField
   *   actionsRender={(props, defaultActions) => [
   *     <CustomButton key="custom" />,
   *     ...defaultActions
   *   ]}
   * />
   * ```
   */
  actionsRender?: (
    props: MarkdownInputFieldProps &
      MarkdownInputFieldProps['attachment'] & {
        isHover: boolean;
        isLoading: boolean;
        fileUploadStatus: 'uploading' | 'done' | 'error';
      },
    defaultActions: React.ReactNode[],
  ) => React.ReactNode[];

  /**
   * 自定义工具栏渲染函数
   * @description 用于自定义渲染输入框左侧的工具栏区域
   * @param {Object} props - 包含组件所有属性以及当前状态的对象
   * @param {boolean} props.isHover - 当前是否处于悬停状态
   * @param {boolean} props.isLoading - 当前是否处于加载状态
   * @param {'uploading' | 'done' | 'error'} props.fileUploadStatus - 文件上传状态
   * @returns {React.ReactNode[]} 返回要渲染的工具栏节点数组
   * @example
   * ```tsx
   * <MarkdownInputField
   *   toolsRender={(props) => [
   *     <FormatButton key="format" />,
   *     <EmojiPicker key="emoji" />
   *   ]}
   * />
   * ```
   */
  toolsRender?: (
    props: MarkdownInputFieldProps &
      MarkdownInputFieldProps['attachment'] & {
        isHover: boolean;
        isLoading: boolean;
        fileUploadStatus: 'uploading' | 'done' | 'error';
      },
  ) => React.ReactNode[];

  /**
   * Markdown 编辑器实例的引用
   * @description 用于获取编辑器实例，可以通过该实例调用编辑器的方法
   * @type {React.MutableRefObject<MarkdownEditorInstance | undefined>}
   * @example
   * ```tsx
   * const editorRef = useRef<MarkdownEditorInstance>();
   *
   * <MarkdownInputField
   *   inputRef={editorRef}
   * />
   *
   * // 使用编辑器实例
   * editorRef.current?.store?.clearContent();
   * ```
   */
  inputRef?: React.MutableRefObject<MarkdownEditorInstance | undefined>;

  /**
   * 自定义叶子节点渲染函数
   * @description 用于自定义文本节点的渲染方式，可以控制文本的样式和行为
   * @param props - 叶子节点渲染属性
   * @param defaultDom - 默认的叶子节点渲染结果
   * @returns 自定义的叶子节点渲染结果
   * @example
   * ```tsx
   * <MarkdownInputField
   *   leafRender={(props, defaultDom) => {
   *     if (props.leaf.bold) {
   *       return <strong style={{ color: 'red' }}>{props.children}</strong>;
   *     }
   *     return defaultDom;
   *   }}
   * />
   * ```
   */
  leafRender?: MarkdownEditorProps['leafRender'];
};
/**
 * 根据提供的颜色数组生成边缘颜色序列。
 * 对于数组中的每种颜色，该函数会创建一个新的序列，其中颜色按照循环顺序排列，
 * 并在序列末尾再添加当前颜色。
 *
 * @param colors - 要处理的颜色数组
 * @returns 一个二维数组，每个子数组包含从特定位置开始循环的颜色序列，并在末尾重复当前颜色
 * @example
 * // 返回 [['red', 'blue', 'green', 'red'], ['blue', 'green', 'red', 'blue'], ['green', 'red', 'blue', 'green']]
 * generateEdges(['red', 'blue', 'green'])
 */
export function generateEdges(colors: string[]) {
  return colors.map((current, index) => {
    const rotated = colors.slice(index).concat(colors.slice(0, index));
    return [...rotated, current];
  });
}

/**
 * @component MarkdownInputField
 * @description 带发送功能的Markdown输入字段组件。允许用户编辑Markdown内容并通过按钮或快捷键发送。
 *
 * @param {MarkdownInputFieldProps} props - 组件属性
 * @param {string} [props.value] - 输入字段的Markdown内容值
 * @param {function} [props.onChange] - 当输入内容改变时的回调函数
 * @param {function} [props.onSend] - 当内容发送时的回调函数，应返回Promise
 * @param {boolean} [props.disabled] - 是否禁用输入字段
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.placeholder] - 输入字段的占位文本
 * @param {string} [props.triggerSendKey='Enter'] - 触发发送的键盘快捷键，可以是'Enter'或'Mod+Enter'
 * @param {boolean} [props.typing] - 是否显示正在输入状态
 *
 * @returns {JSX.Element} 带样式和功能的Markdown输入字段组件
 *
 * @example
 * <MarkdownInputField
 *   value="# 标题"
 *   onChange={(value) => console.log(value)}
 *   onSend={(value) => Promise.resolve()}
 *   placeholder="请输入Markdown文本..."
 *   triggerSendKey="Mod+Enter"
 * />
 */
export const MarkdownInputField: React.FC<MarkdownInputFieldProps> = (
  props,
) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-input-field');
  const { wrapSSR, hashId } = useStyle(baseCls);
  const [isHover, setHover] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const markdownEditorRef = React.useRef<MarkdownEditorInstance>();

  const actionsRef = React.useRef<HTMLDivElement>(null);

  const [value, setValue] = useMergedState('', {
    value: props.value,
    onChange: props.onChange,
  });

  const [rightPadding, setRightPadding] = useState(64);

  const [fileMap, setFileMap] = useMergedState<
    Map<string, AttachmentFile> | undefined
  >(undefined, {
    value: props.attachment?.fileMap,
    onChange: props.attachment?.onFileMapChange,
  });

  useEffect(() => {
    if (!markdownEditorRef.current) return;
    markdownEditorRef.current?.store?.setMDContent(value);
  }, [props.value]);

  useImperativeHandle(props.inputRef, () => markdownEditorRef.current);

  // 判断是否所有文件上传完成
  const fileUploadDone = useMemo(() => {
    return fileMap?.size
      ? Array.from(fileMap?.values() || []).every(
          (file) => file.status === 'done',
        )
      : true;
  }, [fileMap]);

  /**
   * 发送消息的函数
   * @description 该函数用于处理发送消息的逻辑，包括调用回调函数和清空输入框。
   * @returns {Promise<void>} 发送操作的Promise
   * @example
   * ```tsx
   * <MarkdownInputField
   *   value="# 示例"
   *   onChange={(value) => console.log(value)}
   *   onSend={(value) => Promise.resolve()}
   * />
   * ```
   */
  const sendMessage = useRefFunction(() => {
    if (props.disabled) return;
    if (props.typing) return;
    const mdValue = markdownEditorRef?.current?.store?.getMDContent();

    // 如果mdValue和value不一致，并且mdValue不为空，则调用onChange
    if (mdValue !== value && mdValue) {
      props.onChange?.(mdValue);
    }

    if (props.onSend && mdValue) {
      setIsLoading(true);
      props
        .onSend(mdValue)
        .then(() => {
          markdownEditorRef?.current?.store?.clearContent();
          props.onChange?.('');
          setValue('');
          setFileMap?.(new Map());
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  });

  /**
   * 生成背景颜色列表
   * @description 该函数用于生成背景颜色列表，默认使用四种颜色。
   * @returns {string[][]} 颜色列表
   */
  const colorList = useMemo(() => {
    return generateEdges(
      props.bgColorList || ['#CD36FF', '#FFD972', '#5EBFFF', '#6FFFA7'],
    );
  }, [props.bgColorList?.join(',')]);

  /**
   * 更新附件文件列表
   */
  const updateAttachmentFiles = useRefFunction(
    (newFileMap?: Map<string, AttachmentFile>) => {
      setFileMap?.(new Map(newFileMap));
    },
  );
  // 默认支持的文件格式
  const supportedFormats = useMemo(() => {
    if (props.attachment?.supportedFormats) {
      return props.attachment.supportedFormats;
    }
    return SupportedFileFormats;
  }, [props.attachment?.supportedFormats]);

  /**
   * 上传图片的函数
   * @description 该函数用于处理图片上传的逻辑，包括创建文件输入框和上传文件到服务器。
   * @returns {Promise<void>} 上传操作的Promise
   */
  const uploadImage = useRefFunction(async () => {
    const input = document.createElement('input');
    input.id = 'uploadImage' + '_' + Math.random();
    input.type = 'file';

    input.accept =
      supportedFormats?.map((item) => item.extensions?.join(',')).join(',') ||
      'image/*';

    input.multiple = true;
    input.style.display = 'none';
    input.onchange = async (e: any) => {
      if (input.dataset.readonly) {
        return;
      }
      input.dataset.readonly = 'true';
      try {
        await upLoadFileToServer(e.target.files, {
          ...props.attachment,
          fileMap,
          onFileMapChange: (newFileMap) => {
            updateAttachmentFiles(newFileMap);
          },
        });
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        input.value = '';
        delete input.dataset.readonly;
      }
    };
    if (input.dataset.readonly) {
      return;
    }
    input.click();
    input.remove();
  });
  /**
   * 构造消息发送操作按钮数组
   *
   * @returns {React.ReactNode[]} 过滤后的操作按钮数组，包括：
   *   - 附件按钮（如果启用）：用于管理文件上传
   *   - 发送按钮：用于发送消息或停止当前操作
   *
   * 根据当前状态，发送按钮有不同行为：
   * - 正在输入或加载时：点击会停止当前操作
   * - 其他情况：点击会发送消息
   *
   * 依赖项包括附件配置、文件上传状态、加载状态、悬停状态、禁用状态、
   * 输入状态、发送消息函数和回调函数等。
   */
  const defaultSendActions = useMemo(() => {
    return [
      props.attachment?.enable ? (
        <AttachmentButton
          uploadImage={uploadImage}
          key="attachment-button"
          {...props.attachment}
          supportedFormats={supportedFormats}
          fileMap={fileMap}
          onFileMapChange={(fileMap) => {
            updateAttachmentFiles(fileMap);
          }}
          disabled={!fileUploadDone}
        />
      ) : null,
      <SendButton
        key="send-button"
        typing={!!props.typing || isLoading}
        isHover={isHover}
        disabled={props.disabled}
        onClick={() => {
          if (props.typing || isLoading) {
            setIsLoading(false);
            props.onStop?.();
            return;
          }
          if (props.onSend) {
            sendMessage();
          }
        }}
      />,
    ].filter(Boolean);
  }, [
    props.attachment,
    fileUploadDone,
    isLoading,
    isHover,
    props.disabled,
    props.typing,
    sendMessage,
    props.onSend,
    props.onStop,
  ]);

  const handleFileRemoval = useRefFunction(async (file: AttachmentFile) => {
    try {
      await props.attachment?.onDelete?.(file);
      const map = new Map(fileMap);
      map.delete(file.uuid!);
      updateAttachmentFiles(map);
    } catch (error) {
      console.error('Error removing file:', error);
    }
  });

  return wrapSSR(
    <Suggestion tagInputProps={props.tagInputProps}>
      <div
        className={classNames(baseCls, hashId, props.className, {
          [`${baseCls}-disabled`]: props.disabled,
          [`${baseCls}-typing`]: false,
          [`${baseCls}-loading`]: isLoading,
        })}
        style={{
          ...props.style,
          borderRadius: props.borderRadius || 12,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onKeyDown={(e) => {
          if (markdownEditorRef?.current?.store.inputComposition) {
            return;
          }
          const { triggerSendKey = 'Enter' } = props;
          if (
            triggerSendKey === 'Enter' &&
            e.key === 'Enter' &&
            !(e.ctrlKey || e.metaKey)
          ) {
            e.stopPropagation();
            e.preventDefault();
            if (props.onSend) {
              sendMessage();
            }
            return;
          }
          if (
            triggerSendKey === 'Mod+Enter' &&
            (e.ctrlKey || e.metaKey) &&
            e.key === 'Enter'
          ) {
            e.stopPropagation();
            e.preventDefault();
            if (props.onSend) {
              sendMessage();
            }
          }
        }}
        onClick={(e) => {
          if (markdownEditorRef?.current?.store.inputComposition) {
            return;
          }
          if (props.disabled) {
            return;
          }
          if (actionsRef.current?.contains(e.target as Node)) {
            return;
          }
          if (
            markdownEditorRef.current?.store?.editor &&
            !ReactEditor.isFocused(markdownEditorRef.current?.store?.editor)
          ) {
            const editor = markdownEditorRef.current?.markdownEditorRef.current;
            if (editor) {
              ReactEditor.focus(editor);
              Transforms.move(editor, { distance: 1, unit: 'offset' });
              Transforms.select(editor, {
                anchor: Editor.end(editor, []),
                focus: Editor.end(editor, []),
              });
            }
          }
        }}
      >
        <div
          className={classNames(`${baseCls}-background`, hashId, {
            [`${baseCls}-hover`]: isHover,
          })}
          style={{
            minHeight: props.style?.minHeight || 0,
            height: props.style?.height || '100%',
            width: props.style?.width || '100%',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            fill="none"
            version="1.1"
            width="100%"
            style={{
              borderRadius: 'inherit',
            }}
            height="100%"
          >
            <defs>
              <linearGradient
                x1="2.463307335887066e-16"
                y1="0.5"
                x2="0.9838055372238159"
                y2="0.5"
                id="master_svg1_55_47405"
              >
                {colorList.map((color, index) => {
                  return (
                    <stop
                      key={index}
                      offset={`${(index * 100) / colorList.length}%`}
                      stopColor={color[0]}
                      stopOpacity="0.6300000071525574"
                    >
                      <animate
                        attributeName="stop-color"
                        values={`${color[0]}; ${color[1]}; ${color[2]}; ${color[3]};${color[0]}`}
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </stop>
                  );
                })}
              </linearGradient>
            </defs>
            <g>
              <rect
                x={0}
                y={0}
                width="100%"
                height="100%"
                fill="url(#master_svg1_55_47405)"
              />
            </g>
          </svg>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: '#fff',
            width: '100%',
            display: 'flex',
            zIndex: 9,
            flexDirection: 'column',
            boxSizing: 'border-box',
            borderRadius: (props.borderRadius || 12) - 2 || 10,
            cursor: isLoading || props.disabled ? 'not-allowed' : 'auto',
            opacity: isLoading || props.disabled ? 0.5 : 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: (props.borderRadius || 12) - 2 || 10,
              maxHeight: `max(${(Number(props.style?.maxHeight) || 180) + (props.attachment?.enable ? 90 : 0)}px,100%)`,
              flex: 1,
            }}
            className={classNames(`${baseCls}-editor`, hashId, {
              [`${baseCls}-editor-hover`]: isHover,
              [`${baseCls}-editor-disabled`]: props.disabled,
            })}
          >
            {useMemo(() => {
              return props.attachment?.enable ? (
                <AttachmentFileList
                  fileMap={fileMap}
                  onDelete={handleFileRemoval}
                  onClearFileMap={() => {
                    updateAttachmentFiles(new Map());
                  }}
                />
              ) : null;
            }, [fileMap?.values(), props.attachment?.enable])}

            <BaseMarkdownEditor
              editorRef={markdownEditorRef}
              leafRender={props.leafRender}
              style={
                props.toolsRender
                  ? {
                      width: '100%',
                      flex: 1,
                      padding: 4,
                    }
                  : {
                      width: '100%',
                      flex: 1,
                      padding: 4,
                      paddingRight: rightPadding || 52,
                    }
              }
              readonly={isLoading}
              contentStyle={{
                padding: '8px',
              }}
              textAreaProps={{
                enable: true,
                placeholder: props.placeholder,
                triggerSendKey: props.triggerSendKey || 'Enter',
              }}
              tagInputProps={
                props.tagInputProps || {
                  enable: true,
                  items: [
                    {
                      key: 'Bold',
                      label: 'Bold',
                    },
                  ],
                }
              }
              initValue={props.value}
              onChange={(value) => {
                setValue(value);
                props.onChange?.(value);
              }}
              titlePlaceholderContent={props.placeholder}
              toc={false}
              toolBar={{
                enable: false,
              }}
              floatBar={{
                enable: false,
              }}
            />
          </div>
          {props.toolsRender ? (
            <div
              style={{
                display: 'flex',
                boxSizing: 'border-box',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                width: '100%',
                minHeight: 42,
                paddingRight: 8,
                paddingLeft: 8,
              }}
            >
              {props.toolsRender ? (
                <div
                  ref={actionsRef}
                  contentEditable={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className={classNames(`${baseCls}-send-tools`, hashId)}
                >
                  {props.toolsRender
                    ? props.toolsRender({
                        value,
                        fileMap,
                        onFileMapChange: setFileMap,
                        ...props,
                        isHover,
                        isLoading,
                        fileUploadStatus: fileUploadDone ? 'done' : 'uploading',
                      })
                    : []}
                </div>
              ) : null}
              <RcResizeObserver
                onResize={(e) => {
                  setRightPadding(e.offsetWidth);
                }}
              >
                <div
                  ref={actionsRef}
                  contentEditable={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className={classNames(
                    `${baseCls}-send-actions`,
                    {
                      [`${baseCls}-send-has-tools`]: props.toolsRender,
                    },
                    hashId,
                  )}
                >
                  {props.actionsRender
                    ? props.actionsRender(
                        {
                          value,
                          ...props,
                          fileMap,
                          onFileMapChange: setFileMap,
                          isHover,
                          isLoading,
                          fileUploadStatus: fileUploadDone
                            ? 'done'
                            : 'uploading',
                        },
                        defaultSendActions,
                      )
                    : defaultSendActions}
                </div>
              </RcResizeObserver>
            </div>
          ) : (
            <RcResizeObserver
              onResize={(e) => {
                setRightPadding(e.offsetWidth);
              }}
            >
              <div
                ref={actionsRef}
                contentEditable={false}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className={classNames(
                  `${baseCls}-send-actions`,
                  {
                    [`${baseCls}-send-has-tools`]: props.toolsRender,
                  },
                  hashId,
                )}
              >
                {props.actionsRender
                  ? props.actionsRender(
                      {
                        value,
                        ...props,
                        fileMap,
                        onFileMapChange: setFileMap,
                        isHover,
                        isLoading,
                        fileUploadStatus: fileUploadDone ? 'done' : 'uploading',
                      },
                      defaultSendActions,
                    )
                  : defaultSendActions}
              </div>
            </RcResizeObserver>
          )}
        </div>
      </div>
    </Suggestion>,
  );
};
