<template>
  <a-card title="Xem điểm">
    <div class="view-score">
      <a-table :columns="columns" size="small" :dataSource="dataDiem">
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { onMounted, ref } from "vue";
import axios from "../../../axios";
import { useMenuUsers } from "../../../stores/use-menu-users";

export default {
  setup() {
    const store = useMenuUsers();
    store.onSelectedKeys(["users-view-score"]);

    const columns = [
      { title: "STT", dataIndex: "index", key: "index", width: 50 },
      { title: "Mã môn", dataIndex: "ma_mh", key: "ma_mh", width: 90 },
      { title: "Tên môn", dataIndex: "ten_mh", key: "ten_mh", width: 150 },
      { title: "Quá trình", dataIndex: "diem_qt", key: "diem_qt", width: 80 },
      { title: "Giữa kỳ", dataIndex: "diem_thi1", key: "diem_thi1", width: 80 },
      {
        title: "Điểm thi",
        dataIndex: "diem_thi2",
        key: "diem_thi2",
        width: 80,
      },
      { title: "Điểm TK", dataIndex: "diem_tb", key: "diem_tb", width: 80 },
      { title: "Kết quả", dataIndex: "ket_qua", key: "ket_qua", width: 100 },
    ];

    const dataDiem = ref([]);

    const getDiem = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/getDiem", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dataDiem.value = response.data;
        console.log(dataDiem.value);
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(() => {
      getDiem();
    });

    return {
      columns,
      dataDiem,
    };
  },
};
</script>

<style>
.view-score {
  overflow: hidden;
  overflow-x: auto;
}
</style>
