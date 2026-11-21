import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In real mode, /api requests go to the Express backend on the compute board.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
});
