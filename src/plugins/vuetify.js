import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import pt from "vuetify/es5/locale/pt";
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);

export default new Vuetify({
  iconfont: 'md',
  theme: {
    primary: '#006fc7',
    secondary: '#006fc7',
    accent: '#006fc7',
    error: '#b71c1c'
  },
  lang: {
    locales: { pt },
    current: "pt"
  }
});
