import { Client } from '@notionhq/client';
import type { CommonConfig, NavigationItem, HeroSection } from '../types/notion';

const NOTION_TOKEN = import.meta.env.VITE_NOTION_TOKEN;
const COMMON_DB_ID = import.meta.env.VITE_NOTION_COMMON_DB_ID;
const NAVIGATION_DB_ID = import.meta.env.VITE_NOTION_NAVIGATION_DB_ID;
const HERO_DB_ID = import.meta.env.VITE_NOTION_HERO_DB_ID;

export async function fetchCommonConfig(): Promise<CommonConfig | null> {
  try {
    const response = await fetch(`/api/notion/v1/databases/${COMMON_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch common config');
    }

    const data = await response.json();
    const page = data.results[0];

    if (!page) return null;

    const logoType = page.properties.LogoType.select?.name || 'text';
    let logoContent = '';

    // LogoTypeに基づいて適切なプロパティから値を取得
    if (logoType === 'text') {
      // テキストロゴの場合
      logoContent = page.properties.LogoText?.rich_text[0]?.plain_text || 'PIXEL/FLOW';
    } else {
      // 画像ロゴの場合
      const logoFile = page.properties.LogoImage?.files[0];
      if (logoFile) {
        // Notionにアップロードされた画像の場合
        if (logoFile.file?.url) {
          logoContent = logoFile.file.url;
        }
        // 外部URLの場合
        else if (logoFile.external?.url) {
          logoContent = logoFile.external.url;
        }
      }
      
      // 画像が設定されていない場合は、LogoTextをフォールバックとして使用
      if (!logoContent) {
        logoContent = page.properties.LogoText?.rich_text[0]?.plain_text || 'PIXEL/FLOW';
        logoType = 'text'; // 画像が無い場合はテキストモードにフォールバック
      }
    }

    return {
      baseColor: page.properties.BaseColor.rich_text[0]?.plain_text || '#000000',
      mainColor: page.properties.MainColor.rich_text[0]?.plain_text || '#6366f1',
      accentColor: page.properties.AccentColor.rich_text[0]?.plain_text || '#4f46e5',
      fontColor: page.properties.FontColor.rich_text[0]?.plain_text || '#ffffff',
      font: page.properties.Font.select?.name || 'Noto Sans JP',
      logoType,
      logoContent
    };
  } catch (error) {
    console.error('Error fetching common config:', error);
    return null;
  }
}