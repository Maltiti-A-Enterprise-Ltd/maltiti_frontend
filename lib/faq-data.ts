import {
  Leaf,
  MapPin,
  Award,
  Truck,
  Package,
  Utensils,
  Factory,
  Shield,
  Phone,
} from 'lucide-react';

export const iconMap = {
  leaf: Leaf,
  mapPin: MapPin,
  award: Award,
  truck: Truck,
  package: Package,
  utensils: Utensils,
  factory: Factory,
  shield: Shield,
  phone: Phone,
};

export type IconName = keyof typeof iconMap;

export interface FAQItem {
  question: string;
  answer: string;
  icon?: IconName;
}

export const faqData: FAQItem[] = [
  {
    question: 'Are your products organic?',
    answer:
      'Yes. All our products are naturally made or processed organically. We also possess Ecocert certification.',
    icon: 'leaf',
  },
  {
    question: 'Where are you located?',
    answer: 'We are located at Malshegu, behind Star Fuel Station on the Kumbungu Road.',
    icon: 'mapPin',
  },
  {
    question: 'Are your products certified?',
    answer:
      'Yes. Our products are certified by the FDA, GSA, and other relevant regulatory bodies.',
    icon: 'award',
  },
  {
    question: 'Do you ship within Ghana and internationally?',
    answer: 'Yes. We ship to every region in Ghana and also export to customers across the globe.',
    icon: 'truck',
  },
  {
    question: 'What types of shea butter do you produce?',
    answer:
      'We produce both Grade A and Grade B shea butter in white and yellow varieties, suitable for food, cosmetic, and industrial use.',
    icon: 'package',
  },
  {
    question: 'What packaging sizes are available?',
    answer:
      'Our products are available in 1kg, 5kg, 12kg, and 25kg packaging, with customization options available upon request.',
    icon: 'package',
  },
  {
    question: 'Is your shea butter edible?',
    answer:
      'Yes. Our unrefined shea butter is edible and safe for use as cooking oil, as well as for cosmetic and pharmaceutical applications.',
    icon: 'utensils',
  },
  {
    question: 'Do you supply in bulk for factories and exporters?',
    answer:
      'Yes. We supply bulk quantities to factories, exporters, and institutional buyers both locally and internationally.',
    icon: 'factory',
  },
  {
    question: 'How do you ensure product quality?',
    answer:
      'We follow strict quality control processes, from sourcing high-quality shea nuts to hygienic processing, proper storage, and secure packaging.',
    icon: 'shield',
  },
  {
    question: 'How can I place an order or make inquiries?',
    answer:
      'You can contact us directly through our website, phone number, or email, and our team will assist you promptly.',
    icon: 'phone',
  },
];
