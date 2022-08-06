import path from "path";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";

import type { UserConfig } from "vitest/config";

const config = defineConfig(({ mode, command }) => {
  const config: UserConfig = {
    plugins: [
      vanillaExtractPlugin(),
      solidPlugin(),
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
    ],
    resolve: {
      alias: {
        "~": path.join(__dirname, "src", ""),
        "node:buffer": "buffer",
      },
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
