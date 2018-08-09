var chalk =  require('chalk');
var fse = require('fs-extra')
var fs = require('fs')
var path = require('path')
var doT = require('dot')
var dotSetting = {
	evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
	interpolate: /\{\{=([\s\S]+?)\}\}/g,
	encode:      /\{\{!([\s\S]+?)\}\}/g,
	use:         /\{\{#([\s\S]+?)\}\}/g,
	useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
	define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	defineParams:/^\s*([\w$]+):([\s\S]+)/,
	conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	varname:	"it",
	strip:		false,
	append:		true,
	selfcontained: false,
	doNotSkipEncoded: false
}

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


function addIndexPage(name, options) {
    if(!name) {
        Err('page --add 的参数表示新增项目的名称，不能省略')
        return false
    }
    addRouter(name, options)
    addPage(name, options)
}

function addRouter(name, options) {
    var routerTplPath = path.join(inode, `tpl/router`);
    var routerPath = path.join(root, 'src/router/' + name + '.js')
    if(fs.existsSync(routerPath)) {
        INFO(`添加的项目路由文件${routerPath}已经存在，请去对应位置修改！`)
        return false
    }
    
    writeFileFromTpl(routerPath, routerTplPath, {
        data: {
            name: name,
            compname: name.replace(/( |^)[a-z]/, (L) => L.toUpperCase())
        },
        title: '项目路由'
    })
    return true;
}
function addPage(name, options) {
    var pagePath = path.join(root, 'src/pages/' + name)
    fse.ensureDirSync(pagePath)
    var indexJSPath = path.join(pagePath, 'index.js')
    var indexViewPath = path.join(pagePath, `${name}.vue`)
    var homePath = path.join(pagePath, 'home/home.vue')
    if(fs.existsSync(indexJSPath)) {
        INFO(`添加的项目入口js文件${indexJSPath}已经存在，请去对应位置修改！`)
    } else {
        writeFileFromTpl(indexJSPath, path.join(inode, `tpl/indexJS`), {
            data: {
                name: name,
                compname: name.replace(/( |^)[a-z]/, (L) => L.toUpperCase())
            },
            title: '项目入口JS'
        });
    }
    if(fs.existsSync(indexViewPath)) {
        INFO(`添加的项目入口vue文件${indexViewPath}已经存在，请去对应位置修改！`)
    } else {
        writeFileFromTpl(indexViewPath, path.join(inode, `tpl/indexView`), {
            data: {
                name: name
            },
            title: '项目入口Vue'
        });
    }
    if(fs.existsSync(homePath)) {
        INFO(`添加的项目首页vue文件${homePath}已经存在，请去对应位置修改！`)
    } else {
        fse.ensureFileSync(homePath)
        writeFileFromTpl(homePath, path.join(inode, `tpl/subPageView`), {
            data: {
                name: name
            },
            title: '项目首页Vue'
        });
    }
}

function writeFileFromTpl(path, tplPath, info={}) {
    if(!path || !tplPath) {
        console.log('缺少写入文件的路径，请检查脚手架代码');
        return false
    }
    var viewTpl = fs.readFileSync(tplPath);
	var template = doT.template(viewTpl, dotSetting);
    var resultStr = template(info.data)
    fs.writeFileSync(path, resultStr)
    INFO(`[OK] 生成${info.title}文件 ${path.replace(root, '')}成功`)
}


module.exports = addIndexPage