import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  title: 'AgenticUI',
  mfsu: false,
  themeConfig: {
    logo: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*WWGySab93QoAAAAAAAAAAAAADkN6AQ/original',
    name: 'AgenticUI',
  },
  favicons: [
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*WWGySab93QoAAAAAAAAAAAAADkN6AQ/original',
  ],
  resolve: {
    docDirs: ['docs', 'src/schema'],
  },
});
