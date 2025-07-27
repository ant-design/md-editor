import slash from 'slash2';

export const isLink = (url: string = '') => /^[a-zA-Z]+:(\/\/)?/i.test(url);

export const parsePath = (path: string) => {
  const m = path.match(/#([^\n]*)/);
  if (m) {
    const hashPart = m[0];
    const hashValue = m[1] || '';
    // 只保留换行符前的路径部分
    const pathWithoutHash = path.replace(hashPart, '').split('\n')[0];
    return { path: pathWithoutHash, hash: hashValue };
  }
  return { path, hash: null };
};

export const toUnixPath = (path: string) => slash(path);
