<template>
  <div class="container-fluid">
    <!-- row -->
    <div class="row boxs">
      <!-- box1 -->
      <router-link :to="{ name: 'department' }" class="col-sm-3 box1 box py-2 py-sm-0">
        <div class="row item">
          <!-- box-menu -->
          <div class="col-sm-6 item-menu">
            <span>Khoa</span>
          </div>
          <!-- box-icon -->
          <div class="col-sm-6">
            <i class="fa-solid fa-building-user item-img-box2"></i>
          </div>
        </div>
      </router-link>

      <!-- box2 -->
      <router-link :to="{ name: 'classroom' }" class="col-sm-3 box2 box py-2 py-sm-0">
        <div class="row item">
          <!-- box-menu -->
          <div class="col-sm-6 item-menu">
            <span>Lớp</span>
          </div>
          <!-- box-icon -->
          <div class="col-sm-6">
            <i class="fa-solid fa-building-columns item-img-box2"></i>
          </div>
        </div>
      </router-link>

      <!-- box3 -->
      <router-link :to="{ name: 'student' }" class="col-sm-3 box3 box py-2 py-sm-0">
        <div class="row item">
          <!-- box-menu -->
          <div class="col-sm-6 item-menu">
            <span>Sinh Viên</span>
          </div>
          <!-- box-icon -->
          <div class="col-sm-6">
            <i class="fa-solid fa-graduation-cap item-img-box2"></i>
          </div>
        </div>
      </router-link>

      <!-- box4 -->
      <router-link :to="{ name: 'student' }" class="col-sm-3 box4 box py-2 py-sm-0">
        <div class="row item">
          <!-- box-menu -->
          <div class="col-sm-6 item-menu">
            <span>Môn Học</span>
          </div>
          <!-- box-icon -->
          <div class="col-sm-6">
            <i class="fa-solid fa-building-user item-img-box2"></i>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useMenu } from "../../stores/use-menu";
import "../../css/supper_admin/home.css";
export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["home"]);
  },
});
</script>