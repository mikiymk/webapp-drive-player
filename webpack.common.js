// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new FaviconsWebpackPlugin("./src/img/icon.svg"),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  module: {
    rules: [
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/

      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
          {
            loader: "@linaria/webpack-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules"],
    plugins: [new TsConfigPathsPlugin()],
  },
};
