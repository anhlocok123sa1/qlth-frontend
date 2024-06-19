<template>
  <TheHeaderUsers />
  <div class="container-fluid mt-3">
    <div class="row">
      <div class="col-sm-3 d-none d-sm-flex">
        <a-list bordered style="width: 100%">
          <template #header>
            <div>Thanh Menu</div>
          </template>
          <TheMenuUsers />
        </a-list>
      </div>

      <div class="col-12 col-sm-3">
        <router-view> </router-view>
      </div>
    </div>
  </div>
</template>
<script>
import TheHeaderUsers from "../components/TheHeaderUsers.vue";
import TheMenuUsers from "../components/TheMenuUsers.vue";

export default {
  components: {
    TheHeaderUsers,
    TheMenuUsers,
  },
};
</script>
