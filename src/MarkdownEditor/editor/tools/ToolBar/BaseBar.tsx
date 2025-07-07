/* eslint-disable @typescript-eslint/no-use-before-define */
import { PlusCircleFilled } from '@ant-design/icons';
import { Divider, Dropdown } from 'antd';
import classnames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { I18nContext } from '../../../../i18n';
import { useEditorStore } from '../../store';
import { getInsertOptions } from '../InsertAutocomplete';
import type { ToolsKeyType as ConfigToolsKeyType } from './config/toolsConfig';
import { toolsConfig } from './config/toolsConfig';
import { useToolBarLogic } from './hooks/useToolBarLogic';

// Components
import { ClearFormatButton } from './components/ClearFormatButton';
import { ColorPickerButton } from './components/ColorPickerButton';
import { FormatButton } from './components/FormatButton';
import { FormattingTools } from './components/FormattingTools';
import { HeadingDropdown } from './components/HeadingDropdown';
import { LinkButton } from './components/LinkButton';
import { ToolBarItem } from './components/ToolBarItem';
import { UndoRedoButtons } from './components/UndoRedoButtons';

export type ToolsKeyType = ConfigToolsKeyType;

/**
 * 基础工具栏
 */
export const BaseToolBar = React.memo<{
  prefix?: string;
  showInsertAction?: boolean;
  extra?: React.ReactNode[];
  min?: boolean;
  readonly?: boolean;
  hashId?: string;
  hideTools?: ToolsKeyType[];
  showEditor?: boolean;
}>((props) => {
  const baseClassName = props.prefix || `toolbar-action`;
  const { hashId } = props;

  const {
    markdownEditorRef,
    keyTask$,
    editorProps,
    openInsertLink$,
    domRect,
    store,
    setDomRect,
    refreshFloatBar,
  } = useEditorStore();

  const i18n = useContext(I18nContext);

  const toolBarLogic = useToolBarLogic({
    markdownEditorRef,
    keyTask$,
    store,
    openInsertLink$,
    setDomRect,
    refreshFloatBar,
    domRect,
  });

  const {
    currentNode,
    highColor,
    isCodeNode,
    isFormatActive,
    isHighColorActive,
    isLinkActive,
    handleUndo,
    handleRedo,
    handleClearFormat,
    handleFormat,
    handleHeadingChange,
    handleColorChange,
    handleToggleHighColor,
    handleToolClick,
    handleInsertLink,
    handleInsert,
  } = toolBarLogic;

  // 插入选项
  const insertOptions = useMemo(
    () =>
      getInsertOptions(
        {
          isTop: false,
        },
        i18n.locale,
      )
        .map((o) => o?.children)
        .flat(1)
        .filter((o) => {
          if (!editorProps?.image && o.task === 'uploadImage') {
            return false;
          }
          return true;
        })
        .filter((o) => {
          if (props.showInsertAction) {
            return true;
          }
          if (o.task === 'list') {
            return true;
          }
          return false;
        }),
    [editorProps, props.showInsertAction, i18n.locale],
  );

  // 插入选项元素
  const insertOptionElements = useMemo(
    () =>
      insertOptions.map((t) => (
        <ToolBarItem
          key={t.key}
          title={t.label.join(' ')}
          icon={t.icon}
          onClick={() => handleInsert(t)}
          className={classnames(`${baseClassName}-item`, hashId)}
        />
      )),
    [insertOptions, handleInsert, baseClassName, hashId],
  );

  // 检查是否显示链接按钮
  const shouldShowLinkButton = useMemo(() => {
    return (
      currentNode &&
      ['head', 'paragraph', 'quote', 'b-list', 'n-list', 't-list'].includes(
        currentNode?.[0]?.type as ToolsKeyType,
      )
    );
  }, [currentNode]);

  // 检查是否显示标题下拉框
  const shouldShowHeadingDropdown = useMemo(() => {
    return ['head', 'paragraph'].includes(currentNode?.[0]?.type);
  }, [currentNode]);

  // 渲染常规工具栏
  const renderFullToolbar = useMemo(() => {
    const elements: React.ReactNode[] = [];

    // 撤销重做按钮
    if (props.showEditor) {
      elements.push(
        <UndoRedoButtons
          key="undo-redo"
          baseClassName={baseClassName}
          hashId={hashId}
          i18n={i18n}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />,
      );
    }

    // 清除格式按钮
    elements.push(
      <ClearFormatButton
        key="clear"
        baseClassName={baseClassName}
        hashId={hashId}
        i18n={i18n}
        onClear={handleClearFormat}
      />,
    );

    // 格式化按钮
    elements.push(
      <FormatButton
        key="format"
        baseClassName={baseClassName}
        hashId={hashId}
        i18n={i18n}
        onFormat={handleFormat}
      />,
    );

    // 标题下拉框
    if (shouldShowHeadingDropdown) {
      elements.push(
        <HeadingDropdown
          key="heading"
          baseClassName={baseClassName}
          hashId={hashId}
          i18n={i18n}
          node={currentNode}
          hideTools={props.hideTools}
          onHeadingChange={handleHeadingChange}
        />,
      );
    }

    // 颜色选择器
    elements.push(
      <ColorPickerButton
        key="color"
        baseClassName={baseClassName}
        hashId={hashId}
        i18n={i18n}
        highColor={highColor}
        isHighColorActive={isHighColorActive}
        onColorChange={handleColorChange}
        onToggleHighColor={handleToggleHighColor}
      />,
    );

    // 插入选项
    elements.push(...insertOptionElements);

    // 格式化工具
    elements.push(
      <FormattingTools
        key="formatting"
        baseClassName={baseClassName}
        hashId={hashId}
        i18n={i18n}
        tools={toolsConfig}
        editor={markdownEditorRef.current}
        isCodeNode={isCodeNode()}
        onToolClick={handleToolClick}
        isFormatActive={isFormatActive}
      />,
    );

    // 链接按钮
    if (shouldShowLinkButton) {
      elements.push(
        <LinkButton
          key="link"
          baseClassName={baseClassName}
          hashId={hashId}
          i18n={i18n}
          onInsertLink={handleInsertLink}
          isLinkActive={isLinkActive}
        />,
      );
    }

    // 过滤隐藏的工具
    if (props.hideTools) {
      return elements.filter((element) => {
        if (React.isValidElement(element) && element.key) {
          return !props.hideTools?.includes(element.key as ToolsKeyType);
        }
        return true;
      });
    }

    return elements;
  }, [
    props.showEditor,
    props.hideTools,
    baseClassName,
    hashId,
    i18n,
    handleUndo,
    handleRedo,
    handleClearFormat,
    handleFormat,
    shouldShowHeadingDropdown,
    currentNode,
    handleHeadingChange,
    highColor,
    isHighColorActive,
    handleColorChange,
    handleToggleHighColor,
    insertOptionElements,
    markdownEditorRef,
    isCodeNode,
    handleToolClick,
    isFormatActive,
    shouldShowLinkButton,
    handleInsertLink,
    isLinkActive,
  ]);

  // 渲染精简工具栏
  const renderMinToolbar = useMemo(() => {
    if (!props.min) return null;

    return (
      <>
        <ToolBarItem
          title="更多操作"
          icon={<PlusCircleFilled />}
          className={classnames(
            `${baseClassName}-item`,
            `${baseClassName}-item-min-plus-icon`,
            hashId,
          )}
          tabIndex={-1}
        >
          <Dropdown
            menu={{
              items: insertOptions.map((t) => ({
                label: (
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    {t.icon}
                    {t.label?.at(0)}
                  </div>
                ),
                key: `min-${t.key}`,
                onClick: () => handleInsert(t),
              })),
            }}
          >
            <PlusCircleFilled />
          </Dropdown>
        </ToolBarItem>

        <Divider
          type="vertical"
          style={{
            margin: '0 4px',
            height: '18px',
            borderColor: 'rgba(0,0,0,0.15)',
          }}
        />

        {/* 精简版的主要工具 */}
        <UndoRedoButtons
          baseClassName={baseClassName}
          hashId={hashId}
          i18n={i18n}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />

        <ClearFormatButton
          baseClassName={baseClassName}
          hashId={hashId}
          i18n={i18n}
          onClear={handleClearFormat}
        />

        <HeadingDropdown
          baseClassName={baseClassName}
          hashId={hashId}
          i18n={i18n}
          node={currentNode}
          hideTools={props.hideTools}
          onHeadingChange={handleHeadingChange}
        />

        <ColorPickerButton
          baseClassName={baseClassName}
          hashId={hashId}
          i18n={i18n}
          highColor={highColor}
          isHighColorActive={isHighColorActive}
          onColorChange={handleColorChange}
          onToggleHighColor={handleToggleHighColor}
        />

        <FormattingTools
          baseClassName={baseClassName}
          hashId={hashId}
          i18n={i18n}
          tools={toolsConfig}
          editor={markdownEditorRef.current}
          isCodeNode={isCodeNode()}
          onToolClick={handleToolClick}
          isFormatActive={isFormatActive}
        />
      </>
    );
  }, [
    props.min,
    baseClassName,
    hashId,
    insertOptions,
    handleInsert,
    i18n,
    handleUndo,
    handleRedo,
    handleClearFormat,
    currentNode,
    props.hideTools,
    handleHeadingChange,
    highColor,
    isHighColorActive,
    handleColorChange,
    handleToggleHighColor,
    markdownEditorRef,
    isCodeNode,
    handleToolClick,
    isFormatActive,
  ]);

  // 渲染额外内容
  const renderExtra = useMemo(() => {
    if (!props.extra) return null;

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {props.extra.map((item, index) => {
          if (React.isValidElement(item)) {
            if (item.type === 'span') {
              return (
                <div
                  className={classnames(`${baseClassName}-item`, hashId)}
                  key={`extra-span-${index}`}
                >
                  {item}
                </div>
              );
            }
            return React.cloneElement(item, { key: `extra-item-${index}` });
          }
          return (
            <div
              className={classnames(`${baseClassName}-item`, hashId)}
              key={`extra-div-${index}`}
            >
              {item}
            </div>
          );
        })}
      </div>
    );
  }, [props.extra, baseClassName, hashId]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        gap: '1px',
        alignItems: 'center',
      }}
    >
      {props.min ? renderMinToolbar : renderFullToolbar}
      {renderExtra}
    </div>
  );
});

BaseToolBar.displayName = 'BaseToolBar';
