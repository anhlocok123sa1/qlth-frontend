function checkUserRole(to, from, next) {
  const role = localStorage.getItem("role");
  if (role === "student") {
    if (to.name == "users-sv") {
      next({ name: "users-qrcode" });
    }
    next();
  } else {
    next({ name: "login" });
  }
}

const users = [
  {
    path: "/users",
    name: "users-sv",
    component: () => import("../layouts/users.vue"),
    meta: { requiresAuth: true },
    beforeEnter: checkUserRole,
    children: [
      {
        path: "qrcode",
        name: "users-qrcode",
        component: () => import("../pages/users/qrcode/index.vue"),
      },
      {
        path: "information",
        name: "users-information",
        component: () => import("../pages/users/information/index.vue"),
      },
      {
        path: "attendance-results",
        name: "users-attendance-results",
        component: () => import("../pages/users/attendance-results/index.vue"),
      },
      {
        path: "timetable",
        name: "users-timetable",
        component: () => import("../pages/users/timetable/index.vue"),
      },
      {
        path: "scanqr",
        name: "users-scanqr",
        component: () =>
          import("../pages/users/scan-attendance-code/index.vue"),
      },
      {
        path: "view-score",
        name: "users-view-score",
        component: () => import("../pages/users/view-score/index.vue"),
      },
    ],
  },
];
export default users;
