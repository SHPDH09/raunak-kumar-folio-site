import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/send-otp': {
        target: process.env.VITE_SUPABASE_URL ? `${process.env.VITE_SUPABASE_URL}/functions/v1/send-otp` : 'http://localhost:54321/functions/v1/send-otp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/send-otp/, ''),
      },
    },
  },
  plugins: [
    react(),
    // Disable componentTagger by default to avoid passing 'lov-*' props to react-three-fiber (causes runtime errors)
    // Enable locally by setting VITE_ENABLE_TAGGER=true
    ...(process.env.VITE_ENABLE_TAGGER === 'true' ? [componentTagger()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
