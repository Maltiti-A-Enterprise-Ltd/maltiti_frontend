import { JSX } from 'react';
import type { Metadata } from 'next';
import { SettingsPage } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Settings | Maltiti A. Enterprise Ltd',
  description:
    'Manage your account settings, update your profile information, and change your password.',
};

export default function Settings(): JSX.Element {
  return <SettingsPage />;
}
