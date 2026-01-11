'use client';

import React, { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Phone, User, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactSchema, type ContactFormData } from '@/lib/validations/contact';
import { contactControllerSubmitContactForm } from '@/app/api/sdk.gen';
import { toast } from 'sonner';

type ContactSectionProps = {
  className?: string;
};

export function ContactSection({ className = '' }: ContactSectionProps): JSX.Element {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });
  const onSubmit = async (data: ContactFormData): Promise<void> => {
    try {
      // Trim all text inputs before submission
      const sanitizedData = {
        fullName: data.fullName?.trim() || undefined,
        email: data.email?.trim() || undefined,
        phoneNumber: data.phoneNumber?.trim() || undefined,
        message: data.message.trim(),
      };

      // Call the generated API client
      const { error } = await contactControllerSubmitContactForm({
        body: sanitizedData,
      });

      if (error) {
        throw new Error(String(error));
      }

      // Success state
      setIsSuccess(true);
      reset();
      toast.success('Message sent successfully!', {
        description: 'Thank you for contacting us. We will get back to you soon.',
      });

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      // Error state
      console.error('Contact form submission error:', error);
      toast.error('Failed to send message', {
        description: 'Please try again later or contact us directly via email.',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="contactus"
      className={`scroll-mt-20 bg-linear-to-b from-gray-50 to-white py-20 ${className}`}
    >
      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Get in <span className="text-[#0F6938]">Touch</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Have a question or want to learn more about our products? Send us a message and
            we&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h3 className="mb-6 text-2xl font-bold text-gray-900">Contact Information</h3>
              <p className="text-gray-600">
                We&apos;d love to hear from you. Choose the method that works best for you.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F6938]/10">
                  <Mail className="h-6 w-6 text-[#0F6938]" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">Email Us</h4>
                  <a
                    href="mailto:info@maltitiaenterprise.com"
                    className="text-gray-600 transition-colors hover:text-[#0F6938]"
                  >
                    info@maltitiaenterprise.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F6938]/10">
                  <Phone className="h-6 w-6 text-[#0F6938]" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">Call Us</h4>
                  <p className="text-gray-600">Mon-Fri from 8am to 5pm</p>
                </div>
              </div>

              {/* Response Time */}
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F6938]/10">
                  <MessageSquare className="h-6 w-6 text-[#0F6938]" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">Quick Response</h4>
                  <p className="text-gray-600">We typically respond within 24 hours</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 className="mb-4 h-20 w-20 text-green-500" />
                  </motion.div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. We&apos;ll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">
                      <User className="inline h-4 w-4" /> Full Name{' '}
                      <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      {...register('fullName')}
                      aria-invalid={errors.fullName ? 'true' : 'false'}
                      disabled={isSubmitting}
                      autoComplete="name"
                      className="h-12"
                    />
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600"
                      >
                        {errors.fullName.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      <Mail className="inline h-4 w-4" /> Email{' '}
                      <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register('email')}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      disabled={isSubmitting}
                      autoComplete="email"
                      className="h-12"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-gray-700">
                      <Phone className="inline h-4 w-4" /> Phone Number{' '}
                      <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...register('phoneNumber')}
                      aria-invalid={errors.phoneNumber ? 'true' : 'false'}
                      disabled={isSubmitting}
                      autoComplete="tel"
                      className="h-12"
                    />
                    {errors.phoneNumber && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600"
                      >
                        {errors.phoneNumber.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700">
                      <MessageSquare className="inline h-4 w-4" /> Message{' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us what's on your mind... (minimum 10 characters)"
                      {...register('message')}
                      aria-invalid={errors.message ? 'true' : 'false'}
                      disabled={isSubmitting}
                      rows={5}
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600"
                      >
                        {errors.message.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="h-12 w-full bg-[#0F6938] text-base font-semibold transition-colors hover:bg-[#0F6938]/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    <span className="text-red-500">*</span> Required field
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
