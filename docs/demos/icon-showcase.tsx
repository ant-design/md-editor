import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Segmented,
  Space,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';

// 导入主要图标
import {
  CodeIcon,
  DatabaseIcon,
  FunctionIcon,
  NewChatIcon,
  PanelLeftIcon,
  ShareIcon,
  StarFilledIcon,
  StarIcon,
  ThinkIcon,
} from '../../src/icons';

// 导入组件图标
import {
  RagIcon,
  SearchIcon,
  TableSqlIcon,
  ToolCallIcon,
} from '../../src/components/icons';

// 导入其他图标
import { AttachmentIcon } from '../../src/icons/AttachmentIcon';
import { CloseIcon } from '../../src/icons/CloseIcon';
import { CopyIcon } from '../../src/icons/CopyIcon';
import { EmptyIcon } from '../../src/icons/EmptyIcon';
import { FinishedIcon } from '../../src/icons/FinishedIcon';
import { HistoryIcon } from '../../src/icons/HistoryIcon';
import { LoadingIcon } from '../../src/icons/LoadingIcon';
import { PauseIcon } from '../../src/icons/PauseIcon';
import { PlayIcon } from '../../src/icons/PlayIcon';
import { PlusIcon } from '../../src/icons/PlusIcon';
import { RunIcon } from '../../src/icons/RunIcon';
import { VoiceIcon } from '../../src/icons/VoiceIcon';
import { DocQueryIcon } from '../../src/icons/docQuery';
import { ChatDownLoadIcon as DownloadIcon } from '../../src/icons/download';

// 导入文件类型图标
import {
  CSSIcon,
  DOCSIcon,
  HTMLIcon,
  JSONIcon,
  MarkDownIcon,
  PDFIcon,
  PPTIcon,
  PPTXIcon,
  XLSIcon,
  XLSXIcon,
  XMLIcon,
  YMLIcon,
} from '../../src/icons/FileIconList';

// 导入编程语言图标（选择一些常用的）
import {
  CIcon,
  CppIcon,
  CsharpIcon,
  GoIcon,
  JavaIcon,
  JavascriptIcon,
  CssIcon as LangCssIcon,
  HtmlIcon as LangHtmlIcon,
  JsonIcon as LangJsonIcon,
  XmlIcon as LangXmlIcon,
  YamlIcon as LangYamlIcon,
  MarkdownIcon,
  PhpIcon,
  PythonIcon,
  ReactIcon,
  RustIcon,
  TypescriptIcon,
  VueIcon,
} from '../../src/plugins/code/langIcons';

const { Title, Text } = Typography;

// 图标分类定义
interface IconCategory {
  key: string;
  label: string;
  icons: Array<{
    name: string;
    component: React.ComponentType<any>;
    description?: string;
  }>;
}

const IconShowcase: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 获取图标尺寸信息
  const getIconSize = (iconName: string) => {
    // 根据图标名称返回对应的尺寸信息
    const sizeMap: Record<string, string> = {
      // 主要图标
      CodeIcon: '14.83×14.83',
      DatabaseIcon: '14.99×16.49',
      FunctionIcon: '18×18',
      NewChatIcon: '16×16',
      PanelLeftIcon: '16×16',
      StarFilledIcon: '16×16',
      StarIcon: '16×16',
      ThinkIcon: '16×16',

      // 组件图标
      RagIcon: '20×20',
      SearchIcon: '20×20',
      ShareIcon: '16×16',
      TableSqlIcon: '20×20',
      ToolCallIcon: '20×20',

      // UI图标
      AttachmentIcon: '16×16',
      CloseIcon: '12×12',
      CopyIcon: '14×14',
      EmptyIcon: '80×80',
      FinishedIcon: '16×16',
      HistoryIcon: '16×16',
      LoadingIcon: '16×16',
      PauseIcon: '16×16',
      PlayIcon: '16×16',
      PlusIcon: '10.66×10.66',
      RunIcon: '16×16',
      VoiceIcon: '16×16',
      DocQueryIcon: '21×21',
      DownloadIcon: '24×24',

      // 文件类型图标
      DOCSIcon: '24×24',
      PPTIcon: '24×24',
      PPTXIcon: '24×24',
      PDFIcon: '24×24',
      XLSIcon: '24×24',
      XLSXIcon: '24×24',
      HTMLIcon: '24×24',
      MarkDownIcon: '24×24',
      CSSIcon: '24×24',
      XMLIcon: '24×24',
      YMLIcon: '1024×1024',
      JSONIcon: '1024×1024',

      // 编程语言图标
      CIcon: '24×24',
      CppIcon: '24×24',
      CsharpIcon: '24×24',
      LangCssIcon: '24×24',
      GoIcon: '24×24',
      LangHtmlIcon: '24×24',
      JavaIcon: '24×24',
      JavascriptIcon: '24×24',
      LangJsonIcon: '24×24',
      MarkdownIcon: '24×24',
      PhpIcon: '24×24',
      PythonIcon: '24×24',
      ReactIcon: '24×24',
      RustIcon: '24×24',
      TypescriptIcon: '24×24',
      VueIcon: '24×24',
      LangXmlIcon: '24×24',
      LangYamlIcon: '24×24',
    };

    return sizeMap[iconName] || '24×24';
  };

  // 定义图标分类
  const iconCategories: IconCategory[] = [
    {
      key: 'all',
      label: '全部',
      icons: [],
    },
    {
      key: 'main',
      label: '主要图标',
      icons: [
        { name: 'CodeIcon', component: CodeIcon, description: '代码图标' },
        {
          name: 'DatabaseIcon',
          component: DatabaseIcon,
          description: '数据库图标',
        },
        {
          name: 'FunctionIcon',
          component: FunctionIcon,
          description: '函数图标',
        },
        {
          name: 'NewChatIcon',
          component: NewChatIcon,
          description: '新聊天图标',
        },
        {
          name: 'PanelLeftIcon',
          component: PanelLeftIcon,
          description: '左侧面板图标',
        },
        {
          name: 'StarFilledIcon',
          component: StarFilledIcon,
          description: '实心星标图标',
        },
        { name: 'StarIcon', component: StarIcon, description: '空心星标图标' },
        { name: 'ThinkIcon', component: ThinkIcon, description: '思考图标' },
      ],
    },
    {
      key: 'components',
      label: '组件图标',
      icons: [
        { name: 'RagIcon', component: RagIcon, description: 'RAG图标' },
        { name: 'SearchIcon', component: SearchIcon, description: '搜索图标' },
        { name: 'ShareIcon', component: ShareIcon, description: '分享图标' },
        {
          name: 'TableSqlIcon',
          component: TableSqlIcon,
          description: 'SQL表格图标',
        },
        {
          name: 'ToolCallIcon',
          component: ToolCallIcon,
          description: '工具调用图标',
        },
      ],
    },
    {
      key: 'ui',
      label: 'UI图标',
      icons: [
        {
          name: 'AttachmentIcon',
          component: AttachmentIcon,
          description: '附件图标',
        },
        { name: 'CloseIcon', component: CloseIcon, description: '关闭图标' },
        { name: 'CopyIcon', component: CopyIcon, description: '复制图标' },
        { name: 'EmptyIcon', component: EmptyIcon, description: '空状态图标' },
        {
          name: 'FinishedIcon',
          component: FinishedIcon,
          description: '完成图标',
        },
        {
          name: 'HistoryIcon',
          component: HistoryIcon,
          description: '历史图标',
        },
        {
          name: 'LoadingIcon',
          component: LoadingIcon,
          description: '加载图标',
        },
        { name: 'PauseIcon', component: PauseIcon, description: '暂停图标' },
        { name: 'PlayIcon', component: PlayIcon, description: '播放图标' },
        { name: 'PlusIcon', component: PlusIcon, description: '加号图标' },
        { name: 'RunIcon', component: RunIcon, description: '运行图标' },
        { name: 'VoiceIcon', component: VoiceIcon, description: '语音图标' },
        {
          name: 'DocQueryIcon',
          component: DocQueryIcon,
          description: '文档查询图标',
        },
        {
          name: 'DownloadIcon',
          component: DownloadIcon,
          description: '下载图标',
        },
      ],
    },
    {
      key: 'files',
      label: '文件类型',
      icons: [
        { name: 'CSSIcon', component: CSSIcon, description: 'CSS文件图标' },
        { name: 'DOCSIcon', component: DOCSIcon, description: '文档图标' },
        { name: 'HTMLIcon', component: HTMLIcon, description: 'HTML文件图标' },
        { name: 'JSONIcon', component: JSONIcon, description: 'JSON文件图标' },
        {
          name: 'MarkDownIcon',
          component: MarkDownIcon,
          description: 'Markdown文件图标',
        },
        { name: 'PDFIcon', component: PDFIcon, description: 'PDF文件图标' },
        { name: 'PPTIcon', component: PPTIcon, description: 'PPT文件图标' },
        { name: 'PPTXIcon', component: PPTXIcon, description: 'PPTX文件图标' },
        { name: 'XLSIcon', component: XLSIcon, description: 'XLS文件图标' },
        { name: 'XLSXIcon', component: XLSXIcon, description: 'XLSX文件图标' },
        { name: 'XMLIcon', component: XMLIcon, description: 'XML文件图标' },
        { name: 'YMLIcon', component: YMLIcon, description: 'YAML文件图标' },
      ],
    },
    {
      key: 'languages',
      label: '编程语言',
      icons: [
        { name: 'CIcon', component: CIcon, description: 'C语言图标' },
        { name: 'CppIcon', component: CppIcon, description: 'C++图标' },
        { name: 'CsharpIcon', component: CsharpIcon, description: 'C#图标' },
        { name: 'LangCssIcon', component: LangCssIcon, description: 'CSS图标' },
        { name: 'GoIcon', component: GoIcon, description: 'Go语言图标' },
        {
          name: 'LangHtmlIcon',
          component: LangHtmlIcon,
          description: 'HTML图标',
        },
        { name: 'JavaIcon', component: JavaIcon, description: 'Java图标' },
        {
          name: 'JavascriptIcon',
          component: JavascriptIcon,
          description: 'JavaScript图标',
        },
        {
          name: 'LangJsonIcon',
          component: LangJsonIcon,
          description: 'JSON图标',
        },
        {
          name: 'MarkdownIcon',
          component: MarkdownIcon,
          description: 'Markdown图标',
        },
        { name: 'PhpIcon', component: PhpIcon, description: 'PHP图标' },
        {
          name: 'PythonIcon',
          component: PythonIcon,
          description: 'Python图标',
        },
        { name: 'ReactIcon', component: ReactIcon, description: 'React图标' },
        { name: 'RustIcon', component: RustIcon, description: 'Rust图标' },
        {
          name: 'TypescriptIcon',
          component: TypescriptIcon,
          description: 'TypeScript图标',
        },
        { name: 'VueIcon', component: VueIcon, description: 'Vue图标' },
        { name: 'LangXmlIcon', component: LangXmlIcon, description: 'XML图标' },
        {
          name: 'LangYamlIcon',
          component: LangYamlIcon,
          description: 'YAML图标',
        },
      ],
    },
  ];

  // 合并所有图标到"全部"分类
  const allIcons = iconCategories
    .filter((category) => category.key !== 'all')
    .flatMap((category) => category.icons);

  // 更新"全部"分类
  iconCategories[0].icons = allIcons;

  // 过滤图标
  const filteredIcons = useMemo(() => {
    const category = iconCategories.find((cat) => cat.key === selectedCategory);
    if (!category) return [];

    let icons = category.icons;

    if (searchText.trim()) {
      icons = icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(searchText.toLowerCase()) ||
          icon.description?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    return icons;
  }, [selectedCategory, searchText, iconCategories]);

  // 复制代码到剪贴板
  const handleCopyCode = (iconName: string) => {
    const size = getIconSize(iconName);
    const code = `import { ${iconName} } from '@ant-design/md-editor';

// ${iconName} - viewBox: ${size}
<${iconName} />

// 自定义尺寸
<${iconName} style={{ fontSize: '24px' }} />

// 自定义颜色
<${iconName} style={{ color: '#1890ff' }} />`;

    navigator.clipboard.writeText(code).then(() => {
      // 可以添加成功提示
      console.log('代码已复制到剪贴板');
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>SVG 图标预览</Title>
      <Text type="secondary">
        预览项目中所有可用的 SVG 图标组件，支持搜索和分类查看
      </Text>

      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%', marginTop: '24px' }}
      >
        {/* 搜索和分类控制 */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Input
              placeholder="搜索图标名称或描述..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ maxWidth: '400px' }}
            />

            <Segmented
              options={iconCategories.map((cat) => ({
                label: cat.label,
                value: cat.key,
              }))}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value as string)}
            />
          </Space>
        </Card>

        {/* 图标展示区域 */}
        <Card>
          <Title level={4}>
            {selectedCategory === 'all'
              ? '全部图标'
              : iconCategories.find((cat) => cat.key === selectedCategory)
                  ?.label}
            <Text type="secondary" style={{ marginLeft: '8px' }}>
              ({filteredIcons.length} 个图标)
            </Text>
          </Title>

          <Row gutter={[16, 16]}>
            {filteredIcons.map((icon, index) => {
              const IconComponent = icon.component;
              return (
                <Col xs={12} sm={8} md={6} lg={4} xl={3} key={index}>
                  <Card
                    hoverable
                    size="small"
                    style={{
                      textAlign: 'center',
                      height: '130px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                    bodyStyle={{
                      padding: '16px 12px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <IconComponent style={{ fontSize: '24px' }} />
                    </div>
                    <Text
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '2px',
                        wordBreak: 'break-all',
                      }}
                    >
                      {icon.name}
                    </Text>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: '10px',
                        marginBottom: '4px',
                        color: '#666',
                      }}
                    >
                      {getIconSize(icon.name)} (viewBox)
                    </Text>
                    {icon.description && (
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '10px',
                          marginBottom: '8px',
                        }}
                      >
                        {icon.description}
                      </Text>
                    )}
                    <Button
                      size="small"
                      type="link"
                      onClick={() => handleCopyCode(icon.name)}
                      style={{ fontSize: '10px', padding: '0' }}
                    >
                      复制代码
                    </Button>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {filteredIcons.length === 0 && (
            <div
              style={{ textAlign: 'center', padding: '40px', color: '#999' }}
            >
              没有找到匹配的图标
            </div>
          )}
        </Card>

        {/* 使用说明 */}
        <Card>
          <Title level={4}>使用说明</Title>
          <Space direction="vertical" size="small">
            <Text>• 点击"复制代码"按钮可以复制图标的导入和使用代码</Text>
            <Text>• 使用搜索框可以根据图标名称或描述进行过滤</Text>
            <Text>• 使用分类标签可以按类型查看图标</Text>
            <Text>
              • 所有图标都支持标准的 SVG 属性，如 size、className、style 等
            </Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default IconShowcase;
