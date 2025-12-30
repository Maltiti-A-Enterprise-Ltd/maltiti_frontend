import { JSX } from 'react';
import { NavBar } from '@/components/home/navbar';

export default function Home(): JSX.Element {
  return (
    <main className="mx-auto mt-20 px-8">
      <NavBar />
      <section id="hero" className="py-20 text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Maltiti</h1>
        <p className="mb-8 text-lg">Your one-stop shop for quality products</p>
        <button className="rounded-full bg-green-500 px-6 py-3 text-white hover:bg-green-600">
          Shop Now
        </button>
      </section>
      <section id="about" className="py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">About Us</h2>
        <p className="mx-auto max-w-2xl text-center">
          We provide high-quality products with excellent customer service.
        </p>
      </section>
      <section id="shop" className="bg-gray-50 py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Shop</h2>
        <p className="text-center">Browse our collection of products.</p>
      </section>
      <section id="faqs" className="py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">FAQs</h2>
        <p className="text-center">Frequently asked questions.</p>
      </section>
      <section id="contactus" className="bg-gray-50 py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Contact Us</h2>
        <p className="text-center">Get in touch with us.</p>
      </section>
    </main>
  );
}
