/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/lib/test-utils/setup.ts'],
    css: true,
    passWithNoTests: true,
    // Emulator integration tests share a single DB — run files sequentially
    // so clearFirestoreEmulator() calls don't race across test files.
    fileParallelism: false,
  },
})
