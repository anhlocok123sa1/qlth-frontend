<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12"><h2>Thêm khoa</h2></div>
    </div>

    <div v-if="successMessage" class="row">
      <a-alert :message="`${successMessage}`" type="success" show-icon />
    </div>
    <div v-if="errorMessage" class="row">
      <a-alert :message="`${errorMessage.ma_khoa}`" type="error" show-icon />
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
import { defineComponent, reactive, ref, toRefs } from "vue";

import { useMenu } from "../../../stores/use-menu.js";
import axios from "../../../axios.js";
import { message } from "ant-design-vue";
export default defineComponent({
  setup() {
    const store = useMenu();
    const errorMessage = ref("");
    const department = reactive({
      ma_khoa: "",
      ten_khoa: "",
    });

    const save = () => {
      if (!department.ma_khoa || !department.ten_khoa) {
        alert("vui lòng nhập đầy đủ thông tin");
        return;
      }
      axios
        .post("/create-department", {
          ma_khoa: department.ma_khoa,
          ten_khoa: department.ten_khoa,
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.message) {
            message.success(response.data.message);
            errorMessage.value = "";
          }
        })
        .catch((error) => {
          errorMessage.value = error.response.data.errors;
        });
    };

    store.onSelectedKeys(["department"]);
    return {
      save,
      ...toRefs(department),
      errorMessage,
    };
  },
});
</script>
