var path = require('path');
var webpack = require('webpack');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:4000',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    './src/index.js',
    // the entry point of our app
  ],

  output: {
    filename: 'bundle.js',
    // the output bundle

    path: path.resolve(__dirname, 'dist'),

    publicPath: '/static/'
    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'inline-source-map',

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
      },
    ],
  },

  externals: {
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
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
  ],

  devServer: {
    host: 'localhost',
    port: 4000,

    historyApiFallback: true,
    // respond to 404s with index.html

    overlay: true,
    proxy: {
      '/': {
        target: 'https://kinops.io',
        secure: false,
        autoRewrite: true,
        protocolRewrite: 'http',
        headers: { 'X-From-Webpack-Proxy' : 'X-From-Webpack-Proxy' }
      }
    }
  },
};
