import { ChartElement } from './chart';
import { CodeElement, InlineKatex } from './code';

export const standardPlugins = [
  {
    elements: {
      code: CodeElement,

      chart: ChartElement,
      katex: CodeElement,
      'inline-katex': InlineKatex,
    },
  },
];
