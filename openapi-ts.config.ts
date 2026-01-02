import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi.json',
  output: 'app/api',
  plugins: [
    {
      name: '@hey-api/client-next',
      runtimeConfigPath: '@/client-config',
    },
  ],
});
