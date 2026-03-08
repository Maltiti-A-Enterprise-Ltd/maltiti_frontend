import { Config, CreateClientConfig } from '@/app/api/client';

export const createClientConfig: CreateClientConfig = (config: Config | undefined) => ({
  ...config,
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include',
});
