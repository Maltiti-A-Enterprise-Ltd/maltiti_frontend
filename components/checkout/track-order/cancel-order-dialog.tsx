import { JSX, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { REFUND_TIMELINE } from '@/lib/constants/refund-config';

type CancelOrderDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (reason: string) => Promise<void>;
  isLoading: boolean;
  dialogMessage: string;
};

export const CancelOrderDialog = ({
  isOpen,
  onOpenChange,
  onCancel,
  isLoading,
  dialogMessage,
}: CancelOrderDialogProps): JSX.Element => {
  const [cancelReason, setCancelReason] = useState('');

  const handleConfirm = async (): Promise<void> => {
    await onCancel(cancelReason);
    setCancelReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">Cancel Your Order?</DialogTitle>
          <DialogDescription className="text-center">{dialogMessage}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-700">
          <div className="shrink-0 pt-0.5">
            <Loader2 className="h-3 w-3 animate-pulse" />
          </div>
          <p>
            <strong>Note on Refunds:</strong> Approved refunds are processed automatically and
            typically take <strong>{REFUND_TIMELINE}</strong> to reflect in your account.
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <label htmlFor="cancel-reason" className="text-sm font-medium text-gray-700">
            Reason for cancellation (optional)
          </label>
          <Textarea
            id="cancel-reason"
            placeholder="Please tell us why you're cancelling..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="resize-none focus:border-red-500 focus:ring-red-500"
            rows={3}
          />
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            No, Keep My Order
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleConfirm()}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Yes, Cancel Order'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
