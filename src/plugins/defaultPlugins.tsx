﻿import { ChartElement } from './chart';
import { CodeElement, InlineKatex } from './code';

export const standardPlugins = [
  {
    elements: {
      code: CodeElement,
      katex: CodeElement,
      chart: ChartElement,
      'inline-katex': InlineKatex,
    },
  },
];
