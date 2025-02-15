import path from "node:path";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";

import type { ViteUserConfig as UserConfig } from "vitest/config";

const config = defineConfig(({ mode, command }) => {
  const plugins: UserConfig["plugins"] = [];
  plugins.push(vanillaExtractPlugin());
  plugins.push(solidPlugin());
  plugins.push(
    VitePWA({
      includeAssets: [],
      manifest: {
        /* eslint-disable camelcase */
        name: "Iron Ragdoll",
        short_name: "IronRagdoll",
        start_url: "/",
        display: "standalone",
        theme_color: "#888",
        background_color: "#888",
        description: "Web App Audio Player with Google Drive",
        categories: ["music"],
        icons: [
          { src: "/icon.svg", type: "image/svg+xml" },
          {
            src: "/icon.webp",
            type: "image/webp",
            sizes: "512x512",
            purpose: "any maskable",
          },
          { src: "/icon.png", type: "image/png", sizes: "144x144" },
        ],
        /* eslint-enable camelcase */
      },
      workbox: {},
    }),
  );
  if (command === "serve") plugins.push(eslintPlugin());

  const resolve: UserConfig["resolve"] = {
    alias: {
      "~": path.join(__dirname, "src", ""),
      "node:buffer": "buffer",
    },
    conditions: ["development", "browser"],
  };

  const build: UserConfig["build"] = {};

  if (command === "serve") build.sourcemap = true;

  build.rollupOptions = {};
  build.rollupOptions.plugins = [];
  if (mode === "analyze")
    build.rollupOptions.plugins.push(
      visualizer({
        open: true,
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
    );

  const test: UserConfig["test"] = {};

  test.environment = "jsdom";
  test.transformMode = { web: [/\.[jt]sx?$/] };
  test.deps = { inline: [/solid-js/, /solid-testing-library/] };
  test.threads = false;
  test.isolate = false;

  return {
    plugins,
    resolve,
    build,
    test,
  };
});

export default config;
