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

interface ExpertCard {
  title?: string;
  content: string;
  highlight?: string;
}

interface LandingExpertSectionConfig extends SectionStyleConfig {
  heading?: string;
  banner?: string;
  cards?: ExpertCard[];
  style?: SectionStyleConfig[];
}

export default class LandingExpertSection extends LitElement {
  @property({ type: Object })
  config?: LandingExpertSectionConfig;

  static styles = [
    sectionBaseStyles,
    css`
      .banner {
        width: 100%;
        display: block;
        height: auto;
        border-radius: 10px;
        margin-bottom: 14px;
      }

      .cards-grid {
        display: grid;
        gap: 12px;
      }

      .expert-card {
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 14px;
        background: #f8f8f8;
      }

      .expert-title {
        margin: 0 0 8px;
        display: block;
        font-size: var(--heading-size-mobile, 18px);
        font-weight: 900;
        color: var(--heading-color, #111);
      }

      .expert-content {
        margin: 0;
      }

      .highlight {
        margin-top: 10px;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #e3e3e3;
        background: #fff;
        font-weight: 700;
      }
    `,
  ];

  render() {
    if (!this.config) {
      return html`<div style="color:#c00">Configuration is required</div>`;
    }

    const cards = this.config.cards ?? [];
    const styleConfig = resolveStyleConfig(this.config);
    const headingClass = getHeadingClass(styleConfig);
    const textClass = getTextClass(styleConfig);
    const headingStyle = getHeadingGradientStyle(styleConfig);
    const textStyle = getTextGradientStyle(styleConfig);

    return html`
      <section class="section-shell" style=${getSectionShellStyle(styleConfig)}>
        ${this.config.heading
          ? html`<h2 class="section-heading ${headingClass}" style=${headingStyle}>${this.config.heading}</h2>`
          : ""}
        ${this.config.banner ? html`<img class="banner positionable-image" src=${this.config.banner} alt="expert-banner" />` : ""}
        <div class="cards-grid">
          ${cards.map(
            (item) => html`
              <div class="expert-card">
                ${item.title ? html`<span class="expert-title ${headingClass}" style=${headingStyle}>${item.title}</span>` : ""}
                <p class="section-text expert-content ${textClass}" style=${textStyle}>${item.content}</p>
                ${item.highlight ? html`<div class="section-text highlight ${textClass}" style=${textStyle}>${item.highlight}</div>` : ""}
              </div>
            `,
          )}
        </div>
      </section>
    `;
  }
}
