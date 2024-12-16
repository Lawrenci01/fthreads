import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3007,
    // Get rid of the CORS error
    proxy: {
      "/api": {
        target: "0.0.0.0:3006",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist", // Ensures the build output goes to the 'dist' directory
    chunkSizeWarningLimit: 1000, // Set the chunk size warning limit in KB (e.g., 1000 KB = 1 MB)
  },
});
