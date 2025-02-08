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

export const DEFAULT_CONFIG: SiteConfig = {
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
    const token = import.meta.env.VITE_NOTION_TOKEN;
    const dbId = import.meta.env.VITE_NOTION_SITE_CONFIG_DB_ID;

    if (!token || !dbId) {
      console.warn('Notion credentials not found, using default configuration');
      return DEFAULT_CONFIG;
    }

    const response = await fetch(`/api/notion/v1/databases/${dbId}/query`, {
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
      throw new Error(`Notion API error: ${response.status}`);
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
      .map((page: any) => {
        // URLプロパティの取得を修正
        let url = '';
        const urlProp = page.properties.url;
        
        if (urlProp?.type === 'url' && urlProp.url) {
          url = urlProp.url;
        } else if (urlProp?.rich_text?.[0]?.plain_text) {
          url = urlProp.rich_text[0].plain_text;
        }

        return {
          label: page.properties.label?.rich_text[0]?.plain_text || '',
          url: url || '#',
          order: page.properties.order?.number || 0,
        };
      })
      .sort((a, b) => a.order - b.order);

    return {
      logo,
      navigation: navItems.length > 0 ? navItems : DEFAULT_CONFIG.navigation,
    };
  } catch (error) {
    console.error('Failed to fetch Notion configuration:', error);
    return DEFAULT_CONFIG;
  }
};