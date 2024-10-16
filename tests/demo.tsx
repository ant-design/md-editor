import {
  cleanup,
  render as reactRender,
  waitFor,
} from '@testing-library/react';
import { App } from 'antd';
import { glob } from 'glob';
import { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { describe, expect, test, vi } from 'vitest';

function demoTest(component: string, options?: { skip?: boolean }) {

  const files = glob.sync(`./src/MarkdownEditor/demos/${component}.tsx`, {
    ignore: ['./**/*.test.tsx', './**/node_modules/**'], // 排除测试文件和 node_modules
    nodir: true, 
  });

  if (!files.length) {
    console.warn(`No files found for component: ${component}`);
    return;
  }

  const TestApp = (props: { children: any; onInit: () => void }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        props.onInit?.();
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    return <App>{props.children}</App>;
  };

  describe(`${component} demos`, () => {
    files.forEach((file: any) => {
      const testMethod = options?.skip ? test.skip : test;

      testMethod(`📸 renders ${file} correctly`, async () => {
        vi.useFakeTimers().setSystemTime(new Date('2016-11-22 15:22:44'));

        const onInitFn = vi.fn();
        
        // 动态导入组件
        const DemoModule = await import(file);
        console.log('Imported Demo Module:', DemoModule);

        const Demo = DemoModule.default;

        const wrapper = reactRender(
          <TestApp onInit={onInitFn}>
            <Demo />
          </TestApp>,
        );

        act(() => {
          vi.runAllTimers();
        });

        await waitFor(() => {
          expect(onInitFn).toBeCalled();
        });

        await waitFor(() => {
          expect(wrapper.asFragment()).toMatchSnapshot();
        });

        wrapper.unmount();
        cleanup();
        vi.useRealTimers();
      });
    });
  });
}

export default demoTest;
