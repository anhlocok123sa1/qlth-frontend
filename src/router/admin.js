const admin = [
  {
    path: "/admin",
    name: "admin",
    component: () => import("../layouts/admin.vue"),
    children: [
      //Quản lý users giao vien
      {
        path: "users-gv",
        name: "admin-users",
        component: () => import("../pages/admin/users-gv/index.vue"),
      },
      {
        path: "users-gv/create",
        name: "admin-users-create",
        component: () => import("../pages/admin/users-gv/create.vue"),
      },
      {
        path: "users-gv/:id/edit",
        name: "admin-users-edit",
        component: () => import("../pages/admin/users-gv/edit.vue"),
      },
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
      },
    ],
  }
];

export default admin;
