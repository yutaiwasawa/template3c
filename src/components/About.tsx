import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { AboutSection } from '../types/notion';
import { fetchAboutSection } from '../lib/notion-client';

const getCloudinaryUrl = (publicId: string): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (!publicId || !cloudName) {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }

  const transformations = 'f_auto,q_auto:good,w_800';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

const About = () => {
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAboutSection();
        if (data) {
          setAboutData(data);
        }
      } catch (error) {
        // Error handling
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return null;
  }

  if (!aboutData?.active) {
    return null;
  }

  const imageUrl = getCloudinaryUrl(aboutData.imagePublicId);

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
          <p className="text-gray-400 mb-6">
            私たちは2015年の創業以来、600社以上のデジタルマーケティング支援を行ってきました。時代とともに変化するデジタル環境において、最新のテクノロジーと確かな戦略で、クライアント企業の成長をサポートしています。
          </p>
          <p className="text-gray-400 mb-8">
            業界や規模を問わず、お客様一社一社に最適なデジタルマーケティング戦略を提案し、継続的な成果創出を実現してきました。私たちの強みは、データ分析に基づく戦略立案と、それを実行に移す実践力にあります。
          </p>
          <motion.a
            href={aboutData.ctaUrl}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: aboutData.ctaColor,
            }}
            className="inline-block text-white px-8 py-3 rounded-full transition duration-300 uppercase tracking-wider text-sm hover:bg-opacity-90"
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
              src={imageUrl}
              alt="Digital Marketing Team"
              className="rounded-lg shadow-2xl"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 blur-lg opacity-20 -z-10 transform rotate-3"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;