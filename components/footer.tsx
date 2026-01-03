'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useCookieConsent } from '@/lib/cookie-consent';

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();
  const { openSettings } = useCookieConsent();

  return (
    <footer className="bg-slate-900 text-slate-200">
      {/* Optional gradient divider */}
      <div className="from-primary/20 via-primary/40 to-primary/20 h-1 bg-linear-to-r"></div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand / About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Maltiti A. Enterprise Ltd</h3>
            <p className="text-sm leading-relaxed">
              A trusted producer and exporter of organic shea butter, essential oils, and agro-based
              products from Ghana.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="hover:text-primary text-sm transition-colors duration-200">
                Home
              </Link>
              <Link
                href="/#about"
                className="hover:text-primary text-sm transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                href="/shop"
                className="hover:text-primary text-sm transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                href="/blog"
                className="hover:text-primary text-sm transition-colors duration-200"
              >
                Blog
              </Link>
              <Link
                href="/#contactus"
                className="hover:text-primary text-sm transition-colors duration-200"
              >
                Contact Us
              </Link>
              <Link
                href="/#faqs"
                className="hover:text-primary text-sm transition-colors duration-200"
              >
                FAQs
              </Link>
            </nav>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal & Policies</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/privacy"
                className="hover:text-primary text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary text-sm transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              <button
                onClick={openSettings}
                className="hover:text-primary text-left text-sm transition-colors duration-200"
              >
                Cookie Settings
              </button>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-2">
              <Link
                href="mailto:info@maltitiaenterprise.com"
                className="hover:text-primary flex items-center space-x-2 text-sm transition-colors duration-200"
              >
                <Mail className="h-4 w-4" />
                <span>info@maltitiaenterprise.com</span>
              </Link>
              <p className="text-sm">Ghana</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <div className="flex justify-center space-x-6">
            <Link
              href="https://www.linkedin.com/company/maltiti-a-enterprise/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary text-gray-400 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Icon icon="simple-icons:linkedin" className="h-6 w-6" />
            </Link>
            <Link
              href="https://web.facebook.com/mhaltiti99"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary text-gray-400 transition-colors duration-200"
              aria-label="Facebook"
            >
              <Icon icon="simple-icons:facebook" className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.instagram.com/maltiti_a_enterprise/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary text-gray-400 transition-colors duration-200"
              aria-label="Instagram"
            >
              <Icon icon="simple-icons:instagram" className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm">
              © {currentYear} Maltiti A. Enterprise Ltd. All rights reserved.
            </p>
            <p className="text-primary text-sm font-medium">Certified | Organic | Export-Ready</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
