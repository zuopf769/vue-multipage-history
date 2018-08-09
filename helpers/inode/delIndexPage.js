var chalk =  require('chalk');
var fse = require('fs-extra')
var fs = require('fs')
var path = require('path')

var root = path.join(__dirname, '../../')
var inode = __dirname
var Err = function(...args) {
    console.log(chalk.red(args))
}
var OK = function(...args) {
    console.log(chalk.green(args))
}
var INFO = function(...args) {
    console.log(chalk.yellow(args))
}


function delIndexPage(name, options) {
    if(!name) {
        Err('page --del 的参数表示删除项目的名称，不能省略')
        return false
    }
    delRouter(name, options)
    delPage(name, options)
}

function delRouter(name, options) {
    var routerPath = path.join(root, 'src/router/' + name + '.js')
    try{
        fse.removeSync(routerPath)
        INFO(`[OK] ${name}项目路由已成功删除`)
    } catch(e) {
        Err(`[Err] ${routerPath}项目路由删除失败，请手动删除`)
    }
}
function delPage(name, options) {
    var pagePath = path.join(root, 'src/pages/' + name)
    try{
        fse.removeSync(pagePath)
        INFO(`[OK] ${name}项目已成功删除`)
    } catch(e) {
        Err(`[Err] ${pagePath}项目删除失败，请手动删除`)
    }
    return true;
    
}

module.exports = delIndexPage