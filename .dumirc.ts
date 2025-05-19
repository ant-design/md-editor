import { defineConfig  } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  title: 'md-editor',
  mfsu: false,
  themeConfig: {
    logo: 'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*WWGySab93QoAAAAAAAAAAAAADkN6AQ/original',
    name: 'md-editor',
  },
  favicons: [
    'https://mdn.alipayobjects.com/huamei_ptjqan/afts/img/A*WWGySab93QoAAAAAAAAAAAAADkN6AQ/original',
  ],
  resolve: {
    docDirs: ['docs','src/schema'],
  },
});
