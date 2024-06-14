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
  }),
  actions: {
    setUser(data) {
      this.user = data;
    },
    clearUser() {
      this.user = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    getmagv: (state) => (state.user ? state.user.ma_gv : ""),
    gettengv: (state) => (state.user ? state.user.ten_gv : ""),
  },
});
