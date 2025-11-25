import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
  },
  splitting: false,
  clean: true,
  minify: true,
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEBUG: 'false'
  },
  silent: true,
});
