import { JSX } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

type EmailRequestCardProps = {
  email: string;
  setEmail: (email: string) => void;
  onTrack: () => void;
  triedUserEmail: boolean;
};

export const EmailRequestCard = ({
  email,
  setEmail,
  onTrack,
  triedUserEmail,
}: EmailRequestCardProps): JSX.Element => (
  <div className="mt-16 min-h-screen bg-linear-to-br from-gray-50 to-green-50/30 px-4 py-12">
    <div className="mx-auto max-w-2xl">
      <Card className={triedUserEmail ? 'border-amber-200 bg-amber-50/50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {triedUserEmail && <AlertTriangle className="h-5 w-5 text-amber-600" />}
            Track Your Order
          </CardTitle>
          <CardDescription className={triedUserEmail ? 'text-amber-800' : ''}>
            {triedUserEmail
              ? "We couldn't find this order with your account email. Please try another email address."
              : 'Enter your email to view order details'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter the email address you used during checkout
            </p>
          </div>
          <Button
            onClick={onTrack}
            disabled={!email}
            className="w-full bg-[#0F6938] hover:bg-[#0F6938]/90"
          >
            Track Order
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);
