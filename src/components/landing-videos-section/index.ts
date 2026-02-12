import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import type { SectionStyleConfig } from "../landing-shared/style";
import {
  getHeadingClass,
  getHeadingGradientStyle,
  getSectionShellStyle,
  getTextClass,
  getTextGradientStyle,
  getVimeoEmbed,
  getYoutubeEmbed,
  resolveStyleConfig,
  sectionBaseStyles,
} from "../landing-shared/style";

interface VideoItem {
  title?: string;
  provider: "mp4" | "youtube" | "vimeo";
  url: string;
  poster?: string;
}

interface LandingVideosSectionConfig extends SectionStyleConfig {
  heading?: string;
  videos?: VideoItem[];
  style?: SectionStyleConfig[];
}

export default class LandingVideosSection extends LitElement {
  @property({ type: Object })
  config?: LandingVideosSectionConfig;

  static styles = [
    sectionBaseStyles,
    css`
      .videos-carousel {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 8px;
      }

      .videos-carousel::-webkit-scrollbar {
        display: none;
      }

      .video-item {
        flex: 0 0 86%;
        border-radius: 14px;
        overflow: hidden;
        background: #000;
        scroll-snap-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .video-item video,
      .video-item iframe {
        width: 100%;
        height: auto;
        aspect-ratio: 9 / 16;
        display: block;
        border: 0;
        background: #000;
      }

      .video-caption {
        margin: 0;
        padding: 10px;
        font-size: var(--text-size-mobile, 13px);
        color: #fff;
        background: rgba(0, 0, 0, 0.45);
      }

      @media (min-width: 768px) {
        .video-item {
          flex-basis: 320px;
        }
      }
    `,
  ];

  private renderVideoItem(item: VideoItem, textClass: string, textStyle: string) {
    if (item.provider === "mp4") {
      return html`
        <div class="video-item">
          <video controls playsinline preload="metadata" .poster=${item.poster ?? ""}>
            <source src=${item.url} type="video/mp4" />
          </video>
          ${item.title ? html`<p class="video-caption ${textClass}" style=${textStyle}>${item.title}</p>` : ""}
        </div>
      `;
    }

    const embed = item.provider === "youtube" ? getYoutubeEmbed(item.url) : getVimeoEmbed(item.url);
    if (!embed) return html``;

    return html`
      <div class="video-item">
        <iframe
          src=${embed}
          title=${item.title ?? `${item.provider}-video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        ${item.title ? html`<p class="video-caption ${textClass}" style=${textStyle}>${item.title}</p>` : ""}
      </div>
    `;
  }

  render() {
    if (!this.config) {
      return html`<div style="color:#c00">Configuration is required</div>`;
    }

    const videos = this.config.videos ?? [];
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
        <div class="videos-carousel">${videos.map((item) => this.renderVideoItem(item, textClass, textStyle))}</div>
      </section>
    `;
  }
}
