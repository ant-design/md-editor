import React from 'react';
import { TableNode } from '../../../el';

export const TablePropsContext = React.createContext<{
  tablePath?: number[];
  tableNode?: TableNode;
}>({});
