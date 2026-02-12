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

interface LandingDescriptionSectionConfig extends SectionStyleConfig {
  heading?: string;
  body?: string;
  highlight?: string;
  image?: string;
  style?: SectionStyleConfig[];
}

export default class LandingDescriptionSection extends LitElement {
  @property({ type: Object })
  config?: LandingDescriptionSectionConfig;

  static styles = [
    sectionBaseStyles,
    css`
      .description-image {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 10px;
        margin-bottom: 12px;
        object-fit: cover;
      }

      .desc-highlight {
        margin-top: 10px;
        font-weight: 700;
      }
    `,
  ];

  render() {
    if (!this.config) {
      return html`<div style="color:#c00">Configuration is required</div>`;
    }

    const styleConfig = resolveStyleConfig(this.config);
    const headingClass = getHeadingClass(styleConfig);
    const textClass = getTextClass(styleConfig);

    return html`
      <section class="section-shell" style=${getSectionShellStyle(styleConfig)}>
        ${this.config.image ? html`<img class="description-image positionable-image" src=${this.config.image} alt="section-image" />` : ""}
        ${this.config.heading
          ? html`<h2 class="section-heading ${headingClass}" style=${getHeadingGradientStyle(styleConfig)}>
              ${this.config.heading}
            </h2>`
          : ""}
        ${this.config.body
          ? html`<p class="section-text ${textClass}" style=${getTextGradientStyle(styleConfig)}>${this.config.body}</p>`
          : ""}
        ${this.config.highlight
          ? html`
              <p class="section-text desc-highlight ${textClass}" style=${getTextGradientStyle(styleConfig)}>
                ${this.config.highlight}
              </p>
            `
          : ""}
      </section>
    `;
  }
}
