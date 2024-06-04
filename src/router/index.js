import { createRouter, createWebHistory } from "vue-router";
import admin from "./admin.js";
import Login from '../pages/Login.vue';

const routes = [
  ...admin,
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for logged-in users
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
