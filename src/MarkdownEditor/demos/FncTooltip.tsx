import { ExportOutlined } from '@ant-design/icons';
import {
  MARKDOWN_EDITOR_EVENTS,
  MarkdownEditor,
  MarkdownEditorInstance,
  useRefFunction,
} from '@ant-design/md-editor';
import { ChartElement } from '@ant-design/md-editor/plugins/chart';
import { CodeElement } from '@ant-design/md-editor/plugins/code';
import { MermaidElement } from '@ant-design/md-editor/plugins/mermaid';
import { Popover } from 'antd';
import React, { useEffect } from 'react';

const defaultValue = `根据提供的上下文数据，微软最近的股票并没有大涨，反而表现不佳。以下是相关信息的总结：

1. **股价表现不佳**：微软的股价自2024年7月触及峰值以来，已累计下跌约17%，并且在2024年11月6日收于2024年1月以来的最低水平[^1]。

2. **财报表现**：微软的财报显示，其Azure云计算业务的增长不尽如人意，尽管部分原因是公司数据中心数量不足，无法满足市场需求。虽然其人工智能服务有所增长，但将这些产品货币化的进程比许多投资者预期的要慢[^1]。

3. **人工智能投入**：微软在人工智能领域的投入持续增加，资本支出大幅膨胀。该公司预计本财年将在人工智能数据中心上投入800亿美元，但这些投入尚未显著转化为盈利增长[^1]。

4. **竞争压力**：微软在人工智能领域的竞争对手，如DeepSeek，宣称找到了一种更高效的人工智能模型创建方法，这对微软及其合作伙伴OpenAI构成了挑战[^1]。

综上所述，微软最近的股票并没有大涨，反而因为财报表现不佳、人工智能投入尚未显著转化为盈利增长以及竞争压力等因素，股价表现疲软。

*** Reference Sources ***

[^1]: [微软(MSFT)股价陷低谷，AI投入何时兑现增加承诺？ - 美股投资网](https://www.tradesmax.com/component/k2/item/22075-microsoft)
`;

export default () => {
  const editorRef = React.useRef<MarkdownEditorInstance>();
  const [nodeList, setNodeList] = React.useState<
    {
      id: any;
      placeholder: any;
      origin_text: any;
      url: any;
      origin_url: any;
    }[]
  >([]);
  useEffect(() => {
    // @ts-ignore
    window.editorRef = editorRef;
    editorRef.current?.markdownContainerRef?.current?.addEventListener(
      MARKDOWN_EDITOR_EVENTS.SELECTIONCHANGE,
      (e) => {
        console.log('selectionchange', e);
      },
    );
  }, []);

  const funRender = useRefFunction(
    (props: { identifier?: any }, _: React.ReactNode) => {
      const node = nodeList.find(
        (item) => item.placeholder === props.identifier,
      );
      return (
        <Popover
          title="参考链接"
          content={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <a
                href={node?.url}
                style={{
                  color: '#1890ff',
                }}
                target="_blank"
                rel="noreferrer"
              >
                {node?.origin_text}
              </a>

              <ExportOutlined />
            </div>
          }
        >
          {_}
        </Popover>
      );
    },
  );
  return (
    <MarkdownEditor
      editorRef={editorRef}
      width={'100vw'}
      height={'100vh'}
      reportMode
      plugins={[
        {
          elements: {
            code: CodeElement,
            chart: ChartElement,
            mermaid: MermaidElement,
          },
        },
      ]}
      fncProps={{
        onFootnoteDefinitionChange: (nodeList) => {
          console.log(nodeList);
          setNodeList(nodeList);
        },
        render: (props, _) => {
          return funRender(props, _);
        },
      }}
      onChange={(e, value) => {
        console.log(value);
      }}
      image={{
        upload: async (fileList) => {
          return new Promise((resolve) => {
            const file = fileList[0];
            if (typeof file === 'string') {
              fetch(file)
                .then((res) => res.blob())
                .then((blob) => {
                  console.log(blob);
                  const url = URL.createObjectURL(blob);
                  resolve(url);
                });
            } else {
              const url = URL.createObjectURL(file);
              resolve(url);
            }
          });
        },
      }}
      toolBar={{
        hideTools: ['H1'],
        min: true,
      }}
      insertAutocompleteProps={{
        optionsRender: (options) => {
          return options.filter((item) => {
            return item.key !== 'head1';
          });
        },
      }}
      initValue={
        process.env.NODE_ENV === 'test'
          ? defaultValue
          : defaultValue +
            `## 公式

Lift($$L$$) can be determined by Lift Coefficient ($$C_L$$) like the following
equation.

$$
L = \frac{1}{2} \rho v^2 S C_L
$$

$x^3+x^9+x^y$
`
      }
    />
  );
};
