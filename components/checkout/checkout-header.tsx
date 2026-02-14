'use client';

import { JSX } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CheckoutHeaderProps = {
  onBack: () => void;
  title: string;
  description: string;
};

const CheckoutHeader = ({ onBack, title, description }: CheckoutHeaderProps): JSX.Element => (
  <div className="mb-8">
    <Button variant="ghost" onClick={onBack} className="mb-4 gap-2 hover:bg-transparent">
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
    <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

export default CheckoutHeader;
