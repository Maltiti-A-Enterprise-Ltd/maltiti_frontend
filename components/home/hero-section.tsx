'use client';

import { JSX, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowRight, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Hero1,
  Hero3,
  Hero5,
  Hero7,
  SvgDecoratorBlob1,
  SvgDecoratorBlob3,
  SvgDecoratorBlob5,
  SvgDecoratorBlob7,
} from '@/app/assets';

type HeroSectionProps = Record<string, never>;

export function HeroSection({}: HeroSectionProps): JSX.Element {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

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
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-linear-to-br from-amber-50 via-white to-green-50">
      {/* Decorative Blobs - Background Layer */}
      <motion.div
        className="pointer-events-none absolute -top-32 -right-32 h-125 w-125 opacity-10 lg:-top-40 lg:-right-40 lg:h-175 lg:w-175"
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
        <Image src={SvgDecoratorBlob1} alt="" fill className="object-contain" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -bottom-20 -left-20 h-100 w-100 opacity-10 lg:-bottom-32 lg:-left-32 lg:h-150 lg:w-150"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image src={SvgDecoratorBlob3} alt="" fill className="object-contain" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/4 hidden h-75 w-75 -translate-x-1/2 -translate-y-1/2 opacity-5 lg:block"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image src={SvgDecoratorBlob5} alt="" fill className="object-contain" />
      </motion.div>

      {/* Main Content Grid */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left Content - Text */}
          <motion.div
            className="flex flex-col justify-center space-y-6 lg:space-y-8"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {/* Eyebrow Text */}
            <motion.div variants={fadeInUp} className="inline-flex">
              <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800 shadow-sm">
                From Ghana to the World 🌍
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl leading-tight font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Quality & Affordable{' '}
              <span className="relative">
                <span className="relative z-10 bg-linear-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
                  Organic Products
                </span>
                <motion.span
                  className="absolute bottom-1 left-0 z-0 h-3 w-full bg-yellow-200"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>{' '}
              Across the Globe
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              variants={fadeInUp}
              className="max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl lg:text-2xl"
            >
              Improving the lives of thousands of families in Northern Ghana through the power of
              the shea nut, ethical sourcing, and community empowerment.
            </motion.p>

            {/* Stats Section */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 lg:pt-8"
            >
              <div>
                <div className="text-2xl font-bold text-green-600 sm:text-3xl">100%</div>
                <div className="text-sm text-gray-600">Organic</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 sm:text-3xl">1000+</div>
                <div className="text-sm text-gray-600">Families</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 sm:text-3xl">Local</div>
                <div className="text-sm text-gray-600">Sourcing</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full bg-linear-to-r from-green-600 to-green-700 px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl sm:h-14 sm:text-lg"
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                onClick={() => setIsVideoOpen(true)}
                variant="outline"
                size="lg"
                className="group h-12 rounded-full border-2 border-gray-300 bg-white/80 px-8 text-base font-semibold text-gray-900 backdrop-blur-sm transition-all hover:scale-105 hover:border-green-600 hover:bg-white hover:text-green-700 sm:h-14 sm:text-lg"
              >
                <Play className="mr-2 h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                Watch Our Story
              </Button>
            </motion.div>

            {/* Track Order CTA */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 rounded-xl border-2 border-green-100 bg-green-50/50 p-4 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Already placed an order?</p>
                <Link
                  href="/track-order"
                  className="text-sm font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline"
                >
                  Track your order here →
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Images Grid */}
          <motion.div className="relative" initial="initial" animate="animate" variants={fadeIn}>
            {/* Decorative Blob Behind Images */}
            <motion.div
              className="pointer-events-none absolute -top-10 -right-10 h-100 w-100 opacity-20 lg:h-125 lg:w-125"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Image src={SvgDecoratorBlob7} alt="" fill className="object-contain" />
            </motion.div>

            {/* Image Grid */}
            <div className="relative grid grid-cols-2 gap-4 lg:gap-6">
              {/* Large Image - Top Left */}
              <motion.div
                className="relative col-span-2 h-64 overflow-hidden rounded-3xl shadow-2xl sm:h-80 lg:h-96"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <Image
                  src={Hero1}
                  alt="Maltiti A. Enterprise - Shea butter production"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </motion.div>

              {/* Small Image - Bottom Left */}
              <motion.div
                className="relative h-48 overflow-hidden rounded-3xl shadow-xl sm:h-56 lg:h-64"
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <Image
                  src={Hero3}
                  alt="Natural shea products"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </motion.div>

              {/* Small Image - Bottom Right */}
              <motion.div
                className="relative h-48 overflow-hidden rounded-3xl shadow-xl sm:h-56 lg:h-64"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <Image
                  src={Hero5}
                  alt="Community empowerment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-4 shadow-2xl sm:-bottom-6 sm:-left-6 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full sm:h-16 sm:w-16">
                  <Image src={Hero7} alt="Women empowerment" fill className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 sm:text-base">Women-Led</div>
                  <div className="text-xs text-gray-600 sm:text-sm">Community Impact</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">Maltiti A. Enterprise Brand Story</DialogTitle>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            {isVideoOpen && (
              <iframe
                src="https://www.youtube.com/embed/urqDElN7gzo?autoplay=1"
                title="Maltiti A. Enterprise Brand Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
