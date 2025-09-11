import React from 'react';
import { Chunk } from '../../ThoughtChainList/types';

/**
 * 文档信息列表的属性接口
 *
 * @interface DocInfoListProps
 * @property {any[]} reference_url_info_list - 引用URL信息列表数组
 * @property {function} [render] - 自定义渲染函数，接收chunk项和默认DOM，返回React节点
 * @property {function} [onOriginUrlClick] - 原始URL点击处理函数
 * @property {Chunk[]} [options] - 可选的Chunk数组配置项
 */
export interface DocInfoListProps {
  reference_url_info_list?: any[];
  render?: (item: Chunk, defaultDom: React.ReactNode) => React.ReactNode;
  onOriginUrlClick?: (url: string) => void;
  options?: Chunk[];
}
