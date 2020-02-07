import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import User from '../views/User.vue';
import Report from '../views/Report.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/report',
    name: 'report',
    component: Report
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
