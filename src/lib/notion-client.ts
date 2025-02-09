import { Client } from '@notionhq/client';
import type { CommonConfig, NavigationItem, HeroSection, AboutSection } from '../types/notion';

const NOTION_TOKEN = import.meta.env.VITE_NOTION_TOKEN;
const COMMON_DB_ID = import.meta.env.VITE_NOTION_COMMON_DB_ID;
const NAVIGATION_DB_ID = import.meta.env.VITE_NOTION_NAVIGATION_DB_ID;
const HERO_DB_ID = import.meta.env.VITE_NOTION_HERO_DB_ID;
const ABOUT_DB_ID = import.meta.env.VITE_NOTION_ABOUT_DB_ID;
const ABOUT_PAGE_ID = import.meta.env.VITE_NOTION_ABOUT_PAGE_ID;

const formatText = (text: string): string => {
  return text.replace(/_/g, '\n');
};

const notionClient = new Client({
  auth: NOTION_TOKEN,
});

export async function fetchNavigation(): Promise<NavigationItem[]> {
  try {
    if (!NOTION_TOKEN || !NAVIGATION_DB_ID) {
      console.warn('Missing Notion credentials for navigation');
      return [
        { label: '私たちについて', url: '#about', headerOrder: 0, footerOrder: 0, showInHeader: true, showInFooter: false },
        { label: 'ブログ', url: '#blog', headerOrder: 1, footerOrder: 1, showInHeader: true, showInFooter: false },
        { label: 'サービス', url: '#services', headerOrder: 2, footerOrder: 2, showInHeader: true, showInFooter: false },
        { label: 'お問い合わせ', url: '#contact', headerOrder: 3, footerOrder: 3, showInHeader: true, showInFooter: false }
      ];
    }

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
        ],
        filter: {
          property: 'ShowInHeader',
          checkbox: {
            equals: true
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch navigation: ${response.statusText}`);
    }

    const data = await response.json();
    const results = data.results;

    if (!results.length) {
      throw new Error('No navigation items found');
    }

    const navItems = results.map((page: any) => {
      try {
        const properties = page.properties;
        return {
          label: properties.Label?.title?.[0]?.plain_text || '',
          url: properties.URL?.url || properties.URL?.rich_text?.[0]?.plain_text || '#',
          headerOrder: properties.HeaderOrder?.number || 0,
          footerOrder: properties.FooterOrder?.number || 0,
          showInHeader: properties.ShowInHeader?.checkbox ?? true,
          showInFooter: properties.ShowInFooter?.checkbox ?? false
        };
      } catch (error) {
        console.error('Error parsing navigation item:', error);
        return null;
      }
    }).filter((item): item is NavigationItem => 
      item !== null && Boolean(item.label) && Boolean(item.url)
    );

    return navItems;
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return [];
  }
}

export async function fetchHeroSection(): Promise<HeroSection | null> {
  try {
    if (!NOTION_TOKEN || !HERO_DB_ID) {
      console.warn('Missing Notion credentials for hero section');
      return {
        name: 'Default Hero',
        active: true,
        taglineActive: true,
        tagline: 'デジタルマーケティングエージェンシー',
        titleActive: true,
        title: 'デジタルの力で_ビジネスを変革する',
        subtitleActive: true,
        subtitle: '最新のテクノロジーと戦略で、あなたのビジネスの成長をサポートします',
        ctaText: '私たちについて',
        ctaUrl: '#about',
        ctaColor: '#7C3AED',
        ctaHoverColor: '#6D28D9',
        heroImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
        overlayFrom: 'rgba(99, 102, 241, 0.9)',
        overlayTo: 'rgba(79, 70, 229, 0.9)',
        overlayOpacity: 0.9
      };
    }

    const response = await fetch(`/api/notion/v1/databases/${HERO_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Active',
          checkbox: {
            equals: true
          }
        },
        page_size: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hero section: ${response.statusText}`);
    }

    const data = await response.json();
    const page = data.results[0];

    if (!page) {
      throw new Error('No active hero section found');
    }

    const properties = page.properties;
    const rawTitle = properties.Title?.rich_text?.[0]?.plain_text || '';
    const rawSubtitle = properties.Subtitle?.rich_text?.[0]?.plain_text || '';

    return {
      name: properties.Name?.title?.[0]?.plain_text || '',
      active: properties.Active?.checkbox ?? true,
      taglineActive: properties.TaglineActive?.checkbox ?? true,
      tagline: properties.Tagline?.rich_text?.[0]?.plain_text || 'デジタルマーケティングエージェンシー',
      titleActive: properties.TitleActive?.checkbox ?? true,
      title: formatText(rawTitle || 'デジタルの力で_ビジネスを変革する'),
      subtitleActive: properties.SubtitleActive?.checkbox ?? true,
      subtitle: formatText(rawSubtitle || '最新のテクノロジーと戦略で、あなたのビジネスの成長をサポートします'),
      ctaText: properties.CTAText?.rich_text?.[0]?.plain_text || '私たちについて',
      ctaUrl: properties.CTAUrl?.rich_text?.[0]?.plain_text || '#about',
      ctaColor: properties.CTAColor?.rich_text?.[0]?.plain_text || '#7C3AED',
      ctaHoverColor: properties.CTAHoverColor?.rich_text?.[0]?.plain_text || '#6D28D9',
      heroImage: properties.HeroImage?.files?.[0]?.external?.url || 
                properties.HeroImage?.files?.[0]?.file?.url || 
                'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
      overlayFrom: properties.OverlayFrom?.rich_text?.[0]?.plain_text || 'rgba(99, 102, 241, 0.9)',
      overlayTo: properties.OverlayTo?.rich_text?.[0]?.plain_text || 'rgba(79, 70, 229, 0.9)',
      overlayOpacity: properties.OverlayOpacity?.number ?? 0.9
    };
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }
}

export async function fetchAboutSection(): Promise<AboutSection | null> {
  try {
    if (!NOTION_TOKEN || !ABOUT_DB_ID) {
      console.warn('Missing Notion credentials for about section');
      return {
        name: 'Default About',
        active: true,
        mainTitle: 'デジタルの力で、',
        subTitle: 'ビジネスの成長を加速する',
        description: '私たちは2015年の創業以来、600社以上のデジタルマーケティング支援を行ってきました。時代とともに変化するデジタル環境において、最新のテクノロジーと確かな戦略で、クライアント企業の成長をサポートしています。\n\n業界や規模を問わず、お客様一社一社に最適なデジタルマーケティング戦略を提案し、継続的な成果創出を実現してきました。私たちの強みは、データ分析に基づく戦略立案と、それを実行に移す実践力にあります。',
        ctaText: '私たちのアプローチについて',
        ctaUrl: '#services',
        ctaColor: '#7C3AED',
        ctaHoverColor: '#6D28D9',
        imagePublicId: 'about-image'
      };
    }

    const response = await fetch(`/api/notion/v1/databases/${ABOUT_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Active',
          checkbox: {
            equals: true
          }
        },
        page_size: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch about section: ${response.statusText}`);
    }

    const data = await response.json();
    const page = data.results[0];

    if (!page) {
      throw new Error('No active about section found');
    }

    const properties = page.properties;
    const description = await fetchAboutContent();

    return {
      name: properties.Name?.title?.[0]?.plain_text || '',
      active: properties.Active?.checkbox ?? true,
      mainTitle: properties.MainTitle?.rich_text?.[0]?.plain_text || 'デジタルの力で、',
      subTitle: properties.SubTitle?.rich_text?.[0]?.plain_text || 'ビジネスの成長を加速する',
      description: description || '私たちは2015年の創業以来、600社以上のデジタルマーケティング支援を行ってきました。時代とともに変化するデジタル環境において、最新のテクノロジーと確かな戦略で、クライアント企業の成長をサポートしています。\n\n業界や規模を問わず、お客様一社一社に最適なデジタルマーケティング戦略を提案し、継続的な成果創出を実現してきました。私たちの強みは、データ分析に基づく戦略立案と、それを実行に移す実践力にあります。',
      ctaText: properties.CTAText?.rich_text?.[0]?.plain_text || '私たちのアプローチについて',
      ctaUrl: properties.CTAUrl?.rich_text?.[0]?.plain_text || '#services',
      ctaColor: properties.CTAColor?.rich_text?.[0]?.plain_text || '#7C3AED',
      ctaHoverColor: properties.CTAHoverColor?.rich_text?.[0]?.plain_text || '#6D28D9',
      imagePublicId: properties.ImagePublicId?.rich_text?.[0]?.plain_text || 'about-image'
    };
  } catch (error) {
    console.error('Error fetching about section:', error);
    return null;
  }
}

export async function fetchAboutContent(): Promise<string | null> {
  try {
    if (!NOTION_TOKEN || !ABOUT_PAGE_ID) {
      return null;
    }

    const response = await fetch(`/api/notion/v1/blocks/${ABOUT_PAGE_ID}/children`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch about content: ${response.statusText}`);
    }

    const data = await response.json();
    let content = '';

    data.results.forEach((block: any) => {
      if (block.type === 'paragraph') {
        const text = block.paragraph.rich_text
          .map((text: any) => text.plain_text)
          .join('');
        if (text) {
          content += text + '\n\n';
        }
      }
    });

    return content.trim();
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
}