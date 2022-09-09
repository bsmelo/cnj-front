import Vue from 'vue'
import App from './App.vue'
import filters from './filters/index.js';
import './assets/fonts/style.css';
import store from "./store";
import router from "./router";
import PortalVue from 'portal-vue';
import vuetify from './plugins/vuetify'
import "./plugins/vuetify-mask.js";
import Keycloak from 'keycloak-js';


import 'focus-visible';

Vue.config.productionTip = false

window._merge = require('lodash/merge');
window.axios = require('axios');
window.Vue = Vue;
Vue.use(filters);
Vue.use(PortalVue);

let keycloak_url = 'https://sso.cloud.pje.jus.br/'
if (process.env.NODE_ENV === 'production') {
  Vue.preUrl = "http://200.137.197.234:5009/api"; // FIXME
  keycloak_url = 'https://sso.cloud.pje.jus.br/'

} else if (process.env.NODE_ENV === 'staging') {
  // Homologação
  Vue.preUrl = "http://200.137.197.234:5009/api";
  keycloak_url = 'https://sso.stg.cloud.pje.jus.br/'

} else {
  // Desenvolvimento (local)
  Vue.preUrl = "http://localhost:5009/api";
  keycloak_url = 'http://localhost:8585/'
}

let initOptions = {
  url: keycloak_url, realm: 'pdpj', clientId: 'sas-frontend', onLoad: 'login-required'
}

let keycloak = new Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.log("Authenticated");
    window.kc = keycloak;
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;

    new Vue({
      store,
      router,
      vuetify,
      render: h => h(App),
      // TODO: Existem outras páginas? Se sim, todas deveriam checar if (keycloak.authenticated), talvez por meio de um interceptor
    }).$mount('#app')
  }

  // Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      console.log('Token refreshed? ' + refreshed);
    }).catch(() => {
      console.log('Failed to refresh token');
      keycloak.clearToken();
      axios.defaults.headers.common['Authorization'] = undefined;
    });
  }, 6000)

}).catch(() => {
  console.log("Authentication Failed");
});
