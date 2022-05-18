import { defineConfig } from "vite";
import { UserConfig } from "vitest/config";
import path from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import solidPlugin from "vite-plugin-solid";
import eslintPlugin from "vite-plugin-eslint";
import { visualizer } from "rollup-plugin-visualizer";

const config = defineConfig(({ mode, command }) => {
  const config: UserConfig = {
    plugins: [vanillaExtractPlugin(), solidPlugin()],
    resolve: {
      alias: { "~/": path.join(__dirname, "src/") },
    },
    build: {
      rollupOptions: {
        plugins: [],
      },
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
    config.build.sourcemap = true;
    config.plugins.push(eslintPlugin());
  }

  if (mode === "analyze") {
    config.build.rollupOptions.plugins.push(
      visualizer({
        open: true,
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
      })
    );
  }
  return config;
});

export default config;
