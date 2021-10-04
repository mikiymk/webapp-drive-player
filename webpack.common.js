// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

//MiniCssExtractPlugin の読み込み
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "javascript"),
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/

    new MiniCssExtractPlugin({
      // 抽出する CSS のファイル名
      filename: "style.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        // 対象となるファイルの拡張子(scss)
        test: /\.scss$/,
        // Sassファイルの読み込みとコンパイル
        use: [
          // CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするためのローダー
          {
            loader: "css-loader",
            options: {
              //URL の解決を無効に
              url: false,
              // ソースマップを有効に
              sourceMap: true,
            },
          },
          // Sass を CSS へ変換するローダー
          {
            loader: "sass-loader",
            options: {
              // dart-sass を優先
              implementation: require("sass"),
              sassOptions: {
                // fibers を使わない場合は以下で false を指定
                fiber: false, // require('fibers'),
              },
              // ソースマップを有効に
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules"],
  },
};
