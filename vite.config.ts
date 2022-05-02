import { defineConfig, UserConfig } from "vite";
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
  };

  if (command === "serve") {
    config.build = { sourcemap: true };
    config.plugins.push(eslintPlugin());
  }
  return config;
});

export default config;
