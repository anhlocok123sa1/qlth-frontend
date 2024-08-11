<template>
  <div class="header-container">
    <TheHeader />
  </div>
  <div :class="['container-fluid mt-3', { 'menu-collapsed': collapsed }]">
    <div class="row">
      <div
        class="col-sm-3 d-none d-sm-flex fixed-column"
        :class="{ collapsed: collapsed }"
      >
        <a-list bordered class="a-list">
          <TheMenu @update:collapsed="handleCollapse" />
          <template #header>
            <div class="text-menu">MENU</div>
          </template>
        </a-list>
      </div>

      <div class="col-12 col-sm-9">
        <router-view> </router-view>
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
import "../css/supper_admin/system.css";

export default {
  components: {
    TheHeader,
    TheMenu,
  },
  middleware: "auth-admin",
  setup() {
    const userStore = useUser();
    const collapsed = ref(false);

    const handleCollapse = (collapsedState) => {
      collapsed.value = collapsedState;
    };
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
    return {
      collapsed,
      handleCollapse,
    };
  },
};
</script>
<style scoped>
.container-fluid.menu-collapsed .row {
  transition: margin-left 0.3s;
}
.fixed-column {
  transition: width 0.2s;
}
.fixed-column.collapsed {
  width: 120px;
  transition: width 0.3s;
}

.col-sm-9 {
  flex: 1;
}
</style>
