import Vue from 'vue'
import Router from 'vue-router'
import siteManage from '@/components/siteManage'
import OpenLayer from '@/components/openlayer'
import OpenMap from '@/components/openMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'siteManage',
      component: siteManage
    },{
      path: '/openlayer',
      name: 'OpenLayer',
      component: OpenLayer
    },{
      path: '/openMap',
      name: 'OpenMap',
      component: OpenMap
    }
  ]
})
