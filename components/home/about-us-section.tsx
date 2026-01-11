'use client';

import { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Award,
  Heart,
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
  Leaf,
  Globe,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AboutUsCEO, SvgDecoratorBlob2, SvgDecoratorBlob4 } from '@/app/assets';

type AboutUsSectionProps = Record<string, never>;

export function AboutUsSection({}: AboutUsSectionProps): JSX.Element {
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

  const impactStats = [
    { icon: Users, value: '5,000+', label: 'Women Empowered', color: 'text-green-600' },
    { icon: TrendingUp, value: '22+', label: 'Years of Impact', color: 'text-amber-600' },
    { icon: Globe, value: 'Global', label: 'Market Reach', color: 'text-blue-600' },
    { icon: Heart, value: '1000s', label: 'Families Supported', color: 'text-pink-600' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'We never compromise on the quality of our products or processes.',
    },
    {
      icon: Users,
      title: 'Women Empowerment',
      description: 'Training and empowering women is at the heart of everything we do.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We practice ethical sourcing and sustainable farming methods.',
    },
    {
      icon: Target,
      title: 'Reliability',
      description: 'Our partners and customers can always count on us to deliver.',
    },
  ];

  const products = [
    'Shea Butter & Shea-Based Products',
    'Black Soap & Natural Cosmetics',
    'Essential Oils (Moringa, Neem, Baobab, Palm Kernel)',
    'Agricultural Processing (Rice, Soy, Maize, Groundnut)',
    'Organic Farming Operations',
  ];

  const certifications = [
    'Organic Certified',
    'Fair Trade',
    'GSA Certified',
    'FDA Approved',
    'Global Shea Alliance Member',
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-linear-to-b from-white via-green-50/30 to-white py-16 lg:py-24"
    >
      {/* Decorative Blobs */}
      <motion.div
        className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 opacity-5"
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
        <Image src={SvgDecoratorBlob2} alt="" fill className="object-contain" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 opacity-5"
        animate={{
          y: [0, -30, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image src={SvgDecoratorBlob4} alt="" fill className="object-contain" />
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
            <Badge className="bg-green-100 px-4 py-1.5 text-green-800">Our Story</Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Building a Legacy of{' '}
            <span className="bg-linear-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
              Quality & Impact
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-lg text-gray-600 sm:text-xl"
          >
            Since 2002, we&apos;ve been transforming lives through organic products, women
            empowerment, and sustainable agriculture in Northern Ghana.
          </motion.p>
        </motion.div>

        {/* Founder Story Section */}
        <motion.div
          className="mb-16 lg:mb-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Founder Image */}
            <motion.div variants={fadeIn} className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={AboutUsCEO}
                  alt="Rabiatu Gurunpaga Abukari - Founder & CEO of Maltiti A. Enterprise Ltd"
                  width={600}
                  height={700}
                  className="h-auto w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                {/* Founder Card Overlay */}
                <motion.div
                  className="absolute right-6 bottom-6 left-6 rounded-2xl bg-white/95 p-6 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="mb-1 text-sm font-medium text-green-600">Founder & CEO</p>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    Rabiatu Gurunpaga Abukari
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visionary leader empowering thousands of women through sustainable agriculture
                    and quality organic products
                  </p>
                </motion.div>
              </div>

              {/* Floating Stats */}
              <motion.div
                className="absolute -top-4 -right-4 rounded-2xl bg-green-600 p-4 text-white shadow-xl sm:-top-6 sm:-right-6 sm:p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold sm:text-4xl">22+</div>
                  <div className="text-sm sm:text-base">Years of Excellence</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Founder Story Content */}
            <motion.div variants={staggerChildren} className="order-1 space-y-6 lg:order-2">
              <motion.div variants={fadeInUp}>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                  From Humble Beginnings to Global Impact
                </h3>
                <p className="text-lg leading-relaxed text-gray-600">
                  In 2002, <strong>Rabiatu Gurunpaga Abukari</strong> started Maltiti A. Enterprise
                  Ltd with a simple but powerful vision: to improve lives through the power of shea
                  and organic products while empowering women in Northern Ghana.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-4">
                <p className="leading-relaxed text-gray-600">
                  What began as a very small operation has grown into a thriving enterprise that
                  impacts over <strong>5,000 women</strong> and their families. Through training,
                  mechanization, and unwavering commitment to quality, Rabiatu has transformed
                  traditional farming practices into a sustainable, scalable business model.
                </p>
                <p className="leading-relaxed text-gray-600">
                  Her leadership has enabled women to increase their income, access education for
                  their children, participate in mobile savings programs, and secure health
                  insurance— fundamentally changing the trajectory of entire communities.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="pt-4">
                <div className="rounded-xl bg-green-50 p-6">
                  <p className="text-lg font-semibold text-green-800 italic">
                    &ldquo;Quality is not negotiable. When we empower women with skills and
                    resources, we don&apos;t just change individual lives—we transform entire
                    communities.&rdquo;
                  </p>
                  <p className="mt-2 text-sm text-green-700">— Rabiatu Gurunpaga Abukari</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          className="mb-16 lg:mb-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <Card className="border-none bg-white p-6 text-center shadow-lg transition-shadow hover:shadow-xl">
                    <Icon className={`mx-auto mb-3 h-8 w-8 ${stat.color}`} />
                    <div className="mb-1 text-3xl font-bold text-gray-900 sm:text-4xl">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 sm:text-base">{stat.label}</div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission, Vision & What We Do */}
        <motion.div
          className="mb-16 lg:mb-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Mission */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-none bg-linear-to-br from-green-600 to-green-700 p-8 text-white shadow-xl">
                <Target className="mb-4 h-10 w-10" />
                <h3 className="mb-3 text-2xl font-bold">Our Mission</h3>
                <p className="leading-relaxed">
                  Improving lives through the power of shea and organic products, while empowering
                  women and practicing sustainable agriculture.
                </p>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-none bg-linear-to-br from-amber-600 to-amber-700 p-8 text-white shadow-xl">
                <Globe className="mb-4 h-10 w-10" />
                <h3 className="mb-3 text-2xl font-bold">Our Vision</h3>
                <p className="leading-relaxed">
                  To become the biggest exporter of shea butter and essential organic products
                  globally, setting the standard for quality and ethical sourcing.
                </p>
              </Card>
            </motion.div>

            {/* What We Do */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-none bg-linear-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
                <Leaf className="mb-4 h-10 w-10" />
                <h3 className="mb-3 text-2xl font-bold">What We Do</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  {products.slice(0, 3).map((product, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{product}</span>
                    </li>
                  ))}
                  <li className="text-white/90">...and more</li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Products & Services - Detailed */}
        <motion.div
          className="mb-16 lg:mb-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp} className="mb-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              Our Products & Services
            </h3>
            <p className="mx-auto max-w-2xl text-gray-600">
              From shea butter to agricultural processing, every product represents our commitment
              to quality, sustainability, and community impact.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <Card className="border-l-4 border-green-600 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                  <CheckCircle className="mb-3 h-6 w-6 text-green-600" />
                  <p className="font-semibold text-gray-900">{product}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          className="mb-16 lg:mb-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp} className="mb-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">Our Core Values</h3>
            <p className="mx-auto max-w-2xl text-gray-600">
              These principles guide every decision we make and every relationship we build.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-none bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-green-100 p-4">
                        <Icon className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h4 className="mb-2 text-lg font-bold text-gray-900">{value.title}</h4>
                    <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Trust & Credibility */}
        <motion.div
          className="mb-16 lg:mb-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp}>
            <Card className="border-none bg-linear-to-r from-gray-50 to-green-50/50 p-8 shadow-lg lg:p-12">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                <div>
                  <Award className="mb-4 h-12 w-12 text-green-600" />
                  <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Certified & Trusted
                  </h3>
                  <p className="mb-6 leading-relaxed text-gray-600">
                    Our commitment to quality and ethical practices is recognized by leading
                    international organizations. We maintain the highest standards through
                    partnerships with MEDA, SNV, Global Shea Alliance, and more.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert, index) => (
                      <Badge
                        key={index}
                        className="bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none bg-white p-6 text-center shadow-md">
                    <Shield className="mx-auto mb-2 h-8 w-8 text-green-600" />
                    <p className="text-sm font-semibold text-gray-900">Quality Assured</p>
                  </Card>
                  <Card className="border-none bg-white p-6 text-center shadow-md">
                    <Award className="mx-auto mb-2 h-8 w-8 text-amber-600" />
                    <p className="text-sm font-semibold text-gray-900">Internationally Certified</p>
                  </Card>
                  <Card className="border-none bg-white p-6 text-center shadow-md">
                    <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-900">Community Focused</p>
                  </Card>
                  <Card className="border-none bg-white p-6 text-center shadow-md">
                    <Heart className="mx-auto mb-2 h-8 w-8 text-pink-600" />
                    <p className="text-sm font-semibold text-gray-900">Ethically Sourced</p>
                  </Card>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp}>
            <Card className="border-none bg-linear-to-r from-green-600 to-green-700 p-8 text-white shadow-2xl lg:p-12">
              <h3 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
                Join Us in Making a Difference
              </h3>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-green-50">
                Whether you&apos;re looking for premium organic products or interested in partnering
                with a purpose-driven company, we&apos;d love to connect with you.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="group h-12 rounded-full bg-white px-8 text-base font-semibold text-green-700 shadow-lg transition-all hover:scale-105 hover:bg-green-50 sm:h-14 sm:text-lg"
                >
                  <Link href="/shop">
                    Explore Our Products
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-2 border-white bg-transparent px-8 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-white/10 sm:h-14 sm:text-lg"
                >
                  <a href="#contactus">Partner With Us</a>
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
