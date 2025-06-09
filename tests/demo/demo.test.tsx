import { cleanup, render, waitFor } from '@testing-library/react';
import { App, ConfigProvider } from 'antd';
import { glob } from 'glob';
import React, { useEffect } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

// Mock console.log to ignore act warnings
const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('inside an act')) {
    return;
  }
  originalConsoleLog(...args);
};

const waitTime = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const TestApp = (props: { children: any; onInit: () => void }) => {
  useEffect(() => {
    setTimeout(() => {
      props.onInit?.();
    }, 2000);
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

  const files = glob.sync('./docs/**/demos/**/*.tsx', {
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

        await waitTime(1500);
        await waitFor(() => {
          return wrapper.findAllByText('test');
        });

        await waitFor(() => {
          expect(fn).toHaveBeenCalled();
        });

        await expect(wrapper.asFragment()).toMatchFileSnapshot(
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
