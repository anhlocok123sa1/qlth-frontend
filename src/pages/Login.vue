<template>
  <div class="login">
    <div class="container container-login">
      <div class="row center-image">
        <div class="col-sm-3"></div>
        <div class="col-sm-6">
          <form v-if="isUserLogin" @submit.prevent="loginUser">
            <a-card
              title="Login"
              style="width: 100%"
              class="background login-card"
            >
              <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                  <label>
                    <span class="text-danger me-1">*</span>
                    <span
                      :class="{
                        'text-danger': errors.username,
                      }"
                    ></span>
                    <span class="login-name">Username:</span>
                  </label>
                </div>
                <div class="col-12 col-sm-5">
                  <a-input
                    placeholder="Username"
                    allow-clear
                    v-model:value="user.username"
                    :class="{
                      input_danger: errors.username,
                    }"
                  />
                  <div class="w-100"></div>
                  <small v-if="errors.username" class="text-danger">{{
                    errors.username[0]
                  }}</small>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                  <label>
                    <span class="text-danger me-1">*</span>
                    <span
                      :class="{
                        'text-danger': errors.password,
                      }"
                    ></span>
                    <span class="login-name">Password:</span>
                  </label>
                </div>
                <div class="col-12 col-sm-5">
                  <a-input-password
                    placeholder="Password"
                    v-model:value="user.password"
                    :class="{
                      input_danger: errors.password,
                    }"
                  />
                  <div class="w-100"></div>
                  <small v-if="errors.password" class="text-danger">{{
                    errors.password[0]
                  }}</small>
                </div>
              </div>
              <div class="row">
                <div
                  class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto"
                >
                  <a href="/forget-password" class="forget-password"
                    >Forgot my password</a
                  >
                  <a-button
                    type="primary"
                    html-type="submit"
                    class="ms-0 ms-sm-2 mt-3 mt-sm-0"
                  >
                    <span>Login</span>
                  </a-button>
                </div>
              </div>
            </a-card>
          </form>
          <form v-else @submit.prevent="loginAdmin">
            <a-card
              title="Login Admin"
              style="width: 100%"
              class="background login-card"
            >
              <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                  <label>
                    <span class="text-danger me-1">*</span>

                    <span
                      :class="{
                        'text-danger': errors.username,
                      }"
                    ></span>
                    <span class="login-name">Username:</span>
                  </label>
                </div>
                <div class="col-12 col-sm-5">
                  <a-input
                    placeholder="Username"
                    allow-clear
                    v-model:value="admin.username"
                    :class="{
                      input_danger: errors.username,
                    }"
                  />
                  <div class="w-100"></div>
                  <small v-if="errors.username" class="text-danger">{{
                    errors.username[0]
                  }}</small>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                  <label>
                    <span class="text-danger me-1">*</span>
                    <span
                      :class="{
                        'text-danger': errors.password,
                      }"
                    ></span>
                    <span class="login-name">Password:</span>
                  </label>
                </div>
                <div class="col-12 col-sm-5">
                  <a-input-password
                    placeholder="Password"
                    v-model:value="admin.password"
                    :class="{
                      input_danger: errors.password,
                    }"
                  />
                  <div class="w-100"></div>
                  <small v-if="errors.password" class="text-danger">{{
                    errors.password[0]
                  }}</small>
                </div>
              </div>

              <div class="row">
                <div
                  class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto"
                >
                  <a href="/forget-password" class="forget-password"
                    >Forgot my password</a
                  >
                  <a-button
                    type="primary"
                    html-type="submit"
                    class="ms-0 ms-sm-2 mt-3 mt-sm-0"
                  >
                    <span>Login</span>
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
    const router = useRouter();
    const user = reactive({
      username: "",
      password: "",
    });
    const admin = reactive({
      username: "",
      password: "",
    });
    const isUserLogin = ref(true);

    const errors = ref({});

    const toggleLogin = (isUser) => {
      isUserLogin.value = isUser;
    };

    const loginUser = () => {
      axios
        .post("/login", user)
        .then((response) => {
          if (response.status === 200) {
            message.success("Đăng nhập thành công");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            if (response.data.role == "teacher") {
              router.push({ name: "admin" });
            } else if (response.data.role == "student") {
              router.push({ name: "users-sv" });
            }
          }
        })
        .catch((error) => {
          errors.value = error.response.data.error || {};
          message.error(errors.value);
        });
    };

    const loginAdmin = () => {
      axios.defaults.withCredentials = true;
      axios
        .post("/loginAdmin", admin, {
          withCredentials: "include",
        })
        .then((response) => {
          if (response.status === 200) {
            // console.log(response);
            message.success("Đăng nhập thành công");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            router.push({ name: "home" });
          }
        })
        .catch((error) => {
          errors.value = error.response.data.error || {};
          message.error(errors.value);
        });
    };

    return {
      user,
      admin,
      errors,
      loginUser,
      toggleLogin,
      isUserLogin,
      loginAdmin,
    };
  },
});
</script>

<style>
.input_danger {
  border-color: red;
}
</style>
