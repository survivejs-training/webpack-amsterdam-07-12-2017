const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const webpack = require("webpack");

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "app"),
  build: path.join(__dirname, "build"),
};

const NAMES = {
  css: "[name].[contenthash:8].css",
  image: "[name].[hash:8].[ext]",
  output: "[name].[chunkhash:8].js",
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: NAMES.output,
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
    filename: NAMES.css,
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: NAMES.image,
    },
  }),
  parts.extractBundles([
    {
      name: "vendor",
      minChunks: ({ resource }) => /node_modules/.test(resource),
    },
    {
      name: "manifest",
      minChunks: Infinity,
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
