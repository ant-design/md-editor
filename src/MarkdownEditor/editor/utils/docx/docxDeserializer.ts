import { jsx } from 'slate-hyperscript';
import { makeDeserializer } from './module';
import { imagePastingListener } from './utils';
/* eslint-disable no-param-reassign */
import { Node } from 'slate';
import { EditorUtils } from '../../utils';

export const docxDeserializer = (rtf: string, html: string): any[] => {
  const deserialize = makeDeserializer(jsx);
  // image tags have to be cleaned out and converted
  const imageTags = imagePastingListener(rtf, html);
  if (html) {
    const parsed_html = new DOMParser().parseFromString(html, 'text/html');
    const fragment = deserialize(parsed_html.body, imageTags || []) as any[];
    return fragment
      .filter((item) => {
        if (
          item.type === 'paragraph' &&
          !Node.string(item).trim() &&
          !item?.children?.at(0)?.type
        ) {
          return false;
        }
        return true;
      })
      .map((fragment) => {
        if (fragment.type === 'table') {
          return EditorUtils.wrapperCardNode(fragment);
        }
        if (fragment.type === '"paragraph"' && fragment.children.length === 1) {
          return {
            type: 'paragraph',
            children: fragment.children,
          };
        }
        return fragment;
      });
  }
  return [];
};
