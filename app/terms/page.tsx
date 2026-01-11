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

interface TermItem {
  title: string;
  content: string;
}

const termsData: TermItem[] = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing or purchasing from the Maltiti A. Enterprise Ltd website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.',
  },
  {
    title: '2. Products & Services',
    content: `We specialize in:\n\nShea butter (Grade A & B, white and yellow)\n\nBlack soap and shea-based cosmetics\n\nEssential oils and agricultural products\n\nProduct descriptions, images, and specifications are provided for informational purposes. Minor variations may occur due to natural production processes.`,
  },
  {
    title: '3. Orders & Payments',
    content: `All orders are subject to availability and confirmation\n\nPrices are listed in [currency] and may change without notice\n\nPayments must be completed before order processing begins\n\nBulk or custom orders may require partial or full advance payment`,
  },
  {
    title: '4. Shipping & Delivery',
    content: `We ship across Ghana and internationally\n\nDelivery timelines vary depending on destination and logistics partners\n\nCustomers are responsible for providing accurate shipping information\n\nMaltiti A. Enterprise Ltd is not liable for delays caused by customs, port authorities, or third-party carriers`,
  },
  {
    title: '5. Returns & Refunds',
    content: `Due to the nature of our products:\n\nReturns are accepted only for damaged, incorrect, or contaminated goods\n\nClaims must be reported within 48 hours of delivery\n\nRefunds or replacements are handled on a case-by-case basis\n\nCustom, bulk, or export orders are generally non-refundable unless otherwise agreed in writing.`,
  },
  {
    title: '6. Quality Assurance',
    content:
      'We maintain strict quality control standards. Certifications such as FDA, GSA, and others apply to specific products and batches as applicable.\n\nNatural variations in color, texture, or scent do not constitute defects.',
  },
  {
    title: '7. Intellectual Property',
    content:
      'All website content including text, images, logos, and designs belongs to Maltiti A. Enterprise Ltd and may not be reproduced without written permission.',
  },
  {
    title: '8. Limitation of Liability',
    content: `Maltiti A. Enterprise Ltd shall not be liable for:\n\nIndirect or consequential damages\n\nLosses resulting from misuse of products\n\nDelays beyond our reasonable control\n\nOur liability, where applicable, shall not exceed the value of the purchased product.`,
  },
  {
    title: '9. Governing Law',
    content:
      'These Terms & Conditions are governed by the laws of the Republic of Ghana. Any disputes shall be resolved under Ghanaian jurisdiction.',
  },
  {
    title: '10. Changes to Terms',
    content:
      'We reserve the right to modify these Terms & Conditions at any time. Continued use of the website constitutes acceptance of updated terms.',
  },
  {
    title: '11. Contact Information',
    content:
      'For questions regarding these Terms & Conditions, please contact us at [email] or [phone].',
  },
];

export default function TermsPage(): JSX.Element {
  const router = useRouter();

  return (
    <main className="mx-auto mt-20 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl p-6"
      >
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="from-primary via-primary to-primary/80 mb-3 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-wide text-transparent drop-shadow-sm">
              Terms & Conditions
            </h1>
            <div className="from-primary/60 to-primary/30 mx-auto mb-4 h-0.5 w-16 rounded-full bg-linear-to-r"></div>
            <p className="text-primary/70 mx-auto max-w-md text-sm leading-relaxed font-medium">
              Please read these terms carefully before using our services.
            </p>
            <p className="text-muted-foreground mt-4 text-sm">Effective Date: December 31, 2025</p>
          </div>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {termsData.map((item, index) => (
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
