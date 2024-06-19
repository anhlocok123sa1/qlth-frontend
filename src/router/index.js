import { createRouter, createWebHistory } from "vue-router";
import admin from "./admin.js";
import Login from '../pages/Login.vue';
import axios from "../axios.js";
import users from "./users.js";

const routes = [
  ...admin,
  ...users,
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

// Function to validate token with the server
async function validateToken(token) {
  try {
    const response = await axios.post('validate-token', { token });
    return response.data.valid;
  } catch (error) {
    return false;
  }
}

// Navigation guard to check for logged-in users
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      const isValidToken = await validateToken(token);
      if (isValidToken) {
        next();
      } else {
        localStorage.removeItem('token');
        next({ name: 'login' });
      }
    } else {
      if (to.meta.requiresAuth) {
        next({ name: "login" });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
