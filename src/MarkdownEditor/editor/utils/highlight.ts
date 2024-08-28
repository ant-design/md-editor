import {
  bundledLanguages,
  bundledThemes,
  getSingletonHighlighter,
  Highlighter,
} from 'shiki';

export const codeThemes = new Set(Object.keys(bundledThemes));
export const allLanguages = Object.keys(bundledLanguages);
export const langSet = new Set(allLanguages);
export let highlighter: Highlighter;
export const loadedLanguage = new Set<string>(['tex']);

export const codeReady = async (allLanguage = false) => {
  highlighter = await getSingletonHighlighter({
    themes: ['github-light'],
    langs: allLanguage ? allLanguages : ['tex'],
  });
};
