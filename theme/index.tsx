import { Content, useLocation } from '@rspress/core/runtime';
import { type RootProps } from '@rspress/core/theme';
import {
  Layout as OriginalLayout,
  useScrollReset,
  useSetup,
} from '@rspress/core/theme-original';
import React, { lazy, Suspense } from 'react';
import './agentic-site.css';
import ServerStyleProvider from './ServerStyleProvider';

const DemoAntdProvider = lazy(() => import('./DemoAntdProvider'));

function isDemoRoute(pathname: string) {
  return /\/~demos(?:\/|$)/.test(pathname);
}

function DemoLayout() {
  useSetup();
  useScrollReset();
  return <Content />;
}

export function Layout(props: React.ComponentProps<typeof OriginalLayout>) {
  const { pathname } = useLocation();

  // Demo routes stay bare even when page metadata falls back to a document layout.
  return isDemoRoute(pathname) ? <DemoLayout /> : <OriginalLayout {...props} />;
}

export function Root({ children }: RootProps) {
  const { pathname } = useLocation();

  // 普通文档页只渲染 Rspress 主题和 iframe 容器，无需加载完整 antd。
  // ConfigProvider 及 reset.css 仅在独立 demo 路由中按需加载。
  const content = isDemoRoute(pathname) ? (
    <Suspense fallback={null}>
      <DemoAntdProvider>{children}</DemoAntdProvider>
    </Suspense>
  ) : (
    children
  );

  // Rspress replaces these flags at build time, excluding the collector from client bundles.
  if (process.env.__SSR__ && !process.env.__SSR_MD__) {
    return <ServerStyleProvider>{content}</ServerStyleProvider>;
  }

  return content;
}

export * from '@rspress/core/theme-original';
