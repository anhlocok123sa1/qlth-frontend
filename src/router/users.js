const users = [
    {
        path: "/users",
        name: "users-sv",
        component: () => import("../layouts/users.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: "qrcode",
                name: "users-qrcode",
                component: () => import("../pages/users/qrcode/index.vue")
            },
            {
                path: "information",
                name: "users-information",
                component: () => import("../pages/users/information/index.vue")
            },
            {
                path: "attendance-results",
                name: "users-attendance-results",
                component: () => import("../pages/users/attendance-results/index.vue")
            },
            {
                path: "timetable",
                name: "users-timetable",
                component: () => import("../pages/users/timetable/index.vue")
            }
        ]
    }
]
export default users; 