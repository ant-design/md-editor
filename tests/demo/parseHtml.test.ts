import { docxDeserializer } from '@ant-design/agentic-ui';
import { describe, expect, it } from 'vitest';

import { html, rtl } from './word';

describe('word parse', () => {
  it('docxDeserializer', () => {
    const fragment = docxDeserializer(rtl, html);
    expect(fragment).toMatchSnapshot();
  });
});
