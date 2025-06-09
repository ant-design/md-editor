import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImageAndError } from '../../src/MarkdownEditor/editor/elements/image';
import { I18nContext } from '../../src/i18n';
import { cnLabels, enLabels } from '../../src/i18n';

describe('ImageElement i18n tests', () => {
  it('should render Chinese text when using Chinese locale', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <ImageAndError src="test.jpg" />
      </I18nContext.Provider>
    );

    // Test image actions in Chinese
    expect(screen.getByTitle('删除')).toBeDefined();
    expect(screen.getByText('删除媒体')).toBeDefined();
    expect(screen.getByText('确定删除该媒体吗？')).toBeDefined();
  });

  it('should render English text when using English locale', () => {
    render(
      <I18nContext.Provider value={{ locale: enLabels }}>
        <ImageAndError src="test.jpg" />
      </I18nContext.Provider>
    );

    // Test image actions in English
    expect(screen.getByTitle('Delete')).toBeDefined();
    expect(screen.getByText('Delete Media')).toBeDefined();
    expect(screen.getByText('Are you sure to delete?')).toBeDefined();
  });

  it('should handle image layout options with i18n', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <ImageAndError src="test.jpg" />
      </I18nContext.Provider>
    );

    // Test image layout options in Chinese
    expect(screen.getByTitle('行内图片')).toBeDefined();
    expect(screen.getByTitle('单独一行')).toBeDefined();
  });
}); 