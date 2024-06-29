<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
  >

    <!-- Điểm danh sinh viên -->
    <a-menu-item key="admin-diemdanh">
      <router-link :to="{ name: 'admin-diemdanh' }">
        <span><i class="fa-regular fa-calendar me-1"></i>Điểm danh</span>
      </router-link>
    </a-menu-item>

    <!-- Xem kết quả điểm danh -->
     <a-menu-item key="admin-kqdiemdanh">
      <router-link :to="{ name: 'admin-kqdiemdanh' }">
        <span><i class="fa-solid fa-file me-1"></i>Xem kết quả điểm danh</span>
      </router-link>
    </a-menu-item>

    <!-- Xem thời khóa biểu -->
    <a-menu-item key="admin-thoikhoabieu">
      <router-link :to="{ name: 'admin-thoikhoabieu' }">

        <span><i class="fa-regular fa-calendar-days me-1"></i>Thời khóa biểu</span>

      </router-link>
    </a-menu-item>

    <!-- information -->
    <a-menu-item key="admin-information">
      <router-link :to="{ name: 'admin-information' }">
        <span><i class="fa-solid fa-user me-1"></i>Thông tin cá nhân</span>
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
