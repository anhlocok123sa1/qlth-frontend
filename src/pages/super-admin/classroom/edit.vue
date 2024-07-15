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
    <!-- mã khoa -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Mã lớp</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ma_lop" placeholder="Nhập mã lớp" />
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-12"><span>Tên lớp</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ten_lop" placeholder="Nhập tên lớp" />
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
import { defineComponent, reactive, toRefs, ref, watch } from "vue";
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
    const department = reactive({
      ma_lop: "",
      ten_lop: "",
    });
    const successMessage = ref("");
    const errorMessage = ref("");

    // lưu dữ liệu
    const save = () => {
      if (
        department.ma_lop == changeKeyDepartment.value &&
        department.ten_lop == changeNameDepartment.value
      ) {
        message.warn("Vui lòng thay đổi dữ liệu cần cập nhật");
        return;
      }
      console.log(department.ma_lop);
      console.log(department.ten_lop);
      axios

        .put(`list-classroom/save/${department.ma_lop}`, {
          ten_lop: department.ten_lop,
        })
        .then((response) => {
          if (response.data.message) {
            successMessage.value = response.data.message;
            errorMessage.value = "";
            changeKeyDepartment.value = department.ma_lop;
            changeNameDepartment.value = department.ten_lop;
            setTimeout(() => {
              successMessage.value = "";
            }, 3000);
          }
        })
        .catch((error) => {
          errorMessage.value = error.response.data.error;
          successMessage.value = "";
          changeKeyDepartment.value = department.ma_lop;
          changeNameDepartment.value = department.ten_lop;
          setTimeout(() => {
            errorMessage.value = "";
          }, 3000);
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
        })
        .catch((error) => {
          console.log(error);
        });
    };

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
    };
  },
});
</script>
