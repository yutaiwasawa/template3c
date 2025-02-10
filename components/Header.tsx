import { getSiteConfig, getNavigation, DEFAULT_CONFIG } from '@/lib/notion';
import ClientHeader from './client/ClientHeader';

// フォールバックデータ
const TEMPORARY_NAVIGATION = [
  { label: "ホーム", url: "#", headerOrder: 1, footerOrder: 1, showInHeader: true, showInFooter: true },
  { label: "サービス", url: "#services", headerOrder: 2, footerOrder: 2, showInHeader: true, showInFooter: true },
  { label: "ブログ", url: "/blog", headerOrder: 3, footerOrder: 3, showInHeader: true, showInFooter: true },
  { label: "お問い合わせ", url: "#contact", headerOrder: 4, footerOrder: 4, showInHeader: true, showInFooter: true }
];

export default async function Header() {
  try {
    const [navigation, siteConfig] = await Promise.all([
      getNavigation().catch(() => TEMPORARY_NAVIGATION),
      getSiteConfig().catch(() => DEFAULT_CONFIG),
    ]);

    return <ClientHeader 
      navigation={navigation.length > 0 ? navigation : TEMPORARY_NAVIGATION} 
      siteConfig={siteConfig} 
    />;
  } catch (error) {
    console.error('Error in Header:', error);
    // エラー時はフォールバックデータを使用
    return <ClientHeader 
      navigation={TEMPORARY_NAVIGATION} 
      siteConfig={DEFAULT_CONFIG} 
    />;
  }
}