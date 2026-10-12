import type { RouteMeta, UserConfig } from '@rspress/core';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanUrlsPlugin } from './rspress-plugin-clean-urls.mjs';

describe('static clean URL output', () => {
  let outDir: string;

  beforeEach(async () => {
    outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agentic-clean-urls-'));
  });

  afterEach(async () => {
    await fs.rm(outDir, { force: true, recursive: true });
  });

  async function write(relativePath: string, content: string) {
    const filename = path.join(outDir, relativePath);
    await fs.mkdir(path.dirname(filename), { recursive: true });
    await fs.writeFile(filename, content);
  }

  const routesFor = (paths: string[]) =>
    paths.map((routePath) => ({ routePath }) as RouteMeta);

  const buildConfig = (): UserConfig => ({
    outDir,
    route: { cleanUrls: true },
  });

  it('serves the route-specific SSG and CSR HTML through directory indexes', async () => {
    await write('index.html', '<main>homepage</main>');
    await write('components/SuggestionList.html', '<main>suggestions</main>');
    await write('~demos/suggestions-basic.html', '<main id="root"></main>');
    await write('public-widget.html', '<main>unrelated public asset</main>');
    const routes = routesFor([
      '/',
      '/components/SuggestionList',
      '/~demos/suggestions-basic',
      '/components/SuggestionList',
      '/missing-page',
    ]);
    const plugin = cleanUrlsPlugin();
    await plugin.routeGenerated?.(routes, true);
    // Match Rspress removing CSR fallback routes after routeGenerated.
    routes.length = 0;
    await plugin.afterBuild?.(buildConfig(), true);

    for (const route of [
      'components/SuggestionList',
      '~demos/suggestions-basic',
    ]) {
      expect(await fs.readFile(path.join(outDir, route, 'index.html'))).toEqual(
        await fs.readFile(path.join(outDir, `${route}.html`)),
      );
    }
    expect(await fs.readFile(path.join(outDir, 'index.html'), 'utf8')).toBe(
      '<main>homepage</main>',
    );
    await expect(
      fs.access(path.join(outDir, 'public-widget')),
    ).rejects.toThrow();
    await expect(
      fs.access(path.join(outDir, 'missing-page')),
    ).rejects.toThrow();
  });

  it('preserves existing directory pages and the 404 response document', async () => {
    await write('guide.html', '<main>legacy HTML</main>');
    await write('guide/index.html', '<main>directory page</main>');
    await write('404.html', '<main>not found</main>');
    const plugin = cleanUrlsPlugin();
    await plugin.routeGenerated?.(
      routesFor(['/guide', '/guide/', '/404']),
      true,
    );
    await plugin.afterBuild?.(buildConfig(), true);

    expect(
      await fs.readFile(path.join(outDir, 'guide/index.html'), 'utf8'),
    ).toBe('<main>directory page</main>');
    expect(await fs.readFile(path.join(outDir, '404.html'), 'utf8')).toBe(
      '<main>not found</main>',
    );
    await expect(
      fs.access(path.join(outDir, '404/index.html')),
    ).rejects.toThrow();
    await expect(
      fs.access(path.join(outDir, 'guide/index/index.html')),
    ).rejects.toThrow();
  });

  it('does not modify output in dev or with clean URLs disabled', async () => {
    await write('guide.html', 'guide');
    const plugin = cleanUrlsPlugin();
    await plugin.routeGenerated?.(routesFor(['/guide']), false);
    await plugin.afterBuild?.(buildConfig(), false);
    await plugin.afterBuild?.({ outDir, route: { cleanUrls: false } }, true);

    expect(await fs.readdir(outDir)).toEqual(['guide.html']);
  });

  it('rejects route paths that could escape or alias the output directory', async () => {
    await write('guide.html', 'guide');
    const plugin = cleanUrlsPlugin();
    await plugin.routeGenerated?.(
      routesFor([
        '/../guide',
        '/folder/../guide',
        '/%2e%2e/guide',
        '/folder%2f..%2fguide',
        '/folder\\guide',
        '/guide?query',
        '/guide#hash',
        '/invalid%escape',
        'guide',
      ]),
      true,
    );
    await plugin.afterBuild?.(buildConfig(), true);

    expect(await fs.readdir(outDir)).toEqual(['guide.html']);
  });
});
