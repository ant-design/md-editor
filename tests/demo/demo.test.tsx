import { cleanup, render, waitFor } from '@testing-library/react';
import { App, ConfigProvider } from 'antd';
import { glob } from 'glob';
import React, { useEffect } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const TestApp = (props: { children: any; onInit: () => void }) => {
  useEffect(() => {
    setTimeout(() => {
      props.onInit?.();
    }, 160);
  }, []);
  return (
    <App>
      <div>test</div>
      {props.children}
    </App>
  );
};

function demoTest() {
  beforeAll(() => {
    global.window.scrollTo = vi.fn();
    Element.prototype.scrollTo = vi.fn();
    process.env.NODE_ENV = 'test';
  });

  const files = glob.sync('./src/**/demos/**/*.tsx', {
    ignore: ['./**/*.test.tsx', './**/node_modules/**'],
    nodir: true,
  });

  files.forEach((file) => {
    describe(`Rendering demo: ${file}`, () => {
      it(`renders ${file} correctly`, async () => {
        const fn = vi.fn();
        Math.random = () => 0.8404419276253765;
        const DemoModule = await import(file);
        const wrapper = render(
          <ConfigProvider
            theme={{
              hashed: false,
            }}
          >
            <TestApp onInit={fn}>
              <DemoModule.default />
            </TestApp>
          </ConfigProvider>,
        );
        await waitFor(() => {
          return wrapper.findAllByText('test');
        });

        await waitFor(() => {
          expect(fn).toHaveBeenCalled();
        });

        expect(wrapper.asFragment()).toMatchFileSnapshot(
          './__snapshots__/' + file.replace(/\.tsx$/, '.snap'),
        );
      });

      afterEach(() => {
        cleanup();
      });
    });
  });
}

demoTest();
