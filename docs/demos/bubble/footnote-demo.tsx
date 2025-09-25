import { LinkOutlined } from '@ant-design/icons';
import {
  Bubble,
  BubbleProps,
  MessageBubbleData,
  useRefFunction,
  VisualList,
  VisualListItem,
} from '@ant-design/md-editor';
import { ArrowUpRight } from '@ant-design/md-editor/icons/ArrowUpRight1';
import { Popover } from 'antd';
import React, { useMemo } from 'react';

function isValidUrl(input: string) {
  try {
    new URL(input);
    return true;
  } catch (_) {
    return false;
  }
}

const FootnotePopverContent: React.FC<{
  href?: string;
  titleText: string;
  hostText: string;
  faviconLetter: string;
}> = ({ href, titleText, hostText, faviconLetter }) => {
  const [hovered, setHovered] = React.useState(false);
  const [arrowHovered, setArrowHovered] = React.useState(false);
  const isTitlePureLink = isValidUrl(titleText?.trim());
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 284,
        background: 'var(--color-gray-bg-card-white)',
        position: 'relative',
        padding: '8px 12px',
        cursor: 'pointer',
      }}
      onClick={() => {
        window.open(href, '_blank', 'noopener noreferrer');
      }}
    >
      {/* 跳转按钮（浮动显示） */}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setArrowHovered(true)}
          onMouseLeave={() => setArrowHovered(false)}
          style={{
            position: 'absolute',
            right: 12,
            top: 12,
            width: 32,
            height: 32,
            fontSize: 16,
            borderRadius: 'var(--radius-control-base)',
            background: 'var(--color-gray-control-fill-secondary)',
            backdropFilter: 'blur(40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 120ms ease',
            ...(arrowHovered && {
              background: 'var(--color-gray-control-fill-secondary-hover)',
            }),
          }}
        >
          <ArrowUpRight style={{ color: 'var(--color-gray-text-secondary)' }} />
        </a>
      ) : null}

      {/* 标题（单行截断） */}
      <div
        style={{
          font: 'var(--font-text-body-base)',
          letterSpacing: 'var(--letter-spacing-body-base, normal)',
          fontSize: 13,
          color: 'var(--color-gray-text-default)',
          lineHeight: '20px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={titleText}
      >
        {titleText}
      </div>

      {/* 域名行（favicon 圆点 + 域名） */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 'var(--radius-control-sm)',
            background: isTitlePureLink
              ? 'var(--color-primary-control-fill-primary)'
              : '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            lineHeight: '20px',
          }}
        >
          {isTitlePureLink ? <LinkOutlined /> : faviconLetter}
        </div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--color-gray-text-light)',
              font: 'var(--font-text-paragraph-sm)',
              fontSize: 12,
              lineHeight: '20px',
            }}
          >
            {hostText}
          </a>
        ) : (
          <span
            style={{
              color: 'var(--color-gray-text-light)',
              font: 'var(--font-text-paragraph-sm)',
              fontSize: 12,
            }}
          >
            {hostText}
          </span>
        )}
      </div>
    </div>
  );
};

const message1 = `# 引用（Reference）示例

在技术文档与产品说明中，引用用于标注来源、补充上下文与延伸阅读，而不打断阅读节奏[^1]。本示例展示如何将正文中的引用渲染为可预览的气泡卡片，并在需要时汇总“引用定义表”方便统计与展示[^2]。

引用系统强调三件事：

1. 可定位：从正文引用跳转到引用定义[^3]；
2. 可回溯：从引用定义回看被引用的语境，形成闭环[^4]；
3. 可预览：悬浮即可查看标题与关键信息，不打断阅读[^5]。

在长文或多人协作场景中，引用有助于统一管理来源，并在文末集中呈现，或在侧栏生成索引视图[^6]。你可以尝试移动光标、增删引用，观察下方“引用定义表”的实时变化[^7]。

- 产品层面：适用于名词解释、来源标注与合规模块[^8]。
- 工程层面：可替换为 Tooltip/Popover 等形态并支持样式定制[^9]。
- 写作层面：可承载参考文献与多语言版本的交叉引用[^10]。

更多示例：当正文混合代码块、列表、图片与图表时，引用的展示应保持一致且不干扰阅读；引用系统需与富文本/Markdown 的节点模型良好整合[^11]。

*** Reference Notes ***

[^1]: [](https://www.baidu.com) 
[^2]: [可通过自定义渲染与变更回调实现引用的预览与收集。](https://www.baidu.com)
[^3]: [支持从正文引用标记定位到定义处。](https://www.baidu.com)
[^4]: [支持从定义处回看被引用的上下文。](https://www.baidu.com)
[^5]: [悬浮展示简要信息以保持阅读连贯性。](https://www.baidu.com)
[^6]: [统一收敛与索引利于维护与协作。](https://www.baidu.com)
[^7]: [新增、删除与选区变化会实时反映在定义表。](https://www.baidu.com)
[^8]: [常见于 FAQ、名词解释和条款说明等模块。](https://www.baidu.com)
[^9]: [引用组件可替换、可主题化，适配不同产品风格。](https://www.baidu.com)
[^10]: [适合管理多语言/多版本的跨文档引用。](https://www.baidu.com)
[^11]: [在多模态内容下仍应保持稳定与一致。](https://www.baidu.com)
`;

const items: VisualListItem[] = [
  {
    title: 'afc163',
    src: 'https://avatars.githubusercontent.com/u/507615?s=40&v=4',
    href: 'https://github.com/afc163',
  },
  {
    title: 'li-jia-nan',
    src: 'https://avatars.githubusercontent.com/u/49217418?s=40&v=4',
    href: 'https://github.com/li-jia-nan',
  },
  {
    title: 'MadCcc',
    src: 'https://avatars.githubusercontent.com/u/27722486?s=40&v=4',
    href: 'https://github.com/MadCcc',
  },
  {
    title: 'zombieJ',
    src: 'https://avatars.githubusercontent.com/u/5378891?s=40&v=4',
    href: 'https://github.com/zombieJ',
  },
  {
    title: 'benjycui',
    src: 'https://avatars.githubusercontent.com/u/3580607?s=40&v=4',
    href: 'https://github.com/benjycui',
  },
  {
    title: 'ycjcl868',
    src: 'https://avatars.githubusercontent.com/u/13595509?s=40&v=4',
    href: 'https://github.com/ycjcl868',
  },
  {
    title: 'coding-ice',
    src: 'https://avatars.githubusercontent.com/u/49827327?s=40&v=4',
    href: 'https://github.com/coding-ice',
  },
  {
    title: 'yesmeck',
    src: 'https://avatars.githubusercontent.com/u/465125?s=40&v=4',
    href: 'https://github.com/yesmeck',
  },
  {
    title: 'xrkffgg',
    src: 'https://avatars.githubusercontent.com/u/29775873?s=40&v=4',
    href: 'https://github.com/xrkffgg',
  },
  {
    title: 'hengkx',
    src: 'https://avatars.githubusercontent.com/u/8358236?s=40&v=4',
    href: 'https://github.com/hengkx',
  },
];

export default () => {
  const [nodeList, setNodeList] = React.useState<
    {
      id: string;
      placeholder: string;
      origin_text: string;
      url: string;
      origin_url: string;
    }[]
  >([]);

  const renderRef = useRefFunction(
    (props: { identifier?: string }, _: React.ReactNode) => {
      const node = nodeList.find(
        (item) => item.placeholder === props.identifier,
      );
      if (!node) return _;
      const href = node?.url as string | undefined;
      let host = '';
      try {
        host = href ? new URL(href).hostname : '';
      } catch (e) {
        host = '';
      }
      const hostText = (host || '').replace(/^www\./, '') || '链接';
      const faviconLetter = hostText?.charAt(0)?.toUpperCase() || 'L';
      const titleText = (node?.origin_text as string) || hostText;
      return (
        <Popover
          overlayInnerStyle={{
            padding: 0,
            borderRadius: 'var(--radius-card-base)',
            boxShadow: 'var(--shadow-control-lg)',
          }}
          arrow={false}
          content={
            <FootnotePopverContent
              href={href}
              titleText={titleText}
              hostText={hostText}
              faviconLetter={faviconLetter}
            />
          }
        >
          {_}
        </Popover>
      );
    },
  );

  const bubbleRef = React.useRef<any>();
  const conversation: MessageBubbleData[] = useMemo(
    () => [
      {
        id: 'a1',
        role: 'assistant',
        content: message1,
        createAt: Date.now() - 40_000,
        updateAt: Date.now() - 40_000,
        isFinished: true,
        meta: {
          avatar:
            'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
          title: 'AI Assistant',
          description: '智能助手 v2.1',
        },
        extra: {
          showRefs: true,
        },
      },
    ],
    [],
  );

  const afterMessageRender = (props: BubbleProps) => {
    const { originData } = props;
    if (!originData?.extra?.showRefs) return null;

    return (
      <div style={{ padding: 16 }}>
        <VisualList
          data={items}
          shape="circle"
          description={`${items.length} 个网页`}
        />
      </div>
    );
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {conversation.map((msg, idx) => (
          <Bubble
            key={msg.id}
            bubbleRef={bubbleRef}
            avatar={msg.meta!}
            originData={msg}
            placement={msg.role === 'user' ? 'right' : 'left'}
            bubbleRenderConfig={{ afterMessageRender }}
            markdownRenderConfig={{
              fncProps: {
                render: renderRef,
                onFootnoteDefinitionChange: (list) => {
                  setNodeList(list);
                },
              },
            }}
            preMessage={conversation[idx - 1]}
            onLike={() => {}}
            onDisLike={() => {}}
          />
        ))}
      </div>
    </>
  );
};
