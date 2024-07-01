<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
  >
    <!-- Trang chủ -->
    <a-menu-item key="home">
      <router-link :to="{ name: 'home' }">
        <span><i class="fa-solid fa-user me-1"></i>Trang chủ</span>
      </router-link>
    </a-menu-item>
    <!-- Quản lý tài khoản giáo viên -->
    <a-menu-item key="admin-users-gv">
      <router-link :to="{ name: 'admin-users-gv' }">
        <span><i class="fa-solid fa-user me-1"></i>Tài khoản giáo viên</span>
      </router-link>
    </a-menu-item>

    <!-- Quản lý tài khoản sinh viên -->
    <a-menu-item key="admin-users-sv">
      <router-link :to="{ name: 'admin-users-sv' }">
        <span><i class="fa-solid fa-user me-1"></i>Tài khoản sinh viên</span>
      </router-link>
    </a-menu-item>

    <!-- information -->
    <a-menu-item key="super-admin-information">
      <router-link :to="{ name: 'super-admin-information' }">
        <span><UserOutlined /> Thông tin cá nhân</span>
      </router-link>
    </a-menu-item>

    <a-menu-item key="admin-roles">
      <router-link :to="{ name: 'admin-roles' }">
        <span><i class="fa-solid fa-tag me-1"></i>Vai trò</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="admin-settings">
      <router-link :to="{ name: 'admin-settings' }">
        <span><i class="fa-solid fa-gear me-1"></i>Cài đặt</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="student">
      <router-link :to="{ name: 'student' }">
        <span><i class="fa-solid fa-graduation-cap"></i> Sinh Viên</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>
<script>
import { defineComponent } from "vue";
import { useMenu } from "../stores/use-menu";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const store = useMenu();

    return {
      ...storeToRefs(store),
    };
  },
});
</script>
