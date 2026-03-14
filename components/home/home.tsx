'use client';

import { JSX, useEffect } from 'react';
import { Faqs } from '@/components/faqs';
import { faqData } from '@/lib/faq-data';
import { BestProductsSection } from '@/components/products';
import { HeroSection } from '@/components/home/hero-section';
import { AboutUsSection } from '@/components/home/about-us-section';
import { LeadershipTeamSection } from '@/components/home/leadership-team-section';
import { teamMembers } from '@/lib/team-data';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { testimonialsData } from '@/lib/testimonials-data';
import { LocationSection } from '@/components/home/location-section';
import { maltitiLocationInfo } from '@/lib/location-data';
import { ContactSection } from '@/components/home/contact-section';
import { TrackOrderSection } from '@/components/home/track-order-section';
import { useAppSelector } from '@/lib/store/hooks';

export default function Home(): JSX.Element {
  const { loading } = useAppSelector(({ products }) => products);

  useEffect(() => {
    if (loading) {
      return;
    }

    const hash = globalThis.location.hash.slice(1);
    if (!hash) {
      return;
    }

    // Small delay to ensure layout has fully settled after products load
    const timer = setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);

    return (): void => clearTimeout(timer);
  }, [loading]);

  return (
    <main className="mx-auto mt-20">
      <HeroSection />
      <div className="px-8">
        <BestProductsSection />
      </div>
      <TrackOrderSection />
      <AboutUsSection />
      <LeadershipTeamSection teamMembers={teamMembers} />
      <TestimonialsSection testimonials={testimonialsData} />
      <div className="px-8">
        <section id="faqs" className="scroll-mt-20 py-20">
          <Faqs items={faqData} />
        </section>
      </div>
      <LocationSection location={maltitiLocationInfo} />
      <ContactSection />
    </main>
  );
}
