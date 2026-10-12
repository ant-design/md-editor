import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContentDataSourceStrategy } from '../DataSourceStrategy';
import { getMimeType } from '../FileTypeProcessor';

describe('FileTypeProcessor data source resources', () => {
  afterEach(() => vi.restoreAllMocks());

  it('releases Blob URLs created while querying MIME metadata', () => {
    const create = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:metadata');
    const revoke = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    expect(getMimeType({ name: 'note.txt', content: 'hello' })).toBe(
      'text/plain',
    );
    expect(create).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith('blob:metadata');
  });

  it('retains an explicitly empty document instead of falling through to its old URL', () => {
    const strategy = new ContentDataSourceStrategy();
    const file = {
      name: 'note.txt',
      content: '',
      url: 'https://example.com/old.txt',
    };
    expect(strategy.canHandle(file)).toBe(true);
    expect(strategy.process(file).content).toBe('');
  });
});
