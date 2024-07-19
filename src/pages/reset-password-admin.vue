<template>
  <div class="login">
    <div class="container container-login">
      <div class="row center-image">
        <div class="col-sm-3"></div>
        <div class="col-sm-6">
          <a-spin :spinning="indicator" />
          <form @submit.prevent="forgetpassworduser">
            <a-card
              title="Xác nhận mật khẩu"
              style="width: 100%"
              class="background"
            >
              <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                  <label>
                    <span>Email:</span>
                  </label>
                </div>
                <div class="col-12 col-sm-6">
                  <a-input v-model:value="user.emailUser" allow-clear />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                  <label>
                    <span>Mật khẩu:</span>
                  </label>
                </div>
                <div class="col-12 col-sm-6">
                  <a-input-password
                    v-model:value="user.password"
                    placeholder="Nhập Mật khẩu"
                    allow-clear
                  />
                </div>
              </div>

              <!-- xác nhận mk -->
              <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                  <label>
                    <span>Xác nhận mật khẩu :</span>
                  </label>
                </div>
                <div class="col-12 col-sm-6">
                  <a-input-password
                    v-model:value="user.password_confirmation"
                    placeholder="Xác nhận mật khẩu"
                    allow-clear
                  />
                </div>
              </div>
              <div class="row">
                <div
                  class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto"
                >
                  <a-button
                    type="primary"
                    html-type="submit"
                    class="ms-0 ms-sm-2 mt-3 mt-sm-0"
                  >
                    <span>Đặt lại mật khẩu</span>
                  </a-button>
                </div>
              </div>
            </a-card>
          </form>
        </div>
        <div class="col-sm-3"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { message } from "ant-design-vue";
import { defineComponent, reactive, ref, defineProps } from "vue";
import axios from "../axios";
import "../css/login.css";
import { useRouter } from "vue-router";

import { LoadingOutlined } from "@ant-design/icons-vue";
import { h } from "vue";

export default defineComponent({
  props: {
    email: String,
    token: String,
  },

  setup(props) {
    const indicator = ref(false);
    const router = useRouter();
    const user = reactive({
      emailUser: props.email || "",
      password: "",
      password_confirmation: "",
    });

    const errors = ref({});

    const forgetpassworduser = () => {
      axios
        .post("/reset-password-admin", {
          token: props.token,
          email: props.email,
          password: user.password,
          password_confirmation: user.password_confirmation,
        })
        .then((response) => {
          if (response.data.status === "SUCCESS") {
            message.success("Đặt lại mật khẩu thành công");
            setTimeout(() => {
              router.push({ name: "login" });
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error.response.data.error);
          if (error.response.data.errors)
            message.error(error.response.data.errors.password);
          else {
            message.error(error.response.data.error);
          }
        });
    };

    return {
      user,
      errors,
      forgetpassworduser,
      indicator,
    };
  },
});
</script>

<style>
.input_danger {
  border-color: red;
}
</style>
