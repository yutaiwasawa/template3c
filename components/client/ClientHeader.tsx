'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavigationItem, SiteConfig } from '@/types/notion';

interface ClientHeaderProps {
  navigation: NavigationItem[];
  siteConfig: SiteConfig;
}

export default function ClientHeader({ navigation, siteConfig }: ClientHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    setIsOpen(false);

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
  };

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

  return (
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

        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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
  );
}