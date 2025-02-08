import React from 'react';
import { motion } from 'framer-motion';

interface BlogPost {
  date: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
}

const BlogPost = ({ date, title, excerpt, image, category }: BlogPost) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10"
  >
    <div className="h-48 overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
      />
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-purple-400 text-sm">{category}</span>
        <span className="text-gray-500 text-sm">{date}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{excerpt}</p>
      <motion.a
        href="#"
        className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center text-sm uppercase tracking-wider"
        whileHover={{ x: 5 }}
      >
        Read More →
      </motion.a>
    </div>
  </motion.div>
);

const Blog = () => {
  const posts: BlogPost[] = [
    {
      date: "Mar 15, 2024",
      title: "2025年に効果的なSEO戦略とは？最新アルゴリズム対応のポイント",
      excerpt: "検索エンジンの最新アップデートに対応したSEO施策について解説。コアWebバイタルの重要性と対策方法をご紹介します。...",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "SEO対策"
    },
    {
      date: "Mar 10, 2024",
      title: "Instagram活用で売上150%増！事例から学ぶ成功のポイント",
      excerpt: "実際の成功事例をもとに、効果的なInstagramマーケティングの具体的な手法を紹介します。...",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "SNSマーケティング"
    },
    {
      date: "Mar 5, 2024",
      title: "データドリブンマーケティングの始め方",
      excerpt: "Googleアナリティクスを活用した効果的なデータ分析と、施策への活かし方について解説します。...",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Web解析"
    }
  ];

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-black to-purple-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">ブログ</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            デジタルマーケティングの最新情報をお届けします
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a 
            href="/blog"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition duration-300 uppercase tracking-wider text-sm"
          >
            ブログ一覧へ
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;