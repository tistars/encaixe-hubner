import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: o build roda em qualquer subpasta (ex.: /encaixe-xxxx/)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1500 },
})
