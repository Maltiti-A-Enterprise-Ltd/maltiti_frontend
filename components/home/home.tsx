import { JSX } from 'react';
import { NavBar } from '@/components/home/navbar';
import { FAQ } from '@/components/faq';
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

export default function Home(): JSX.Element {
  return (
    <main className="mx-auto mt-20">
      <NavBar />
      <HeroSection />
      <div className="px-8">
        <BestProductsSection />
      </div>
      <AboutUsSection />
      <LeadershipTeamSection teamMembers={teamMembers} />
      <TestimonialsSection testimonials={testimonialsData} />
      <div className="px-8">
        <section id="faqs" className="scroll-mt-20 py-20">
          <FAQ items={faqData} />
        </section>
      </div>
      <LocationSection location={maltitiLocationInfo} />
      <ContactSection />
    </main>
  );
}
