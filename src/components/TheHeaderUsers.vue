<template>
  <div class="container-fluid">
    <div class="row text-white header">
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawer"> <UnorderedListOutlined /></span>
      </div>

      <div
        class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start"
      >
        <img
          src="../assets/logosv.png"
          alt="logo"
          height="50"
          width="50"
          class="ms-3 me-3"
        />
        <span class="d-none d-sm-flex name-student">Sinh Viên</span>
      </div>
      <div
        class="col-sm-3 d-none d-sm-flex align-items-center justify-content-center justify-content-sm-end"
      >
        <span class="name-user">{{ currentUser }}</span>
        <a-button @click="logout" class="ms-3 logout-web">Đăng xuất</a-button>
      </div>
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawer_Users"><LogoutOutlined /></span>
      </div>
    </div>
  </div>

  <!-- show thanh trang thai mobile -->
  <a-drawer v-model:open="open" title="Danh Mục" placement="left">
    <TheMenuUsers />
  </a-drawer>

  <!-- show thanh trang thai mobile -->
  <a-drawer v-model:open="open_users" title="Danh Mục" placement="right">
    <a-button type="primary" @click="logout" class="ms-3 logout-mobile"
      >Đăng xuất</a-button
    >
  </a-drawer>
</template>

<script setup>
import TheMenuUsers from "./TheMenuUsers.vue";
import { ref } from "vue";
import axios from "../axios.js";
import { useRouter } from "vue-router";
import { LogoutOutlined, UnorderedListOutlined } from "@ant-design/icons-vue";
import "../css/users/header.css";

const open = ref(false);
const open_users = ref(false);
const currentUser = ref("");
const router = useRouter();
const showDrawer = () => {
  open.value = true;
};

const showDrawer_Users = () => {
  open_users.value = true;
};

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.get("thong-tin-ca-nhan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("ma_sv", response.data.ma_sv);
    currentUser.value = response.data.ten_sv;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("ma_sv");
  }
};
const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    await axios.post(
      "logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.removeItem("token");
    localStorage.removeItem("ma_sv");
    localStorage.removeItem("role");
    // console.log("Đăng xuất thành công");
    router.push("/login");
  } catch (error) {
    console.error("Đăng xuất thất bại:", error);
  }
};
fetchUserInfo();
</script>
