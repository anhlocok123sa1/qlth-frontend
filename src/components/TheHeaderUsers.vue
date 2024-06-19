<template>
  <div class="container-fluid">
    <div
      class="row text-white"
      style="background-color: #0c713d; padding: 1rem"
    >
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawer">X</span>
      </div>

      <div
        class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start"
      >
        <img
          src="../assets/logosv.png"
          alt="logo"
          height="32"
          width="34"
          class="ms-3 me-3"
        />
        <span class="d-none d-sm-flex">Sinh Viên</span>
      </div>
      <div
        class="col-sm-3 d-none d-sm-flex align-items-center justify-content-center justify-content-sm-end"
      >
        <span>{{ currentUser }}</span>
        <a-button type="primary" @click="logout" class="ms-3"
          >Đăng xuất</a-button
        >
      </div>
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawer_Users">X</span>
      </div>
    </div>
  </div>

  <a-drawer v-model:open="open" title="Danh Mục" placement="left">
    <TheMenuUsers />
  </a-drawer>

  <a-drawer v-model:open="open_users" title="Danh Mục" placement="right">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<script setup>
import TheMenuUsers from "./TheMenuUsers.vue";
import { ref } from "vue";
import axios from "../axios.js";
import { useRouter } from "vue-router";

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
  }
};
const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    await axios.post(
      "http://127.0.0.1:8000/api/logout",
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
    console.log("Đăng xuất thành công");
    router.push("/login");
  } catch (error) {
    console.error("Đăng xuất thất bại:", error);
  }
};
fetchUserInfo();
</script>
