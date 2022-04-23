import type { UserConfig } from "vite";
import path from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const config: UserConfig = {
  plugins: [vanillaExtractPlugin()],
  resolve: {
    alias: {
      "~/": path.join(__dirname, "src/"),
    },
  },
};

export default config;
