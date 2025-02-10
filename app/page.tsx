import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';

const Header = dynamic(() => import('@/components/Header'), { ssr: true });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: true });
const About = dynamic(() => import('@/components/About'), { ssr: true });
const Blog = dynamic(() => import('@/components/Blog'), { ssr: true });
const Services = dynamic(() => import('@/components/Services'), { ssr: true });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: true });

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <Header />
        <Hero />
        <About />
        <Blog />
        <Services />
        <Contact />
      </Suspense>
    </main>
  );
}