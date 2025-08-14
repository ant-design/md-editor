import { describe, it, expect } from 'vitest';
import {
  getLanguageFromFilename,
  isSupportedLanguage,
  wrapContentInCodeBlock,
} from '../../src/Workspace/utils/codeLanguageUtils';

describe('Workspace utils/codeLanguageUtils', () => {
  it('根据文件名推断语言：常见扩展名与特殊文件', () => {
    expect(getLanguageFromFilename('main.ts')).toBe('typescript');
    expect(getLanguageFromFilename('index.html')).toBe('html');
    expect(getLanguageFromFilename('Dockerfile')).toBe('dockerfile');
    expect(getLanguageFromFilename('CMakeLists.txt')).toBe('cmake');
    expect(getLanguageFromFilename('unknown.custom')).toBe('text');
  });

  it('语言支持检测', () => {
    expect(isSupportedLanguage('typescript')).toBe(true);
    expect(isSupportedLanguage('unknown-lang')).toBe(false);
  });

  it('wrapContentInCodeBlock：受支持语言与不支持语言', () => {
    const code = 'console.log(1)';
    expect(wrapContentInCodeBlock(code, 'typescript')).toBe(
      '```typescript\nconsole.log(1)\n```',
    );
    expect(wrapContentInCodeBlock(code, 'nonexistent')).toBe(
      '```text\nconsole.log(1)\n```',
    );
  });
}); 
