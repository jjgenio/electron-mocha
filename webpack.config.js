const path = require('path');
/* const webpack = require('webpack'); */

module.exports = {
  entry: [
    path.resolve(__dirname,'bin/electron-mocha.js'),
  ],
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'/* , '.ts', '.tsx' */],
    fallback: {
        path: require.resolve("path-browserify"),
        fs: false,
    }
  },
  /* module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: '@jsdevtools/coverage-istanbul-loader',
          options: { esModules: false },
        },
        enforce: 'post',
        exclude: /node_modules|lib|renderer|bin|\.spec\.js$/,
      }
    ]
  }, */
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  devtool: 'inline-source-map',
  /* plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ] */
};