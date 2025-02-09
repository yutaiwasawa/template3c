import { Client } from '@notionhq/client';
import type { CommonConfig, NavigationItem, HeroSection } from '../types/notion';

const NOTION_TOKEN = import.meta.env.VITE_NOTION_TOKEN;
const COMMON_DB_ID = import.meta.env.VITE_NOTION_COMMON_DB_ID;
const NAVIGATION_DB_ID = import.meta.env.VITE_NOTION_NAVIGATION_DB_ID;
const HERO_DB_ID = import.meta.env.VITE_NOTION_HERO_DB_ID;

// テキストの改行処理を行う関数
const formatText = (text: string): string => {
  return text.replace(/_/g, '\n');
};

export async function fetchNavigation(): Promise<NavigationItem[]> {
  try {
    if (!NOTION_TOKEN || !NAVIGATION_DB_ID) {
      return [];
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
      return [];
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    const navItems = data.results.map((page: any) => {
      try {
        const properties = page.properties;
        const label = properties.Label?.title?.[0]?.plain_text || 
                     properties.Label?.rich_text?.[0]?.plain_text || '';
        
        const url = properties.URL?.url || 
                   properties.URL?.rich_text?.[0]?.plain_text || 
                   '#';

        const headerOrder = properties.HeaderOrder?.number || 0;
        const footerOrder = properties.FooterOrder?.number || 0;
        const showInHeader = properties.ShowInHeader?.checkbox ?? true;
        const showInFooter = properties.ShowInFooter?.checkbox ?? false;

        return {
          label,
          url,
          headerOrder,
          footerOrder,
          showInHeader,
          showInFooter
        };
      } catch (error) {
        return null;
      }
    }).filter((item): item is NavigationItem => 
      item !== null && Boolean(item.label) && Boolean(item.url)
    );

    return navItems;
  } catch (error) {
    return [];
  }
}

export async function fetchHeroSection(): Promise<HeroSection | null> {
  try {
    if (!NOTION_TOKEN || !HERO_DB_ID) {
      return null;
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
      return null;
    }

    const data = await response.json();

    if (!data.results?.[0]) {
      return null;
    }

    const page = data.results[0];
    const properties = page.properties || {};

    const rawTitle = properties.Title?.rich_text?.[0]?.plain_text || '';
    const rawSubtitle = properties.Subtitle?.rich_text?.[0]?.plain_text || '';

    return {
      name: properties.Name?.title?.[0]?.plain_text || '',
      active: properties.Active?.checkbox ?? false,
      taglineActive: properties.TaglineActive?.checkbox ?? false,
      tagline: properties.Tagline?.rich_text?.[0]?.plain_text || '',
      titleActive: properties.TitleActive?.checkbox ?? false,
      title: formatText(rawTitle),
      subtitleActive: properties.SubtitleActive?.checkbox ?? false,
      subtitle: formatText(rawSubtitle),
      ctaText: properties.CTAText?.rich_text?.[0]?.plain_text || '',
      ctaUrl: properties.CTAUrl?.rich_text?.[0]?.plain_text || '#',
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
    return null;
  }
}