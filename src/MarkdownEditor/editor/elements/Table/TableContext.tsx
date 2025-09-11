import React from 'react';
import { TableNode } from '../../types/Table';

export const TablePropsContext = React.createContext<{
  tablePath?: number[];
  tableNode?: TableNode;
}>({});
