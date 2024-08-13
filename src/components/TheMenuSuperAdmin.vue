<template>
  <div>
    <a-button @click="toggleCollapsed">
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
        <!-- Trang chủ -->
        <a-menu-item key="home">
          <router-link :to="{ name: 'home' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-house" />
              <span class="menu-item-text">Trang chủ</span>
            </span>
          </router-link>
        </a-menu-item>
        <!-- Quản lý khoa -->
        <a-menu-item key="department">
          <router-link :to="{ name: 'department' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-building" />
              <span class="menu-item-text">Khoa</span>
            </span>
          </router-link>
        </a-menu-item>
        <!-- Quản lý lớp -->
        <a-menu-item key="classroom">
          <router-link :to="{ name: 'classroom' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-graduation-cap" />
              <span class="menu-item-text">Lớp</span>
            </span>
          </router-link>
        </a-menu-item>
        <!-- Quản lý môn học -->
        <a-menu-item key="subject">
          <router-link :to="{ name: 'subject' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-book" />
              <span class="menu-item-text">Môn học</span>
            </span>
          </router-link>
        </a-menu-item>
        <!-- Quản lý sinh viên -->
        <a-menu-item key="student">
          <router-link :to="{ name: 'student' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-user" />
              <span class="menu-item-text">Tra cứu thông tin sinh viên</span>
            </span>
          </router-link>
        </a-menu-item>
        <!-- Quản lý tài khoản giáo viên -->
        <a-menu-item key="admin-users-gv">
          <router-link :to="{ name: 'admin-users-gv' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-chalkboard-user" />
              <span class="menu-item-text">Tài khoản giáo viên</span>
            </span>
          </router-link>
        </a-menu-item>
        <!-- Quản lý tài khoản sinh viên -->
        <a-menu-item key="admin-users-sv">
          <router-link :to="{ name: 'admin-users-sv' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-chalkboard-user" />
              <span class="menu-item-text">Tài khoản sinh viên</span>
            </span>
          </router-link>
        </a-menu-item>
        <!-- Thông tin cá nhân -->
        <a-menu-item key="super-admin-information">
          <router-link :to="{ name: 'super-admin-information' }">
            <span class="menu-item-content">
              <i class="fa-solid fa-circle-info" />
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
    const collapsed = ref(false);

    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
      emit("update:collapsed", collapsed.value);
    };
    const store = useMenu();

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
