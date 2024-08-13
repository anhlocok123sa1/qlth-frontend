<template>
  <router-link
    :to="{
      name: 'admin-tracuuthongtin',
    }"
  >
    <span class="item-link">
      <a-button style="margin-left: 2px"
        ><i class="fa-solid fa-backward"></i
      ></a-button>
    </span>
  </router-link>
  <a-card
    title="Thông tin cá nhân sinh viên"
    style="width: 100%; background-color: gainsboro"
  >
    <div class="row">
      <!-- ảnh đại diện -->
      <div class="col-12 col-sm-4">
        <div class="row">
          <div class="col-12 d-flex justify-content-center mb-3">
            <a-avatar shape="square" :size="200">
              <template #icon>
                <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
                <img
                  v-else
                  src="../../../assets/users.png"
                  alt="Default Avatar"
                />
              </template>
            </a-avatar>
          </div>
        </div>
      </div>
      <!-- Thông tin cá nhân -->
      <div class="col-12 col-sm-8">
        <!-- Mã giáo viên -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Mã sinh viên</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input :value="student.ma_sv" :readonly="true"></a-input>
          </div>
        </div>

        <!-- Họ và tên -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Họ và tên</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input :value="student.ten_sv" :readonly="true"></a-input>
          </div>
        </div>

        <!-- Ngày sinh -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Ngày sinh</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input
              placeholder="Ngày sinh"
              allow-clear
              v-model:value="student.ngay_sinh"
              :readonly="true"
            />
          </div>
        </div>

        <!-- Giới tính -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Giới tính</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input :value="student.phai" :readonly="true"></a-input>
          </div>
        </div>

        <!-- Địa chỉ -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Địa chỉ</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input
              placeholder="Địa chỉ"
              allow-clear
              v-model:value="student.dia_chi"
              :readonly="true"
            />
          </div>
        </div>

        <!-- SDT -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Số điện thoại</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input
              placeholder="Địa chỉ"
              allow-clear
              v-model:value="student.sdt"
              :readonly="true"
            />
          </div>
        </div>
        <!-- Email -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Email</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input
              placeholder="Địa chỉ"
              allow-clear
              v-model:value="student.email"
              :readonly="true"
            />
          </div>
        </div>

        <!-- Tên giáo viên chủ nhiệm -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Cố vấn học tập</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input
              placeholder="Chưa cập nhật"
              allow-clear
              v-model:value="student.gvcn"
              :readonly="true"
            />
          </div>
        </div>
        <!-- Số điện thoai gvcn -->
        <div class="row mb-3">
          <div class="col-12 col-sm-3 text-start text-sm-end">
            <label>
              <strong>Cố vấn học tập</strong>
            </label>
          </div>
          <div class="col-12 col-sm-5">
            <a-input
              placeholder="Chưa cập nhật"
              allow-clear
              v-model:value="student.sdt_gvcn"
              :readonly="true"
            />
          </div>
        </div>
      </div>
    </div>
  </a-card>
  <a-table :data-source="teachingSchedules" student>
    <a-table-column key="stt" title="Tên môn học" data-index="ten_mh" />
    <a-table-column key="stt" title="Giáo viên giảng dạy" data-index="ten_gv" />
    <a-table-column key="action" title="">
      <template #default="{ record }">
        <span>
          <!-- edit -->
          <a-button style="background-color: gainsboro" @click="view(record)"
            >Kết quả điểm danh</a-button
          >
          <br />
          <!-- delete -->
        </span>
      </template>
    </a-table-column>
  </a-table>

  <a-modal v-model:open="modalVisible" title="KẾT QUẢ ĐIỂM DANH" @ok="handleOk">
    <a-table :dataSource="attendance" :columns="columnsAttendance" size="small">
      <a-table-column title="STT" dataIndex="stt"></a-table-column>
    </a-table>
  </a-modal>
</template>

<script>
import { onMounted, defineComponent, ref, computed, watch } from "vue";
import { useMenu, useUser } from "../../../stores/use-menu";
import axios from "../../../axios";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
import constants from "../../../constants";

export default defineComponent({
  setup() {
    const store = useMenu();
    const student = ref({});
    const teachingSchedules = ref([]);
    const userStore = useUser();
    const magv = computed(() => userStore.getma);
    const avatarUrl = ref("");
    const route = useRoute();
    const attendance = ref([]);
    const modalVisible = ref(false);

    const view = (record) => {
      modalVisible.value = true;

      axios
        .get(`ket-qua-diem-danh/${record.ma_gd}/${student.value.ma_sv}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            console.log(response.data);
            attendance.value = response.data.map((item, index) => ({
              ...item,
              ten_mh: record.ten_mh,
              ma_sv: item.diem_danh.ma_sv,
              diem_danh1: item.diem_danh.diem_danh1,
              diem_danh2:
                item.diem_danh.diem_danh2 !== "0000-00-00 00:00:00"
                  ? item.diem_danh.diem_danh2
                  : "",
            }));
          } else {
            attendance.value = [];
          }
        })
        .catch((error) => {
          console.error("Lỗi không gọi được api", error);
        });
    };
    axios
      .get(`/get-information-student/${route.params.ma_sv}`)
      .then((response) => {
        student.value = response.data.student;
        teachingSchedules.value = response.data.teachingSchedules;
        if (student.value.avatar) {
          avatarUrl.value = `${constants.BASE_AVATAR_URL}${student.value.avatar}`;
          // avatarUrl.value = `http://127.0.0.1:8000/storage/${student.value.avatar}`;

          // avatarUrl.value = `http://127.0.0.1:8000/storage/app/public/${student.value.avatar}`;
          console.log(avatarUrl.value);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    const handleOk = () => {
      modalVisible.value = false;
    };
    const columnsAttendance = [
      { title: "MSSV", dataIndex: "ma_sv", key: "ma_sv" },
      { title: "Tên môn học", dataIndex: "ten_mh", key: "ten_mh" },
      { title: "Điểm danh lần 1", dataIndex: "diem_danh1", key: "diem_danh1" },
      { title: "Điểm danh lần 2", dataIndex: "diem_danh2", key: "diem_danh2" },
    ];
    store.onSelectedKeys(["admin-tracuuthongtin"]);
    return {
      student,
      teachingSchedules,
      avatarUrl,
      view,
      attendance,
      columnsAttendance,
      modalVisible,
      handleOk,
    };
  },
});
</script>
<style>
a {
  text-decoration: none;
}
</style>
