# Feature-Rich Components Implementation Guide

This guide explains how to build production-ready Twilight components in this repository, based on the actual structure in `src/`, `vite.config.ts`, and `twilight-bundle.json`.

## 1) How this project works end-to-end

Your component lifecycle is:

1. Define component metadata and fields in `twilight-bundle.json`.
2. Implement UI/logic in `src/components/<component-name>/index.ts`.
3. Run `pnpm dev` and test in the demo page.
4. Build with `pnpm build`, which outputs bundle-ready component files in `dist/`.

The build/runtime contract depends on these files:

- `vite.config.ts`: controls transform, build, and demo behavior.
- `twilight-bundle.json`: defines component schema, fields, defaults, and registration metadata.
- `src/components/*/index.ts`: implementation classes (mostly `LitElement`).

## 2) Vite pipeline in this project

Current `vite.config.ts` uses these plugins in order:

1. `litImportMapPlugin()`
2. `sallaTransformPlugin()`
3. `sallaBuildPlugin()`
4. `sallaDemoPlugin()`

### Why this matters

- `litImportMapPlugin()` (dev-only) injects import maps so Lit modules resolve in browser during `vite serve`.
- `sallaTransformPlugin()` discovers and transforms component entries under `src/components/*/index.ts`.
- `sallaBuildPlugin()` creates per-component output files for deployment.
- `sallaDemoPlugin()` renders a local playground for fast feedback and manual QA.

If a component is not showing in dev/build, check:

- Folder naming in `src/components/<name>/index.ts`
- Matching `name` in `twilight-bundle.json`
- Default export class exists in `index.ts`

## 3) `twilight-bundle.json` is your schema source of truth

Each object in `components[]` defines:

- `name`: must match folder name in `src/components/`
- `title`: display name in editor
- `icon`, `image`, `key`
- `fields`: configuration schema delivered to your component as `config`

### Critical naming contract

For a component:

- JSON name: `"name": "product-card"`
- Source path: `src/components/product-card/index.ts`

Keep these aligned exactly (including kebab-case).

### Field design patterns already used in your repo

- Primitive fields: `string`, `number`, `boolean`
- Select/list fields: `type: "items"` with `format` such as `dropdown-list`, `checkbox-list`, `radio-list`
- Data-source fields: `items` fields with `source` (`products`, `categories`, etc.)
- Collection/repeater fields: `type: "collection"` with nested `fields`
- Validation metadata: `required`, `minLength`, `maxLength`, `step`, `minimum`, `maximum`
- UX metadata: `placeholder`, `description`, `multichoice`, `searchable`, `multilanguage`, `class`

## 4) Recommended folder anatomy for advanced components

Use this structure for maintainability:

```text
src/components/your-component/
  index.ts          # required entry
  types.ts          # request/response + config types
  state.ts          # optional state helpers
  view.ts           # optional render helpers
  styles.ts         # optional shared styles
  utils.ts          # optional pure utility functions
```

This repo currently uses:

- `product-card/types.ts` for API model typing
- inline styles/render in most components

## 5) Base implementation blueprint (Lit)

Use this as your default pattern:

```ts
import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

type MyConfig = {
  title?: string;
  enabled?: boolean;
  items?: Array<{ label: string; value: string }>;
};

export default class MyFeatureComponent extends LitElement {
  @property({ type: Object }) config?: MyConfig;
  @state() private loading = false;
  @state() private error?: string;

  static styles = css`
    :host { display: block; }
  `;

  async connectedCallback() {
    super.connectedCallback();
    // Optional async init
  }

  render() {
    if (!this.config) return html`<div>Configuration is required</div>`;
    if (this.error) return html`<div>${this.error}</div>`;
    return html`<div>${this.config.title ?? 'Untitled'}</div>`;
  }
}
```

## 6) Build feature-rich behavior with proven patterns from your code

### A) Config-driven rendering

Pattern used in `basic-inputs`, `advanced-inputs`, `items-select-input`, `dropdown-list-source-input`:

- Receive all values via `config`
- Iterate with `Object.entries(config)` when fields are dynamic
- Convert arrays/objects to readable text before rendering

Use when:

- Field set may evolve often in `twilight-bundle.json`
- You want low-maintenance component rendering

### B) Async data hydration (API-backed component)

Pattern used in `product-card`:

- Read selected item ID from config
- Wait for platform readiness (`Salla.onReady()`)
- Fetch details from API (`Salla.product.api.getDetails(id)`)
- Show skeleton while loading
- Render hydrated UI when data arrives

Suggested hardening:

- Add `try/catch` and user-facing fallback for fetch errors
- Validate selected config shape before API calls
- Guard against disconnected component updates

### C) Localization + RTL support

Pattern used in `getting-started-guide`:

- Detect RTL with `Salla.config.get('theme.is_rtl', true)`
- Register strings with `Salla.lang.addBulk(...)`
- Resolve labels using `Salla.lang.get(key)`
- Apply direction-aware classes (`rtl` / `ltr`) in markup and styles

Use when:

- Component includes substantial text or directional interactions
- UI motion/spacing differs between Arabic and English contexts

### D) Progressive UX states

Pattern used in `product-card` and `getting-started-guide`:

- Skeletons for loading
- Empty/fallback blocks for missing config
- Hover and responsive behavior through CSS media queries

Recommended state model:

- `idle`
- `loading`
- `ready`
- `empty`
- `error`

## 7) Designing powerful fields in `twilight-bundle.json`

### Example: API-backed selector + display options

```json
{
  "title": "Featured Product Card",
  "name": "featured-product-card",
  "key": "replace-with-unique-id",
  "icon": "sicon-album-photo",
  "image": "https://example.com/preview.png",
  "fields": [
    {
      "id": "product",
      "type": "items",
      "format": "dropdown-list",
      "source": "products",
      "label": "Product",
      "required": true,
      "multichoice": false,
      "searchable": true,
      "selected": []
    },
    {
      "id": "show_discount",
      "type": "boolean",
      "format": "switch",
      "label": "Show discount badge",
      "value": true
    },
    {
      "id": "title_limit",
      "type": "number",
      "format": "number",
      "label": "Title max length",
      "minimum": 20,
      "maximum": 120,
      "step": 1,
      "value": 60
    }
  ]
}
```

### Collection field pattern (repeater)

You already use this in `table-list`:

- `type: "collection"`
- `value`: initial list
- `fields`: sub-schema for each row/item

Use it for:

- FAQs
- feature bullets
- comparison rows
- icon lists

## 8) Wiring component config to TypeScript safely

Treat config as an API contract.

1. Define a TypeScript interface matching JSON field IDs.
2. Keep optionality aligned with field requirements.
3. Normalize data near render boundary.

Example:

```ts
type ProductCardConfig = {
  product?: Array<{ value: number; label: string }>;
  show_discount?: boolean;
  title_limit?: number;
};
```

Then:

```ts
@property({ type: Object }) config?: ProductCardConfig;
```

## 9) Advanced UX capabilities checklist

Use this checklist when building a new feature-rich component:

- Config schema includes validation (`required`, ranges, lengths)
- Supports empty/loading/error states
- Handles asynchronous APIs safely
- RTL and translations are implemented
- Responsive behavior exists for mobile/tablet/desktop
- Accessibility basics: semantic tags, alt text, button labels
- No hard crash when config is partially missing
- Stable defaults for all optional UI flags

## 10) Testing strategy for this repo

Current tests include plugin tests (`src/plugins/lit-import-map.test.ts`). Extend similarly for components:

- Unit-test pure helpers (formatters, mappers)
- DOM render tests with `vitest` + `jsdom`
- Assert fallback rendering when config is missing
- Assert API error UI if fetch fails
- Assert localization keys resolve for both `ar` and `en`

Suggested scripts:

```bash
pnpm vitest
pnpm build
pnpm dev
```

## 11) Common pitfalls and how to avoid them

- `name` mismatch between JSON and folder -> component not discovered
- No default export in `index.ts` -> transform/build failures
- Assuming `config` always exists -> runtime errors
- Not awaiting `Salla.onReady()` before APIs -> undefined behavior
- Over-coupling UI to exact response shape -> fragile rendering

## 12) Step-by-step: create a new rich component in this project

1. Generate scaffold:
   - `pnpm tw-create-component my-rich-component`
2. Add/adjust schema in `twilight-bundle.json` under `components[]`.
3. Implement `src/components/my-rich-component/index.ts`.
4. Add `types.ts` for config/API typing if needed.
5. Implement state machine (`loading`, `ready`, `error`).
6. Add localization keys if component contains text.
7. Verify in demo (`pnpm dev`).
8. Run tests/build (`pnpm vitest`, `pnpm build`).
9. Polish RTL/responsive/accessibility.

## 13) Optional `vite.config.ts` enhancements for larger bundles

- Limit demo to target components during development:

```ts
sallaDemoPlugin({
  components: ['product-card', 'table-list'],
})
```

- Customize demo layout and helper CSS/JS to speed QA sessions.
- Keep `litImportMapPlugin()` as `apply: 'serve'` to avoid production side effects.

## 14) Production readiness checklist

Before release:

- `twilight-bundle.json` component metadata complete (titles/icons/images/keys)
- All field IDs match runtime config usage
- No console errors in `pnpm dev`
- `pnpm build` succeeds and outputs expected files in `dist/`
- API-backed components gracefully handle empty/error responses
- Arabic/English rendering verified
- Visual quality verified at mobile and desktop breakpoints

---

If you want, the next step can be a concrete starter kit for one new advanced component (for example: `smart-product-grid`) with ready-to-copy `twilight-bundle.json` schema + full `index.ts`.
