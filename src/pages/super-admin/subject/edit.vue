<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12"><h2>SỬA ĐỔI THÔNG TIN MÔN HỌC</h2></div>
    </div>

    <div v-if="successMessage" class="row">
      <a-alert :message="`${successMessage}`" type="success" show-icon />
    </div>
    <div v-if="errorMessage" class="row">
      <a-alert :message="`${errorMessage}`" type="error" show-icon />
    </div>
    <!-- mã khoa -->
    <div class="row mt-3">
      <div class="col-sm-12"><span>Mã môn học</span><span>*</span></div>
      <div class="col-sm-12">
        <a-input
          disabled
          v-model:value="ma_mh"
          placeholder="Nhập Mã môn học"
          :readonly="true"
        />
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
      <div class="col-sm-3">
        <a-button type="primary" style="margin-right: 3px" @click="save"
          >Lưu thông tin</a-button
        >
        <a-button type="primary" danger @click="backSubject">Hủy bỏ</a-button>
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
    const changeKeySubject = ref("");
    const changeNameSubject = ref("");
    const errors = ref("");

    const subject = reactive({
      ma_mh: "",
      ten_mh: "",
    });
    const successMessage = ref("");
    const errorMessage = ref("");

    // lưu dữ liệu
    const save = () => {
      if (
        subject.ma_mh == changeKeySubject.value &&
        subject.ten_mh == changeNameSubject.value
      ) {
        message.warn("Vui lòng thay đổi dữ liệu cần cập nhật");
        return;
      }
      axios
        .put(`list-subject/save/${subject.ma_mh}`, {
          ten_mh: subject.ten_mh,
        })
        .then((response) => {
          if (response.data.message) {
            successMessage.value = response.data.message;
            errorMessage.value = "";
            changeKeySubject.value = subject.ma_mh;
            changeNameSubject.value = subject.ten_mh;
            setTimeout(() => {
              successMessage.value = "";
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
          errorMessage.value = error.response.data.error;
          successMessage.value = "";
          changeKeySubject.value = subject.ma_mh;
          changeNameSubject.value = subject.ten_mh;
          setTimeout(() => {
            errorMessage.value = "";
          }, 3000);
        });
    };
    const backSubject = () => {
      router.push({ name: `subject` });
    };
    // lấy thông tin department
    const getSubject = () => {
      axios
        .get(`/list-subject/${route.params.ma_mh}`)
        .then((response) => {
          subject.ma_mh = response.data.ma_mh;
          subject.ten_mh = response.data.ten_mh;
          changeKeySubject.value = response.data.ma_mh;
          changeNameSubject.value = response.data.ten_mh;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getSubject();
    store.onSelectedKeys(["subject"]);

    return {
      ...toRefs(subject),
      save,
      successMessage,
      errorMessage,
      backSubject,
      changeKeySubject,
      changeNameSubject,
      errors,
    };
  },
});
</script>
