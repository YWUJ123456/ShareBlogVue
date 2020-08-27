import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import Article from '@/components/Article'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children:[
        {
          path:'Article',
          name:'Article',
          component:Article
        }
      ]
    }
  ]
})
