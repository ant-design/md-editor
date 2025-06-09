import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BaseToolBar } from '../../src/MarkdownEditor/editor/tools/ToolBar/BaseBar';
import { I18nContext } from '../../src/i18n';
import { cnLabels, enLabels } from '../../src/i18n';

describe('BaseBar i18n tests', () => {
  it('should render Chinese text when using Chinese locale', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <BaseToolBar />
      </I18nContext.Provider>
    );

    // Test common tool button tooltips in Chinese
    expect(screen.getByTitle('加粗')).toBeDefined();
    expect(screen.getByTitle('斜体')).toBeDefined();
    expect(screen.getByTitle('删除线')).toBeDefined();
    expect(screen.getByTitle('行内代码')).toBeDefined();
  });

  it('should render English text when using English locale', () => {
    render(
      <I18nContext.Provider value={{ locale: enLabels }}>
        <BaseToolBar />
      </I18nContext.Provider>
    );

    // Test common tool button tooltips in English
    expect(screen.getByTitle('Bold')).toBeDefined();
    expect(screen.getByTitle('Italic')).toBeDefined();
    expect(screen.getByTitle('Strikethrough')).toBeDefined();
    expect(screen.getByTitle('Inline Code')).toBeDefined();
  });
}); 