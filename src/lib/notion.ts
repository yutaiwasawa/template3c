import { Client } from '@notionhq/client';

export interface SiteConfig {
  logo: {
    type: 'text' | 'image';
    content: string;
  };
  navigation: {
    label: string;
    url: string;
    order: number;
  }[];
}

const DEFAULT_CONFIG: SiteConfig = {
  logo: {
    type: 'text',
    content: 'PIXEL/FLOW'
  },
  navigation: [
    { label: '私たちについて', url: '#about', order: 1 },
    { label: 'ブログ', url: '#blog', order: 2 },
    { label: 'サービス', url: '#services', order: 3 },
    { label: 'お問い合わせ', url: '#contact', order: 4 }
  ]
};

export const getSiteConfig = async (): Promise<SiteConfig> => {
  try {
    if (!import.meta.env.VITE_NOTION_TOKEN || !import.meta.env.VITE_NOTION_SITE_CONFIG_DB_ID) {
      console.warn('Notion credentials not found, using default configuration');
      return DEFAULT_CONFIG;
    }

    const response = await fetch('/api/notion/v1/databases/' + import.meta.env.VITE_NOTION_SITE_CONFIG_DB_ID + '/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          or: [
            {
              property: 'type',
              select: {
                equals: 'navigation'
              }
            },
            {
              property: 'type',
              select: {
                equals: 'logo'
              }
            }
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Notion API');
    }

    const data = await response.json();

    // ロゴの設定を取得
    const logoPage = data.results.find(
      (page: any) => page.properties.type?.select?.name === 'logo'
    );

    const logo = logoPage ? {
      type: logoPage.properties.logoType?.select?.name as 'text' | 'image',
      content: logoPage.properties.content?.rich_text[0]?.plain_text || DEFAULT_CONFIG.logo.content,
    } : DEFAULT_CONFIG.logo;

    // ナビゲーション項目を取得
    const navItems = data.results
      .filter((page: any) => page.properties.type?.select?.name === 'navigation')
      .map((page: any) => ({
        label: page.properties.label?.rich_text[0]?.plain_text || '',
        url: page.properties.url?.url || '',
        order: page.properties.order?.number || 0,
      }))
      .sort((a, b) => a.order - b.order);

    return {
      logo,
      navigation: navItems.length > 0 ? navItems : DEFAULT_CONFIG.navigation,
    };
  } catch (error) {
    console.warn('Failed to fetch Notion configuration, using default:', error);
    return DEFAULT_CONFIG;
  }
};

export { DEFAULT_CONFIG };