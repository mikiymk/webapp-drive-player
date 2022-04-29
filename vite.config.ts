import { defineConfig } from "vite";
import path from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import solidPlugin from "vite-plugin-solid";
import eslintPlugin from "vite-plugin-eslint";

const config = defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      build: {
        sourcemap: true,
      },
      plugins: [vanillaExtractPlugin(), solidPlugin(), eslintPlugin()],
      resolve: {
        alias: {
          "~/": path.join(__dirname, "src/"),
        },
      },
    };
  } else {
    return {
      plugins: [vanillaExtractPlugin(), solidPlugin()],
      resolve: {
        alias: {
          "~/": path.join(__dirname, "src/"),
        },
      },
    };
  }
});

export default config;
