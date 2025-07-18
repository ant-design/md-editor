import React from 'react';
import './index.css';

export const DotLoading = () => {
  return (
    <div
      data-testid="dot-loading"
      className="md-editor-loader"
      role="progressbar"
      aria-label="Loading"
    />
  );
};
