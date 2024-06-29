import { createRouter, createWebHistory } from "vue-router";
import admin from "./admin.js";
import superAdmin from "./super_admin.js"
import Login from '../pages/Login.vue';
import axios from "../axios.js";
import users from "./users.js";

const routes = [
  ...admin,
  ...users,
  ...superAdmin,
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
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return false;
  }
}

// Navigation guard to check for logged-in users
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    const isValidToken = await validateToken(token);

    if (!isValidToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return next({ name: "login" });
    } else {
      if (to.path.startsWith("/admin") && role !== "teacher") {
        return next({ name: "login" });
      }

      if (role === "student" && !to.path.startsWith("/users")) {
        return next({ name: "users-sv" });
      } else if (role === "teacher" && !to.path.startsWith("/admin")) {
        return next({ name: "admin" });
      } else if (role === "super_admin" && !to.path.startsWith("/super-admin")) {
        return next({ name: "super-admin" });
      } else {
        return next(); // Proceed if the role and path match
      }
    }
  } else {
    if (to.meta.requiresAuth || to.name === undefined) {
      return next({ name: "login" });
    } else {
      return next(); // Proceed if the route does not require authentication
    }
  }
});




export default router;
