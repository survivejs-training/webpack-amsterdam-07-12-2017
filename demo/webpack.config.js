const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const webpack = require("webpack");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "app"),
  build: path.join(__dirname, "build"),
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: "[name].js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo",
      }),
      new webpack.NamedModulesPlugin(),
    ],
  },
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  parts.extractCSS({
    use: "css-loader",
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: "[name].[ext]",
    },
  }),
  parts.extractBundles([
    {
      name: "vendor",
      minChunks: ({ resource }) => /node_modules/.test(resource),
    },
  ]),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true,
    },
  }),
  {
    performance: {
      hints: "warning", // "error" or false are valid too
      maxEntrypointSize: 50000, // in bytes
      maxAssetSize: 100000, // in bytes
    },
  },
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);

module.exports = env => {
  const config = {
    production: productionConfig,
    development: developmentConfig,
  }[env];

  if (!config) {
    throw new Error("Config not found!");
  }

  return merge(
    commonConfig,
    config,
    parts.setFreeVariable("process.env.NODE_ENV", env)
  );
};
