# vue-multipage-history

> activityPage
page下面可以放置多个project，每个project一个文件


## history模式

+ /demo 类似模块名

```
// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())
let history = require('connect-history-api-fallback');
app.use(history({
  verbose: true,
  rewrites: [
    { from: '/demo', to: '/demo/index.html'}
  ],
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  disableDotRule: true
}));
```

+ history模式最好用全路径
```
mode: 'history',
  base: '/demo/',
  routes: [
    {
      path: '/',
      name: 'Demo',
      component: Demo
    },
    {
      path: '/text',
      name: 'text',
      component: Text
    }
  ]
```

## 多页面支持

page下面可以放置多个project，每个project一个文件

npm run dev --project=xxx

npm run build --project=xx


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev --project=xxx

# build for production with minification
npm run build --project=xx

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
