import { useRoute } from "vue-router";

const admin = [
  {
    path: "/admin",
    name: "admin",
    component: () => import("../layouts/admin.vue"),
    props: true,
    children: [
      //Quản lý users giao vien
      {
        path: "users-gv",
        name: "admin-users-gv",
        component: () => import("../pages/admin/users-gv/index.vue"),
      },
      {
        path: "users-gv/create",
        name: "admin-users-gv-create",
        component: () => import("../pages/admin/users-gv/create.vue"),
      },
      {
        path: "users-gv/:id/edit",
        name: "admin-users-gv-edit",
        component: () => import("../pages/admin/users-gv/edit.vue"),
      },
      //Quản lý users sinh vien
      {
        path: "users-sv",
        name: "admin-users-sv",
        component: () => import("../pages/admin/users-sv/index.vue"),
      },
      {
        path: "users-sv/create",
        name: "admin-users-sv-create",
        component: () => import("../pages/admin/users-sv/create.vue"),
      },
      {
        path: "users-sv/:id/edit",
        name: "admin-users-sv-edit",
        component: () => import("../pages/admin/users-sv/edit.vue"),
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
        props: (route) => ({ query: route.query.q }),
      },
    ],
  },
];

export default admin;
