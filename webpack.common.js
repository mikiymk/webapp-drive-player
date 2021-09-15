// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "javascript"),
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ['node_modules'],
  },
};
