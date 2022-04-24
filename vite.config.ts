import { defineConfig } from "vite";
import path from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const config = defineConfig(({ command }) => ({
  build: {
    sourcemap: command === "serve",
  },
  plugins: [vanillaExtractPlugin()],
  resolve: {
    alias: {
      "~/": path.join(__dirname, "src/"),
    },
  },
}));

export default config;
