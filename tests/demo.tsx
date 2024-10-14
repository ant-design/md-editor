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

type Options = {
  skip?: boolean;
};

function demoTest(component: string, options?: Options) {
  const files = glob.sync(`./src/MarkdownEditor/demos/${component}.tsx`);

  console.log('Matched files:', files);

  const TestApp = (props: { children: any; onInit: () => void }) => {
    useEffect(() => {
      setTimeout(() => {
        props.onInit?.();
      }, 1000);
    }, []);
    return <App>{props.children}</App>;
  };

  describe(`${component} demos`, () => {
    files.forEach((file: any) => {
      let testMethod = options?.skip === true ? test.skip : test;

      testMethod(`📸 renders ${file} correctly`, async () => {
        vi.useFakeTimers().setSystemTime(new Date('2016-11-22 15:22:44'));

        const fn = vi.fn();
        const Demo = (await import(file)).default;

        const wrapper = reactRender(
          <TestApp onInit={fn}>
            <Demo />
          </TestApp>,
        );

        act(() => {
          vi.runAllTimers();
        });

        await waitFor(() => {
          expect(fn).toBeCalled();
        });

        await waitFor(() => {
          expect(wrapper.asFragment()).toMatchSnapshot();
        });

        wrapper.unmount();
        vi.useRealTimers();
        cleanup();
      });
    });
  });
}

export default demoTest;
