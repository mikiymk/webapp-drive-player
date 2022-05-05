import { defineConfig } from "vite";
import { UserConfig } from "vitest/config";
import path from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import solidPlugin from "vite-plugin-solid";
import eslintPlugin from "vite-plugin-eslint";

const config = defineConfig(({ command }) => {
  const config: UserConfig = {
    plugins: [vanillaExtractPlugin(), solidPlugin()],
    resolve: {
      alias: { "~/": path.join(__dirname, "src/") },
    },
    test: {
      environment: "jsdom",
      transformMode: {
        web: [/.[jt]sx?/],
      },
      deps: {
        inline: [/solid-js/],
      },
      threads: false,
      isolate: false,
    },
  };

  if (command === "serve") {
    config.build = { sourcemap: true };
    config.plugins.push(eslintPlugin());
  }
  return config;
});

export default config;
