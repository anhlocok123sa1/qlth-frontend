<template>
  <TheHeader />
  <div class="container-fluid mt-3">
    <div class="row">
      <div class="col-sm-3 d-none d-sm-flex">
        <a-list bordered style="width: 100%">
          <TheMenu />
          <template #header>
            <div>Bảng điều khiển</div>
          </template>
        </a-list>
      </div>
      <div class="col-12 col-sm-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import axios from "../axios";
import TheHeader from "../components/TheHeader.vue";
import TheMenu from "../components/TheMenu.vue";
import { useUser } from "../stores/use-menu";
import users from "../router/users";
export default {
  components: {
    TheHeader,
    TheMenu,
  },
  middleware: "auth-admin",
  setup() {
    const userStore = useUser();
    onMounted(() => {
      axios
        .get("/getusertoken")
        .then((response) => {
          if (response.data.giaovien) {
            const userData = response.data.giaovien;
            userStore.setUser(userData, "giaovien");
          } else if (response.data.sinhvien) {
            const userData = response.data.sinhvien;
            userStore.setUser(userData, "sinhvien");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user details", error);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          userStore.clearUser();
        });
    });
  },
};
</script>
