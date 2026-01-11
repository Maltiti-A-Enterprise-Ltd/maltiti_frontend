import { StaticImageData } from 'next/image';
import {
  RabiatuAbukari,
  KasimImoro,
  BilalAbubakari,
  KantakoMohammed,
  MohammedSuhuyini,
} from '@/app/assets';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: StaticImageData;
  isBoardMember?: boolean;
};

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Rabiatu Abukari',
    role: 'CEO / Founder',
    quote:
      'It is my utmost believe that I can change the lives of many with power of shea nuts and so help me God.',
    image: RabiatuAbukari,
    isBoardMember: false,
  },
  {
    id: '2',
    name: 'Kassim Imoro',
    role: 'General Manager',
    quote:
      'I want to be an active change agent to many rural communities in Northern Ghana with a strong ability to research and communicate effectively.',
    image: KasimImoro,
    isBoardMember: true,
  },
  {
    id: '3',
    name: 'Bilal Abubakari',
    role: 'Director',
    quote:
      'Maltiti is on its way to breaking strongly into the European market, and digitization and social media are going to be very key to achieving such a goal.',
    image: BilalAbubakari,
    isBoardMember: true,
  },
  {
    id: '4',
    name: 'Kantako Muhammed',
    role: 'Operations Manager',
    quote:
      'I have been working with Maltiti for more than 5 years and it has indeed been a very enriching experience. This organization offers opportunities for everyone, especially women.',
    image: KantakoMohammed,
    isBoardMember: true,
  },
  {
    id: '5',
    name: 'Abubakari Mohammed Suhuyini',
    role: 'Head of Sales & Finance',
    quote:
      'Maltiti is strongly involved at the grassroots level so every woman is paid and treated fairly in production activities. This puts smiles on women in the shea-producing communities.',
    image: MohammedSuhuyini,
    isBoardMember: true,
  },
];
