<template>
  <div class="login">
    <div class="container container-login">
      <div class="row center-image">
        <div class="col-sm-3"></div>
        <div class="col-sm-6">
          <form v-if="isUserLogin" @submit.prevent="forgetpassworduser">
            <a-card
              title="Lấy lại mật khẩu"
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
                  <a-input
                    v-model:value="user.emailUser"
                    placeholder="Nhập email"
                    allow-clear
                  />
                </div>
              </div>
              <div class="row">
                <div
                  class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto"
                >
                  <a href="/login" class="forget-password">Login</a>
                  <a-button
                    type="primary"
                    html-type="submit"
                    class="ms-0 ms-sm-2 mt-3 mt-sm-0"
                  >
                    <span>Gửi</span>
                  </a-button>
                </div>
              </div>
            </a-card>
          </form>
          <form v-else @submit.prevent="forgetpasswordadmin">
            <a-card
              title="Lấy lại mật khẩu Admin"
              style="width: 100%"
              class="background"
            >
              <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                  <label>
                    <span>Email Admin:</span>
                  </label>
                </div>
                <div class="col-12 col-sm-6">
                  <a-input
                    v-model:value="admin.emailAdmin"
                    placeholder="Nhập email"
                    allow-clear
                  />
                </div>
              </div>

              <div class="row">
                <div
                  class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto"
                >
                  <a href="/login" class="forget-password">Login</a>

                  <a-button
                    type="primary"
                    html-type="submit"
                    class="ms-0 ms-sm-2 mt-3 mt-sm-0"
                  >
                    <span>Gửi</span>
                  </a-button>
                </div>
              </div>
            </a-card>
          </form>
          <a-space wrap class="d-flex justify-content-center mt-2">
            <a-button
              @click="toggleLogin(true)"
              :type="isUserLogin ? 'primary' : 'default'"
              class="me-2"
              >User</a-button
            >
            <a-button
              @click="toggleLogin(false)"
              :type="!isUserLogin ? 'primary' : 'default'"
              >Admin</a-button
            >
          </a-space>
        </div>
        <div class="col-sm-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { defineComponent, reactive, ref, toRefs } from "vue";
import axios from "../axios"; // Import axios instance
import "../css/login.css";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const user = reactive({
      emailUser: "",
    });
    const admin = reactive({
      emailAdmin: "",
    });
    const isUserLogin = ref(true);
    const errors = ref({});

    const toggleLogin = (isUser) => {
      isUserLogin.value = isUser;
    };

    const forgetpassworduser = () => {
      axios
        .post("/forget-password-user", {
          email: user.emailUser,
        })
        .then((response) => {
          message.success(response.data.message);
        })
        .catch((error) => {
          console.log(error.response.data.message);
          message.error(error.response.data.message);
        });
    };
    const forgetpasswordadmin = () => {
      console.log(admin.emailAdmin);
      axios
        .post("/forget-password-admin", {
          email: admin.emailAdmin,
        })
        .then((response) => {
          console.log(response.data);
          message.success(response.data.message);
        })
        .catch((error) => {
          console.log(error.response.data.message);
          message.error(error.response.data.message);
        });
    };
    return {
      user,
      admin,
      errors,
      forgetpassworduser,
      toggleLogin,
      isUserLogin,
      forgetpasswordadmin,
    };
  },
});
</script>

<style>
.input_danger {
  border-color: red;
}
</style>
