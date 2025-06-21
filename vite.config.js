// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://directory-management-g8gf.onrender.com", // Your backend server URL
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist", // This is the default and should already be set to 'dist'
  },
});
