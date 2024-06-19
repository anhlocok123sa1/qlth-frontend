<template>
  <a-card title="Thông tin cá nhân" style="width: max-content">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end"></div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table :dataSource="users" :columns="columns" :pagination="false" />
      </div>
    </div>
  </a-card>
</template>
<script>
import { useMenuUsers } from "../../../stores/use-menu-users.js";
import { onMounted } from "vue";
import axios from "axios";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    // Lấy store từ useMenuUsers

    const menuUsersStore = useMenuUsers();
    onMounted(() => {
      menuUsersStore.onSelectedKeys(["users-information"]);
    });

    const users = ref([]);
    const columns = [
      {
        title: "Mã Sinh Viên",
        dataIndex: "ma_sv",
        key: "ma_sv",
      },
      {
        title: "Tên Sinh Viên",
        dataIndex: "ten_sv",
        key: "ten_sv",
      },
      {
        title: "Ngày Sinh",
        dataIndex: "ngay_sinh",
        key: "ngay_sinh",
      },
      {
        title: "Số điện thoại",
        dataIndex: "sdt",
        key: "sdt",
      },
      {
        title: "email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Mã Lớp",
        dataIndex: "ma_lop",
        key: "ma_lop",
      },
      {
        title: "Phái",
        dataIndex: "phai",
        key: "phai",
        // Thêm cột hiển thị 'phai'
      },
    ];

    onMounted(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/thong-tin-ca-nhan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        users.value = [response.data];
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    });
    return { users, columns };
  },
});
</script>
