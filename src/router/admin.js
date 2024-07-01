function checkAdminRole(to, from, next) {
  const role = localStorage.getItem("role");
  if (role === "teacher") {
    if (to.name == 'admin') {
      next({ name: "admin-diemdanh" });
    }
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
      //Xem điểm danh
      {
        path: "kqdiemdanh",
        name: "admin-kqdiemdanh",
        component: () => import("../pages/admin/kqdiemdanh/index.vue"),
      },
      //Quản lý thời khóa biểu
      {
        path: "thoikhoabieu",
        name: "admin-thoikhoabieu",
        component: () => import("../pages/admin/thoikhoabieu/index.vue"),
        props: (route) => ({ query: route.query.q }),
      },
      //Thông tin cá nhân
      {
        path: "information",
        name: "admin-information",
        component: () => import("../pages/admin/information/index.vue"),
      },
    ],
  },
];

export default admin;
