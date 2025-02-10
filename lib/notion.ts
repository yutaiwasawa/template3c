import { cache } from 'react';
import { Client } from '@notionhq/client';
import type { SiteConfig, NavigationItem, HeroSection, AboutSection } from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const logError = (section: string, error: any) => {
  console.error(`Error in ${section}:`, {
    message: error.message,
    code: error.code,
    status: error.status,
    details: error,
    env: {
      hasToken: !!process.env.NOTION_TOKEN,
      hasHeroDbId: !!process.env.NOTION_HERO_DB_ID,
      hasAboutDbId: !!process.env.NOTION_ABOUT_DB_ID,
    }
  });
};

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

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  if (!notion || !process.env.NOTION_COMMON_DB_ID) {
    return DEFAULT_CONFIG;
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_COMMON_DB_ID,
      page_size: 1,
    });

    if (!response.results.length) {
      return DEFAULT_CONFIG;
    }

    const page = response.results[0];
    const properties = page.properties as any;

    return {
      logo: {
        type: 'text',
        content: properties.LogoText?.rich_text?.[0]?.plain_text || DEFAULT_CONFIG.logo.content,
        color: properties.LogoColor?.rich_text?.[0]?.plain_text || DEFAULT_CONFIG.logo.color
      },
      baseColor: properties.BaseColor?.rich_text?.[0]?.plain_text || DEFAULT_CONFIG.baseColor,
      mainColor: properties.MainColor?.rich_text?.[0]?.plain_text || DEFAULT_CONFIG.mainColor,
      accentColor: properties.AccentColor?.rich_text?.[0]?.plain_text || DEFAULT_CONFIG.accentColor,
      fontColor: properties.FontColor?.rich_text?.[0]?.plain_text || DEFAULT_CONFIG.fontColor,
      font: DEFAULT_CONFIG.font
    };
  } catch (error) {
    logError('getSiteConfig', error);
    return DEFAULT_CONFIG;
  }
});

export const getNavigation = cache(async (): Promise<NavigationItem[]> => {
  if (!notion || !process.env.NOTION_NAVIGATION_DB_ID) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_NAVIGATION_DB_ID,
      sorts: [{ property: 'HeaderOrder', direction: 'ascending' }],
      filter: {
        property: 'ShowInHeader',
        checkbox: {
          equals: true,
        },
      },
    });

    return response.results.map((page: any) => ({
      label: page.properties.Label?.title?.[0]?.plain_text || '',
      url: page.properties.URL?.rich_text?.[0]?.plain_text || '#',
      headerOrder: page.properties.HeaderOrder?.number || 0,
      footerOrder: page.properties.FooterOrder?.number || 0,
      showInHeader: page.properties.ShowInHeader?.checkbox ?? true,
      showInFooter: page.properties.ShowInFooter?.checkbox ?? false,
    }));
  } catch (error) {
    logError('getNavigation', error);
    return [];
  }
});

export const getHeroSection = cache(async (): Promise<HeroSection | null> => {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_HERO_DB_ID) {
    console.log('Missing Notion credentials for Hero section');
    return null;
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_HERO_DB_ID,
      filter: {
        property: 'Active',
        checkbox: {
          equals: true,
        },
      },
      page_size: 1,
    });

    if (!response.results.length) {
      console.log('No active hero section found');
      return null;
    }

    const page = response.results[0];
    const properties = page.properties as any;

    console.log('Hero properties:', Object.keys(properties));

    return {
      name: properties.Name?.title?.[0]?.plain_text || '',
      active: properties.Active?.checkbox ?? true,
      taglineActive: properties.TaglineActive?.checkbox ?? true,
      tagline: properties.Tagline?.rich_text?.[0]?.plain_text || '',
      titleActive: properties.TitleActive?.checkbox ?? true,
      title: properties.Title?.rich_text?.[0]?.plain_text || '',
      subtitleActive: properties.SubtitleActive?.checkbox ?? true,
      subtitle: properties.Subtitle?.rich_text?.[0]?.plain_text || '',
      ctaText: properties.CTAText?.rich_text?.[0]?.plain_text || '',
      ctaUrl: properties.CTAUrl?.rich_text?.[0]?.plain_text || '#',
      ctaColor: properties.CTAColor?.rich_text?.[0]?.plain_text || '#6366f1',
      ctaHoverColor: properties.CTAHoverColor?.rich_text?.[0]?.plain_text || '#4f46e5',
      heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      overlayFrom: properties.OverlayFrom?.rich_text?.[0]?.plain_text || 'rgba(0,0,0,0.7)',
      overlayTo: properties.OverlayTo?.rich_text?.[0]?.plain_text || 'rgba(0,0,0,0.7)',
      overlayOpacity: properties.OverlayOpacity?.number ?? 0.8,
      imagePublicId: properties.ImagePublicId?.rich_text?.[0]?.plain_text || ''
    };
  } catch (error) {
    logError('getHeroSection', error);
    return null;
  }
});

export const getAboutSection = cache(async (): Promise<AboutSection | null> => {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_ABOUT_DB_ID || !process.env.NOTION_ABOUT_PAGE_ID) {
    console.log('Missing Notion credentials for About section:', {
      hasToken: !!process.env.NOTION_TOKEN,
      hasAboutDbId: !!process.env.NOTION_ABOUT_DB_ID,
      hasAboutPageId: !!process.env.NOTION_ABOUT_PAGE_ID
    });
    return null;
  }

  try {
    // データベースからメタデータを取得
    const response = await notion.databases.query({
      database_id: process.env.NOTION_ABOUT_DB_ID,
      filter: {
        property: 'Active',
        checkbox: {
          equals: true,
        },
      },
      page_size: 1,
    });

    if (!response.results.length) {
      console.log('No active about section found in database');
      return null;
    }

    const page = response.results[0];
    const properties = page.properties as any;

    // Notionページから本文を取得
    let description = '';
    try {
      const pageContent = await notion.blocks.children.list({
        block_id: process.env.NOTION_ABOUT_PAGE_ID,
      });

      description = pageContent.results
        .filter((block: any) => block.type === 'paragraph')
        .map((block: any) => block.paragraph.rich_text?.[0]?.plain_text || '')
        .join('\n');

      console.log('About page content fetched:', { description });
    } catch (contentError) {
      console.error('Error fetching about page content:', contentError);
    }

    const aboutData = {
      name: properties.Name?.title?.[0]?.plain_text || '',
      active: properties.Active?.checkbox ?? true,
      mainTitle: properties.MainTitle?.rich_text?.[0]?.plain_text || '',
      subTitle: properties.SubTitle?.rich_text?.[0]?.plain_text || '',
      description: description || null,
      ctaText: properties.CTAText?.rich_text?.[0]?.plain_text || '',
      ctaUrl: properties.CTAUrl?.rich_text?.[0]?.plain_text || '#',
      ctaColor: properties.CTAColor?.rich_text?.[0]?.plain_text || '#6366f1',
      ctaHoverColor: properties.CTAHoverColor?.rich_text?.[0]?.plain_text || '#4f46e5',
      imagePublicId: properties.ImagePublicId?.rich_text?.[0]?.plain_text || ''
    };

    console.log('Final about section data:', aboutData);
    return aboutData;
  } catch (error) {
    console.error('Error in getAboutSection:', {
      error,
      message: error.message,
      code: error.code,
      requestId: error.requestId
    });
    return null;
  }
});