'use client';

import React, { JSX, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CompanyLogo } from '@/app/assets';
import { useAppDispatch } from '@/lib/store/hooks';
import { clearError } from '@/lib/store/features/auth';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  illustration?: string;
  footer?: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearError());

    // Clear errors when component unmounts
    return (): void => {
      dispatch(clearError());
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-green-50 via-white to-green-50 lg:flex-row">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24"
      >
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center justify-center lg:justify-start">
            <Image src={CompanyLogo} alt="Maltiti Logo" width={60} height={60} priority />
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          </div>

          {/* Form Content */}
          <div>{children}</div>

          {/* Footer */}
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </motion.div>

      {/* Right Side - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative hidden w-1/2 bg-linear-to-br from-green-500 to-green-700 lg:flex lg:items-center lg:justify-center"
      >
        <div className="relative h-full w-full p-12">
          <div className="flex h-full flex-col items-center justify-center text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <h2 className="mb-4 text-4xl font-bold">Welcome to Maltiti</h2>
              <p className="text-xl text-green-100">
                Your trusted source for quality shea butter and natural products
              </p>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-white"></div>
              <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
