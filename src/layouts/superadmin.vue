<template>
  <TheHeaderSuperAdmin />
  .
  <div class="container-fluid mt-3">
    <div class="row">
      <div class="col-sm-3 d-none d-sm-flex">
        <a-list bordered style="width: 100%">
          <TheMenuSuperAdmin />
          <template #header>
            <div>Bảng điều khiển</div>
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
export default {
  components: {
    TheHeaderSuperAdmin,
    TheMenuSuperAdmin,
  },
};
</script>
