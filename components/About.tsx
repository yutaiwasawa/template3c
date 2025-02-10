import { getAboutSection } from '@/lib/notion';
import ClientAbout from './client/ClientAbout';

// フォールバックデータ
const TEMPORARY_ABOUT_DATA = {
  active: true,
  name: "About Us",
  mainTitle: "デジタルマーケティングの",
  subTitle: "新しいカタチ",
  description: "私たちは、最新のテクノロジーとデータ分析を活用し、\nお客様のビジネス成長を支援します。\n\n独自のマーケティング戦略と、データに基づいた意思決定で、確実な成果を実現します。",
  ctaText: "私たちについて",
  ctaUrl: "#services",
  ctaColor: "#6366f1",
  ctaHoverColor: "#4f46e5",
  imagePublicId: ''
};

export default async function About() {
  try {
    // Notionデータベースが利用可能な場合のみデータを取得
    if (process.env.NOTION_TOKEN && process.env.NOTION_ABOUT_DB_ID) {
      const aboutData = await getAboutSection();
      if (aboutData && aboutData.active) {
        return <ClientAbout aboutData={aboutData} />;
      }
    }
    
    // データベース未設定またはデータ取得失敗時はフォールバックを使用
    return <ClientAbout aboutData={TEMPORARY_ABOUT_DATA} />;
  } catch (error) {
    console.error('Error in About component:', error);
    return <ClientAbout aboutData={TEMPORARY_ABOUT_DATA} />;
  }
}