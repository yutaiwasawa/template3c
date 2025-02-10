import { getHeroSection } from '@/lib/notion';
import ClientHero from './client/ClientHero';

const TEMPORARY_HERO_DATA = {
  active: true,
  name: "メインビジュアル",
  taglineActive: true,
  tagline: "Digital Marketing Agency",
  titleActive: true,
  title: "デジタルで\nビジネスの未来を創る",
  subtitleActive: true,
  subtitle: "最新のテクノロジーとデータ分析で\nお客様のビジネス成長を支援します",
  ctaText: "お問い合わせ",
  ctaUrl: "#contact",
  ctaColor: "#6366f1",
  ctaHoverColor: "#4f46e5",
  heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
  overlayFrom: "rgba(0,0,0,0.7)",
  overlayTo: "rgba(0,0,0,0.7)",
  overlayOpacity: 0.8,
  imagePublicId: ''
};

export default async function Hero() {
  try {
    const heroData = await getHeroSection();
    if (!heroData || !heroData.active) {
      console.log('Using temporary hero data');
      return <ClientHero data={TEMPORARY_HERO_DATA} />;
    }
    return <ClientHero data={heroData} />;
  } catch (error) {
    console.error('Error in Hero:', error);
    return <ClientHero data={TEMPORARY_HERO_DATA} />;
  }
}