import { Config, CreateClientConfig } from '@/app/api/client';

export const createClientConfig: CreateClientConfig = (config: Config | undefined) => ({
  ...config,
  baseUrl: 'http://localhost:3002',
  credentials: 'include',
});
