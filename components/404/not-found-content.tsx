'use client';

import { JSX } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Hero3, Hero5, SvgDecoratorBlob3, SvgDecoratorBlob5 } from '@/app/assets';

type NotFoundContentProps = Record<string, never>;

export function NotFoundContent({}: NotFoundContentProps): JSX.Element {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="relative mt-16 min-h-screen overflow-hidden bg-linear-to-br from-green-50/30 via-white to-amber-50/40">
      {/* Decorative Blobs - Background Layer */}
      <motion.div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 opacity-[0.07] lg:-top-40 lg:-right-40 lg:h-125 lg:w-125"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Image src={SvgDecoratorBlob3} alt="" fill className="object-contain" aria-hidden="true" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 opacity-[0.06] lg:-bottom-32 lg:-left-32 lg:h-112.5 lg:w-112.5"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Image src={SvgDecoratorBlob5} alt="" fill className="object-contain" aria-hidden="true" />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center lg:flex-row lg:gap-12 xl:gap-20">
          {/* Left Content - Text and CTAs */}
          <motion.div
            className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {/* 404 Badge */}
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#0F6938]/10 px-4 py-2 text-sm font-medium text-[#0F6938]"
            >
              <span className="text-2xl font-bold">404</span>
              <span>•</span>
              <span>Page Not Found</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={fadeInUp}
              className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            >
              Oops! This page
              <br />
              <span className="bg-linear-to-r from-[#0F6938] to-emerald-600 bg-clip-text text-transparent">
                can&apos;t be found
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="mb-8 max-w-lg text-base text-gray-600 sm:text-lg"
            >
              We couldn&apos;t find the page you&apos;re looking for. But don&apos;t worry—we have
              plenty of wonderful organic products and stories to share with you!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row sm:gap-3">
              <Button
                asChild
                size="lg"
                className="group h-12 bg-[#0F6938] px-8 text-base font-semibold hover:bg-[#0F6938]/90 focus-visible:ring-[#0F6938]/30"
              >
                <Link href="/">
                  <Home className="size-5" />
                  <span>Go back home</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="group h-12 border-[#0F6938]/20 px-8 text-base font-semibold text-[#0F6938] hover:bg-[#0F6938]/5 hover:text-[#0F6938] focus-visible:ring-[#0F6938]/30"
              >
                <Link href="/shop">
                  <ShoppingBag className="size-5" />
                  <span>Shop our products</span>
                </Link>
              </Button>
            </motion.div>

            {/* Additional Link */}
            <motion.div variants={fadeInUp} className="mt-8">
              <Link
                href="/#about"
                className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#0F6938]"
              >
                <Heart className="size-4 text-[#0F6938]" />
                <span>Learn about our mission and values</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Reassuring Note */}
            <motion.div
              variants={fadeIn}
              className="mt-12 max-w-lg rounded-xl border border-[#0F6938]/10 bg-linear-to-br from-[#0F6938]/5 to-emerald-50/30 p-6"
            >
              <p className="text-sm leading-relaxed text-gray-700">
                <span className="font-semibold text-[#0F6938]">Nothing is broken!</span> You might
                have followed an outdated link, or the page may have moved. Our team is here to
                help—feel free to{' '}
                <Link
                  href="/#contactus"
                  className="font-medium text-[#0F6938] underline decoration-[#0F6938]/30 underline-offset-2 hover:decoration-[#0F6938]"
                >
                  reach out
                </Link>{' '}
                if you need assistance.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            className="relative mt-12 flex flex-1 items-center justify-center lg:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Image Container with decorative elements */}
            <div className="relative">
              {/* Background Circle Decoration */}
              <motion.div
                className="absolute inset-0 -z-10 scale-110 rounded-full bg-linear-to-br from-[#0F6938]/10 via-emerald-100/20 to-amber-100/20 blur-3xl"
                animate={{
                  scale: [1.1, 1.2, 1.1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Floating Image 1 */}
              {/* Floating Image 1 */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative h-64 w-64 overflow-hidden rounded-3xl shadow-2xl shadow-[#0F6938]/10 sm:h-80 sm:w-80 lg:h-96 lg:w-96"
              >
                <Image
                  src={Hero3}
                  alt="Organic shea butter production"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0F6938]/20 to-transparent" />
              </motion.div>

              {/* Floating Image 2 - Smaller overlay */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  transition: {
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  },
                }}
                className="absolute -right-6 -bottom-6 h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-xl shadow-[#0F6938]/20 sm:-right-8 sm:-bottom-8 sm:h-40 sm:w-40"
              >
                <Image
                  src={Hero5}
                  alt="Natural products from Ghana"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 128px, 160px"
                />
                <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-transparent" />
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-linear-to-br from-[#0F6938] to-emerald-600 opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-linear-to-br from-amber-400 to-orange-500 opacity-15 blur-2xl"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute right-0 bottom-0 left-0 h-24 bg-linear-to-t from-white/50 to-transparent" />
    </section>
  );
}
