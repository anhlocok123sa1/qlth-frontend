<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12"><h2>Cập nhật thông tin khoa</h2></div>
    </div>

    <div v-if="successMessage" class="row">
      <a-alert :message="`${successMessage}`" type="success" show-icon />
    </div>
    <div v-if="errorMessage" class="row">
      <a-alert :message="`${errorMessage}`" type="error" show-icon />
    </div>
    <!-- mã khoa -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Mã khoa</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ma_khoa" placeholder="Nhập mã khoa" />
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-12"><span>Tên khoa</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ten_khoa" placeholder="Nhập tên khoa" />
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
      ma_khoa: "",
      ten_khoa: "",
    });
    const successMessage = ref("");
    const errorMessage = ref("");

    // lưu dữ liệu
    const save = () => {
      if (
        department.ma_khoa == changeKeyDepartment.value &&
        department.ten_khoa == changeNameDepartment.value
      ) {
        message.warn("Vui lòng thay đổi dữ liệu cần cập nhật");
        return;
      }
      axios
        .put(`list-department/save/${department.ma_khoa}`, {
          ten_khoa: department.ten_khoa,
        })
        .then((response) => {
          if (response.data.message) {
            successMessage.value = response.data.message;
            errorMessage.value = "";
            changeKeyDepartment.value = department.ma_khoa;
            changeNameDepartment.value = department.ten_khoa;
            setTimeout(() => {
              successMessage.value = "";
            }, 3000);
          }
        })
        .catch((error) => {
          errorMessage.value = error.response.data.error;
          successMessage.value = "";
          changeKeyDepartment.value = department.ma_khoa;
          changeNameDepartment.value = department.ten_khoa;
          setTimeout(() => {
            errorMessage.value = "";
          }, 3000);
        });
    };
    const backDepartment = () => {
      router.push({ name: `department` });
    };
    // lấy thông tin department
    const getDepartment = () => {
      axios
        .get(`/list-department/${route.params.ma_khoa}`)
        .then((response) => {
          console.log(response.data);
          department.ma_khoa = response.data.ma_khoa;
          department.ten_khoa = response.data.ten_khoa;
          changeKeyDepartment.value = response.data.ma_khoa;
          changeNameDepartment.value = response.data.ten_khoa;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getDepartment();
    store.onSelectedKeys(["department"]);

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
