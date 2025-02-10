import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { BlogPost } from '@/types/notion';

// 一時的なデータ
const POSTS: Record<string, BlogPost> = {
  'seo-strategy-2025': {
    id: '1',
    title: '2025年に効果的なSEO戦略とは？最新アルゴリズム対応のポイント',
    slug: 'seo-strategy-2025',
    excerpt: '検索エンジンの最新アップデートに対応したSEO施策について解説。コアWebバイタルの重要性と対策方法をご紹介します。',
    content: `
# 2025年に効果的なSEO戦略とは？最新アルゴリズム対応のポイント

検索エンジンの最新アップデートに対応したSEO施策について解説します。コアWebバイタルの重要性と対策方法をご紹介します。

## 1. コアWebバイタルの重要性

コアWebバイタルは、Googleが提唱するWebサイトのユーザー体験を測定する指標です。主に以下の3つの要素で構成されています：

- LCP（Largest Contentful Paint）：最大コンテンツの表示時間
- FID（First Input Delay）：ユーザーの最初の入力までの遅延時間
- CLS（Cumulative Layout Shift）：視覚的な安定性

## 2. E-E-A-Tの最適化

ExpertiseとExperienceを重視した、信頼性の高いコンテンツ作成が重要です。

## 3. AIと共存するSEO戦略

AIの発展に伴い、より自然な文章と、人間ならではの視点や経験を活かしたコンテンツが重要になってきています。

## まとめ

2025年のSEO戦略では、技術的な最適化とユーザー体験の向上、そして質の高いコンテンツ作成がより一層重要になります。
    `,
    publishedAt: '2024-03-15',
    category: 'SEO対策',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-white">記事が見つかりません</h1>
          <Link 
            href="/blog"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mt-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            ブログ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/blog"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8"
        >
          <ArrowLeft className="mr-2" size={20} />
          ブログ一覧に戻る
        </Link>

        <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-purple-400 text-sm">{post.category}</span>
              <span className="text-gray-400 text-sm">{post.publishedAt}</span>
            </div>
            <h1 className="text-4xl font-bold text-white">{post.title}</h1>
          </div>
        </div>

        <article className="prose prose-invert prose-purple max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </article>
      </div>
    </div>
  );
}