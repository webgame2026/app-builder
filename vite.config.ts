
import { defineConfig } from 'vite';

export default defineConfig({
  // If deploying to a custom domain, use '/'. 
  // If deploying to username.github.io/repo/, use '/repo/'
  base: './', 
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
