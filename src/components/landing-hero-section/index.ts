import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import type { SectionStyleConfig } from "../landing-shared/style";
import {
  getHeadingClass,
  getHeadingGradientStyle,
  getSectionShellStyle,
  getTextClass,
  getTextGradientStyle,
  resolveStyleConfig,
  sectionBaseStyles,
} from "../landing-shared/style";

interface HeroImageItem {
  url: string;
  alt?: string;
}

interface ProductSelectorItem {
  value: number | string;
  label: string;
}

interface ProductData {
  name?: string;
  price?: number;
  regular_price?: number;
  image?: {
    url?: string;
    alt?: string | null;
  };
}

interface LandingHeroSectionConfig extends SectionStyleConfig {
  heading?: string;
  subtitle?: string;
  images?: HeroImageItem[];
  product?: ProductSelectorItem[];
  use_product_data?: boolean;
  price_current?: number;
  price_old?: number;
  price_save?: number;
  style?: SectionStyleConfig[];
}

export default class LandingHeroSection extends LitElement {
  @property({ type: Object })
  config?: LandingHeroSectionConfig;

  @state()
  private activeSlide = 0;

  @state()
  private productData?: ProductData;

  private productRequestId = 0;

  static styles = [
    sectionBaseStyles,
    css`
      .custom-slider-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
      }

      .custom-slider-track {
        display: flex;
        transition: transform 0.35s ease;
      }

      .custom-slide {
        min-width: 100%;
        width: 100%;
      }

      .custom-slide img {
        width: 100%;
        display: block;
        height: auto;
        border-radius: 8px;
        object-fit: cover;
      }

      .custom-thumbs-container {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
      }

      .custom-thumb-item {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 8px;
        border: 2px solid #ddd;
        opacity: 0.65;
        cursor: pointer;
        transition: 0.25s ease;
      }

      .custom-thumb-item.active {
        border-color: #111;
        opacity: 1;
        transform: scale(1.06);
      }

      .custom-price-wrapper {
        margin-top: 14px;
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }

      .current-price {
        font-size: 28px;
        line-height: 1;
        font-weight: 900;
        color: #c00;
      }

      .old-price-wrap {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #888;
        font-size: 14px;
      }

      .old-price {
        color: #999;
        text-decoration: line-through;
      }

      .save-badge {
        display: inline-flex;
        align-items: center;
        border: 1px solid #c00;
        border-radius: 6px;
        color: #c00;
        background: #fff;
        padding: 5px 10px;
        font-size: 13px;
        font-weight: 800;
      }
    `,
  ];

  private onSelectSlide(index: number) {
    this.activeSlide = index;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadSelectedProduct();
  }

  protected updated(changedProps: Map<string, unknown>) {
    if (changedProps.has("config")) {
      this.loadSelectedProduct();
      this.activeSlide = 0;
    }
  }

  private async loadSelectedProduct() {
    if (!this.config?.use_product_data) {
      this.productData = undefined;
      return;
    }

    const selected = this.config.product?.[0];
    const productId = Number(selected?.value);
    if (!productId || Number.isNaN(productId)) {
      this.productData = undefined;
      return;
    }

    const requestId = ++this.productRequestId;
    try {
      await (window as any).Salla?.onReady?.();
      const response = await (window as any).Salla?.product?.api?.getDetails?.(productId);
      if (requestId !== this.productRequestId) return;
      this.productData = response?.data;
    } catch (error) {
      if (requestId !== this.productRequestId) return;
      this.productData = undefined;
      console.error("landing-hero-section: failed to load selected product", error);
    }
  }

  render() {
    if (!this.config) {
      return html`<div style="color:#c00">Configuration is required</div>`;
    }

    const resolvedCurrent = this.config.price_current ?? this.productData?.price ?? 0;
    const resolvedOld = this.config.price_old ?? this.productData?.regular_price ?? 0;
    const resolvedSave =
      this.config.price_save ??
      (resolvedOld > resolvedCurrent && resolvedCurrent > 0 ? resolvedOld - resolvedCurrent : 0);
    const images =
      this.config.images && this.config.images.length > 0
        ? this.config.images
        : this.productData?.image?.url
          ? [{ url: this.productData.image.url, alt: this.productData.image.alt ?? this.productData.name ?? "hero-image" }]
          : [];
    const styleConfig = resolveStyleConfig(this.config);
    const headingClass = getHeadingClass(styleConfig);
    const textClass = getTextClass(styleConfig);
    const shellStyle = getSectionShellStyle(styleConfig);
    const resolvedHeading = this.config.heading || this.productData?.name;

    return html`
      <section class="section-shell" style=${shellStyle}>
        ${resolvedHeading
          ? html`<h2 class="section-heading ${headingClass}" style=${getHeadingGradientStyle(styleConfig)}>
              ${resolvedHeading}
            </h2>`
          : ""}
        ${this.config.subtitle
          ? html`<p class="section-text ${textClass}" style=${getTextGradientStyle(styleConfig)}>
              ${this.config.subtitle}
            </p>`
          : ""}

        ${images.length
          ? html`
              <div class="custom-slider-wrapper">
                <div class="custom-slider-track" style=${`transform:translateX(-${this.activeSlide * 100}%);`}>
                  ${images.map(
                    (item) => html`
                      <div class="custom-slide">
                        <img class="positionable-image" src=${item.url} alt=${item.alt ?? "hero-image"} />
                      </div>
                    `,
                  )}
                </div>
              </div>
              <div class="custom-thumbs-container">
                ${images.map(
                  (item, index) => html`
                    <img
                      class="custom-thumb-item ${index === this.activeSlide ? "active" : ""}"
                      src=${item.url}
                      alt=${item.alt ?? `thumb-${index + 1}`}
                      @click=${() => this.onSelectSlide(index)}
                    />
                  `,
                )}
              </div>
            `
          : ""}

        ${resolvedCurrent > 0
          ? html`
              <div class="custom-price-wrapper">
                <span class="current-price">${resolvedCurrent}</span>
                ${resolvedOld > 0
                  ? html`
                      <span class="old-price-wrap">
                        <span>بدلاً من</span>
                        <span class="old-price">${resolvedOld}</span>
                      </span>
                    `
                  : ""}
                ${resolvedSave > 0
                  ? html`<span class="save-badge">وفر ${resolvedSave}</span>`
                  : ""}
              </div>
            `
          : ""}
      </section>
    `;
  }
}
