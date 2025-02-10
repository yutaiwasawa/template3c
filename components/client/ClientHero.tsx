'use client';

import { motion } from 'framer-motion';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import type { HeroSection } from '@/types/notion';

interface ClientHeroProps {
  data: HeroSection;
}

export default function ClientHero({ data }: ClientHeroProps) {
  const isExternalUrl = data.ctaUrl.startsWith('http') || data.ctaUrl.startsWith('https');
  const heroImage = data.imagePublicId 
    ? getCloudinaryUrl(data.imagePublicId, { width: 1920, format: 'webp' })
    : data.heroImage;

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (isExternalUrl) return;
    
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

  // アンダースコアを改行に変換する関数
  const convertUnderscoresToLineBreaks = (text: string) => {
    return text.split('_').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <header className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${heroImage}")`,
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${data.overlayFrom}, ${data.overlayTo})`,
            opacity: data.overlayOpacity
          }}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white"
      >
        {data.taglineActive && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-purple-400 uppercase tracking-widest mb-4"
          >
            {data.tagline}
          </motion.p>
        )}
        
        {data.titleActive && (
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-center mb-6 leading-tight"
          >
            {convertUnderscoresToLineBreaks(data.title)}
          </motion.h1>
        )}
        
        {data.subtitleActive && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-300 mb-8 text-center max-w-2xl"
          >
            {convertUnderscoresToLineBreaks(data.subtitle)}
          </motion.p>
        )}
        
        <motion.a
          href={data.ctaUrl}
          onClick={(e) => handleCtaClick(e, data.ctaUrl)}
          target={isExternalUrl ? "_blank" : undefined}
          rel={isExternalUrl ? "noopener noreferrer" : undefined}
          initial={false}
          animate={{
            backgroundColor: data.ctaColor
          }}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: data.ctaHoverColor
          }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            backgroundColor: {
              type: "tween",
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
          className="inline-block text-white px-8 py-3 rounded-full uppercase tracking-wider text-sm text-center"
        >
          {data.ctaText}
        </motion.a>
      </motion.div>
    </header>
  );
}