import Vue from 'vue'
import Router from 'vue-router'
import Demo from '@/pages/demo/home/home'
import Text from '@/pages/demo/text/text'

Vue.use(Router)

export default new Router({
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
})
