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
    const dbId = import.meta.env.VITE_NOTION_SITE_CONFIG_DB_ID;

    if (!token || !dbId) {
      console.warn('Notion credentials not found:', { token: !!token, dbId: !!dbId });
      return DEFAULT_CONFIG;
    }

    const response = await fetch(`/api/notion/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    const commonPage = data.results[0];

    if (!commonPage) {
      console.warn('No common configuration found in Notion');
      return DEFAULT_CONFIG;
    }

    // ロゴの設定を取得
    let logoType: 'text' | 'image' = 'text';
    let logoContent = DEFAULT_CONFIG.logo.content;
    let logoColor = commonPage.properties.LogoColor?.rich_text[0]?.plain_text || DEFAULT_CONFIG.logo.color;

    // 画像ロゴの確認
    const logoImage = commonPage.properties.LogoImage?.files[0];
    if (logoImage) {
      logoType = 'image';
      if (logoImage.file?.url) {
        logoContent = logoImage.file.url;
      } else if (logoImage.external?.url) {
        logoContent = logoImage.external.url;
      }
    } else {
      // 画像が設定されていない場合はテキストを使用
      logoContent = commonPage.properties.LogoText?.rich_text[0]?.plain_text || DEFAULT_CONFIG.logo.content;
    }

    // ロゴの色が有効なカラーコードでない場合はデフォルト値を使用
    if (!isValidColor(logoColor)) {
      console.warn('Invalid logo color:', logoColor);
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

    // カラーコードの検証
    ['baseColor', 'mainColor', 'accentColor', 'fontColor'].forEach((colorKey) => {
      const color = config[colorKey as keyof SiteConfig] as string;
      if (!isValidColor(color)) {
        console.warn(`Invalid color for ${colorKey}:`, color);
        config[colorKey as keyof SiteConfig] = DEFAULT_CONFIG[colorKey as keyof SiteConfig];
      }
    });

    return config;
  } catch (error) {
    console.error('Failed to fetch Notion configuration:', error);
    return DEFAULT_CONFIG;
  }
};