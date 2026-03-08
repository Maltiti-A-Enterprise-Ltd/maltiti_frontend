import { JSX } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isValidEmail } from './helpers';

type EmailSearchCardProps = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  isLoading: boolean;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function EmailSearchCard({
  searchInput,
  setSearchInput,
  isLoading,
  onSearch,
  onKeyDown,
}: Readonly<EmailSearchCardProps>): JSX.Element {
  const getInputClassName = (): string => {
    if (!searchInput) {
      return 'border-gray-300';
    }
    if (!isValidEmail(searchInput)) {
      return 'border-red-300 focus-visible:ring-red-500';
    }
    return 'border-green-300 focus-visible:ring-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="mb-8 border-2 border-green-100">
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label
                htmlFor="search-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="search-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className={`h-12 pr-10 transition-colors ${getInputClassName()}`}
                  disabled={isLoading}
                />
                {searchInput && !isLoading && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Clear email"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {searchInput && !isValidEmail(searchInput) && (
                <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
              )}
            </div>
            <div className="flex items-end">
              <Button
                onClick={onSearch}
                disabled={isLoading || !searchInput.trim() || !isValidEmail(searchInput)}
                className="h-12 w-full gap-2 bg-[#0F6938] hover:bg-[#0F6938]/90 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Search className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search Orders
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
