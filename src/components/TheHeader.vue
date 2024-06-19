<template>
  <div class="container-fuild">
    <div
      class="row text-white"
      style="background-color: #0c713d; padding: 1rem"
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
          src="../assets/logo.png"
          alt="Logo"
          height="32"
          width="34"
          class="ms-3 me-3"
        />
        <span class="d-none d-sm-flex">Quản trị</span>
      </div>
      <div
        class="col-sm-3 d-none d-sm-flex align-items-center justify-content-sm-end"
      >
        <span>{{ userName }}</span>
        <a-button type="primary" class="ms-2" @click="logout"
          >Đăng xuất</a-button
        >
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
    <TheMenu />
  </a-drawer>
  <a-drawer v-model:open="open_user" title="Danh mục" placement="right">
    <p>Some contents for user...</p>
    <p>Some contents for user...</p>
    <p>Some contents for user...</p>
  </a-drawer>
</template>

<script>
import TheMenu from "../components/TheMenu.vue";
import axios from "../axios"; // Import axios instance
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { defineComponent, ref, computed } from "vue";
import { useUser } from "../stores/use-menu";
export default defineComponent({
  components: {
    TheMenu,
  },
  setup() {
    const router = useRouter();
    const open = ref(false);
    const open_user = ref(false);
    const showDrawer = () => {
      open.value = true;
    };
    const showDrawerUser = () => {
      open_user.value = true;
    };

    const logout = () => {
      axios
        .post("/logout")
        .then(() => {
          message.success("Đăng xuất thành công");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.user = null;
          router.push({ name: "login" });
        })
        .catch(() => {
          console.error("Logout failed");
        });
    };
    const userStore = useUser();
    const userName = computed(() => userStore.getten);

    return {
      open,
      open_user,
      showDrawer,
      showDrawerUser,
      logout,
      userName,
    };
  },
});
</script>
