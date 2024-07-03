<template>
  <div class="row">
    <div class="col-sm-6 d-flex justify-content-sm-start">
      <span>Danh sách sinh viên</span>
    </div>
    <div class="col-sm-6 d-flex justify-content-sm-end">
      <a-button type="primary">Thêm mới</a-button>
    </div>
  </div>

  <div class="row">
    <!-- Lớp -->
    <div class="col-sm-5">
      <a-select
        v-model:value="valueDepartment"
        show-search
        placeholder="Chọn khoa"
        style="width: 100%"
        :options="departmentList"
        :filter-option="filterOption"
        @change="handleChangeDepartment"
      ></a-select>
    </div>
    <div class="col-sm-4">
      <a-select
        v-model:value="selectedClasses"
        mode="multiple"
        style="width: 100%"
        placeholder="Chọn Lớp"
        :options="classList"
        @change="handleChangeClass"
      ></a-select>
    </div>

    <div class="col-sm-3">
      <a-button type="primary" @click="search()">
        <i class="fa-solid fa-magnifying-glass" style="margin-right: 4px"></i
        >Tìm Kiếm</a-button
      >
    </div>
  </div>
  <br />

  <div class="row">
    <div class="col-sm-12 d-flex">
      <div class="col-sm-8 d-sm-flex m-1">
        <div class="col-sm-5">
          <a-input-search
            v-model:value="nameFilter"
            placeholder="Nhập họ và tên"
            allow-clear
            enter-button
            @search="searchName"
          />
        </div>
        <div class="col-sm-5">
          <a-input-search
            class=""
            v-model:value="idFilter"
            placeholder="Nhập MSSV "
            allow-clear
            enter-button
            @search="searchID"
          />
        </div>
      </div>
      <!-- import-export -->
      <div class="col-sm-4 m-1">
        <a-button type="primary" style="margin-left: 8px" @click="importData()">
          <i class="fa-solid fa-upload"></i><label> import</label></a-button
        >
        <a-button
          type="primary"
          danger
          style="margin-left: 8px"
          @click="exportData()"
        >
          <i class="fa-solid fa-download"></i><lable> Export</lable></a-button
        >
      </div>
    </div>
    <div class="col-sm-12 d-flex justify-content-end">
      <div class="col-sm-8"></div>
      <div class="col-sm-4">
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx, .xls"
          style="display: none"
          @change="handleFileChange"
        />
      </div>
    </div>
  </div>
  <br />
  <div class="row">
    <div class="col-sm-12">
      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1500, y: 1500 }"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'operation'">
            <a>action</a>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useMenuUsers } from "../../../stores/use-menu-users.js";
import axios from "../../../axios.js";
import { message } from "ant-design-vue";
import { max } from "date-fns";

export default defineComponent({
  setup() {
    const menuUsersStore = useMenuUsers();
    const departmentList = ref([]);
    const classList = ref([]);
    const selectedClasses = ref([]);
    const valueDepartment = ref(undefined);
    const data = ref([]);
    const nameFilter = ref("");
    const idFilter = ref("");
    // khoa
    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const handleChangeDepartment = (value) => {
      selectedClasses.value = [];
      console.log(`selected ${value}`);
      axios
        .get(`/get-department-class/${value}`)
        .then((response) => {
          classList.value = response.data.classFilter.map((classItem) => ({
            label: classItem.ten_lop,
            value: classItem.ma_lop,
          }));
          console.log(classList.value);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // Tìm kiếm
    const search = () => {
      if (!valueDepartment.value || selectedClasses.value.length === 0) {
        message.warn("Vui lòng chọn thông tin");
      } else {
        axios
          .post("get-list-student", {
            selectedClasses: selectedClasses.value,
            nameFilter: nameFilter.value,
            idFilter: idFilter.value,
          })
          .then((response) => {
            data.value = response.data;
            console.log("Danh sách sinh viên:", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        console.log("Selected Department:", valueDepartment.value);
        console.log("Selected Classes:", selectedClasses.value);
      }
    };

    // Nhập file
    const importData = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".xlsx, .xls";
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);

        axios
          .post("/import-data", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            message.success("Import thành công");
            // Thực hiện các thao tác tiếp theo sau khi import thành công
          })
          .catch((error) => {
            console.error("Lỗi khi import dữ liệu:", error);
            message.error("Lỗi khi import dữ liệu");
          });
      };

      fileInput.click();
    };

    //Xuất file Excel
    const exportData = () => {
      axios
        .post(
          "/export-data-students",
          { data: data.value },
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
    // table
    const columns = [
      { title: "STT", dataIndex: "key", key: "key", width: 50, fixed: "left" },
      {
        title: "Mã SV",
        dataIndex: "ma_sv",
        key: "ma_sv",
        width: 50,
        fixed: "left",
      },
      { title: "Tên SV", dataIndex: "ten_sv", key: "ten_sv", width: 80 },
      {
        title: "Ngày sinh",
        dataIndex: "ngay_sinh",
        key: "ngay_sinh",
        width: 50,
      },
      { title: "Tên lớp", dataIndex: "ten_lop", key: "ten_lop", width: 50 },
      { title: "Tên khoa", dataIndex: "ten_khoa", key: "ten_khoa", width: 150 },
    ];

    //Tìm kiếm theo tên
    const searchName = () => {
      if (data.value.length === 0) {
        message.warn("Không tồn tại danh sách sinh viên");
        return;
      }
      if (!nameFilter.value) {
        message.warn("Vui lòng nhập thông tin");
      }
      idFilter.value = "";
      search();
    };
    // Tim kiem theo ma_sv
    const searchID = () => {
      if (data.value.length === 0) {
        message.warn("Không tồn tại danh sách sinh viên");
        return;
      }
      if (!idFilter.value) {
        message.warn("Vui lòng nhập thông tin");
      }
      nameFilter.value = "";
      search();
    };

    //lop
    const handleChangeClass = (value) => {
      console.log(`selected ${value}`);
    };

    onMounted(() => {
      menuUsersStore.onSelectedKeys(["student"]);
      // lay danh sách khoa, lop
      axios
        .get("/get-department-class")
        .then((response) => {
          if (response.status === 200) {
            departmentList.value = response.data.departmentList.map(
              (department) => ({
                label: department.ten_khoa,
                value: department.ma_khoa,
              })
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
    return {
      handleChangeDepartment,
      handleChangeClass,
      departmentList,
      classList,
      valueDepartment,
      filterOption,
      selectedClasses,
      search,
      data,
      columns,
      searchName,
      searchID,
      nameFilter,
      idFilter,
      exportData,
      importData,
    };
  },
});
</script>
