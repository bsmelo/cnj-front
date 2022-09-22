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

let KEYCLOAK_URL = process.env.VUE_APP_KEYCLOAK_URL + "/"
Vue.preUrl = process.env.VUE_APP_WEBAPI_URL + "/api"

let CHECK_TOKEN_EXPIRATION_INTERVAL = 5 * 60 * 1000; // every 5 minutes (in ms)
let MIN_TOKEN_VALIDITY = 10 * 60 * 1000; // 10 minutes

/*
console.log(process.env)
console.log("Using",
    " NODE_ENV=", process.env.NODE_ENV,
    //" PORT=", PORT,
    " BACKEND_URL=", Vue.preUrl,
    " KEYCLOAK_URL=", KEYCLOAK_URL,
)
*/

let initOptions = {
  url: KEYCLOAK_URL, realm: 'pdpj', clientId: 'sas-frontend', onLoad: 'login-required'
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
    keycloak.updateToken(MIN_TOKEN_VALIDITY).then((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed');
      }
    }).catch(() => {
      console.log('Failed to refresh token');
      keycloak.clearToken();
      axios.defaults.headers.common['Authorization'] = undefined;
    });
  }, CHECK_TOKEN_EXPIRATION_INTERVAL)
  
  keycloak.onAuthLogout = () => {
    console.log('onAuthLogout');
    window.location.reload();
  }

}).catch(() => {
  console.log("Authentication Failed");
});
