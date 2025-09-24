import { ChartElement } from './chart';
import { CodeElement } from './code';
import { InlineKatex, KatexElement } from './katex';

export const standardPlugins = [
  {
    elements: {
      code: CodeElement,
      chart: ChartElement,
      katex: KatexElement,
      'inline-katex': InlineKatex,
    },
  },
];
