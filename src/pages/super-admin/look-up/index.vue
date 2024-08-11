<template>
  <div>
    <a-form @submit.prevent="fetchDiemDanh">
      <a-form-item label="Mã sinh viên">
        <a-input v-model="filters.ma_sv" placeholder="Nhập mã sinh viên" />
      </a-form-item>
      <a-form-item label="Mã môn học">
        <a-input v-model="filters.ma_mh" placeholder="Nhập mã môn học" />
      </a-form-item>
      <a-form-item label="Ngày học">
        <a-date-picker v-model="filters.ngay_hoc" placeholder="Chọn ngày học" />
      </a-form-item>
      <a-form-item label="Học kỳ">
        <a-select v-model="filters.hoc_ky" placeholder="Chọn học kỳ">
          <a-select-option value="123">Học kỳ 1</a-select-option>
          <a-select-option value="223">Học kỳ 2</a-select-option>
          <a-select-option value="323">Học kỳ 3</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">Tìm kiếm</a-button>
      </a-form-item>
    </a-form>

    <a-table :columns="columns" :data-source="dataSource" row-key="ma_dd" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      filters: {
        ma_sv: "",
        ma_mh: "",
        ngay_hoc: null,
        hoc_ky: "",
      },
      dataSource: [],
      columns: [
        { title: "Mã SV", dataIndex: "ma_sv", key: "ma_sv" },
        { title: "Tên SV", dataIndex: ["sinhVien", "ten_sv"], key: "ten_sv" },
        {
          title: "Mã môn học",
          dataIndex: ["tkb", "lichDay", "ma_mh"],
          key: "ma_mh",
        },
        {
          title: "Tên môn học",
          dataIndex: ["tkb", "lichDay", "monHoc", "ten_mh"],
          key: "ten_mh",
        },
        { title: "Ngày học", dataIndex: "ngay_hoc", key: "ngay_hoc" },
        { title: "Trạng thái", dataIndex: "diem_danh1", key: "diem_danh1" },
      ],
    };
  },
  methods: {
    async fetchDiemDanh() {
      try {
        const response = await axios.get("/api/diem-danh", {
          params: this.filters,
        });
        this.dataSource = response.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    },
  },
};
</script>
