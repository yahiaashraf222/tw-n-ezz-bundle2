import type { Plugin, HtmlTagDescriptor } from 'vite';

/**
 * Vite plugin that injects a browser import map for Lit dependencies.
 * Restricted to dev mode (`apply: 'serve'`) so production builds are unaffected.
 */
export function litImportMapPlugin(): Plugin {
  return {
    name: 'lit-import-map',
    apply: 'serve',
    transformIndexHtml(): HtmlTagDescriptor[] {
      return [
        {
          tag: 'script',
          attrs: { type: 'importmap' },
          children: JSON.stringify({
            imports: {
              'lit': 'https://cdn.jsdelivr.net/npm/lit@3/+esm',
              'lit/decorators.js': 'https://cdn.jsdelivr.net/npm/lit@3/decorators.js/+esm',
              '@lit/reactive-element': 'https://cdn.jsdelivr.net/npm/@lit/reactive-element@2/+esm',
              'lit-html': 'https://cdn.jsdelivr.net/npm/lit-html@3/+esm',
              'lit-element/lit-element.js': 'https://cdn.jsdelivr.net/npm/lit-element@4/lit-element.js/+esm',
            },
          }),
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}
