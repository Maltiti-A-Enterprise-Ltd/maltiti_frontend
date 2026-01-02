import { StaticImageData } from 'next/image';
import { Darnisha } from '@/app/assets';

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  quote: string;
  image: StaticImageData;
};

export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Darnisha Wright',
    role: 'CEO',
    company: 'Ubuntu1865 African Marketplace',
    location: 'Oakland, CA – USA',
    quote:
      'I travel to Tamale, Ghana to meet with Maltiti annually for the last several years. I purchase their incredibly quality shea butter alone with oils, soaps and even delicious honey! Comparing with other cooperatives the quality and service does not compare with that of Maltiti. I am welcomed, treated like a family and provided with excellent service and outstanding products. I proudly brag in Oakland that I carry the finest, purest Shea butter in the world. I believe that to be true. I have yet to experience Shea butter quality better than what Maltiti provides. The soaps and oils are also of excellent price and quality.',
    image: Darnisha,
  },
  // Add more testimonials here as needed
];
