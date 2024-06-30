<template>
  <a-card title="KÊT QUẢ ĐIỂM DANH" style="width: 100%">
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="subject" :columns="columns">
          <template #bodyCell="{ column, record }">
            <!-- <template v-if="column.key === 'index'"> </template> -->

            <template v-if="column.key === 'actions'">
              <a-button
                @click="showModal(record)"
                type="primary"
                class="me-sm-2"
                >Xem kết quả</a-button
              >
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-card>
  <a-modal v-model:open="modalVisible" title="KẾT QUẢ ĐIỂM DANH">
    <a-table :dataSource="attendance" :columns="columnsAttendance">
      <a-table-column title="STT" dataIndex="stt"></a-table-column>
    </a-table>
  </a-modal>
</template>

<script>
import { useMenuUsers } from "../../../stores/use-menu-users.js";
import { onMounted, ref } from "vue";
import axios from "../../../axios.js";
export default {
  setup() {
    const modalVisible = ref(false);
    const subject = ref([]);
    const attendance = ref([]);
    const token = localStorage.getItem("token");
    const apiSubject = "thoi-khoa-bieu";
    const ma_sv = localStorage.getItem("ma_sv");

    const showModal = (record) => {
      const ma_gd = record.ma_gd;
      // console.log(ma_gd);

      axios
        .get(`ket-qua-diem-danh/${ma_gd}/${ma_sv}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            attendance.value = response.data.map((item, index) => ({
              ...item,
              ten_mh: record.ten_mh,
              ma_sv: item.diem_danh.ma_sv,
              diem_danh1: item.diem_danh.diem_danh1,
              diem_danh2:
                item.diem_danh.diem_danh2 !== "0000-00-00 00:00:00"
                  ? item.diem_danh.diem_danh2
                  : "",
              // stt: index + 1, // Tự động tính STT từ 1
            }));
          } else {
            attendance.value = [];
          }
          // console.log(ma_gd);
          // console.log(localStorage.getItem("ma_sv"));
        })
        .catch((error) => {
          console.error("Lỗi không gọi được api", error);
        });

      modalVisible.value = true;
    };

    const menuUsersStore = useMenuUsers();
    onMounted(() => {
      menuUsersStore.onSelectedKeys(["users-attendance-results"]);
      fetchSubject();
    });

    const fetchSubject = () => {
      axios
        .get(apiSubject, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          subject.value = response.data.map((item) => ({
            ...item,
            ten_mh: item.mon_hoc.ten_mh,
          }));
        })
        .catch((error) => {
          console.error("Lỗi không tìm thấy danh sách môn học", error);
        });
    };

    const columns = [
      { title: "Tên môn học", dataIndex: "ten_mh", key: "ten_mh" },
      { title: "Phòng học", dataIndex: "phong_hoc", key: "phong_hoc" },
      {
        title: "Kết quả điểm danh",
        key: "actions",
      },
    ];

    const columnsAttendance = [
      // {
      //   title: "STT",
      //   key: "index",
      //   render: (text, record, index) => index + 1,
      // },
      { title: "MSSV", dataIndex: "ma_sv", key: "ma_sv" },
      { title: "Tên môn học", dataIndex: "ten_mh", key: "ten_mh" },
      { title: "Điểm danh lần 1", dataIndex: "diem_danh1", key: "diem_danh1" },
      { title: "Điểm danh lần 2", dataIndex: "diem_danh2", key: "diem_danh2" },
    ];
    return {
      subject,
      columns,
      showModal,
      modalVisible,
      columnsAttendance,
      attendance,
    };
  },
};
</script>
//
