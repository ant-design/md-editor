import { cleanup, render } from '@testing-library/react';
import { glob } from 'glob';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

function demoTest() {
  beforeAll(() => {
    global.window.scrollTo = vi.fn();
    Element.prototype.scrollTo = vi.fn();
  });

  const files = glob.sync('./src/MarkdownEditor/demos/**/*.tsx', {
    ignore: ['./**/*.test.tsx', './**/node_modules/**'],
    nodir: true,
  });

  if (!files.length) {
    console.warn('No demo files found.');
    return;
  }

  files.forEach((file) => {
    describe(`Rendering demo: ${file}`, () => {
      it(`renders ${file} correctly`, async () => {
        try {
          const DemoModule = await import(file);
          const Demo = DemoModule.default;

          const wrapper = render(<Demo />);

          expect(wrapper.asFragment()).toMatchSnapshot();
        } catch (error) {
          console.error(`Error rendering ${file}:`, error);
        }
      });

      afterEach(() => {
        cleanup();
      });
    });
  });
}

demoTest();
