// import { defineConfig , loadEnv} from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api/": {
//         target: import.meta.env.VITE_API_URL, // Your backend server URL
//         changeOrigin: true, // Changes the origin of the host header to the target URL
//         secure: false,rewrite: (path) => path.replace(/^\/api/, '')
//       } , 
//       "/uploads/": import.meta.env.VITE_API_URL
//     }
//   },
// });

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // loads VITE_* vars
  const target = env.VITE_API_URL || "http://localhost:3002";

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        // Calls to /api/* will be forwarded to your backend
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        // Static file passthrough (if you serve uploads from backend)
        "/uploads": {
          target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
