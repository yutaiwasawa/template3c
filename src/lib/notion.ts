import { Client } from '@notionhq/client';

export interface SiteConfig {
  logo: {
    type: 'text' | 'image';
    content: string;
    color: string;
  };
  baseColor: string;
  mainColor: string;
  accentColor: string;
  fontColor: string;
  font: string;
}

export const DEFAULT_CONFIG: SiteConfig = {
  logo: {
    type: 'text',
    content: 'PIXEL/FLOW',
    color: '#ffffff'
  },
  baseColor: '#000000',
  mainColor: '#6366f1',
  accentColor: '#4f46e5',
  fontColor: '#ffffff',
  font: 'Noto Sans JP'
};

const isValidColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
  const rgbaRegex = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01]?\.?\d*)\s*\)$/;
  const hslRegex = /^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/;
  const hslaRegex = /^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([01]?\.?\d*)\s*\)$/;

  return [hexRegex, rgbRegex, rgbaRegex, hslRegex, hslaRegex].some(regex => regex.test(color));
};

export const getSiteConfig = async (): Promise<SiteConfig> => {
  try {
    const token = import.meta.env.VITE_NOTION_TOKEN;
    const dbId = import.meta.env.VITE_NOTION_COMMON_DB_ID;

    if (!token || !dbId) {
      return DEFAULT_CONFIG;
    }

    const response = await fetch(`/api/notion/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      return DEFAULT_CONFIG;
    }

    const data = await response.json();
    const commonPage = data.results[0];

    if (!commonPage) {
      return DEFAULT_CONFIG;
    }

    let logoType: 'text' | 'image' = 'text';
    let logoContent = DEFAULT_CONFIG.logo.content;
    let logoColor = commonPage.properties.LogoColor?.rich_text[0]?.plain_text || DEFAULT_CONFIG.logo.color;

    const logoImage = commonPage.properties.LogoImage?.files[0];
    if (logoImage) {
      logoType = 'image';
      if (logoImage.file?.url) {
        logoContent = logoImage.file.url;
      } else if (logoImage.external?.url) {
        logoContent = logoImage.external.url;
      }
    } else {
      logoContent = commonPage.properties.LogoText?.rich_text[0]?.plain_text || DEFAULT_CONFIG.logo.content;
    }

    if (!isValidColor(logoColor)) {
      logoColor = DEFAULT_CONFIG.logo.color;
    }

    const config: SiteConfig = {
      logo: {
        type: logoType,
        content: logoContent,
        color: logoColor
      },
      baseColor: commonPage.properties.BaseColor?.rich_text[0]?.plain_text || DEFAULT_CONFIG.baseColor,
      mainColor: commonPage.properties.MainColor?.rich_text[0]?.plain_text || DEFAULT_CONFIG.mainColor,
      accentColor: commonPage.properties.AccentColor?.rich_text[0]?.plain_text || DEFAULT_CONFIG.accentColor,
      fontColor: commonPage.properties.FontColor?.rich_text[0]?.plain_text || DEFAULT_CONFIG.fontColor,
      font: commonPage.properties.Font?.select?.name || DEFAULT_CONFIG.font
    };

    ['baseColor', 'mainColor', 'accentColor', 'fontColor'].forEach((colorKey) => {
      const color = config[colorKey as keyof SiteConfig] as string;
      if (!isValidColor(color)) {
        config[colorKey as keyof SiteConfig] = DEFAULT_CONFIG[colorKey as keyof SiteConfig];
      }
    });

    return config;
  } catch (error) {
    return DEFAULT_CONFIG;
  }
};