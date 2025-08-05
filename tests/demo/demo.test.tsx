import { cleanup, render, waitFor } from '@testing-library/react';
import { App, ConfigProvider } from 'antd';
import { glob } from 'glob';
import React, { useEffect } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  framerMotionMock,
  setupAnimationMocks,
} from '../_mocks_/animationMocks';

// Mock framer-motion to speed up tests
vi.mock('framer-motion', () => framerMotionMock);

// 设置动画相关的全局mock
setupAnimationMocks();

const waitTime = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const TestApp = (props: { children: any; onInit: () => void }) => {
  useEffect(() => {
    setTimeout(() => {
      props.onInit?.();
    }, 500);
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

    // 禁用动画以减少测试时间
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = (element) => {
      const style = originalGetComputedStyle(element);
      return {
        ...style,
        animation: 'none',
        transition: 'none',
        transform: 'none',
      } as any;
    };
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

        await waitTime(500);

        await waitFor(
          () => {
            return wrapper.findAllByText('test');
          },
          { timeout: 10000 },
        );

        await waitFor(
          () => {
            expect(fn).toHaveBeenCalled();
          },
          { timeout: 10000 },
        );

        await expect(wrapper.asFragment()).toMatchFileSnapshot(
          './__snapshots__/' + file.replace(/\.tsx$/, '.snap'),
        );
        wrapper.unmount();
      });

      afterEach(() => {
        cleanup();
      });
    });
  });
}

demoTest();
