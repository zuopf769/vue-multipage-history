var chalk =  require('chalk');
var fse = require('fs-extra')
var fs = require('fs')
var path = require('path')
var addIndex = require('./addIndexPage')


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

function addSubPage(indexPage, subPath, options) {
    if(!indexPage || !subPath) {
        console.log('增加子页面的路径不能为空')
    }
    if(!fs.existsSync(path.join(root, 'src/router/' + indexPage + '.js')) || !fs.existsSync(path.join(root, 'src/pages/' + indexPage))) {
        addIndex(indexPage)
    }
    editRouter(indexPage, subPath, options)
    addPage(indexPage, subPath, options)
}

function editRouter(indexPage, subPath=[], options={}) {
    var routerPath = path.join(root, 'src/router/' + indexPage + '.js')
    var comp = subPath[subPath.length - 1] || ''
    var Comp = comp.replace(/( |^)[a-z]/, (L) => L.toUpperCase())
    var source = fs.readFileSync(routerPath).toString()
    if(source.indexOf(subPath.join('/')) === -1) {
        source = source.replace(/Vue\.use\(Router\)/, `import ${Comp} from '@/pages/${indexPage}/${subPath.join("/")}/${comp}'\nVue.use(Router)`)
    }
    if(source.indexOf(`component: ${Comp}`) === -1) {
        var routerReg = /routes:([^\}]*)\}/;
        source = source.replace(routerReg, function(itemF, items) {
            var tabStr = /\[\n(\s*)\{/.exec(itemF)[1] || ''
            var tabpathStr = /\n(\s*)path/.exec(itemF)[1] || ''
            itemF += `,\n${tabStr}\{\n${tabpathStr}path: '\/${comp}',\n${tabpathStr}name: '${Comp}',\n${tabpathStr}component: ${Comp}\n${tabStr}\},`
            return itemF
        })
        source = source.replace(/\},,/g, '},')
        fs.writeFileSync(routerPath, source)
        INFO(`[OK] 子页面${indexPage}/${subPath.join("/")}追加路由成功`)
        return true
    }
    INFO(`[warn] ${routerPath}子页面已经加入了路由文件，直接对文件进行编辑`)
}

function addPage(indexPage, subPath=[], options={}) {
    if(!indexPage || !subPath) {
        console.log('新建自页面视图参数缺失，请检查页面配置参数')
        return false
    }
    var pagePath = path.join(root, `src/pages/${indexPage}/${subPath.join('/')}/${subPath[subPath.length-1]}.vue`)
    if(fs.existsSync(pagePath)) {
        INFO(`[warn] ${pagePath.replace(root, '')}子页面视图文件已经存在，直接编辑即可`)
        return false
    }
    fse.ensureFileSync(pagePath)
    fse.copySync(path.join(inode, '/tpl/subPageView'), pagePath)
    INFO(`[OK] 子页面${pagePath.replace(root, '')}视图文件创建成功`)
}
module.exports = addSubPage