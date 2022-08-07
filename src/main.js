import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";
import router from "./router";
import PortalVue from 'portal-vue';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'


import 'focus-visible';

Vue.config.productionTip = false

window._merge = require('lodash/merge');
window.axios = require('axios');
window.Vue = Vue;
Vue.use(filters);
Vue.use(PortalVue);
Vue.use(Vuetify, {
  iconfont: 'md',
  theme: { disable: true }
})

if (process.env.NODE_ENV === 'production') {
  //
} else {
  Vue.preUrl = "http://localhost:3000";
}

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')


