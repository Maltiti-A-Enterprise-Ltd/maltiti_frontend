import { z } from 'zod';

/**
 * Review validation schema
 * Validates rating, title, and comment fields for product reviews
 */
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  title: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') {
          return true;
        }
        return val.length >= 3;
      },
      { message: 'Title must be at least 3 characters if provided' },
    ),
  comment: z
    .string()
    .min(1, 'Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment cannot exceed 500 characters'),
});

// Type inference from schema
export type ReviewFormData = z.infer<typeof reviewSchema>;
