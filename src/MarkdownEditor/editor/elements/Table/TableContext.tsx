import React from 'react';
import { TableNode } from './index';

export const TablePropsContext = React.createContext<{
  tablePath?: number[];
  tableNode?: TableNode;
}>({});
