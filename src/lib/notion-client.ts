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
      throw new Error('設定の取得に失敗しました');
    }

    const data = await response.json();
    const page = data.results[0];

    if (!page) return null;

    let logoContent = '';
    let logoType: 'text' | 'image' = 'text';

    // 画像ロゴの確認
    const logoImage = page.properties.LogoImage?.files[0];
    if (logoImage) {
      logoType = 'image';
      if (logoImage.file?.url) {
        logoContent = logoImage.file.url;
      } else if (logoImage.external?.url) {
        logoContent = logoImage.external.url;
      }
    }

    // 画像が設定されていない場合はテキストを使用
    if (!logoContent) {
      logoContent = page.properties.LogoText?.rich_text[0]?.plain_text || 'PIXEL/FLOW';
      logoType = 'text';
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
    console.error('共通設定の取得に失敗しました:', error);
    return null;
  }
}

export async function fetchNavigation(): Promise<NavigationItem[]> {
  try {
    const response = await fetch(`/api/notion/v1/databases/${NAVIGATION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [
          {
            property: 'HeaderOrder',
            direction: 'ascending'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('ナビゲーションの取得に失敗しました');
    }

    const data = await response.json();
    
    return data.results.map((page: any) => ({
      label: page.properties.Label.title[0]?.plain_text || '',
      url: page.properties.URL.url || '#',
      headerOrder: page.properties.HeaderOrder.number || 0,
      footerOrder: page.properties.FooterOrder.number || 0,
      showInHeader: page.properties.ShowInHeader.checkbox || false,
      showInFooter: page.properties.ShowInFooter.checkbox || false
    }));
  } catch (error) {
    console.error('ナビゲーションの取得に失敗しました:', error);
    return [];
  }
}