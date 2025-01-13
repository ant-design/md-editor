import {
  bundledThemes,
  getSingletonHighlighter,
  Highlighter,
} from 'shiki/bundle-web.mjs';

export const codeThemes = new Set(Object.keys(bundledThemes));
export let highlighter: Highlighter = {} as any;
export const loadedLanguage = new Set<string>([
  'java',
  'json',
  'sql',
  'javascript',
  'typescript',
  'python',
]);

export const langSet = new Set<string>([
  'java',
  'json',
  'sql',
  'javascript',
  'typescript',
  'python',
]);

export const codeReady = async (props: { langs: string[] }) => {
  try {
    highlighter = await getSingletonHighlighter({
      themes: ['github-light'],
      langs: [
        'java',
        'json',
        'sql',
        'javascript',
        'typescript',
        'python',
        ...props.langs,
      ],
    });
  } catch (error) {}
};
