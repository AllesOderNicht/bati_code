import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const deploymentBase = process.env.VITE_APP_BASE ?? "/bati/";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : deploymentBase,
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
}));
