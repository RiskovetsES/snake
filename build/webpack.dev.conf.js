/* Development config:
   ========================================================================== */

const webpack = require("webpack");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  output: {
    publicPath: "/"
  },
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8081,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  module: {
    rules: [
      {
        // css
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: { path: `./postcss.config.js` }
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map"
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].[id].css',
    }),
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
});
