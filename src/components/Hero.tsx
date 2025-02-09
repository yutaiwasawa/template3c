import React from 'react';
import { motion } from 'framer-motion';
import type { HeroSection } from '../types/notion';

interface HeroProps {
  data: HeroSection;
  onCtaClick: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
}

const Hero = ({ data, onCtaClick }: HeroProps) => {
  const isExternalUrl = data.ctaUrl.startsWith('http') || data.ctaUrl.startsWith('https');

  return (
    <header className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${data.heroImage}")`,
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
            {data.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < data.title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>
        )}
        
        {data.subtitleActive && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-300 mb-8 text-center max-w-2xl whitespace-pre-line"
          >
            {data.subtitle}
          </motion.p>
        )}
        
        <motion.a
          href={data.ctaUrl}
          onClick={(e) => !isExternalUrl && onCtaClick(e, data.ctaUrl)}
          target={isExternalUrl ? "_blank" : undefined}
          rel={isExternalUrl ? "noopener noreferrer" : undefined}
          initial={false}
          animate={{
            backgroundColor: data.ctaColor || '#7C3AED'
          }}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: data.ctaHoverColor || '#6D28D9'
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
};

export default Hero;