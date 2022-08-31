import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";
import router from "./router";
import PortalVue from 'portal-vue';
import vuetify from './plugins/vuetify'
import "./plugins/vuetify-mask.js";


import 'focus-visible';

Vue.config.productionTip = false

window._merge = require('lodash/merge');
window.axios = require('axios');
window.Vue = Vue;
Vue.use(filters);
Vue.use(PortalVue);

if (process.env.NODE_ENV === 'production') {
  //
  Vue.preUrl = "http://200.137.197.234:5009/api";
} else {
  Vue.preUrl = "http://200.137.197.234:5009/api";
}

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')


