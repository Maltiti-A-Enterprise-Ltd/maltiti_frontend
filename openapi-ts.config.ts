import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi.json',
  output: 'app/api',
  parser: {
    transforms: { enums: 'root' },
  },
  plugins: [
    {
      name: '@hey-api/client-next',
      runtimeConfigPath: '@/client-config',
    },
    '@hey-api/sdk',
    {
      name: '@hey-api/typescript',
      enums: 'typescript',
    },
  ],
});
