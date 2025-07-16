import { docxDeserializer } from '@ant-design/md-editor';
import { describe, expect, it } from 'vitest';

import { html, rtl } from './word';

describe('word parse', () => {
  it('docxDeserializer', () => {
    const fragment = docxDeserializer(rtl, html);
    expect(fragment).toMatchSnapshot();
  });
});
