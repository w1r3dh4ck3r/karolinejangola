import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // CNAME, robots, favicons, og-image, assets/*.webp|avif copied verbatim
  build: {
    outDir: 'dist', // app/dist — cleared each build, safe; root is never overwritten by a build
    assetsDir: 'assets',
  },
})
