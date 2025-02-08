import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteConfig } from '../lib/notion';

interface HeaderProps {
  siteConfig: SiteConfig;
}

const Header = ({ siteConfig }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderLogo = () => {
    const content = siteConfig.logo.type === 'image' ? (
      <img 
        src={siteConfig.logo.content} 
        alt="Logo" 
        className="h-8 w-auto"
      />
    ) : (
      <span className="text-white text-2xl font-bold">
        {siteConfig.logo.content}
      </span>
    );

    return (
      <a 
        href="/" 
        className="hover:opacity-80 transition-opacity"
        onClick={(e) => handleNavClick(e, '/')}
      >
        {content}
      </a>
    );
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    if (url === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
    } else if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    } else {
      window.location.href = url;
    }
  };

  return (
    <header className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${siteConfig.header.heroImage}")`,
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${siteConfig.header.overlayColors.from}${Math.round(siteConfig.header.overlayColors.opacity * 255).toString(16).padStart(2, '0')}, ${siteConfig.header.overlayColors.to}${Math.round(siteConfig.header.overlayColors.opacity * 255).toString(16).padStart(2, '0')})`
          }}
        ></div>
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
          <div className="hidden md:flex space-x-8 text-white">
            {siteConfig.navigation.map((item, index) => (
              <motion.a
                key={`desktop-nav-${index}`}
                href={item.url}
                onClick={(e) => handleNavClick(e, item.url)}
                className="hover:text-purple-400 transition-colors text-sm uppercase tracking-wider"
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
                {siteConfig.navigation.map((item, index) => (
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
        className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4"
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-purple-400 uppercase tracking-widest mb-4"
        >
          {siteConfig.header.tagline}
        </motion.p>
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold text-center mb-6 leading-tight"
        >
          {siteConfig.header.title.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < siteConfig.header.title.length - 1 && <br />}
            </React.Fragment>
          ))}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-gray-300 mb-8 text-center max-w-2xl"
        >
          {siteConfig.header.subtitle.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < siteConfig.header.subtitle.length - 1 && <br />}
            </React.Fragment>
          ))}
        </motion.p>
        <motion.a
          href={siteConfig.header.ctaUrl}
          onClick={(e) => handleNavClick(e, siteConfig.header.ctaUrl)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition duration-300 uppercase tracking-wider text-sm"
        >
          {siteConfig.header.ctaText}
        </motion.a>
      </motion.div>
    </header>
  );
};

export default Header;