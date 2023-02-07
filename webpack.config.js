const path = require('path');
const { IgnorePlugin } = require('webpack');
/* const webpack = require('webpack'); */

const optionalPlugins = [];
if (process.platform !== "darwin") { // don't ignore on OSX
  optionalPlugins.push(new IgnorePlugin({ resourceRegExp: /^fsevents$/ }));
}

module.exports = {
  entry: [
    /* path.resolve(__dirname,'bin/electron-mocha.js'), */
    path.resolve(__dirname,'lib/main.js'),
  ],
  target: 'node',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.json'/* , '.ts', '.tsx' */],
    fallback: {
        path: require.resolve("path-browserify"),
        fs: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(txt)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      /* {
        test: /\.js$/,
        use: {
          loader: '@jsdevtools/coverage-istanbul-loader',
          options: { esModules: false },
        },
        enforce: 'post',
        exclude: /node_modules|lib|renderer|bin|\.spec\.js$/,
      } */
    ]
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  devtool: 'inline-source-map',
  plugins: [
    ...optionalPlugins,
  ],
  /* plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ] */
};