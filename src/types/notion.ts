export interface CommonConfig {
  baseColor: string;
  mainColor: string;
  accentColor: string;
  fontColor: string;
  font: string;
  logoType: 'text' | 'image';
  logoContent: string;
}

export interface NavigationItem {
  label: string;
  url: string;
  headerOrder: number;
  footerOrder: number;
  showInHeader: boolean;
  showInFooter: boolean;
}

export interface HeroSection {
  name: string;
  active: boolean;
  taglineActive: boolean;
  tagline: string;
  titleActive: boolean;
  title: string;
  subtitleActive: boolean;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  ctaColor: string;
  ctaHoverColor: string;
  heroImage: string;
  overlayFrom: string;
  overlayTo: string;
  overlayOpacity: number;
}

export interface AboutSection {
  name: string;
  active: boolean;
  mainTitle: string;
  subTitle: string;
  description: string | null;
  ctaText: string;
  ctaUrl: string;
  ctaColor: string;
  ctaHoverColor: string;
  imagePublicId: string;
}