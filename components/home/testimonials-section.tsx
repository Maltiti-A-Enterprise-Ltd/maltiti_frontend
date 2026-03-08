'use client';

import { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Quote, Star, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Testimonial } from '@/lib/testimonials-data';
import { SvgDecoratorBlob8 } from '@/app/assets';

type TestimonialsProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsProps): JSX.Element {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-green-50/20 to-white py-16 lg:py-24">
      {/* Decorative Blob */}
      <motion.div
        className="pointer-events-none absolute top-10 -right-20 h-96 w-96 opacity-5"
        animate={{
          y: [0, 30, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image src={SvgDecoratorBlob8} alt="" fill className="object-contain" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center lg:mb-16"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <Badge className="bg-green-100 px-4 py-1.5 text-green-800">Client Testimonials</Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Trusted by Partners{' '}
            <span className="bg-linear-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
              Worldwide
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl"
          >
            Hear from our valued clients about their experience with Maltiti&apos;s quality products
            and exceptional service.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 gap-8 lg:gap-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={fadeInUp}>
              <Card className="overflow-hidden border-none bg-white shadow-xl transition-all hover:shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Left: Customer Image & Info */}
                  <div className="relative bg-linear-to-br from-green-600 to-green-700 p-8 lg:p-10">
                    {/* Quote Icon */}
                    <div className="absolute top-4 right-4 opacity-20">
                      <Quote className="h-20 w-20 text-white" fill="currentColor" />
                    </div>

                    {/* Customer Image */}
                    <div className="relative z-10 mb-6">
                      <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                        <Image
                          src={testimonial.image}
                          alt={`${testimonial.name} - ${testimonial.role} at ${testimonial.company}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 160px, 192px"
                        />
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="relative z-10 text-center text-white">
                      <h3 className="mb-2 text-2xl font-bold">{testimonial.name}</h3>
                      <p className="mb-1 text-lg font-medium text-green-100">{testimonial.role}</p>
                      <p className="mb-3 text-base text-green-50">{testimonial.company}</p>
                      <div className="flex items-center justify-center gap-2 text-sm text-green-100">
                        <MapPin className="h-4 w-4" />
                        <span>{testimonial.location}</span>
                      </div>

                      {/* Rating Stars */}
                      <div className="mt-4 flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Testimonial Content */}
                  <div className="relative col-span-2 p-8 lg:p-10">
                    {/* Quote Mark */}
                    <div className="mb-4">
                      <Quote className="h-12 w-12 text-green-600 opacity-30" fill="currentColor" />
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-lg leading-relaxed text-gray-700 sm:text-xl">
                      <p className="italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    </blockquote>

                    {/* Partnership Badge */}
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      <Badge className="bg-green-50 px-3 py-1 text-green-700">
                        Long-term Partner
                      </Badge>
                      <Badge className="bg-amber-50 px-3 py-1 text-amber-700">
                        International Client
                      </Badge>
                    </div>

                    {/* Decorative Line */}
                    <div className="mt-6 h-1 w-20 bg-linear-to-r from-green-600 to-amber-600" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-12 lg:mt-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-green-600 sm:text-4xl">100%</div>
              <div className="text-sm text-gray-600 sm:text-base">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-green-600 sm:text-4xl">22+</div>
              <div className="text-sm text-gray-600 sm:text-base">Years in Business</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-green-600 sm:text-4xl">Global</div>
              <div className="text-sm text-gray-600 sm:text-base">Market Reach</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-green-600 sm:text-4xl">Premium</div>
              <div className="text-sm text-gray-600 sm:text-base">Quality Products</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center lg:mt-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <p className="text-lg text-gray-600">
            Join our growing list of satisfied international partners.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
