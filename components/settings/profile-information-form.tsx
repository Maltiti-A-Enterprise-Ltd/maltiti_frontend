'use client';

import React, { JSX, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, User, Phone, AlertCircle, CheckCircle2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { updateProfileSchema, type UpdateProfileFormData } from '@/lib/validations/settings';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateUser } from '@/lib/store/features/auth/authSlice';
import {
  profileControllerGetProfile,
  profileControllerUpdateProfile,
  profileControllerUploadAvatar,
  ProfileResponseDto,
  UpdateProfileDto,
} from '@/app/api';

export function ProfileInformationForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onChange',
  });

  // Watch form values to detect changes
  const formValues = watch();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        setIsLoadingProfile(true);
        const { data, error } = await profileControllerGetProfile();

        if (!data || error) {
          throw new Error('No data received');
        }

        const profileInfo = data.data;

        setProfile(profileInfo);
        // Pre-fill form with existing data
        reset({
          name: profileInfo.name || '',
          phone: profileInfo.phone || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile', {
          description: 'Please refresh the page to try again.',
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [reset]);

  // Detect changes in form values
  useEffect(() => {
    if (!profile) {
      return;
    }

    const nameChanged = formValues.name !== profile.name;
    const phoneChanged = (formValues.phone || '') !== (profile.phone || '');

    setHasChanges(nameChanged || phoneChanged);
  }, [formValues, profile]);

  const onSubmit = async (data: UpdateProfileFormData): Promise<void> => {
    try {
      const updateData: UpdateProfileDto = {
        name: data.name,
        phone: data.phone || undefined,
      };

      const { data: responseData, error } = await profileControllerUpdateProfile({
        body: updateData,
      });

      if (error) {
        throw new Error('Error updating profile');
      }

      const profileInfo = responseData?.data;
      if (profileInfo) {
        dispatch(
          updateUser({
            ...profileInfo,
          }),
        );
        setProfile(profileInfo);
        setHasChanges(false);

        toast.success('Profile updated successfully', {
          description: 'Your profile information has been saved.',
          icon: <CheckCircle2 className="h-5 w-5" />,
        });

        reset({
          name: profileInfo.name || '',
          phone: profileInfo.phone || '',
        });
      }
    } catch (error: unknown) {
      console.error('Failed to update profile:', error);

      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Failed to update profile. Please try again.';

      toast.error('Update failed', {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  const handleAvatarClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please upload a JPG, PNG, or GIF image.',
        icon: <AlertCircle className="h-5 w-5" />,
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 5MB.',
        icon: <AlertCircle className="h-5 w-5" />,
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = (): void => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    try {
      setIsUploadingAvatar(true);

      const { data, error } = await profileControllerUploadAvatar({
        body: { file },
      });

      if (error || !data) {
        throw new Error('Failed to upload avatar');
      }

      // Update profile with new avatar URL
      if (profile) {
        setProfile({
          ...profile,
          avatarUrl: data.data,
        });
        dispatch(
          updateUser({
            avatarUrl: data.data,
          }),
        );
      }

      toast.success('Avatar updated successfully', {
        description: 'Your profile picture has been changed.',
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      setAvatarPreview(null);
    } catch (error) {
      console.error('Failed to upload avatar:', error);

      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Failed to upload avatar. Please try again.';

      toast.error('Upload failed', {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
      });

      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async (): Promise<void> => {
    // Note: If there's a delete endpoint, implement it here
    // For now, we'll just clear the preview
    setAvatarPreview(null);
    toast.info('Avatar removal', {
      description: 'Contact support to permanently remove your profile picture.',
    });
  };

  const getInitials = (name: string): string =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information. Your email address cannot be changed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 border-b pb-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={avatarPreview || profile?.avatarUrl || undefined}
                  alt={profile?.name || 'User avatar'}
                />
                <AvatarFallback className="text-lg">
                  {profile?.name ? getInitials(profile.name) : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium">Profile Picture</h3>
              <p className="text-muted-foreground text-xs">
                JPG, PNG or GIF. Max size 5MB. Recommended: Square image, at least 200x200px.
              </p>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                  aria-label="Upload avatar"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                  className="gap-2"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload New
                    </>
                  )}
                </Button>
                {(profile?.avatarUrl || avatarPreview) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                    className="text-destructive hover:text-destructive gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              disabled={isSubmitting}
              {...register('name')}
              className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="name-error"
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Email Address (Read-Only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
              className="bg-muted cursor-not-allowed"
              aria-readonly="true"
            />
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <AlertCircle className="h-3 w-3" />
              Email address cannot be changed. Contact support if you need assistance.
            </p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
              {...register('phone')}
              className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
              aria-invalid={errors.phone ? 'true' : 'false'}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="phone-error"
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.phone.message}
              </motion.p>
            )}
          </div>

          {/* Account Information */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-muted-foreground text-sm font-medium">Account Information</h3>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Account Type</p>
                <p className="font-medium capitalize">{profile?.userType || 'User'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email Verified</p>
                <p className="flex items-center gap-1 font-medium">
                  {profile?.emailVerifiedAt ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      Not Verified
                    </>
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone Verified</p>
                <p className="flex items-center gap-1 font-medium">
                  {profile?.phoneVerifiedAt ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      Not Verified
                    </>
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              disabled={!hasChanges || isSubmitting}
              onClick={() => {
                if (profile) {
                  reset({
                    name: profile.name || '',
                    phone: profile.phone || '',
                  });
                  setHasChanges(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!hasChanges || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
