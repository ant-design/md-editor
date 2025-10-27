import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  title: 'AgenticUI',
  mfsu: false,
  themeConfig: {
    logo: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*ObqVQoMht3oAAAAARuAAAAgAekN6AQ/fmt.webp',
    name: 'AgenticUI',
  },
  favicons: [
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*ObqVQoMht3oAAAAARuAAAAgAekN6AQ/original',
  ],
  resolve: {
    docDirs: ['docs', 'src/schema'],
  },
});
