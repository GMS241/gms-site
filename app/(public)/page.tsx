import { Hero } from '@/components/features/Hero';
import { FeaturedProperties } from '@/components/features/FeaturedProperties';
import { Services } from '@/components/features/Services';
import { LatestArticles } from '@/components/features/LatestArticles';
import { ContactCTA } from '@/components/features/ContactCTA';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

// Force dynamic rendering to ensure the latest articles are always shown
export const revalidate = 0;

export default function Home() {
  return (
    <>
      <div className="relative z-0">
        <Hero />
      </div>

      <div className="relative z-10 bg-[#050505]">
        <RevealOnScroll direction="up" delay={100} threshold={0.1}>
          <FeaturedProperties />
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={200} threshold={0.1} className="relative z-20">
          <LatestArticles />
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={100} threshold={0.05}>
          <Services />
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={100} threshold={0.1}>
          <ContactCTA />
        </RevealOnScroll>
      </div>
    </>
  );
}
