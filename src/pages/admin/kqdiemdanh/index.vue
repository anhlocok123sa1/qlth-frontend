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
  <a-modal
    v-model:open="modalVisible"
    title="KẾT QUẢ ĐIỂM DANH"
    @ok="handleOk"
    width="800px"
  >
    <a-table :dataSource="attendance" :columns="columnsAttendance">
      <a-table-column title="STT" dataIndex="stt"></a-table-column>
      <template
        #customFilterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><SearchOutlined /></template>
            Search
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="handleReset(clearFilters)"
          >
            Reset
          </a-button>
        </div>
      </template>
      <template #customFilterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #bodyCell="{ text, column }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
            >
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup>
import axios from "../../../axios";
import { onMounted, reactive, ref } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";

const state = reactive({
  searchText: "",
  searchedColumn: "",
});
const searchInput = ref();
const columns = [
  { title: "Tên môn học", dataIndex: "ten_mh", key: "ten_mh" },
  { title: "Học kỳ", dataIndex: "hoc_ky", key: "hoc_ky" },
  { title: "Nhóm", dataIndex: "nmh", key: "nmh" },
  {
    title: "Kết quả điểm danh",
    key: "actions",
  },
];
const columnsAttendance = [
  //   {
  //     title: "STT",
  //     key: "index",
  //   //   render: (text, record, index) => index + 1,
  //   },
  {
    title: "MSSV",
    dataIndex: "ma_sv",
    key: "ma_sv",
    customFilterDropdown: true,
    onFilter: (value, record) =>
      record.ma_sv.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  { title: "Họ và tên", dataIndex: "ten_sv", key: "ten_sv" },
  { title: "Số buổi học", dataIndex: "sbh", key: "sbh" },
  { title: "Số buổi điểm danh", dataIndex: "sbdd", key: "sbdd" },
  { title: "Số buổi vắng", dataIndex: "sbv", key: "sbv" },
];
const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
};
const handleReset = (clearFilters) => {
  clearFilters({
    confirm: true,
  });
  state.searchText = "";
};
const subject = ref([]);
const attendance = ref([]);
const modalVisible = ref(false);
const token = localStorage.getItem("token");
onMounted(() => {
  fetchSubject();
});
const fetchSubject = async () => {
  try {
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.get("tkbGiaoVien", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    subject.value = response.data;
  } catch (error) {
    console.log(error);
  }
};
const showModal = async (record) => {
  try {
    const ma_gd = record.ma_gd;

    const response = await axios.get(`getDanhSachDiemDanh/${ma_gd}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    attendance.value = response.data;
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  modalVisible.value = true;
};
const handleOk = (e) => {
  modalVisible.value = false;
};
</script>

<style>
</style>