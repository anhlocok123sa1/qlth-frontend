<template>
  <div class="container-fluid">
    <!-- row -->
    <div class="row boxs">
      <!-- box1 -->
      <div class="col-sm-3 col-xl-6 box1 box">
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
      <div class="col-sm-3 col-xl-6 box2 box">
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
      <div class="col-sm-3 col-xl-6 box3 box">
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
      <div class="col-sm-3 col-xl-6 box4 box">
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
        <div class="row link">
          <a href="classroom" class="item-link">Xem Thêm</a>
        </div>
      </div>
    </div>

    <!--  -->
    <!-- row -->
    <div class="row boxs mt-3">
      <!-- box1 -->
      <div class="col-sm-3 box5 box">
        <div class="row item">
          <!-- box-menu -->
          <div class="col-sm-6 item-menu">
            <span>Điểm danh</span>
          </div>
          <!-- box-icon -->
          <div class="col-sm-6">
            <i class="fa-solid fa-tag item-img"></i>
          </div>
        </div>
        <div class="row link">
          <a href="department" class="item-link"> Xem Thêm</a>
        </div>
      </div>

      <!-- box2 -->
      <div class="col-sm-3"></div>

      <!-- box3 -->
      <div class="col-sm-3"></div>

      <!-- box4 -->
      <div class="col-sm-3"></div>
    </div>
    <!--  -->
  </div>

  <br />
  <br />
  <br />

  <!-- chart -->
  <div class="container">
    <div class="row">
      <div class="col-sm-8">
        <label for="">Biểu đồ thống kê số lượng sinh viên theo khoa</label>
        <div class="col-sm-12"><canvas id="myChart2"></canvas></div>
      </div>
    </div>
    <br />
    <br />
    <div class="row">
      <div class="col-sm-12 d-sm-flex">
        <div class="col-sm-4">
          <div class="row">
            <div class="col-sm-12 d-sm-flex justify-content-center">
              <label for=""
                >Biểu đồ thống kê số lượng sinh viên theo khoa</label
              >
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12"><canvas id="myChart"></canvas></div>
          </div>
        </div>
        <div class="col-sm-1"></div>
        <div class="col-sm-1"></div>
        <div class="col-sm-4">
          <div class="row">
            <div class="col-sm-12 d-sm-flex justify-content-center">
              <label for="">Biểu đồ đánh giá điểm sinh viên</label>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12"><canvas id="myChart1"></canvas></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useMenu } from "../../stores/use-menu";
import "../../css/supper_admin/home.css";
import Chart from "chart.js/auto";
import axios from "../../axios.js";

export default defineComponent({
  setup() {
    const store = useMenu();
    const dataPoints = ref([]);

    onMounted(() => {
      axios
        .get("diem-hoc-tap")
        .then((response) => {
          const data = response.data.data;
          dataPoints.value = [data["<5"], data[">=5 và <8"], data[">=8"]];
          console.log(dataPoints.value[2]);

          const ctx = document.getElementById("myChart");
          const myChart = new Chart(ctx, {
            type: "doughnut",
            data: {
              labels: [
                "<5 Buổi>",
                "= 4 Buổi",
                "= 3 buổi",
                "= 2 buổi",
                "<= buổi",
              ],
              datasets: [
                {
                  data: [10, 19, 1, 1, 1],
                  borderWidth: 1,
                },
              ],
            },
          });

          const ctx1 = document.getElementById("myChart1");
          new Chart(ctx1, {
            type: "doughnut",
            data: {
              labels: ["Điểm <5", "Điểm >=5 và <8", "Điểm >=8"],
              datasets: [
                {
                  data: [
                    dataPoints.value[0],
                    dataPoints.value[1],
                    dataPoints.value[2],
                  ],
                  borderWidth: 1,
                },
              ],
            },
          });
        })
        .catch((error) => {
          console.log("Lỗi: ", error);
        });

      axios.get("/so-luong-sinh-vien").then((response) => {
        //  bđ cột
        const data = response.data;
        const labels = data.map((item) => item.ma_khoa);
        const values = data.map((item) => item.so_luong_sinh_vien);
        console.log(response.data);
        const ctx2 = document.getElementById("myChart2");
        new Chart(ctx2, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                borderWidth: 1,
              },
            ],
          },
        });
      });
    });

    store.onSelectedKeys(["home"]);
    return {};
  },
});
</script>
