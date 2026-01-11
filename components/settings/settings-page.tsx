'use client';

import React, { JSX } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileInformationForm } from './profile-information-form';
import { ChangePasswordForm } from './change-password-form';

export function SettingsPage(): JSX.Element {
  return (
    <div className="bg-background mt-20 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Settings className="text-primary h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6 w-full sm:w-auto">
              <TabsTrigger value="profile" className="flex flex-1 items-center gap-2 sm:flex-none">
                <User className="h-4 w-4" />
                <span>Profile Information</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex flex-1 items-center gap-2 sm:flex-none">
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileInformationForm />
              </motion.div>
            </TabsContent>

            <TabsContent value="password">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChangePasswordForm />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
