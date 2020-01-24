const path = require('path');
const buildOutputPath = path.join(__dirname, 'dist');
const _ = require('lodash');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  context: `${__dirname}`,
  entry: [
    './app',
  ],
  output: {
    path: buildOutputPath,
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      path.resolve('.'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'lodash',
    }),
    new CopyWebpackPlugin([
      {from: 'index.html'},
      {from: 'definition.json'}
    ]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].[hash].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/fonts',
            name: '[hash].[ext]',
          }
        }
      },
      {
        test: /\.(jp(e)?g|png|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/images',
            name: '[name].[ext]',
          }
        },
      },
      {
        test: /\.mp4$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/videos',
            name: '[name].[ext]',
          }
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'file-to-string-loader',
          options: {
            outputPath: 'assets/images',
            name: '[hash].[ext]',
            limit: 1000,
          },
        },
      }
    ],
  },
};
