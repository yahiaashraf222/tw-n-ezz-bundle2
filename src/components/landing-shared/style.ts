import { css } from "lit";

export interface SectionStyleConfig {
  section_opacity?: number;
  padding_mobile?: string;
  padding_tablet?: string;
  padding_desktop?: string;
  margin_mobile?: string;
  margin_tablet?: string;
  margin_desktop?: string;
  background_color?: string;
  background_opacity?: number;
  border_width?: number;
  border_style?: string;
  border_color?: string;
  border_opacity?: number;
  border_radius?: number;
  shadow_x?: number;
  shadow_y?: number;
  shadow_blur?: number;
  shadow_spread?: number;
  shadow_color?: string;
  shadow_opacity?: number;
  enable_image_positioning?: boolean;
  image_x_mobile?: number;
  image_y_mobile?: number;
  image_x_tablet?: number;
  image_y_tablet?: number;
  image_x_desktop?: number;
  image_y_desktop?: number;
  heading_color?: string;
  heading_font_mobile?: number;
  heading_font_tablet?: number;
  heading_font_desktop?: number;
  heading_gradient_enabled?: boolean;
  heading_gradient_start?: string;
  heading_gradient_end?: string;
  text_color?: string;
  text_font_mobile?: number;
  text_font_tablet?: number;
  text_font_desktop?: number;
  text_gradient_enabled?: boolean;
  text_gradient_start?: string;
  text_gradient_end?: string;
}

export interface StyleCarrier extends SectionStyleConfig {
  style?: SectionStyleConfig[];
}

const defaults: Required<SectionStyleConfig> = {
  section_opacity: 1,
  padding_mobile: "16px",
  padding_tablet: "20px",
  padding_desktop: "24px",
  margin_mobile: "12px 0",
  margin_tablet: "14px 0",
  margin_desktop: "16px 0",
  background_color: "#ffffff",
  background_opacity: 1,
  border_width: 1,
  border_style: "solid",
  border_color: "#eaeaea",
  border_opacity: 1,
  border_radius: 12,
  shadow_x: 0,
  shadow_y: 4,
  shadow_blur: 12,
  shadow_spread: 0,
  shadow_color: "#000000",
  shadow_opacity: 0.08,
  enable_image_positioning: false,
  image_x_mobile: 0,
  image_y_mobile: 0,
  image_x_tablet: 0,
  image_y_tablet: 0,
  image_x_desktop: 0,
  image_y_desktop: 0,
  heading_color: "#111111",
  heading_font_mobile: 24,
  heading_font_tablet: 28,
  heading_font_desktop: 32,
  heading_gradient_enabled: false,
  heading_gradient_start: "#111111",
  heading_gradient_end: "#444444",
  text_color: "#444444",
  text_font_mobile: 14,
  text_font_tablet: 16,
  text_font_desktop: 17,
  text_gradient_enabled: false,
  text_gradient_start: "#444444",
  text_gradient_end: "#666666",
};

export const sectionBaseStyles = css`
  :host {
    display: block;
    direction: rtl;
    text-align: right;
    color: #1a1a1a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, sans-serif;
  }

  .section-shell {
    padding: var(--section-padding-mobile, 16px);
    margin: var(--section-margin-mobile, 12px 0);
    background: var(--section-bg, #fff);
    border-width: var(--section-border-width, 1px);
    border-style: var(--section-border-style, solid);
    border-color: var(--section-border-color, #eaeaea);
    border-radius: var(--section-border-radius, 12px);
    box-shadow: var(--section-shadow, 0 4px 12px rgba(0, 0, 0, 0.08));
    opacity: var(--section-opacity, 1);
  }

  .section-heading {
    margin: 0 0 12px;
    font-size: var(--heading-size-mobile, 24px);
    line-height: 1.3;
    font-weight: 900;
    color: var(--heading-color, #111);
  }

  .section-text {
    margin: 0;
    font-size: var(--text-size-mobile, 14px);
    line-height: 1.8;
    color: var(--text-color, #444);
    white-space: pre-line;
  }

  .gradient-text {
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .positionable-image {
    transform: translate(var(--img-x-mobile, 0px), var(--img-y-mobile, 0px));
    transition: transform 0.25s ease;
  }

  @media (min-width: 768px) {
    .section-shell {
      padding: var(--section-padding-tablet, 20px);
      margin: var(--section-margin-tablet, 14px 0);
    }

    .section-heading {
      font-size: var(--heading-size-tablet, 28px);
    }

    .section-text {
      font-size: var(--text-size-tablet, 16px);
    }

    .positionable-image {
      transform: translate(var(--img-x-tablet, 0px), var(--img-y-tablet, 0px));
    }
  }

  @media (min-width: 1024px) {
    .section-shell {
      padding: var(--section-padding-desktop, 24px);
      margin: var(--section-margin-desktop, 16px 0);
    }

    .section-heading {
      font-size: var(--heading-size-desktop, 32px);
    }

    .section-text {
      font-size: var(--text-size-desktop, 17px);
    }

    .positionable-image {
      transform: translate(var(--img-x-desktop, 0px), var(--img-y-desktop, 0px));
    }
  }
`;

function clampOpacity(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(1, Math.max(0, value));
}

function colorWithOpacity(color: string, opacity: number): string {
  if (color.startsWith("#")) {
    const raw = color.slice(1);
    const hex = raw.length === 3 ? raw.split("").map((p) => `${p}${p}`).join("") : raw;
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
  return color;
}

function toStyleString(entries: Record<string, string | number>): string {
  return Object.entries(entries)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
}

function merged(style: SectionStyleConfig = {}): Required<SectionStyleConfig> {
  return { ...defaults, ...style };
}

export function getSectionShellStyle(style: SectionStyleConfig): string {
  const cfg = merged(style);
  const background = colorWithOpacity(cfg.background_color, clampOpacity(cfg.background_opacity, 1));
  const borderColor = colorWithOpacity(cfg.border_color, clampOpacity(cfg.border_opacity, 1));
  const shadowColor = colorWithOpacity(cfg.shadow_color, clampOpacity(cfg.shadow_opacity, 0.08));

  return toStyleString({
    "--section-padding-mobile": cfg.padding_mobile,
    "--section-padding-tablet": cfg.padding_tablet,
    "--section-padding-desktop": cfg.padding_desktop,
    "--section-margin-mobile": cfg.margin_mobile,
    "--section-margin-tablet": cfg.margin_tablet,
    "--section-margin-desktop": cfg.margin_desktop,
    "--section-bg": background,
    "--section-border-width": `${cfg.border_width}px`,
    "--section-border-style": cfg.border_style,
    "--section-border-color": borderColor,
    "--section-border-radius": `${cfg.border_radius}px`,
    "--section-shadow": `${cfg.shadow_x}px ${cfg.shadow_y}px ${cfg.shadow_blur}px ${cfg.shadow_spread}px ${shadowColor}`,
    "--section-opacity": `${clampOpacity(cfg.section_opacity, 1)}`,
    "--heading-size-mobile": `${cfg.heading_font_mobile}px`,
    "--heading-size-tablet": `${cfg.heading_font_tablet}px`,
    "--heading-size-desktop": `${cfg.heading_font_desktop}px`,
    "--text-size-mobile": `${cfg.text_font_mobile}px`,
    "--text-size-tablet": `${cfg.text_font_tablet}px`,
    "--text-size-desktop": `${cfg.text_font_desktop}px`,
    "--heading-color": cfg.heading_color,
    "--text-color": cfg.text_color,
    "--img-x-mobile": `${cfg.enable_image_positioning ? cfg.image_x_mobile : 0}px`,
    "--img-y-mobile": `${cfg.enable_image_positioning ? cfg.image_y_mobile : 0}px`,
    "--img-x-tablet": `${cfg.enable_image_positioning ? cfg.image_x_tablet : 0}px`,
    "--img-y-tablet": `${cfg.enable_image_positioning ? cfg.image_y_tablet : 0}px`,
    "--img-x-desktop": `${cfg.enable_image_positioning ? cfg.image_x_desktop : 0}px`,
    "--img-y-desktop": `${cfg.enable_image_positioning ? cfg.image_y_desktop : 0}px`,
  });
}

export function getHeadingClass(style: SectionStyleConfig): string {
  return style.heading_gradient_enabled ? "gradient-text" : "";
}

export function getTextClass(style: SectionStyleConfig): string {
  return style.text_gradient_enabled ? "gradient-text" : "";
}

export function getHeadingGradientStyle(style: SectionStyleConfig): string {
  if (!style.heading_gradient_enabled) return "";
  const cfg = merged(style);
  return `background:linear-gradient(90deg, ${cfg.heading_gradient_start}, ${cfg.heading_gradient_end});`;
}

export function getTextGradientStyle(style: SectionStyleConfig): string {
  if (!style.text_gradient_enabled) return "";
  const cfg = merged(style);
  return `background:linear-gradient(90deg, ${cfg.text_gradient_start}, ${cfg.text_gradient_end});`;
}

export function getYoutubeEmbed(url: string): string {
  const match =
    url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/) ?? [];
  const id = match[1];
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

export function getVimeoEmbed(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/) ?? [];
  const id = match[1];
  return id ? `https://player.vimeo.com/video/${id}` : "";
}

export function resolveStyleConfig(config: StyleCarrier): SectionStyleConfig {
  if (Array.isArray(config.style) && config.style.length > 0) {
    return config.style[0];
  }
  return config;
}
