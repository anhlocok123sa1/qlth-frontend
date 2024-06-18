import { defineStore } from "pinia";

export const useMenu = defineStore("menuId", {
  state: () => ({
    selectedKeys: [],
    openKeys: [],
  }),
  actions: {
    onSelectedKeys(data) {
      this.selectedKeys = data;
    },
    onOpenKeys(data) {
      this.openKeys = data;
    },
  },
});

export const useUser = defineStore("user", {
  state: () => ({
    user: null,
    role: "",
  }),
  actions: {
    setUser(data, role) {
      this.user = data;
      this.role = role;
    },
    clearUser() {
      this.user = null;
      this.role = "";
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    getma: (state) => (state.user ? state.user.ma : ""),
    getten: (state) => (state.user ? state.user.ten : ""),
  },
});
