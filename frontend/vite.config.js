export default defineConfig({
  plugins: [react()],
  server: {
    port: 3007,
    host: '0.0.0.0',  // Ensures it's accessible externally
    hmr: {
      protocol: 'wss',  // Use WebSocket Secure
      host: 'fthreads.onrender.com',  // Use the correct host (if using Render)
      port: 3007,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3006",  // Ensure to use the correct protocol (http or https)
        changeOrigin: true,
        secure: false, // Adjust based on your server's SSL setup
      },
    },
  },
  build: {
    outDir: "dist", // Ensures the build output goes to the 'dist' directory
    chunkSizeWarningLimit: 1000, // Set the chunk size warning limit in KB (e.g., 1000 KB = 1 MB)
  },
});
