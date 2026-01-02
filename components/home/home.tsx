import { JSX } from 'react';
import { NavBar } from '@/components/home/navbar';
import { FAQ } from '@/components/faq';
import { faqData } from '@/lib/faq-data';
import { BestProductsSection } from '@/components/products';
import { HeroSection } from '@/components/home/hero-section';
import { AboutUsSection } from '@/components/home/about-us-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { testimonialsData } from '@/lib/testimonials-data';

export default function Home(): JSX.Element {
  return (
    <main className="mx-auto mt-20">
      <NavBar />
      <HeroSection />
      <div className="px-8">
        <BestProductsSection />
      </div>
      <AboutUsSection />
      <TestimonialsSection testimonials={testimonialsData} />
      <div className="px-8">
        <section id="faqs" className="scroll-mt-20 py-20">
          <FAQ items={faqData} />
        </section>
        <section id="contactus" className="scroll-mt-20 bg-gray-50 py-20">
          <h2 className="mb-8 text-center text-3xl font-bold">Contact Us</h2>
          <p className="text-center">Get in touch with us.</p>
        </section>
      </div>
    </main>
  );
}
