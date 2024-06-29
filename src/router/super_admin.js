function checkAdminRole(to, from, next) {
  const role = localStorage.getItem("role");
  if (role === "super_admin") {
    next();
  } else {
    next({ name: "login" }); 
  }
}

const superAdmin = [
  {
    path: "/super-admin",
    name: "super-admin",
    component: () => import("../layouts/superadmin.vue"),
    props: true,
    meta: { requiresAuth: true },
    beforeEnter: checkAdminRole,
    children: [
      //Quản lý users giao vien
      {
        path: "users-gv",
        name: "admin-users-gv",
        component: () => import("../pages/super-admin/users-gv/index.vue"),
      },
      {
        path: "users-gv/create",
        name: "admin-users-gv-create",
        component: () => import("../pages/super-admin/users-gv/create.vue"),
      },
      {
        path: "users-gv/:id/edit",
        name: "admin-users-gv-edit",
        component: () => import("../pages/super-admin/users-gv/edit.vue"),
      },

      //Quản lý users sinh vien
      {
        path: "users-sv",
        name: "admin-users-sv",
        component: () => import("../pages/super-admin/users-sv/index.vue"),
      },
      {
        path: "users-sv/create",
        name: "admin-users-sv-create",
        component: () => import("../pages/super-admin/users-sv/create.vue"),
      },
      {
        path: "users-sv/:id/edit",
        name: "admin-users-sv-edit",
        component: () => import("../pages/super-admin/users-sv/edit.vue"),
      },

      //Thông tin cá nhân
      {
        path: "information",
        name: "super-admin-information",
        component: () => import("../pages/super-admin/information/index.vue"),
      },
    ],
  },
];

export default superAdmin;
