'use client';

import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/notion';

interface ClientBlogProps {
  posts: Partial<BlogPost>[];
}

export default function ClientBlog({ posts }: ClientBlogProps) {
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
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-400 text-sm">{post.category}</span>
                  <span className="text-gray-500 text-sm">{post.publishedAt}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{post.title}</h3>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <motion.span
                  className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center text-sm uppercase tracking-wider cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  続きを読む →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition duration-300 uppercase tracking-wider text-sm cursor-pointer">
            ブログ一覧へ
          </span>
        </motion.div>
      </div>
    </section>
  );
}