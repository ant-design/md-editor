//@ts-ignore
import { slash } from 'slash2';

export const isLink = (url: string = '') => /^\w+:\/\//i.test(url);

export const parsePath = (path: string) => {
  const m = path.match(/#([^\n#/]+)?$/);
  if (m) {
    return { path: path.replace(m[0], ''), hash: m[1] || '' };
  }
  return { path, hash: null };
};

export const toUnixPath = (path: string) => slash(path);
