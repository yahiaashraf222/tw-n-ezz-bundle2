import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
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

interface FeatureItem {
  icon?: string;
  title: string;
  subtitle?: string;
}

interface LandingFeaturesSectionConfig extends SectionStyleConfig {
  heading?: string;
  items?: FeatureItem[];
  style?: SectionStyleConfig[];
}

export default class LandingFeaturesSection extends LitElement {
  @property({ type: Object })
  config?: LandingFeaturesSectionConfig;

  static styles = [
    sectionBaseStyles,
    css`
      .features-grid {
        display: grid;
        gap: 14px;
      }

      .feature-row {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 12px;
      }

      .feature-icon-wrapper {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
      }

      .feature-icon-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .feature-text-content {
        flex: 1;
      }

      .feature-title {
        margin: 0 0 4px;
        font-size: var(--heading-size-mobile, 17px);
        line-height: 1.3;
        font-weight: 800;
        color: var(--heading-color, #111);
      }

      .feature-subtitle {
        margin: 0;
        font-size: var(--text-size-mobile, 14px);
        line-height: 1.8;
        color: var(--text-color, #555);
        white-space: pre-line;
      }

      @media (min-width: 768px) {
        .feature-title {
          font-size: var(--heading-size-tablet, 19px);
        }

        .feature-subtitle {
          font-size: var(--text-size-tablet, 15px);
        }
      }

      @media (min-width: 1024px) {
        .feature-title {
          font-size: var(--heading-size-desktop, 20px);
        }

        .feature-subtitle {
          font-size: var(--text-size-desktop, 16px);
        }
      }
    `,
  ];

  render() {
    if (!this.config) {
      return html`<div style="color:#c00">Configuration is required</div>`;
    }

    const items = this.config.items ?? [];
    const styleConfig = resolveStyleConfig(this.config);
    const headingClass = getHeadingClass(styleConfig);
    const textClass = getTextClass(styleConfig);

    return html`
      <section class="section-shell" style=${getSectionShellStyle(styleConfig)}>
        ${this.config.heading
          ? html`<h2 class="section-heading ${headingClass}" style=${getHeadingGradientStyle(styleConfig)}>
              ${this.config.heading}
            </h2>`
          : ""}
        <div class="features-grid">
          ${items.map(
            (item) => html`
              <div class="feature-row">
                ${item.icon
                  ? html`
                      <div class="feature-icon-wrapper">
                        <img class="positionable-image" src=${item.icon} alt=${item.title} />
                      </div>
                    `
                  : ""}
                <div class="feature-text-content">
                  <p class="feature-title ${headingClass}" style=${getHeadingGradientStyle(styleConfig)}>${item.title}</p>
                  ${item.subtitle
                    ? html`
                        <p class="feature-subtitle ${textClass}" style=${getTextGradientStyle(styleConfig)}>
                          ${item.subtitle}
                        </p>
                      `
                    : ""}
                </div>
              </div>
            `,
          )}
        </div>
      </section>
    `;
  }
}
