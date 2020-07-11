// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueRouter from 'vue-router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
// import '~/assets/css/index.css';

Vue.use(vueRouter);
Vue.use(ViewUI);
Vue.config.productionTip = false
Vue.component('happy-scroll', HappyScroll)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
