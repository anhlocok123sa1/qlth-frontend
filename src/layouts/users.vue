<template>
  <TheHeaderUsers />
  <div class="container-fluid mt-3">
    <div class="row">
      <div class="col-sm-3 d-none d-sm-flex">
        <a-list bordered style="width: 100%; background-color: cornflowerblue">
          <template #header>
            <div>
              <strong>Thanh Menu</strong>
            </div>
          </template>
          <TheMenuUsers />
        </a-list>
      </div>
      <div class="col-12 col-sm-9">
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
<style>
body {
  background-color: rgb(235, 240, 240);
}
</style>
