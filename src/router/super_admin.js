function checkAdminRole(to, from, next) {
  const role = localStorage.getItem("role");
  if (role === "super_admin" || role === "student_admin" || role === "teacher_admin") {
    if (to.name == "system") {
      next({ name: "home" });
    }
    next();
  } else {
    next({ name: "login" });
  }
}

const superAdmin = [
  {
    path: "/system",
    name: "system",
    component: () => import("../layouts/superadmin.vue"),
    props: true,
    meta: { requiresAuth: true },
    beforeEnter: checkAdminRole,
    children: [

      // home
      {
        path: "home",
        name: "home",
        component: () => import("../pages/super-admin/index.vue"),
      },
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

      /// ---------------  Users          ---------------------------
      // ------ Khoản lý khoa
      {
        path: "department",
        name: "department",
        component: () => import("../pages/super-admin/department/index.vue"),
      },
      {
        path: "department/:ma_khoa/edit",
        name: "department-edit",
        component: () => import("../pages/super-admin/department/edit.vue"),
      },
      {
        path: "department/create",
        name: "department-create",
        component: () => import("../pages/super-admin/department/create.vue"),
      },
      // ----------- Khoản lý Lớp
      {
        path: "classroom",
        name: "classroom",
        component: () => import("../pages/super-admin/classroom/index.vue"),
      },

      {
        path: "classroom/:ma_lop/edit",
        name: "classroom-edit",
        component: () => import("../pages/super-admin/classroom/edit.vue"),
      },

      {
        path: "classroom/create",
        name: "classroom-create",
        component: () => import("../pages/super-admin/classroom/create.vue"),
      },
      //--------  Quản lý sinh viên 
      {
        path: "student",
        name: "student",
        component: () => import("../pages/super-admin/student/index.vue"),
      },
      {
        path: "student/create",
        name: "student-create",
        component: () => import("../pages/super-admin/student/create.vue"),
      },


      // Quản lý giáo viên TE
    ],
  },
];

export default superAdmin;
