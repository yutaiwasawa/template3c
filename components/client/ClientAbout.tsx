'use client';

import { motion } from 'framer-motion';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import type { AboutSection } from '@/types/notion';

interface ClientAboutProps {
  aboutData: AboutSection;
}

export default function ClientAbout({ aboutData }: ClientAboutProps) {
  const aboutImage = aboutData.imagePublicId 
    ? getCloudinaryUrl(aboutData.imagePublicId, { width: 800, format: 'webp' })
    : 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-white">
            {aboutData.mainTitle}<br />
            <span className="text-purple-400">{aboutData.subTitle}</span>
          </h2>
          {aboutData.description && (
            <div className="text-gray-400 mb-8 whitespace-pre-line">
              {aboutData.description}
            </div>
          )}
          <motion.a
            href={aboutData.ctaUrl}
            initial={false}
            animate={{
              backgroundColor: aboutData.ctaColor
            }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: aboutData.ctaHoverColor
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
            className="inline-block text-white px-8 py-3 rounded-full uppercase tracking-wider text-sm"
          >
            {aboutData.ctaText}
          </motion.a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative z-10">
            <img
              src={aboutImage}
              alt="Digital Marketing Team"
              className="rounded-lg shadow-2xl"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 blur-lg opacity-20 -z-10 transform rotate-3"></div>
        </motion.div>
      </div>
    </section>
  );
}