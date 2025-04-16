import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost", // Use "localhost" instead of "::" for better compatibility
    port: 5000,
    
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(), // Keep componentTagger in development
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optional: Define environment variables for your API
  
}));