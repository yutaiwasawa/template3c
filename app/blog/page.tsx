import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/types/notion';

// 一時的なデータ
const POSTS: Partial<BlogPost>[] = [
  {
    id: '1',
    title: '2025年に効果的なSEO戦略とは？最新アルゴリズム対応のポイント',
    slug: 'seo-strategy-2025',
    excerpt: '検索エンジンの最新アップデートに対応したSEO施策について解説。コアWebバイタルの重要性と対策方法をご紹介します。',
    publishedAt: '2024-03-15',
    category: 'SEO対策',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Instagram活用で売上150%増！事例から学ぶ成功のポイント',
    slug: 'instagram-success-case',
    excerpt: '実際の成功事例をもとに、効果的なInstagramマーケティングの具体的な手法を紹介します。',
    publishedAt: '2024-03-10',
    category: 'SNSマーケティング',
    coverImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'データドリブンマーケティングの始め方',
    slug: 'data-driven-marketing',
    excerpt: 'Googleアナリティクスを活用した効果的なデータ分析と、施策への活かし方について解説します。',
    publishedAt: '2024-03-05',
    category: 'Web解析',
    coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">ブログ</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            デジタルマーケティングの最新情報をお届けします
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="block"
            >
              <div className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 h-full transition duration-300 hover:border-purple-500/50">
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
                  <h2 className="text-xl font-bold mb-3 text-white">{post.title}</h2>
                  <p className="text-gray-400 mb-4">{post.excerpt}</p>
                  <span className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center text-sm uppercase tracking-wider">
                    続きを読む →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}