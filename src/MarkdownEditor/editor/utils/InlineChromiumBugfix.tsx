import React from 'react';

export function InlineChromiumBugfix() {
  return React.useMemo(
    () => (
      <span
        contentEditable={false}
        style={{ fontSize: 0, lineHeight: 0, display: 'inline-block' }}
      >
        {String.fromCodePoint(160)}
      </span>
    ),
    [],
  );
}
