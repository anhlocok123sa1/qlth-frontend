function checkAdminRole(to, from, next) {
  const role = localStorage.getItem("role");
  if (role === "teacher") {
    if (to.name == 'admin') {
      next({ name: "admin-thoikhoabieu" });
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
      // detail giảng dạy
      {
        path: "lich-giang-day",
        name: "admin-lichgiangday",
        component: () => import("../pages/admin/lichgd/index.vue"),
      },
      //tạo lịch giảng dạy
      {
        path: "lich-giang-day/create",
        name: "admin-lichgiangday/create",
        component: () => import("../pages/admin/lichgd/create.vue"),
      },

      //tạo lịch giảng dạy
      {
        path: "lich-giang-day/create-custom",
        name: "admin-lichgiangday/create-custom",
        component: () => import("../pages/admin/lichgd/create_custom.vue"),
      },
      {
        path: "lich-giang-day/edit/:ma_gd/:ten_mh/:nmh",
        name: "admin-lichgiangday/edit",
        component: () => import("../pages/admin/lichgd/edit.vue"),
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
