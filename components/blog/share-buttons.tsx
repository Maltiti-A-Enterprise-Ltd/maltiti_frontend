'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';

type ShareButtonsProps = {
  title: string;
  url: string;
};

export function ShareButtons({ title, url }: ShareButtonsProps): JSX.Element {
  const handleShare = (platform: string): void => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground mr-2 text-sm">Share:</span>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => handleShare('facebook')}
        aria-label="Share on Facebook"
      >
        <Icon icon="simple-icons:facebook" className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => handleShare('twitter')}
        aria-label="Share on Twitter"
      >
        <Icon icon="simple-icons:x" className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => handleShare('linkedin')}
        aria-label="Share on LinkedIn"
      >
        <Icon icon="simple-icons:linkedin" className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={handleCopyLink}
        aria-label="Copy link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
