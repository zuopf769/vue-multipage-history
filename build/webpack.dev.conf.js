var fs = require('fs')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var path = require('path')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
  cache: true,
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name]/static/js/index.js',
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    new FriendlyErrorsPlugin(),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8888,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: true,
    //   statsFilename: 'stats.json',
    //   logLevel: 'info'
    // })
  ]
})

var pages = Object.keys(webpackConfig.entry)
pages.forEach(function (pagename) {
  // 如文件下存在template.html则使用此文件作为模板，忽略全局index.html
  var templateName = 'template.html'
  var templatePath = path.resolve('src/pages', pagename, templateName)
  var hasTemplateFile
  try {
    fs.accessSync(templatePath, fs.constants.R_OK);
    hasTemplateFile = true
  } catch (error) {
    hasTemplateFile = false
  }

  var conf = {
    filename: path.resolve(config.build.assetsRoot, pagename, 'index.html'),
    template: hasTemplateFile ? templatePath : 'index.html',
    inject: true,
    chunks: ['manifest', 'vendor', pagename]
  }
  // console.log(conf)
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin(conf)
  )
})

module.exports = webpackConfig
