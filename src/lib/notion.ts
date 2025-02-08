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
  header: {
    tagline: string;
    title: string[];
    subtitle: string[];
    ctaText: string;
    ctaUrl: string;
    heroImage: string;
    overlayColors: {
      from: string;
      to: string;
      opacity: number;
    };
  };
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
  ],
  header: {
    tagline: 'Digital Marketing Agency',
    title: ['デジタルの力で', 'ビジネスの未来を創造する'],
    subtitle: ['戦略的なデジタルマーケティングで', 'あなたのビジネスを次のステージへ'],
    ctaText: '私たちについて',
    ctaUrl: '#about',
    heroImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    overlayColors: {
      from: '#7e22ce',
      to: '#4338ca',
      opacity: 0.9
    }
  }
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
            },
            {
              property: 'type',
              select: {
                equals: 'header'
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

    const logoPage = data.results.find(
      (page: any) => page.properties.type?.select?.name === 'logo'
    );

    const logo = logoPage ? {
      type: logoPage.properties.logoType?.select?.name as 'text' | 'image',
      content: logoPage.properties.content?.rich_text[0]?.plain_text || DEFAULT_CONFIG.logo.content,
    } : DEFAULT_CONFIG.logo;

    const navItems = data.results
      .filter((page: any) => page.properties.type?.select?.name === 'navigation')
      .map((page: any) => ({
        label: page.properties.label?.rich_text[0]?.plain_text || '',
        url: page.properties.url?.url || page.properties.url?.rich_text?.[0]?.plain_text || '#',
        order: page.properties.order?.number || 0,
      }))
      .sort((a, b) => a.order - b.order);

    const headerPage = data.results.find(
      (page: any) => page.properties.type?.select?.name === 'header'
    );

    const header = headerPage ? {
      tagline: headerPage.properties.tagline?.rich_text[0]?.plain_text || DEFAULT_CONFIG.header.tagline,
      title: (headerPage.properties.title?.rich_text[0]?.plain_text || '')
        .split('_')
        .filter(line => line.length > 0) || DEFAULT_CONFIG.header.title,
      subtitle: (headerPage.properties.subtitle?.rich_text[0]?.plain_text || '')
        .split('_')
        .filter(line => line.length > 0) || DEFAULT_CONFIG.header.subtitle,
      ctaText: headerPage.properties.ctaText?.rich_text[0]?.plain_text || DEFAULT_CONFIG.header.ctaText,
      ctaUrl: headerPage.properties.ctaUrl?.url || headerPage.properties.ctaUrl?.rich_text?.[0]?.plain_text || DEFAULT_CONFIG.header.ctaUrl,
      heroImage: headerPage.properties.heroImage?.files?.[0]?.file?.url || 
                headerPage.properties.heroImage?.files?.[0]?.external?.url ||
                DEFAULT_CONFIG.header.heroImage,
      overlayColors: {
        from: headerPage.properties.overlayFrom?.rich_text[0]?.plain_text || DEFAULT_CONFIG.header.overlayColors.from,
        to: headerPage.properties.overlayTo?.rich_text[0]?.plain_text || DEFAULT_CONFIG.header.overlayColors.to,
        opacity: parseFloat(headerPage.properties.overlayOpacity?.rich_text[0]?.plain_text || '0.9')
      }
    } : DEFAULT_CONFIG.header;

    if (!isValidColor(header.overlayColors.from)) {
      console.warn('Invalid "from" color:', header.overlayColors.from);
      header.overlayColors.from = DEFAULT_CONFIG.header.overlayColors.from;
    }
    if (!isValidColor(header.overlayColors.to)) {
      console.warn('Invalid "to" color:', header.overlayColors.to);
      header.overlayColors.to = DEFAULT_CONFIG.header.overlayColors.to;
    }
    if (isNaN(header.overlayColors.opacity) || header.overlayColors.opacity < 0 || header.overlayColors.opacity > 1) {
      console.warn('Invalid opacity:', header.overlayColors.opacity);
      header.overlayColors.opacity = DEFAULT_CONFIG.header.overlayColors.opacity;
    }

    return {
      logo,
      navigation: navItems.length > 0 ? navItems : DEFAULT_CONFIG.navigation,
      header
    };
  } catch (error) {
    console.error('Failed to fetch Notion configuration:', error);
    return DEFAULT_CONFIG;
  }
};