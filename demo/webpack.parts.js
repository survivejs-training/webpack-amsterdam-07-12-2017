const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.minifyJavaScript = () => ({
  plugins: [new UglifyWebpackPlugin()],
});

exports.extractBundles = bundles => ({
  plugins: bundles.map(
    bundle => new webpack.optimize.CommonsChunkPlugin(bundle)
  ),
});

exports.extractCSS = ({ include, exclude, use, filename }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    // `allChunks` is needed with CommonsChunkPlugin to extract
    // from extracted chunks as well.
    allChunks: true,
    filename,
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: plugin.extract({
            use,
            fallback: "style-loader",
          }),
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: ["style-loader", "css-loader"],
      },
    ],
  },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        include,
        exclude,
        use: {
          loader: "url-loader",
          options,
        },
      },
    ],
  },
});

exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: "babel-loader",
      },
    ],
  },
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};
