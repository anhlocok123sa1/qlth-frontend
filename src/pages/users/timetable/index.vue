<template>
  <a-card title="THỜI KHÓA BIỂU" style="width: 100%">
    <div class="col-12">
      <a-table
        :columns="columns"
        :data-source="timetalbe"
        v-if="timetalbe.length > 0"
        :scroll="{ x: 1000 }"
      ></a-table>
      <a-spin v-else />
    </div>
  </a-card>
</template>
<script>
import { useMenuUsers } from "../../../stores/use-menu-users.js";
import { ref, onMounted } from "vue";
import axios from "../../../axios.js";

export default {
  setup() {
    const timetalbe = ref([]);
    const token = localStorage.getItem("token");
    const apiUrl = "thoi-khoa-bieu";
    const menuUsersStore = useMenuUsers();

    onMounted(() => {
      menuUsersStore.onSelectedKeys(["users-timetable"]);
      fetchTimetable();
    });

    const fetchTimetable = () => {
      axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          timetalbe.value = response.data.map((item) => ({
            ...item,
            ten_mh: item.mon_hoc.ten_mh,
            ten_gv: item.giao_vien.ten_gv,
          }));
        })
        .catch((error) => {
          console.error("Lỗi không tìm thấy thời khóa biểu:", error);
        });
    };

    const columns = [
      { title: "Mã môn học", dataIndex: "ma_mh", key: "ma_mh", fixed: "left" },
      {
        title: "Tên môn học",
        dataIndex: "ten_mh",
        key: "ten_mh",
      },
      { title: "Phòng học", dataIndex: "phong_hoc", key: "phong_hoc" },
      { title: "Số tiết bắt đầu", dataIndex: "st_bd", key: "st_bd" },
      { title: "Số tiết kết thúc", dataIndex: "st_kt", key: "st_kt" },
      { title: "Tên giáo viên", dataIndex: "ten_gv", key: "ten_gv" },
      { title: "NGày bắt đầu", dataIndex: "ngay_bd", key: "ngay_bd" },
      { title: "NGày bắt đầu", dataIndex: "ngay_kt", key: "ngay_kt" },
    ];
    // console.log(timetalbe);
    return {
      timetalbe,
      columns,
    };
  },
};
</script>
