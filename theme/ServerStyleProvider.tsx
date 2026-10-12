import { useHead } from '@rspress/core/runtime';
import React, { useState } from 'react';
import {
  ServerStyleSheet,
  StyleSheetManager,
  version,
} from 'styled-components';

/** Collect one render's styles and resolve them after streamed page content completes. */
export default function ServerStyleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sheet] = useState(() => new ServerStyleSheet());

  useHead({
    style: () =>
      sheet.getStyleElement().map((element) => ({
        key: 'styled-components',
        'data-styled': 'true',
        'data-styled-version': version,
        innerHTML: element.props.dangerouslySetInnerHTML.__html,
      })),
  });

  return (
    <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
  );
}
