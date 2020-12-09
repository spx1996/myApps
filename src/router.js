import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
//import printView from './components/print_view.vue'
// import Personal from './components/Personal.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/printView',
      name: 'printView',
      component: () => import('./components/print_view.vue')
    },
    {
      path: '/view_blank',
      name: 'view_blank',
      component: () => import('./components/view_blank.vue')
    },
    {
      path: '/form_blank',
      name: 'form_blank',
      component: () => import('./components/form_blank.vue')
    },
    
    {
      path: '/test',
      name: 'test',
      component: () => import('./components/test.vue')
    }

    // {
    //   path: '/flowDialog',
    //   name: 'flowDialog',
    //   component: () => import('./components/flow_dialog.vue')
    // }
  ]
})
