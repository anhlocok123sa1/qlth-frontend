<template>
  <a-card title="Danh sách sinh viên">
    <div class="row">
      <!-- Lớp -->
      <div class="col-sm-5 mb-2">
        <a-select
          v-model:value="valueDepartment"
          show-search
          placeholder="Chọn khoa"
          style="width: 100%"
          :options="departmentList"
          :filter-option="filterOption"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChangeDepartment"
          allow-clear
        ></a-select>
      </div>
      <div class="col-sm-4 mb-2">
        <a-select
          v-model:value="selectedClasses"
          mode="multiple"
          style="width: 100%"
          placeholder="Chọn Lớp"
          :options="classList"
        ></a-select>
      </div>

      <div class="col-sm-3">
        <a-button
          type="primary"
          @click="search()"
          style="margin-right: 4px; background-color: cadetblue"
        >
          <i class="fa-solid fa-magnifying-glass" style="margin-right: 4px"></i
          >Tìm Kiếm</a-button
        >
        <a-button
          style="background-color: crimson"
          type="primary"
          @click="addStudent"
          class="mt-1"
        >
          <i class="fa-solid fa-circle-plus" style="margin-right: 4px"></i>Thêm
          sinh viên</a-button
        >
      </div>
    </div>
    <br />

    <div class="row">
      <div class="col-sm-12 d-flex">
        <div class="col-sm-8 d-sm-flex m-1">
          <div class="col-sm-7 me-2 mb-2">
            <a-input-search
              v-model:value="nameFilter"
              placeholder="Nhập tên hoặc mã sinh viên"
              allow-clear
              enter-button
              @search="search"
            />
          </div>
        </div>
        <!-- import-export -->
        <div class="col-sm-4 m-1">
          <a-button
            type="primary"
            style="margin-left: 8px"
            @click="showModal"
            class="mb-2"
          >
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
          v-if="data.length > 0"
          :columns="columns"
          :data-source="data"
          :scroll="{ x: 1000 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <router-link
                :to="{
                  name: 'student/see-details-student',
                  params: {
                    ma_sv: record.ma_sv,
                  },
                }"
              >
                <a-button style="background-color: lavender">Tra cứu</a-button>
              </router-link>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-card>

  <!-- modal import sinh vien -->
  <a-modal
    v-model:open="open"
    width="1000px"
    title="Import Data"
    @ok="handleOk"
  >
    <a-spin
      style="margin-left: 10px; display: flex; justify-content: center"
      tip="Quá trình import đang diễn ra vui lòng chờ"
      v-if="loading"
      size="large"
    />
    <div
      class="div"
      style="display: flex; justify-content: center; align-items: center"
    ></div>
    <div class="div">
      <b>1. Đảm bảo File excel có định dạng như bên dưới</b>

      <img src="../../../assets/hdsd.png" alt="" width="100%" />
      <br />
      <br />
      <b>3. Một số lưu ý: </b>
      <ul>
        <li>Các cột không được để trống</li>
        <li>ma_sv: không được trùng</li>
        <li>sdt: không được trùng</li>
        <li>email: không được trùng</li>
        <li>ma_lop: ma_lop đã tồn tại</li>
      </ul>
      <br />
      <b>2. Chỉ hỗ trợ file .xlsx</b>
      <br />
      <br />
      <b>3. Tải xuống file mẫu: </b
      ><a href="/import-students.xlsx" download>excel</a>
      <br />
      <br />
      <b>4. Vui lòng kiểm tra dữ liệu trước khi upload</b>
      <a-button
        type="primary"
        style="margin-left: 8px"
        @click="importData"
        class="mb-2"
      >
        <i class="fa-solid fa-upload"></i><label> import</label></a-button
      >

      <!-- Hiển thị thông báo khi thành công hoặc thất bại -->
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import axios from "../../../axios.js";
import { message, notification } from "ant-design-vue";
import { format, max } from "date-fns";
import { useMenu } from "../../../stores/use-menu.js";
import { useRouter } from "vue-router";
const open = ref(false);
const showModal = () => {
  open.value = true;
};
export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["student"]);
    const departmentList = ref([]);
    const classList = ref([]);
    const selectedClasses = ref([]);
    const valueDepartment = ref(undefined);
    const data = ref("");
    const nameFilter = ref("");
    const loading = ref(false);
    const router = useRouter();

    // Thêm sinh viên

    const addStudent = () => {
      router.push({ name: "student-create" });
    };
    //end

    // khoa
    const filterOption = (inputValue, option) => {
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    };

    const handleChangeDepartment = (value) => {
      selectedClasses.value = [];

      axios
        .get(`/get-department-class/${value}`)
        .then((response) => {
          classList.value = response.data.classFilter.map((classItem) => ({
            label: classItem.ten_lop,
            value: classItem.ma_lop,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // Tìm kiếm
    const search = () => {
      axios
        .post("get-list-student", {
          department: valueDepartment.value,
          selectedClasses: selectedClasses.value,
          nameFilter: nameFilter.value,
        })
        .then((response) => {
          data.value = response.data.map((student, index) => ({
            ...student,
            stt: index + 1,
          }));

          // Lưu điều kiện tìm kiếm và dữ liệu vào sessionStorage
          // sessionStorage.setItem(
          //   "searchData",
          //   JSON.stringify({
          //     department: valueDepartment.value,
          //     selectedClasses: selectedClasses.value,
          //     nameFilter: nameFilter.value,
          //     data: data.value,
          //   })
          // );
        })
        .catch((error) => {
          console.log(error);
          message.warn(error.response.data.message);
        });
    };
    const handleOk = () => {
      open.value = false;
    };

    // Nhập file
    const importData = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".xlsx, .xls, .csv";
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!file) {
          // Nếu không có file được chọn, dừng lại
          return;
        }

        loading.value = true; // Bật Spin khi người dùng chọn file
        const formData = new FormData();
        formData.append("file", file);
        axios
          .post("/import-data", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            message.success(response.data.message);
          })
          .catch((error) => {
            console.error("Lỗi khi import dữ liệu:", error);
            message.error(error.response.data.message);
          })
          .finally(() => {
            loading.value = false; // Tắt spin sau khi tải xong
          });
      };

      fileInput.click();
    };

    //Xuất file Excel
    const exportData = () => {
      if (data.value.length == 0) {
        message.warn("Không có dữ liệu");
        return;
      }
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
          link.setAttribute("download", "Danh-sach-sinh-vien.xlsx");
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
      { title: "STT", dataIndex: "stt", key: "stt", width: 50, fixed: "left" },
      {
        title: "Mã SV",
        dataIndex: "ma_sv",
        key: "ma_sv",
        width: 70,
        // fixed: "left",
      },
      { title: "Tên SV", dataIndex: "ten_sv", key: "ten_sv", width: 100 },
      {
        title: "Ngày sinh",
        dataIndex: "ngay_sinh",
        key: "ngay_sinh",
        width: 60,
      },
      { title: "Giới tinh", dataIndex: "phai", key: "phai", width: 50 },
      { title: "Tên lớp", dataIndex: "ten_lop", key: "ten_lop", width: 60 },
      { title: "Tên khoa", dataIndex: "ten_khoa", key: "ten_khoa", width: 150 },
      { title: "", dataIndex: "action", key: "action", width: 50 },
    ];

    //Lop
    onMounted(() => {
      // const savedSearchData = sessionStorage.getItem("searchData");
      // if (savedSearchData) {
      //   const {
      //     department,
      //     selectedClasses: savedClasses,
      //     nameFilter: savedNameFilter,
      //     data: savedData,
      //   } = JSON.parse(savedSearchData);
      //   valueDepartment.value = department;
      //   selectedClasses.value = savedClasses;
      //   nameFilter.value = savedNameFilter;
      //   data.value = savedData;
      // }

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
    const test = (ma_sv) => {
      console.log(ma_sv);
    };
    return {
      handleChangeDepartment,
      departmentList,
      classList,
      valueDepartment,
      filterOption,
      selectedClasses,
      search,
      data,
      columns,
      nameFilter,
      exportData,
      importData,
      addStudent,
      showModal,
      open,
      handleOk,
      test,
      loading,
    };
  },
});
</script>
<style>
/* CSS for the search button */
.ant-input-search-button {
  background-color: darkcyan;
}
</style>
