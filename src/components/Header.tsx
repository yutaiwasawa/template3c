import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteConfig } from '../lib/notion';
import { fetchNavigation } from '../lib/notion-client';
import type { NavigationItem } from '../types/notion';

interface HeaderProps {
  siteConfig: SiteConfig;
}

const DEFAULT_NAVIGATION = [
  { label: '私たちについて', url: '#about' },
  { label: 'ブログ', url: '#blog' },
  { label: 'サービス', url: '#services' },
  { label: 'お問い合わせ', url: '#contact' }
];

const Header = ({ siteConfig }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navigation, setNavigation] = useState<NavigationItem[]>(DEFAULT_NAVIGATION.map(item => ({
    ...item,
    headerOrder: 0,
    footerOrder: 0,
    showInHeader: true,
    showInFooter: false
  })));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // ナビゲーションデータの取得
    const loadNavigation = async () => {
      try {
        const navItems = await fetchNavigation();
        if (navItems.length > 0) {
          const headerItems = navItems
            .filter(item => item.showInHeader)
            .sort((a, b) => a.headerOrder - b.headerOrder);
          setNavigation(headerItems);
        }
      } catch (error) {
        console.error('ナビゲーションの読み込みに失敗しました:', error);
      }
    };

    loadNavigation();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderLogo = () => {
    if (siteConfig.logo.type === 'image') {
      return (
        <img 
          src={siteConfig.logo.content} 
          alt="Logo" 
          className="h-8 w-auto"
        />
      );
    }
    return (
      <span 
        className="text-2xl font-bold text-white"
        style={{ color: siteConfig.logo.color }}
      >
        {siteConfig.logo.content}
      </span>
    );
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    setIsOpen(false);

    setTimeout(() => {
      const element = document.querySelector(url);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <header className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90" />
      </div>
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-lg' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {renderLogo()}
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item, index) => (
              <motion.a
                key={`desktop-nav-${index}`}
                href={item.url}
                onClick={(e) => handleNavClick(e, item.url)}
                className="text-white hover:text-purple-400 text-sm uppercase tracking-wider transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-sm"
            >
              <div className="px-6 py-4 space-y-4">
                {navigation.map((item, index) => (
                  <motion.a
                    key={`mobile-nav-${index}`}
                    href={item.url}
                    onClick={(e) => handleNavClick(e, item.url)}
                    className="block text-white hover:text-purple-400 text-sm uppercase tracking-wider"
                    whileHover={{ x: 10 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white"
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-purple-400 uppercase tracking-widest mb-4"
        >
          Digital Marketing Agency
        </motion.p>
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold text-center mb-6 leading-tight"
        >
          デジタルの力で、<br />ビジネスの未来を創造する
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-gray-300 mb-8 text-center max-w-2xl"
        >
          戦略的なデジタルマーケティングで、あなたのビジネスを次のステージへ
        </motion.p>
        <motion.a
          href="#about"
          onClick={(e) => handleNavClick(e, '#about')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition duration-300 uppercase tracking-wider text-sm"
        >
          私たちについて
        </motion.a>
      </motion.div>
    </header>
  );
};

export default Header;