'use client';

import { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Quote, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/lib/team-data';
import { SvgDecoratorBlob5 } from '@/app/assets';

type LeadershipTeamProps = {
  teamMembers: TeamMember[];
};

export function LeadershipTeamSection({ teamMembers }: LeadershipTeamProps): JSX.Element {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleOnHover = {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-green-50/20 to-white py-16 lg:py-24">
      {/* Decorative Blob */}
      <motion.div
        className="pointer-events-none absolute top-20 -left-20 h-96 w-96 opacity-5"
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
        <Image src={SvgDecoratorBlob5} alt="" fill className="object-contain" />
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
            <Badge className="bg-green-100 px-4 py-1.5 text-green-800">Our Leadership</Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Meet the{' '}
            <span className="bg-linear-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
              Leadership Team
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl"
          >
            Driven by purpose, guided by experience, and committed to empowering communities through
            quality and innovation.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeInUp}
              whileHover={scaleOnHover}
              className="group"
            >
              <Card className="relative h-full overflow-hidden border-none bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
                {/* Board Member Badge */}
                {member.isBoardMember && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-600 px-3 py-1 text-xs text-white shadow-md">
                      Board Member
                    </Badge>
                  </div>
                )}

                {/* Card Content */}
                <div className="flex flex-col items-center p-6 lg:p-8">
                  {/* Profile Image */}
                  <div className="relative mb-6">
                    <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-green-100 shadow-xl transition-all duration-300 group-hover:border-green-600 sm:h-48 sm:w-48">
                      <Image
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 160px, 192px"
                      />
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute -inset-2 -z-10 rounded-full bg-linear-to-br from-green-100 to-amber-100 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70" />
                  </div>

                  {/* Name & Role */}
                  <div className="mb-4 text-center">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-green-600 sm:text-base">{member.role}</p>
                  </div>

                  {/* Quote Section */}
                  <div className="relative w-full">
                    {/* Quote Icon */}
                    <div className="mb-2 flex justify-center">
                      <Quote className="h-6 w-6 text-green-600 opacity-30" fill="currentColor" />
                    </div>

                    {/* Quote Text */}
                    <blockquote className="text-center">
                      <p className="text-sm leading-relaxed text-gray-700 italic sm:text-base">
                        &ldquo;{member.quote}&rdquo;
                      </p>
                    </blockquote>

                    {/* Decorative Line */}
                    <div className="mx-auto mt-4 h-1 w-16 bg-linear-to-r from-green-600 to-amber-600" />
                  </div>
                </div>

                {/* Hover Accent Border */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-green-600 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Leadership Stats */}
        <motion.div
          className="mt-16 lg:mt-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="border-none bg-linear-to-r from-green-600 to-green-700 p-8 text-center text-white shadow-xl lg:p-12">
            <div className="mb-6">
              <Users className="mx-auto h-12 w-12 text-white opacity-80" />
            </div>
            <h3 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Leadership Committed to Impact
            </h3>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-green-50">
              Our leadership team brings together decades of experience in agriculture, business
              management, finance, and community development. United by a shared vision of
              empowering women and communities through quality organic products.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <div className="mb-2 text-3xl font-bold sm:text-4xl">22+</div>
                <div className="text-sm text-green-100 sm:text-base">Years Experience</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold sm:text-4xl">5</div>
                <div className="text-sm text-green-100 sm:text-base">Board Members</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold sm:text-4xl">5,000+</div>
                <div className="text-sm text-green-100 sm:text-base">Lives Impacted</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold sm:text-4xl">Global</div>
                <div className="text-sm text-green-100 sm:text-base">Market Reach</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
