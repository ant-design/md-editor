import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useSiteI18n } from '../../i18n';
import VectorIcon from '../../icons/vector.svg';
import LocaleBridge from '../HomePage/LocaleBridge';
import {
  Container,
  CustomTab,
  HorizontalDivider,
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
  SectionWrapper,
  TabDescription,
  TabLoading,
  TabPanel,
  TabsContainer,
  TabTitle,
} from './style';

const loadCanvasTab = () => import('./components/CanvasTab');
const loadCardTab = () => import('./components/CardTab');
const loadMarkdownTab = () => import('./components/MarkdownTab');
const loadSchemaTab = () => import('./components/SchemaTab');
const CanvasTab = lazy(loadCanvasTab);
const CardTab = lazy(loadCardTab);
const MarkdownTab = lazy(loadMarkdownTab);
const SchemaTab = lazy(loadSchemaTab);

const EnhanceDesign: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schema');
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { locale, messages } = useSiteI18n();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // 初始化宽度
    const updateWidth = () => {
      const width = element.offsetWidth;
      // 设置 CSS 变量到最近的 SectionWithBorders 父元素
      const sectionWithBorders = element.closest('[data-section-with-borders]');
      if (sectionWithBorders) {
        (sectionWithBorders as HTMLElement).style.setProperty(
          '--scrollable-content-width',
          `${width + 32}px`,
        );
      }
    };

    updateWidth();

    // 使用 ResizeObserver 监听宽度变化
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [locale]);

  const tabs = [
    {
      key: 'markdown',
      label: messages.enhance.tabs.markdown.label,
      description: messages.enhance.tabs.markdown.description,
      load: loadMarkdownTab,
    },
    {
      key: 'schema',
      label: messages.enhance.tabs.schema.label,
      description: messages.enhance.tabs.schema.description,
      load: loadSchemaTab,
    },
    {
      key: 'canvas',
      label: messages.enhance.tabs.canvas.label,
      description: messages.enhance.tabs.canvas.description,
      load: loadCanvasTab,
    },
    {
      key: 'card',
      label: messages.enhance.tabs.card.label,
      description: messages.enhance.tabs.card.description,
      load: loadCardTab,
    },
  ];

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActiveTab(tabs[nextIndex].key);
    tabRefs.current[nextIndex]?.focus();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'markdown':
        return <MarkdownTab />;
      case 'schema':
        return <SchemaTab />;
      case 'canvas':
        return <CanvasTab />;
      case 'card':
        return <CardTab />;
      default:
        return <SchemaTab />;
    }
  };

  return (
    <LocaleBridge>
      <SectionWrapper>
        <Container ref={containerRef}>
          <SectionHeader>
            <img
              src={VectorIcon}
              alt="Vector"
              style={{ width: '25px', height: '25px' }}
            />
            <SectionTitle>
              <span style={{ backgroundColor: 'white' }}>
                {messages.enhance.sectionTitle}
              </span>
            </SectionTitle>
            <SectionSubtitle>
              <span
                style={{
                  fontWeight: 600,
                  color: '#000',
                  backgroundColor: 'white',
                }}
              >
                {messages.enhance.subtitlePrefix}
              </span>
              <span
                style={{
                  fontFamily: 'PingFang SC',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  marginLeft: '12px',
                  background:
                    'linear-gradient(94deg, #000 4%, #3066FD 66%, #5666EE 100%)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {messages.enhance.subtitleSuffix}
              </span>
            </SectionSubtitle>
          </SectionHeader>

          <TabsContainer
            role="tablist"
            aria-label={messages.enhance.sectionTitle}
          >
            {tabs.map((tab, index) => (
              <CustomTab
                key={tab.key}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`home-enhance-tab-${tab.key}`}
                aria-selected={activeTab === tab.key}
                aria-controls="home-enhance-panel"
                tabIndex={activeTab === tab.key ? 0 : -1}
                $active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                onMouseEnter={() => void tab.load().catch(() => {})}
                onFocus={() => void tab.load().catch(() => {})}
              >
                <TabTitle $active={activeTab === tab.key}>{tab.label}</TabTitle>
                <TabDescription $active={activeTab === tab.key}>
                  {tab.description}
                </TabDescription>
              </CustomTab>
            ))}
          </TabsContainer>

          <TabPanel
            role="tabpanel"
            id="home-enhance-panel"
            aria-labelledby={`home-enhance-tab-${activeTab}`}
          >
            <Suspense
              fallback={
                <TabLoading role="status">
                  {locale === 'zh-CN' ? '正在加载演示…' : 'Loading demo…'}
                </TabLoading>
              }
            >
              {renderTabContent()}
            </Suspense>
          </TabPanel>
        </Container>
        <HorizontalDivider />
      </SectionWrapper>
    </LocaleBridge>
  );
};

export default EnhanceDesign;
