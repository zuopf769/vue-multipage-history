// The Vue build version to load with the `import` command
import Vue from 'vue'
import vuex from 'vuex'
import router from '@/router/demo'
import Demo from './demo'
import VueScroller from 'vue-scroller'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueScroller);
Vue.config.productionTip = false

//配置修改标题的钩子
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})

debugger;
/**
 * 初始化vue对象
 */
new Vue({
  el: '#app',         //根节点元素
  router,             //路由信息
  // store,              //使用store存储管理数据
  template: '<Demo/>', //模版信息
  components: { Demo } //组件信息
})
