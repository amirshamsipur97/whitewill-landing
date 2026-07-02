import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Split stable vendor libraries into their own long-cacheable chunks so a
    // content deploy doesn't re-download React/MUI/GSAP, and the entry chunk
    // stays small for faster first paint (Core Web Vitals / SEO).
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-gsap': ['gsap', '@gsap/react'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
