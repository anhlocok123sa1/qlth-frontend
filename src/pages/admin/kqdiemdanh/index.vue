<template>
  <a-card title="KẾT QUẢ ĐIỂM DANH" style="width: 100%">
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
    <a-button key="test" @click="handleTest()">Xuất Excel</a-button>
  </a-card>
  <a-modal
    v-model:open="modalVisible"
    title="KẾT QUẢ ĐIỂM DANH"
    @ok="handleOk"
    width="800px"
  >
    <a-table
      :dataSource="attendance"
      :columns="columnsAttendance"
      :scroll="{ x: 500 }"
    >
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
    <a-button key="pdf" @click="handlePDF()">Xuất PDF</a-button>
  </a-modal>
</template>

<script setup>
import axios from "../../../axios";
import { onMounted, reactive, ref } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { useMenu } from "../../../stores/use-menu";

const store = useMenu();
store.onSelectedKeys(["admin-kqdiemdanh"]);
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
  { title: "Tên lớp", dataIndex: "ma_lop", key: "ma_lop" },
  { title: "Số buổi học", dataIndex: "sbh", key: "sbh", width: "10%" },
  { title: "Số buổi điểm danh", dataIndex: "sbdd", key: "sbdd", width: "10%" },
  { title: "Số buổi vắng", dataIndex: "sbv", key: "sbv", width: "10%" },
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
const maGD = ref("");
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
    maGD.value = record.ma_gd;

    const response = await axios.get(`getDanhSachDiemDanh/${ma_gd}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    attendance.value = response.data;
  } catch (error) {
    console.log(error);
  }

  modalVisible.value = true;
};
const handleOk = (e) => {
  modalVisible.value = false;
};
const handlePDF = async () => {
  try {
    const response = await axios.get(`exportDiemDanh/${maGD.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "danh_sach_diem_danh.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
  }
};
const handleTest = () => {
      axios
        .get(
          "/testExport",
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "students.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error exporting data:", error);
          message.error("Failed to export data.");
        });
    };
</script>

<style></style>
