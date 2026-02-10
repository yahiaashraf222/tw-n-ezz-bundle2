import { describe, it, expect } from 'vitest';
import type { HtmlTagDescriptor } from 'vite';
import { litImportMapPlugin } from './lit-import-map';

describe('litImportMapPlugin', () => {
  const plugin = litImportMapPlugin();

  it('should have the correct plugin name', () => {
    expect(plugin.name).toBe('lit-import-map');
  });

  it('should only apply during dev (serve)', () => {
    expect(plugin.apply).toBe('serve');
  });

  it('should return a valid import map tag descriptor', () => {
    const result = (plugin as any).transformIndexHtml('') as HtmlTagDescriptor[];

    expect(result).toHaveLength(1);
    expect(result[0].tag).toBe('script');
    expect(result[0].attrs).toEqual({ type: 'importmap' });
    expect(result[0].injectTo).toBe('head-prepend');
  });

  it('should produce valid JSON in the import map', () => {
    const result = (plugin as any).transformIndexHtml('') as HtmlTagDescriptor[];
    const parsed = JSON.parse(result[0].children as string);

    expect(parsed).toHaveProperty('imports');
    expect(typeof parsed.imports).toBe('object');
  });

  it('should map all required lit modules', () => {
    const result = (plugin as any).transformIndexHtml('') as HtmlTagDescriptor[];
    const { imports } = JSON.parse(result[0].children as string);

    expect(imports).toHaveProperty('lit');
    expect(imports).toHaveProperty('lit/decorators.js');
    expect(imports).toHaveProperty('@lit/reactive-element');
    expect(imports).toHaveProperty('lit-html');
    expect(imports).toHaveProperty('lit-element/lit-element.js');
  });

  it('should point all mappings to jsdelivr CDN with +esm suffix', () => {
    const result = (plugin as any).transformIndexHtml('') as HtmlTagDescriptor[];
    const { imports } = JSON.parse(result[0].children as string);

    for (const [key, url] of Object.entries(imports)) {
      expect(url).toMatch(/^https:\/\/cdn\.jsdelivr\.net\/npm\//);
      expect(url).toMatch(/\/\+esm$/);
    }
  });
});
