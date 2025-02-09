import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import About from './components/About';
import Blog from './components/Blog';
import Services from './components/Services';
import Contact from './components/Contact';
import { getSiteConfig, SiteConfig, DEFAULT_CONFIG } from './lib/notion';
import { fetchHeroSection, fetchAboutSection } from './lib/notion-client';
import type { HeroSection, AboutSection } from './types/notion';
import Hero from './components/Hero';

function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [config, hero, about] = await Promise.all([
          getSiteConfig(),
          fetchHeroSection(),
          fetchAboutSection()
        ]);

        setSiteConfig(config);
        if (hero) {
          setHeroData(hero);
        }
        if (about) {
          setAboutData(about);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Header siteConfig={siteConfig} />
          {heroData && heroData.active && (
            <Hero 
              data={heroData}
              onCtaClick={handleHeroCtaClick}
            />
          )}
          <About aboutData={aboutData} />
          <Blog />
          <Services />
          <Contact />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;