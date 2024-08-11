<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12"><h2>THÊM MÔN HỌC</h2></div>
    </div>

    <div v-if="successMessage" class="row">
      <a-alert :message="`${successMessage}`" type="success" show-icon />
    </div>
    <div v-if="errorMessage" class="row">
      <a-alert :message="`${errorMessage.ma_mh}`" type="error" show-icon />
    </div>
    <!-- mã khoa -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Mã Môn học</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ma_mh" placeholder="Nhập mã môn học" />
        <small v-if="errors.ma_mh" class="text-danger">{{
          errors.ma_mh[0]
        }}</small>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-sm-12"><span>Tên môn học</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input v-model:value="ten_mh" placeholder="Nhập tên môn học" />
        <small v-if="errors.ten_mh" class="text-danger">{{
          errors.ten_mh[0]
        }}</small>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-sm-12"><span>Số tiết</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input-number v-model:value="so_tiet" :min="20" :max="45" />

        <!-- <a-input v-model:value="so_tiet" placeholder="Nhập số tiết" /> -->
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
import { defineComponent, reactive, ref, toRefs } from "vue";

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

    const subject = reactive({
      ma_mh: "",
      ten_mh: "",
      so_tiet: 45,
    });

    const save = () => {
      if (!subject.ma_mh || !subject.ten_mh || !subject.so_tiet) {
        message.warn("vui lòng nhập đầy đủ thông tin");
        return;
      }
      axios
        .post("/create-subject", {
          ma_mh: subject.ma_mh,
          ten_mh: subject.ten_mh,
          so_tiet: subject.so_tiet,
        })
        .then((response) => {
          if (response.data.message) {
            message.success(response.data.message);
            errorMessage.value = "";
            setTimeout(() => {
              router.push({ name: "subject" });
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
          //   errorMessage.value = error.response.data.errors;
        });
    };

    const back = () => {
      router.push({ name: "subject" });
    };
    store.onSelectedKeys(["subject"]);
    return {
      save,
      back,
      ...toRefs(subject),
      errorMessage,
      errors,
    };
  },
});
</script>
