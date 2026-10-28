import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "GRAFANA_");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/grafana": {
          target: env.GRAFANA_DEV_URL || "http://localhost:80",
          changeOrigin: true,
        },
      },
    },
  };
});