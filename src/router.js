import Vue from "vue";
import VueRouter from "vue-router";

import Main from "./components/Main.vue";

Vue.use(VueRouter);

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home
//   },
//   {
//     path: "/about",
//     name: "About",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () =>
//       import(/* webpackChunkName: "about" */ "../views/About.vue")
//   }
// ];
const routes = [
  {
    path: '',
    name: 'Home',
    component: Main,
    title: 'Home',
  },
  {
    path: '*',
    redirect: { name: 'Home' } 
  },
];

window.envType = process.env.NODE_ENV;

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;
