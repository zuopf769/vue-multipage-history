var path = require('path')
var glob = require('glob')
var fs = require('fs')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function getEntries(srcPath, projects) {
  // var files = glob.sync(globPath)
  let projectNames = []
  if(projects && projects.length) {
    projectNames = projects
  } else {
    projectNames = fs.readdirSync(srcPath)
  }
  let entrys = {}, indexJsPath
  [].forEach.call(projectNames, (project) => {
    indexJsPath = `${srcPath}/${project}/index.js`
    if(fs.existsSync(indexJsPath)) {
      entrys[project] = ['babel-polyfill', './' + indexJsPath]
    }
  });
  return entrys
}
var projects = []
try {
  projects = JSON.parse(process.env.npm_config_argv).remain
} catch (error) {
  projects = []
}
 
var entries = getEntries('src/pages', projects)

module.exports = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  devServer: {
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'components': path.join(__dirname, '../src/components'),
      'util': path.join(__dirname, '../src/util'),
      'assets': path.join(__dirname, '../src/assets'),
      'style': resolve('src/style')
    },
    modules: [path.resolve(__dirname, '../node_modules')]
  },
  module: {
    rules: [
      // 在此暂时关闭eslint检查
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src'), resolve('test')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          context: path.resolve(__dirname, "../src/assets"),
          name: utils.assetsPath('[path]/img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          context: path.resolve(__dirname, "../src/assets"),
          name: utils.assetsPath('[path]/media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          context: path.resolve(__dirname, "../src/assets"),
          name: utils.assetsPath('[path]/fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
}
