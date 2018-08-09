#!/usr/bin/env node
var yargs = require('yargs')
var fs = require('fs')
var path = require('path')
var chalk =  require('chalk');
var root = path.join(__dirname, '../../');
var addSubPage = require('./addSubPage.js')
var addIndexPage = require('./addIndexPage.js')
var delSubPage = require('./delSubPage.js')
var delIndexPage = require('./delIndexPage.js')

var Err = function(...args) {
    console.log(chalk.red(args))
}
var OK = function(...args) {
    console.log(chalk.green(args))
}
var INFO = function(...args) {
    console.log(chalk.yellow(args))
}

yargs.command('page','operation for page\t页面操作命令', function(yargs) {
	yargs.option('a', {
		alias: 'add',
		demand: false,
		default: false,
		describe: 'add page | 添加页面',
		type: 'string'
	})

	yargs.option('d', {
		alias: 'del',
		demand: false,
		default: false,
		describe: 'del page | 删除页面',
		type: 'string'
	})
	yargs.usage('Usage: inode page [operation] [path]')
	yargs.help('h')
	yargs.alias('h', 'help')

    var args = yargs.argv;
    // console.log(yargs.argv);
	var {add,del} = args;
	if(add) {
        var pages = add.split('/');
        if(pages && pages.length > 1) {
            addSubPage(pages[0], pages.slice(1));
        } else {
            addIndexPage(add)
        }
	}

	if(del) {
		var pages = del.split('/');
        if(pages && pages.length > 1) {
            delSubPage(pages[0], pages.slice(1));
        } else {
            delIndexPage(del)
        }
	}
})
yargs.option('l', {
	alias: 'list',
	boolean: true,
	describe: '查看路由表'
})

yargs.option('A', {
	alias: 'auth',
	demand: false,
	default: false,
	describe: '为路由切换认证状态',
	type: 'string'
})

yargs.usage('Usage: inode page|ajax [operation] [path]')
yargs.help('h')
yargs.alias('h', 'help')

var args = yargs.argv;
var {list,_,auth} = args;
if(_.length) return;
if(list) {
	// routelist();
}

if(auth) {
	// addAuth(auth);
}
