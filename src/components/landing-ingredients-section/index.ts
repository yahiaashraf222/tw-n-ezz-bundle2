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

interface IngredientCard {
  title: string;
  main_title?: string;
  top_notes?: string;
  middle_notes?: string;
  base_notes?: string;
}

interface LandingIngredientsSectionConfig extends SectionStyleConfig {
  heading?: string;
  cards?: IngredientCard[];
  style?: SectionStyleConfig[];
}

export default class LandingIngredientsSection extends LitElement {
  @property({ type: Object })
  config?: LandingIngredientsSectionConfig;

  static styles = [
    sectionBaseStyles,
    css`
      .cards-grid {
        display: grid;
        gap: 14px;
      }

      .card-title {
        margin: 0 0 10px;
        padding-bottom: 10px;
        border-bottom: 2px solid #f0f0f0;
        text-align: center;
        font-weight: 900;
        font-size: var(--heading-size-mobile, 22px);
        color: var(--heading-color, #111);
      }

      .main-title {
        margin: 0 0 12px;
        text-align: center;
        font-weight: 800;
        font-size: var(--text-size-mobile, 15px);
        color: var(--text-color, #444);
      }

      .group-title {
        margin: 0 0 8px;
        text-align: center;
        font-weight: 700;
        font-size: var(--text-size-mobile, 14px);
        color: var(--text-color, #444);
      }

      .notes {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        margin-bottom: 12px;
      }

      .note {
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid #ececec;
        background: #fff;
        color: #333;
        font-size: 13px;
      }
    `,
  ];

  private parseNotes(value: string | undefined): string[] {
    if (!value) return [];
    return value
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  }

  private renderGroup(label: string, values: string[], textClass: string, textStyle: string) {
    if (!values.length) return html``;
    return html`
      <p class="group-title ${textClass}" style=${textStyle}>${label}</p>
      <div class="notes">${values.map((note) => html`<span class="note">${note}</span>`)}</div>
    `;
  }

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
        <div class="cards-grid">
          ${cards.map((card) => {
            const top = this.parseNotes(card.top_notes);
            const middle = this.parseNotes(card.middle_notes);
            const base = this.parseNotes(card.base_notes);
            return html`
              <div class="section-shell">
                <h3 class="card-title ${headingClass}" style=${headingStyle}>${card.title}</h3>
                ${card.main_title ? html`<p class="main-title ${textClass}" style=${textStyle}>${card.main_title}</p>` : ""}
                ${this.renderGroup("مقدمة العطر", top, textClass, textStyle)}
                ${this.renderGroup("قلب العطر", middle, textClass, textStyle)}
                ${this.renderGroup("قاعدة العطر", base, textClass, textStyle)}
              </div>
            `;
          })}
        </div>
      </section>
    `;
  }
}
