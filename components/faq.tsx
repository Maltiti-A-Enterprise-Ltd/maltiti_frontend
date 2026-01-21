'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FAQItem, iconMap } from '@/lib/faq-data';
import { JSX } from 'react';

interface FAQProps {
  items: FAQItem[];
  className?: string;
}

export function FAQ({ items, className }: FAQProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn('mx-auto max-w-4xl p-6', className)}
    >
      <div className="mb-8 text-center">
        <h2 className="from-primary via-primary to-primary/80 mb-3 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-wide text-transparent drop-shadow-sm">
          Frequently Asked Questions
        </h2>
        <div className="from-primary/60 to-primary/30 mx-auto mb-4 h-0.5 w-16 rounded-full bg-linear-to-r"></div>
        <p className="text-primary/70 mx-auto max-w-md text-sm leading-relaxed font-medium">
          Find answers to common questions about our products and services.
        </p>
      </div>
      <Accordion type="single" collapsible className="space-y-4" defaultValue="item-0">
        {items.map((item, index) => {
          const IconComponent = item.icon ? iconMap[item.icon] : null;
          return (
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
                  <div className="flex items-center gap-3">
                    {IconComponent && <IconComponent className="text-primary h-5 w-5 shrink-0" />}
                    <span className="text-foreground font-medium">{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-muted-foreground pl-8 leading-relaxed">{item.answer}</div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>
    </motion.div>
  );
}
