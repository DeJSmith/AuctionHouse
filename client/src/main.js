import Vue from 'vue';
import App from './App';
import Home from './Home';
import Auctions from './Auctions';
import Login from './UserLogin';
import User from './Users';
import CreateUser from './CreateUser';
import CreateAuction from './CreateAuction';
import UserAuctions from './UserAuctions';
import EditAuction from './EditAuction';


import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import VueCookies from 'vue-cookies'
Vue.use(VueCookies);

Vue.http.options.emulateJSON = true;

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },

  {
    path: "/auctions",
    name: "getAuctions",
    component: Auctions
  },

  {
    path: "/auctions/:aucId",
    name: "getAuction",
    component: Auctions
  },

  {
    path: "/userLogin",
    name: "userLogin",
    component: Login
  },

  {
    path: "/createUser",
    name: "createUser",
    component: CreateUser
  },

  {
    path: "/user/:id",
    name: "viewUser",
    component: User
  },

  {
    path: "/createAuction",
    name: "createAuction",
    component: CreateAuction
  },

  {
    path: "/userAuctions",
    name: "userAuctions",
    component: UserAuctions
  },

  {
    path: "/userAuctions/:aucId",
    name: "userAuction",
    component: UserAuctions
  },

  {
    path: "/editAuction/:aucId",
    name: "editAuction",
    component: EditAuction
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
