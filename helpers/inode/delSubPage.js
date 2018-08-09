var chalk =  require('chalk');
var fse = require('fs-extra')
var fs = require('fs')
var path = require('path')
var glob = require('glob')

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

function delSubPage(indexPage, subPath, options) {
    if(!indexPage) {
        Err('page --del 的参数表示删除项目的名称，子页面用“／”划分，不能省略')
        return false
    }
    
    editRouter(indexPage, subPath, options)
    delPage(indexPage, subPath, options)
}

function editRouter(indexPage, subPath=[], options={}) {
    var routerPath = path.join(root, 'src/router/' + indexPage + '.js')
    var comp = subPath[subPath.length - 1] || ''
    var Comp = comp.replace(/( |^)[a-z]/, (L) => L.toUpperCase())
    var source = fs.readFileSync(routerPath).toString()
    if(source.indexOf(subPath.join('/')) !== -1) {
        var importReg = `import\\s+${Comp}\\s+from\\s+'@\\/pages\\/${indexPage}\\/${subPath.join("/")}\\/${comp}'\\n`
        importReg = new RegExp(importReg)
        source = source.replace(importReg, '')
    }
    if(source.indexOf(`component: ${Comp}`) !== -1) {
        var routerReg = `[ \\t]*\\{\\n\\s*path:\\s'\\/${comp}',\\n\\s*name:\\s'${Comp}',\\n\\s*component:\\s${Comp}\\n\\s*\\},\\n`;
        source = source.replace(new RegExp(routerReg), '')
        fs.writeFileSync(routerPath, source)
        return true
    }
    INFO(`[OK] 子页面路由${indexPage}/${subPath.join("/")}已经从活动项目中删除成功`)
}

function delPage(indexPage, subPath=[], options={}) {
    var name = subPath[subPath.length - 1]
    var pagePath = path.join(root, `src/pages/${indexPage}/${subPath.join('/')}/${name}.vue`)
    fse.removeSync(path.join(root, `src/pages/${indexPage}/${subPath.join('/')}`))
    try {
        subPath.pop()
        while (subPath.length > 0) {
            pagePath = path.join(root, `src/pages/${indexPage}/${subPath.join('/')}`)
            var blog = glob.sync(pagePath + '/**/*');
            if(!blog.length) {
                fse.removeSync(pagePath)
                subPath.pop()
            } else {
                break
            }
        }
    } catch(e) {
        Err(`[error] 子页面${pagePath.replace(root, '')}子项目路径删除失败`)
    }
    INFO(`[OK] 子页面${pagePath.replace(root, '')}视图文件删除成功`)
}
module.exports = delSubPage