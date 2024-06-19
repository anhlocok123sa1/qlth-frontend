import { defineStore } from "pinia";

export const useMenuUsers = defineStore("menuUserId", {
    state: () => ({
        selectedKeys: [],
        openKeys: [],
    }),
    actions: {
        onSelectedKeys(data) {
            this.selectedKeys = data
        },
        onOpenKeys(data) {
            this.openKeys = data
        }
    }
});
