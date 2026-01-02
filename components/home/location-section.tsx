'use client';

import { JSX, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Navigation, ExternalLink, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LocationInfo } from '@/lib/location-data';

type LocationSectionProps = {
  location: LocationInfo;
};

export function LocationSection({ location }: LocationSectionProps): JSX.Element {
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const handleCopy = (text: string, field: string): void => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getGoogleMapsUrl = (): string =>
    `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;

  const getDirectionsUrl = (): string =>
    `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;

  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBl4sgRqm-6PHB4dZI_QYnoXZtOqnt_tvI';

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-gray-50 to-white py-16 lg:py-24">
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
            <Badge className="bg-green-100 px-4 py-1.5 text-green-800">Find Us</Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Visit Our{' '}
            <span className="bg-linear-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
              Location
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl"
          >
            We&apos;re located in Tamale, Northern Ghana. Visit us or get in touch today.
          </motion.p>
        </motion.div>

        {/* Main Content: Map + Contact Info */}
        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          {/* Google Map */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden border-none shadow-xl">
              <div className="relative h-96 w-full lg:h-full lg:min-h-150">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map showing location of ${location.name}`}
                  className="h-full w-full"
                />
              </div>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={fadeInUp} className="space-y-6">
            {/* Address Card */}
            <Card className="border-l-4 border-green-600 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl lg:p-8">
              <div className="mb-4 flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Physical Address</h3>
                  <p className="mb-3 leading-relaxed text-gray-700">{location.address}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">P.O. Box:</span>
                      <span>{location.poBox}</span>
                      <button
                        onClick={() => handleCopy(location.poBox, 'poBox')}
                        className="ml-2 text-green-600 transition-colors hover:text-green-700"
                        aria-label="Copy P.O. Box"
                      >
                        {copiedField === 'poBox' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Digital Address:</span>
                      <span className="rounded bg-green-50 px-2 py-1 font-mono text-green-700">
                        {location.digitalAddress}
                      </span>
                      <button
                        onClick={() => handleCopy(location.digitalAddress, 'digitalAddress')}
                        className="ml-2 text-green-600 transition-colors hover:text-green-700"
                        aria-label="Copy digital address"
                      >
                        {copiedField === 'digitalAddress' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="flex-1 bg-green-600 text-white transition-colors hover:bg-green-700"
                >
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-green-600 text-green-600 transition-colors hover:bg-green-50"
                >
                  <a
                    href={getGoogleMapsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Maps
                  </a>
                </Button>
              </div>
            </Card>

            {/* Phone Card */}
            <Card className="border-l-4 border-green-600 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl lg:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-bold text-gray-900">Phone</h3>
                  <div className="space-y-2">
                    {location.phone.map((phone, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <a
                          href={`tel:${phone.replace(/\s/g, '')}`}
                          className="text-lg text-gray-700 transition-colors hover:text-green-600"
                        >
                          {phone}
                        </a>
                        <button
                          onClick={() => handleCopy(phone, `phone-${index}`)}
                          className="text-green-600 transition-colors hover:text-green-700"
                          aria-label={`Copy phone number ${phone}`}
                        >
                          {copiedField === `phone-${index}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Email Card */}
            <Card className="border-l-4 border-green-600 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl lg:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-bold text-gray-900">Email</h3>
                  <div className="flex items-center justify-between">
                    <a
                      href={`mailto:${location.email}`}
                      className="text-lg text-gray-700 transition-colors hover:text-green-600"
                    >
                      {location.email}
                    </a>
                    <button
                      onClick={() => handleCopy(location.email, 'email')}
                      className="text-green-600 transition-colors hover:text-green-700"
                      aria-label="Copy email address"
                    >
                      {copiedField === 'email' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Hours (Optional - can be added later) */}
            <Card className="bg-green-50 p-6 shadow-md lg:p-8">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Business Hours</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-12 lg:mt-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <div className="rounded-2xl bg-linear-to-r from-green-600 to-green-700 p-8 text-center text-white shadow-xl lg:p-12">
            <h3 className="mb-4 text-2xl font-bold sm:text-3xl">
              Established & Accessible Since 2002
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-green-50">
              We welcome visitors, partners, and buyers. Whether you&apos;re sourcing premium shea
              butter or exploring partnerships, our doors are open.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
