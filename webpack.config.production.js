var path = require('path');
var webpack = require('webpack');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
  entry: './src/prodEntry.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'eslint-loader' },
        ],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.(jade|pug)$/,
        use: [
          {
            loader: 'ngtemplate-loader',
            options: {
              module: 'kd.bundle.angular.templates',
              relativeTo: path.resolve(__dirname, './app'),
              requireAngular: true
            }
          },
          { loader: 'pug-html-loader' }
        ]
      },
      { test: require.resolve('jquery'), loader: 'expose-loader?jQuery!expose-loader?$' },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.(jpg|png|svg)/,
        use: 'file-loader'
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false
    }),
    // do not emit compiled assets that include errors
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      toastr: 'toastr',
      moment: 'moment'
    }),

    // Apply ng-annotate to Angular components, etc.
    new NgAnnotatePlugin({
      add: true
    })
  ]
};
