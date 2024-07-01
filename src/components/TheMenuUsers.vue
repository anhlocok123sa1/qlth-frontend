<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    style="min-height: 500px"
  >
    <!-- Qr code -->
    <a-menu-item key="users-qrcode">
      <router-link :to="{ name: 'users-qrcode' }">
        <span><QrcodeOutlined /> QR code</span>
      </router-link>
    </a-menu-item>

    <!-- information -->
    <a-menu-item key="users-information">
      <router-link :to="{ name: 'users-information' }">
        <span><UserOutlined /> Thông tin cá nhân</span>
      </router-link>
    </a-menu-item>

    <!-- attendance-results -->
    <a-menu-item key="users-attendance-results">
      <router-link :to="{ name: 'users-attendance-results' }">
        <span><FileTextOutlined /> Kết quả điểm danh</span>
      </router-link>
    </a-menu-item>

    <!-- timetable -->
    <a-menu-item key="users-timetable">
      <router-link :to="{ name: 'users-timetable' }">
        <span><TableOutlined /> Thời khóa biểu </span>
      </router-link>
    </a-menu-item>

    <!-- Quét mã điểm danh -->
    <a-menu-item key="users-scanqr">
      <router-link :to="{ name: 'users-scanqr' }">
        <span><TableOutlined /> Quét mã điểm danh </span>
      </router-link>
    </a-menu-item>

    <!-- Xem điểm -->
     <a-menu-item key="users-view-score">
      <router-link :to="{ name: 'users-view-score' }">
        <span><TableOutlined /> Xem điểm </span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
import {
  UserOutlined,
  QrcodeOutlined,
  FileTextOutlined,
  TableOutlined,
} from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { useMenuUsers } from "../stores/use-menu-users";

export default defineComponent({
  components: {
    UserOutlined,
    QrcodeOutlined,
    FileTextOutlined,
    TableOutlined,
  },
  setup() {
    const store = useMenuUsers();

    return {
      ...storeToRefs(store),
    };
  },
});
</script>
