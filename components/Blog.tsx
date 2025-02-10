import ClientBlog from './client/ClientBlog';

const TEMPORARY_POSTS = [
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

export default function Blog() {
  return <ClientBlog posts={TEMPORARY_POSTS} />;
}