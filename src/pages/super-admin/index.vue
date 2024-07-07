<template>
  <div class="container-fluid">
    <!-- row -->
    <div class="row boxs">
      <!-- box1 -->
      <div class="col-sm-3 box1 box">
        <div class="row item">
          <!-- box-menu -->
          <div class="col-sm-6 item-menu">
            <span>Khoa</span>
          </div>
          <!-- box-icon -->
          <div class="col-sm-6">
            <i class="fa-solid fa-building-user item-img"></i>
          </div>
        </div>
        <div class="row link">
          <a href="department" class="item-link"> Xem Thêm</a>
        </div>
      </div>

      <!-- box2 -->
      <div class="col-sm-3 box2 box">
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
        <div class="row link">
          <a href="classroom" class="item-link">Xem Thêm</a>
        </div>
      </div>

      <!-- box3 -->
      <div class="col-sm-3 box3 box">
        <div class="row item">
          <!-- box-menu -->
          <div class="col-sm-6 item-menu">
            <span>Sinh Viên</span>
          </div>
          <!-- box-icon -->
          <div class="col-sm-6">
            <i class="fa-solid fa-graduation-cap item-img"></i>
          </div>
        </div>
        <div class="row link">
          <a href="student" class="item-link">Xem Thêm</a>
        </div>
      </div>

      <!-- box4 -->
      <div class="col-sm-3 box4 box">
        <div class="row item">
          <!-- box-menu -->
          <div class="col-sm-6 item-menu">
            <span>Môn Học</span>
          </div>
          <!-- box-icon -->
          <div class="col-sm-6">
            <i class="fa-solid fa-building-user item-img"></i>
          </div>
        </div>
        <div class="row link"><a href="" class="item-link">Xem Thêm</a></div>
      </div>
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
