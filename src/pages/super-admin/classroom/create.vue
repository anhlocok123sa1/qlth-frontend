<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12"><h2>Thêm Lớp</h2></div>
    </div>

    <div v-if="successMessage" class="row">
      <a-alert :message="`${successMessage}`" type="success" show-icon />
    </div>
    <div v-if="errorMessage" class="row">
      <a-alert :message="`${errorMessage.ma_lop}`" type="error" show-icon />
    </div>
    <!-- mã lop -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Mã Lớp</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ma_lop" placeholder="Nhập mã lop" />
        <small v-if="errors.ma_lop" class="text-danger">{{
          errors.ma_lop[0]
        }}</small>
      </div>
    </div>
    <!-- lop -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Tên Lớp</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ten_lop" placeholder="Nhập tên lop" />
        <small v-if="errors.ten_lop" class="text-danger">{{
          errors.ten_lop[0]
        }}</small>
      </div>
    </div>
    <!-- khoa -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Tên Khoa</span></div>
      <a-select
        v-model:value="valueClassroom"
        show-search
        placeholder="Chọn khoa"
        style="width: 100%"
        :options="departmentList"
        :filter-option="filterOption"
        @change="handleChangeDepartment"
      ></a-select>
    </div>
    <!-- Tên giáo viên chủ nhiệm -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Cố vấn học tập</span></div>
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
        <span>Số điện thoại cố vấn học tập</span>
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
        <a-button type="primary" danger @click="back">Hủy bỏ</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted } from "vue";
import { useMenu } from "../../../stores/use-menu.js";
import axios from "../../../axios.js";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useMenu();
    const errorMessage = ref("");
    const errors = ref("");
    const options = ref([]);
    const classroom = reactive({
      ma_lop: "",
      ten_lop: "",
      sdt_gvcn: null,
    });

    const departmentList = ref([]);
    const valueClassroom = ref(undefined);
    const nameTecher = ref(undefined);

    const save = () => {
      if (!classroom.ma_lop || !classroom.ten_lop || !valueClassroom.value) {
        message.warn("Vui lòng nhập đầy đủ thông tin");
        return;
      }
      axios
        .post("/create-classroom", {
          ma_lop: classroom.ma_lop,
          ten_lop: classroom.ten_lop,
          ma_khoa: valueClassroom.value,
          gvcn: nameTecher.value,
          sdt_gvcn: classroom.sdt_gvcn,
        })
        .then((response) => {
          if (response.data.message) {
            message.success(response.data.message);
            errorMessage.value = "";
            setTimeout(() => {
              router.push({ name: "classroom" });
            }, 800);
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
        });
    };

    const back = () => {
      router.push({ name: "classroom" });
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
    const filterOption = (inputValue, option) => {
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    };
    store.onSelectedKeys(["classroom"]);
    return {
      save,
      back,
      ...toRefs(classroom),
      errorMessage,
      departmentList,
      valueClassroom,
      errors,
      options,
      nameTecher,
      filterOption,
    };
  },
});
</script>
