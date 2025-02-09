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
  tagline: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  heroImage: string;
  overlayFrom: string;
  overlayTo: string;
  overlayOpacity: number;
}