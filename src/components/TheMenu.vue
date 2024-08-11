<template>
  <div>
    <a-button @click="toggleCollapsed" style="margin-bottom: 10px">
      <MenuUnfoldOutlined v-if="collapsed" />
      <MenuFoldOutlined v-else />
      <i class="fa-solid fa-list"></i>
    </a-button>
    <transition name="collapse">
      <a-menu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :inline-collapsed="collapsed"
        v-show="!collapsed || !collapsedMenu"
      >
        <!-- Điểm danh sinh viên -->
        <a-menu-item key="admin-diemdanh">
          <router-link :to="{ name: 'admin-diemdanh' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-file-circle-plus" />
              <span class="menu-item-text">Điểm danh</span>
            </span>
          </router-link>
        </a-menu-item>

        <!-- Xem kết quả điểm danh -->
        <a-menu-item key="admin-kqdiemdanh">
          <router-link :to="{ name: 'admin-kqdiemdanh' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-file" />
              <span class="menu-item-text">Xem kết quả điểm danh</span>
            </span>
          </router-link>
        </a-menu-item>

        <!-- Xem thời khóa biểu -->
        <a-menu-item key="admin-thoikhoabieu">
          <router-link :to="{ name: 'admin-thoikhoabieu' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-table" />
              <span class="menu-item-text">Thời khóa biểu</span>
            </span>
          </router-link>
        </a-menu-item>

        <!-- Tạo lịch học -->
        <a-menu-item key="admin-lichgiangday">
          <router-link :to="{ name: 'admin-lichgiangday' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-chalkboard" />
              <span class="menu-item-text">Quản lý giảng dạy</span>
            </span>
          </router-link>
        </a-menu-item>

        <!-- Tra cứu thông tin sinh viên -->
        <a-menu-item key="admin-tracuuthongtin">
          <router-link :to="{ name: 'admin-tracuuthongtin' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-magnifying-glass" />
              <span class="menu-item-text">Tra cứu thông tin sinh viên</span>
            </span>
          </router-link>
        </a-menu-item>

        <!-- Thông tin cá nhân -->
        <a-menu-item key="admin-information">
          <router-link :to="{ name: 'admin-information' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-user" />
              <span class="menu-item-text">Thông tin cá nhân</span>
            </span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </transition>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import { useMenu } from "../stores/use-menu";
import { storeToRefs } from "pinia";

export default defineComponent({
  emits: ["update:collapsed"],
  setup(props, { emit }) {
    const store = useMenu();
    const collapsed = ref(false);

    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
      emit("update:collapsed", collapsed.value);
    };
    return {
      ...storeToRefs(store),
      toggleCollapsed,
      collapsed,
    };
  },
});
</script>
<style scoped>
.menu-item-content {
  display: flex;
  align-items: center;
}

.menu-item-text {
  margin-left: 8px;
}

.ant-menu-inline-collapsed .menu-item-text {
  display: none;
}

.ant-menu-inline-collapsed .fa-solid {
  font-size: 20px;
}
</style>
