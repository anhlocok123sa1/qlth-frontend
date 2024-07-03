<template>
  <div class="header-container">
    <TheHeaderSuperAdmin />
  </div>
  <div class="container-fluid mt-3">
    <div class="row">
      <div class="col-sm-3 d-none d-sm-flex fixed-column">
        <a-list bordered class="a-list">
          <TheMenuSuperAdmin />
          <template #header>
            <div class="text-menu">QUẢN LÝ</div>
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
import TheMenuSuperAdmin from "../components/TheMenuSuperAdmin.vue";
import TheHeaderSuperAdmin from "../components/TheHeaderSuperAdmin.vue";
import { useUser } from "../stores/use-menu";
import "../css/supper_admin/system.css";

export default {
  components: {
    TheHeaderSuperAdmin,
    TheMenuSuperAdmin,
  },
};
</script>
