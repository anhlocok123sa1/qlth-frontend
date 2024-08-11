<template>
  <div class="header-container">
    <TheHeaderSuperAdmin />
  </div>
  <div :class="['container-fluid mt-3', { 'menu-collapsed': collapsed }]">
    <div class="row">
      <div
        class="col-sm-3 d-none d-sm-flex fixed-column"
        :class="{ collapsed: collapsed }"
      >
        <a-list bordered class="a-list">
          <TheMenuSuperAdmin @update:collapsed="handleCollapse" />
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
import { ref } from "vue";
import TheMenuSuperAdmin from "../components/TheMenuSuperAdmin.vue";
import TheHeaderSuperAdmin from "../components/TheHeaderSuperAdmin.vue";
import "../css/supper_admin/system.css";

export default {
  components: {
    TheHeaderSuperAdmin,
    TheMenuSuperAdmin,
  },
  setup() {
    const collapsed = ref(false);

    const handleCollapse = (collapsedState) => {
      collapsed.value = collapsedState;
    };

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
