<template>
  <form @submit.prevent="loginUser">
    <a-card title="Đăng nhập" style="width: 100%">
      <div class="row mb-3">
        <div class="col-12 col-sm-3 text-start text-sm-end">
          <label>
            <span class="text-danger me-1">*</span>
            <span
              :class="{
                'text-danger': errors.username,
              }"
            ></span>
            <span>Username:</span>
          </label>
        </div>
        <div class="col-12 col-sm-5">
          <a-input
            placeholder="Username"
            allow-clear
            v-model:value="username"
            :class="{
              input_danger: errors.username,
            }"
          />
          <div class="w-100"></div>
          <small v-if="errors.username" class="text-danger">{{ errors.username[0] }}</small>
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
            <span>Password:</span>
          </label>
        </div>
        <div class="col-12 col-sm-5">
          <a-input-password
            placeholder="Password"
            v-model:value="password"
            :class="{
              input_danger: errors.password,
            }"
          />
          <div class="w-100"></div>
          <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
        </div>
      </div>

      <div class="row">
        <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <!-- <router-link :to="{ name: 'admin-users' }">
            <a-button class="w-100">
              <span>Hủy</span>
            </a-button>
          </router-link> -->

          <a-button type="primary" html-type="submit" class="ms-0 ms-sm-2 mt-3 mt-sm-0">
            <span>Đăng nhập</span>
          </a-button>
        </div>
      </div>
    </a-card>
  </form>
</template>

<script>
import { message } from 'ant-design-vue';
import { defineComponent, reactive, ref, toRefs } from 'vue';
import axios from '../axios'; // Import axios instance
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const user = reactive({
      username: '',
      password: '',
    });

    const errors = ref({});

    const loginUser = () => {
      axios
        .post('/login', user)
        .then((response) => {
          if (response.status === 200) {
            message.success('Đăng nhập thành công');
            localStorage.setItem('token', response.data.token);
            const token = response.data.token;
            const role = response.data.role;
            window.user = { token, role };
            if (response.data.role == 'teacher') {
              router.push({ name: 'admin-users-gv' });
            } else if(response.data.role == 'student') {
              router.push({ name: 'admin-users-sv' });
            }
          }
        })
        .catch((error) => {
          errors.value = error.response.data.error || {};
          message.error(errors.value);
        });
    };

    return {
      ...toRefs(user),
      errors,
      loginUser,
    };
  },
});
</script>

<style>
.input_danger {
  border-color: red;
}
</style>
