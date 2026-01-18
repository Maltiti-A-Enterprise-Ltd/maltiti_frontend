'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PolicyItem {
  title: string;
  content: string;
}

const privacyData: PolicyItem[] = [
  {
    title: '1. Introduction',
    content:
      'Maltiti A. Enterprise Ltd ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website, services, or purchase our products through our e-commerce platform.\n\nBy accessing or using our website, you agree to the practices described in this policy.',
  },
  {
    title: '2. Information We Collect',
    content: `a. Personal Information\n\nWe may collect the following information when you interact with our platform:\n\nFull name\n\nEmail address\n\nPhone number\n\nBilling and shipping address\n\nCompany name (for bulk or institutional buyers)\n\nPayment-related details (processed securely via third-party providers)\n\nb. Order & Transaction Information\n\nProducts purchased\n\nOrder quantities and packaging preferences\n\nShipping destination\n\nOrder history and invoices\n\nc. Technical & Usage Data\n\nIP address\n\nBrowser type and device information\n\nPages visited and interactions on our website\n\nCookies and similar tracking technologies`,
  },
  {
    title: '3. How We Use Your Information',
    content: `We use your information to:\n\nProcess and fulfill orders\n\nArrange local and international shipping\n\nCommunicate order updates and customer support responses\n\nImprove website performance and user experience\n\nComply with legal and regulatory obligations\n\nSend marketing or promotional messages (only where consent is given)`,
  },
  {
    title: '4. Sharing of Information',
    content: `We do not sell or rent your personal data.\n\nWe may share information only with:\n\nPayment processors\n\nShipping and logistics partners\n\nRegulatory authorities where legally required\n\nAll third parties are required to protect your data and use it only for the intended purpose.`,
  },
  {
    title: '5. Data Security',
    content:
      'We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, loss, or misuse.\n\nHowever, no online platform can guarantee 100% security. You share information at your own risk.',
  },
  {
    title: '6. Cookies',
    content: `Our website uses cookies to:\n\nImprove functionality and performance\n\nUnderstand user behavior\n\nEnhance browsing experience\n\nYou can disable cookies through your browser settings, though some features may not function properly.`,
  },
  {
    title: '7. Your Rights',
    content: `You have the right to:\n\nAccess your personal data\n\nRequest correction of inaccurate data\n\nRequest deletion of your data (subject to legal obligations)\n\nWithdraw consent for marketing communications\n\nRequests can be made via our official contact channels.`,
  },
  {
    title: '8. International Users',
    content:
      'As we serve customers globally, your data may be processed or stored outside your country of residence in compliance with applicable data protection laws.',
  },
  {
    title: '9. Changes to This Policy',
    content:
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.',
  },
  {
    title: '10. Contact Us',
    content:
      'For questions about this Privacy Policy, please contact us through our website or official business channels.',
  },
];

export default function PrivacyPage(): JSX.Element {
  const router = useRouter();

  return (
    <main className="mx-auto mt-20 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl p-6"
      >
        <div className="mb-8 text-center">
          <Button variant="ghost" onClick={() => router.back()} className="text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="from-primary via-primary to-primary/80 mb-3 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-wide text-transparent drop-shadow-sm">
            Privacy Policy
          </h1>
          <div className="from-primary/60 to-primary/30 mx-auto mb-4 h-0.5 w-16 rounded-full bg-linear-to-r"></div>
          <p className="text-primary/70 mx-auto max-w-md text-sm leading-relaxed font-medium">
            Your privacy is important to us. Please read this policy carefully.
          </p>
          <p className="text-muted-foreground mt-4 text-sm">Effective Date: December 31, 2025</p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {privacyData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="bg-card rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <span className="font-semibold">{item.title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-sm leading-relaxed whitespace-pre-line">{item.content}</div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </main>
  );
}
