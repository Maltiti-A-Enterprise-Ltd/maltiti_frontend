import Image from 'next/image';
import { JSX } from 'react';
import { CompanyLogo } from '@/app/assets';

export function Loader(): JSX.Element {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative flex h-36 w-36 items-center justify-center">
        <div className="border-primary absolute inset-0 animate-spin rounded-full border-t-4 border-r-4"></div>
        <Image src={CompanyLogo} alt="Maltiti logo" className="h-16 w-16" />
      </div>
    </div>
  );
}
