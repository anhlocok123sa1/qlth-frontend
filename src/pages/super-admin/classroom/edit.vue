<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12"><h2>Sửa đổi thông tin lớp</h2></div>
    </div>

    <div v-if="successMessage" class="row">
      <a-alert :message="`${successMessage}`" type="success" show-icon />
    </div>
    <div v-if="errorMessage" class="row">
      <a-alert :message="`${errorMessage}`" type="error" show-icon />
    </div>
    <!-- mã lớp -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Mã lớp</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input disabled v-model:value="ma_lop" placeholder="Nhập mã lớp" />
      </div>
    </div>
    <!-- 'Tên lớp' -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Tên lớp</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ten_lop" placeholder="Nhập tên lớp" />
        <small v-if="errors.ten_lop" class="text-danger">{{
          errors.ten_lop[0]
        }}</small>
      </div>
    </div>
    <!-- 'Tên khoa' -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Tên khoa</span><span>*</span></div>
      <div class="col-sm-12">
        <a-select
          disabled
          v-model:value="valueClassroom"
          show-search
          placeholder="Chọn khoa"
          style="width: 100%"
          :options="departmentList"
          :filter-option="filterOption"
          @change="handleChangeDepartment"
        ></a-select>
      </div>
    </div>

    <!-- Tên giáo viên chủ nhiệm -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Tên giáo viên chủ nhiệm</span></div>
      <div class="col-sm-12">
        <a-select
          v-model:value="nameTecher"
          show-search
          placeholder="Có thể để trống"
          style="width: 100%"
          :options="options"
          :filter-option="filterOption"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          allow-clear
        ></a-select>
      </div>
    </div>
    <!-- Số điện thoại giáo viên chủ nhiệm -->
    <div class="row mt-3">
      <div class="col-sm-12">
        <span>Số điện thoại giáo viên chủ nhiệm</span>
      </div>
      <div class="col-sm-12">
        <a-input v-model:value="sdt_gvcn" placeholder="Có thể để trống" />
        <small v-if="errors.sdt_gvcn" class="text-danger">{{
          errors.sdt_gvcn[0]
        }}</small>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-3">
        <a-button type="primary" style="margin-right: 3px" @click="save"
          >Lưu thông tin</a-button
        >
        <a-button type="primary" danger @click="backDepartment"
          >Hủy bỏ</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMenu } from "../../../stores/use-menu.js";
import axios from "../../../axios.js";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const store = useMenu();
    const route = useRoute();
    const router = useRouter();
    const changeKeyDepartment = ref("");
    const changeNameDepartment = ref("");
    const errors = ref("");
    const departmentList = ref([]);
    const options = ref([]);
    const valueClassroom = ref(undefined);
    const sdt_gvcn = ref(null);
    const nameTecher = ref(undefined);

    const department = reactive({
      ma_lop: "",
      ten_lop: "",
    });
    const successMessage = ref("");
    const errorMessage = ref("");

    // lưu dữ liệu
    const save = () => {
      // if (
      //   department.ma_lop == changeKeyDepartment.value &&
      //   department.ten_lop == changeNameDepartment.value
      // ) {
      //   message.warn("Vui lòng thay đổi dữ liệu cần cập nhật");
      //   return;
      // }
      axios
        .put(`list-classroom/save/${department.ma_lop}`, {
          ten_lop: department.ten_lop,
          gvcn: nameTecher.value,
          sdt_gvcn: sdt_gvcn.value,
        })
        .then((response) => {
          if (response.data.message) {
            successMessage.value = response.data.message;
            errorMessage.value = "";
            changeKeyDepartment.value = department.ma_lop;
            changeNameDepartment.value = department.ten_lop;
            setTimeout(() => {
              successMessage.value = "";
              location.reload();
            }, 3000);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            errors.value = error.response.data.errors;
          }
          successMessage.value = "";
          changeKeyDepartment.value = department.ma_lop;
          changeNameDepartment.value = department.ten_lop;
          setTimeout(() => {
            errorMessage.value = "";
          }, 1000);
        });
    };
    const backDepartment = () => {
      router.push({ name: `classroom` });
    };

    // lấy thông tin classrooom
    const getDepartment = () => {
      axios
        .get(`/list-classroom/${route.params.ma_lop}`)
        .then((response) => {
          department.ma_lop = response.data.ma_lop;
          department.ten_lop = response.data.ten_lop;
          changeKeyDepartment.value = response.data.ma_lop;
          changeNameDepartment.value = response.data.ten_lop;
          valueClassroom.value = response.data.ma_khoa;
          sdt_gvcn.value = response.data.sdt_gvcn;
          nameTecher.value = response.data.gvcn;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    onMounted(() => {
      // lay danh sách khoa, lop
      axios
        .get("/get-department-class")
        .then((response) => {
          if (response.status === 200) {
            departmentList.value = response.data.departmentList.map(
              (classroom) => ({
                label: classroom.ten_khoa,
                value: classroom.ma_khoa,
              })
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      // lay danh sach ten giáo viên
      axios
        .get("/get-list-name-teachers")
        .then((response) => {
          options.value = response.data.map((techer) => ({
            label: techer.ten_gv,
            value: techer.ten_gv,
          }));
          console.log(options.value);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    getDepartment();
    store.onSelectedKeys(["classroom"]);

    return {
      ...toRefs(department),
      save,
      successMessage,
      errorMessage,
      backDepartment,
      changeKeyDepartment,
      changeNameDepartment,
      errors,
      departmentList,
      options,
      valueClassroom,
      sdt_gvcn,
      nameTecher,
    };
  },
});
</script>
