function checkAdminRole(to, from, next) {
  const role = localStorage.getItem("role");
  if (role === "teacher") {
    next();
  } else {
    next({ name: "login" }); // Redirect to login if the role is not 'teacher'
  }
}

const admin = [
  {
    path: "/admin",
    name: "admin",
    component: () => import("../layouts/admin.vue"),
    props: true,
    meta: { requiresAuth: true },
    beforeEnter: checkAdminRole,
    children: [
      //Quản lý roles
      {
        path: "roles",
        name: "admin-roles",
        component: () => import("../pages/admin/roles/index.vue"),
      },
      //Quản lý settings
      {
        path: "settings",
        name: "admin-settings",
        component: () => import("../pages/admin/settings/index.vue"),
      },
      //Quản lý điểm danh
      {
        path: "diemdanh",
        name: "admin-diemdanh",
        component: () => import("../pages/admin/diemdanh/index.vue"),
      },
      //Quản lý thời khóa biểu
      {
        path: "thoikhoabieu",
        name: "admin-thoikhoabieu",
        component: () => import("../pages/admin/thoikhoabieu/index.vue"),
        props: (route) => ({ query: route.query.q }),
      },
    ],
  },
];

export default admin;
