import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { MermaidApi } from './types';
import type { MermaidThemeToken } from './utils';
import {
  applyMermaidTheme,
  cleanupTempElement,
  createMermaidThemeConfig,
  loadMermaid,
  renderSvgToContainer,
} from './utils';

// Mermaid owns a shared configuration and temporary DOM. Keep initialize/render
// together until each render settles, including when a newer request replaces it.
const renderQueues = new WeakMap<MermaidApi, Promise<unknown>>();

const enqueueRender = <T>(api: MermaidApi, render: () => Promise<T>) => {
  const previous = renderQueues.get(api) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(render);
  renderQueues.set(api, next);
  void next.then(
    () => {
      if (renderQueues.get(api) === next) renderQueues.delete(api);
    },
    () => {
      if (renderQueues.get(api) === next) renderQueues.delete(api);
    },
  );
  return next;
};

/**
 * Mermaid 渲染 Hook
 */
export const useMermaidRender = (
  code: string,
  divRef: React.RefObject<HTMLDivElement | null>,
  id: string,
  isVisible: boolean,
  themeToken?: MermaidThemeToken,
) => {
  const mermaidRef = useRef<MermaidApi | null>(null);
  const renderedSignatureRef = useRef<string>('');
  const latestRenderSignatureRef = useRef<string>('');
  const [error, setError] = useState<string>('');
  const [renderedCode, setRenderedCode] = useState<string>('');
  const themeConfig = useMemo(
    () => createMermaidThemeConfig(themeToken),
    [
      themeToken?.colorBgContainer,
      themeToken?.colorBgElevated,
      themeToken?.colorBorder,
      themeToken?.colorPrimary,
      themeToken?.colorText,
      themeToken?.colorTextSecondary,
      themeToken?.fontFamily,
    ],
  );
  const renderSignature = `${themeConfig.cacheKey}::${code}`;
  latestRenderSignatureRef.current = renderSignature;

  useEffect(() => {
    if (!isVisible || renderedSignatureRef.current === renderSignature) {
      return;
    }

    if (!code.trim()) {
      renderedSignatureRef.current = '';
      setRenderedCode('');
      setError('');
      if (divRef.current) {
        divRef.current.innerHTML = '';
      }
      return;
    }

    let cancelled = false;
    const currentSignature = renderSignature;
    const isCurrent = () =>
      !cancelled && latestRenderSignatureRef.current === currentSignature;
    const timeout = window.setTimeout(async () => {
      if (!isCurrent()) return;

      try {
        const api = mermaidRef.current ?? (await loadMermaid());
        if (!isCurrent()) return;
        mermaidRef.current = api;

        const result = await enqueueRender(api, async () => {
          // Loading or an earlier diagram may have occupied the queue while this
          // request became stale. Do not parse that stale source at all.
          if (!isCurrent()) return;
          try {
            applyMermaidTheme(api, themeConfig);
            return await api.render(id, code.trim());
          } finally {
            cleanupTempElement(id);
          }
        });

        if (!result || !isCurrent()) return;

        if (divRef.current) {
          renderSvgToContainer(result.svg, divRef.current);
        }

        renderedSignatureRef.current = currentSignature;
        setRenderedCode(code);
        setError('');
      } catch (err) {
        if (isCurrent()) {
          setError(String(err));
          renderedSignatureRef.current = currentSignature;
          setRenderedCode(code);
          if (divRef.current) {
            divRef.current.innerHTML = '';
          }
        }
      }
    }, 100);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [code, id, isVisible, renderSignature, themeConfig, divRef]);

  return { error, renderedCode };
};
