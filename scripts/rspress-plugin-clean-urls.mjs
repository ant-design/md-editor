import { constants } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

function getRouteFileStem(routePath) {
  if (
    !routePath.startsWith('/') ||
    routePath.endsWith('/') ||
    routePath === '/404' ||
    /[\\\0?#]/.test(routePath)
  ) {
    return null;
  }

  const stem = routePath.slice(1);
  for (const segment of stem.split('/')) {
    let decoded;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      return null;
    }
    if (
      !segment ||
      decoded === '.' ||
      decoded === '..' ||
      /[/\\\0]/.test(decoded)
    ) {
      return null;
    }
  }
  return stem;
}

/** Make clean routes work on static hosts that only resolve directory indexes. */
export function cleanUrlsPlugin() {
  let routePaths = [];

  return {
    name: 'agentic-static-clean-urls',
    routeGenerated(routes) {
      // Rspress removes CSR fallback routes from this array while rendering SSG.
      routePaths = [...new Set(routes.map((route) => route.routePath))];
    },
    async afterBuild(config, isProd) {
      if (!isProd || config.route?.cleanUrls !== true) return;

      const outDir = path.resolve(config.outDir ?? 'doc_build');
      for (const routePath of routePaths) {
        const stem = getRouteFileStem(routePath);
        if (!stem) continue;

        const source = path.resolve(outDir, `${stem}.html`);
        const destination = path.resolve(outDir, stem, 'index.html');
        const relative = path.relative(outDir, destination);
        if (relative.startsWith('..') || path.isAbsolute(relative)) continue;

        try {
          if (!(await fs.stat(source)).isFile()) continue;
        } catch (error) {
          if (error.code === 'ENOENT') continue;
          throw error;
        }

        await fs.mkdir(path.dirname(destination), { recursive: true });
        try {
          // Keep explicitly generated directory pages and the original .html URL.
          await fs.copyFile(source, destination, constants.COPYFILE_EXCL);
        } catch (error) {
          if (error.code !== 'EEXIST') throw error;
        }
      }
    },
  };
}
