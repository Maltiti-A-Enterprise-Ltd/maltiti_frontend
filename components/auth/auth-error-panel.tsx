'use client';

import { JSX, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

interface AuthErrorPanelProps {
  /** Whatever explains the failure and offers a way out. */
  readonly children: ReactNode;
}

/**
 * The standard "something went wrong signing in" frame: the icon drops in,
 * the panel settles, and the caller fills in what happened and what to do.
 *
 * Shared because every auth failure should look like the same event to the
 * customer — a sign-in that failed and a verification link that expired are
 * the same kind of dead end, and two hand-copied animations drift apart the
 * first time either one is touched.
 */
export function AuthErrorPanel({ children }: Readonly<AuthErrorPanelProps>): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 text-center"
    >
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="rounded-full bg-red-100 p-6"
        >
          <XCircle className="h-12 w-12 text-red-600" />
        </motion.div>
      </div>

      {children}
    </motion.div>
  );
}
