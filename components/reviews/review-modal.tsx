'use client';

import { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { reviewSchema, type ReviewFormData } from '@/lib/validations/review';
import { reviewControllerCreateReview } from '@/app/api';
import { toast } from 'sonner';

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  saleId: string;
  onSuccess?: () => void;
};

const ReviewModal = ({ isOpen, onClose, saleId, onSuccess }: ReviewModalProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  });

  const watchedRating = form.watch('rating');

  const onSubmit = async (data: ReviewFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { error } = await reviewControllerCreateReview({
        body: {
          saleId,
          rating: data.rating,
          title: data.title || undefined,
          comment: data.comment,
        },
      });

      if (error) {
        throw new Error('Failed to submit review');
      }

      toast.success('Review Submitted', {
        description: 'Thank you for your feedback!',
      });

      form.reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Submission Failed', {
        description: 'Unable to submit your review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (): void => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  const renderStars = (interactive = false): JSX.Element => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = interactive
          ? (hoveredRating ?? watchedRating) >= star
          : watchedRating >= star;

        return (
          <button
            key={star}
            type="button"
            className={`transition-colors duration-150 ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
            onClick={interactive ? (): void => form.setValue('rating', star) : undefined}
            onMouseEnter={interactive ? (): void => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? (): void => setHoveredRating(null) : undefined}
            disabled={!interactive}
          >
            <Icon
              icon="ph:star-fill"
              className={`h-8 w-8 ${isActive ? 'text-yellow-400' : 'text-gray-200'}`}
            />
          </button>
        );
      })}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Share Your Experience
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Help us improve by sharing your feedback about this order. Your review helps other
            customers make informed decisions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Field */}
            <FormField
              control={form.control}
              name="rating"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-900">
                    Overall Rating *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {renderStars(true)}
                      <p className="text-sm text-gray-500">
                        {watchedRating === 0
                          ? 'Click on a star to rate your experience'
                          : `You rated this ${watchedRating} star${watchedRating === 1 ? '' : 's'}`}
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-900">
                    Review Title (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Summarize your experience..." className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment Field */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-900">
                    Your Review *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your experience with this order. What did you like or dislike? How was the quality and delivery?"
                      className="min-h-30 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-gray-500">{field.value?.length || 0}/500 characters</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-3 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || watchedRating === 0}
                className="flex-1 bg-[#0F6938] hover:bg-[#0F6938]/90 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <Icon icon="ph:spinner" className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Icon icon="ph:star" className="mr-2 h-4 w-4" />
                    Submit Review
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
