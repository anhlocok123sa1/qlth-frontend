<template>
  <div class="container-fuild">
    <div
      class="row text-white"
      style="background-color: #134b5f; padding: 0.8rem"
    >
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawer()">
          <i class="fa-solid fa-align-justify"></i>
        </span>
      </div>
      <div
        class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start"
      >
        <img
          src="../assets/pdt3.png"
          alt="Logo"
          height="32"
          width="34"
          class="ms-3 me-3"
        />
        <span class="d-none d-sm-flex">PHÒNG ĐÀO TẠO</span>
      </div>
      <div
        class="col-sm-3 d-none d-sm-flex align-items-center justify-content-sm-end"
      >
        <span>{{ currentUser }}</span>
        <a-button type="primary" class="ms-2" @click="logout"
          ><i class="fa-solid fa-right-from-bracket"></i
        ></a-button>
      </div>

      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawerUser()">
          <i class="fa-regular fa-user"></i>
        </span>
      </div>
    </div>
  </div>

  <a-drawer v-model:open="open" title="Danh mục" placement="left">
    <TheMenuSuperAdmin />
  </a-drawer>
  <a-drawer v-model:open="open_user" title="Danh mục" placement="right">
    <a-button type="primary" class="ms-2" @click="logout">Đăng xuất</a-button>
  </a-drawer>
</template>

<script setup>
import TheMenuSuperAdmin from "./TheMenuSuperAdmin.vue";
import { ref } from "vue";
import axios from "../axios.js";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

const open = ref(false);
const open_user = ref(false);
const currentUser = ref("");
const router = useRouter();
const showDrawer = () => {
  open.value = true;
};

const showDrawerUser = () => {
  open_user.value = true;
};

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.get("thong-tin-admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("ma_admin", response.data.username);
    currentUser.value = response.data.full_name;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("ma_admin");
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
      "logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // console.log("Đăng xuất thành công");
    message.success("Đăng xuất thành công");
    router.push("/login");
  } catch (error) {
    console.error("Đăng xuất thất bại:", error);
  }
};
fetchUserInfo();
</script>
