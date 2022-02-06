const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [new WorkboxWebpackPlugin.GenerateSW()],
});
