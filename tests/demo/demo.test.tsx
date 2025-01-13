import { cleanup, render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { glob } from 'glob';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

function demoTest() {
  beforeAll(() => {
    global.window.scrollTo = vi.fn();
    Element.prototype.scrollTo = vi.fn();
  });

  const files = glob.sync('./src/**/demos/**/*.tsx', {
    ignore: ['./**/*.test.tsx', './**/node_modules/**'],
    nodir: true,
  });

  files.forEach((file) => {
    describe(`Rendering demo: ${file}`, () => {
      it(`renders ${file} correctly`, async () => {
        const DemoModule = await import(file);
        expect(
          render(
            <ConfigProvider
              theme={{
                hashed: false,
              }}
            >
              <DemoModule.default />
            </ConfigProvider>,
          ).asFragment(),
        ).toMatchSnapshot();
      });

      afterEach(() => {
        cleanup();
      });
    });
  });
}

demoTest();
