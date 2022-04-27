import { defineConfig } from "vite";
import path from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import solidPlugin from "vite-plugin-solid";
import eslintPlugin from "vite-plugin-eslint";

const config = defineConfig(({ command }) => ({
  build: {
    sourcemap: command === "serve",
  },
  plugins: [vanillaExtractPlugin(), solidPlugin(), eslintPlugin()],
  resolve: {
    alias: {
      "~/": path.join(__dirname, "src/"),
    },
  },
}));

export default config;
