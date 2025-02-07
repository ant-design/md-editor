import { jsx } from 'slate-hyperscript';
import { makeDeserializer } from './module';
import { imagePastingListener } from './utils';

export const docxDeserializer = (rtf: string, html: string): any[] => {
  const deserialize = makeDeserializer(jsx);
  // image tags have to be cleaned out and converted
  const imageTags = imagePastingListener(rtf, html);
  if (html) {
    const parsed_html = new DOMParser().parseFromString(html, 'text/html');
    const fragment = deserialize(parsed_html.body, imageTags || []);
    return fragment;
  }
  return [];
};
