import { z } from 'zod';

/**
 * Contact Us validation schema
 * Validates fullName, email, phoneNumber, and message fields
 */
export const contactSchema = z.object({
  fullName: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') {
          return true;
        }
        return z.email().safeParse(val).success;
      },
      { message: 'Please enter a valid email address' },
    ),
  phoneNumber: z.string().optional(),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters'),
});

// Type inference from schema
export type ContactFormData = z.infer<typeof contactSchema>;
