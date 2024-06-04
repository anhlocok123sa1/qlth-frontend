<template>
  <form @submit.prevent="loginUser">
    <a-card title="Đăng nhập" style="width: 100%">
      <div class="row mb-3">
        <div class="col-12 col-sm-3 text-start text-sm-end">
          <label>
            <span class="text-danger me-1">*</span>
            <span
              :class="{
                'text-danger': errors.ma_gv,
              }"
            ></span>
            <span>Mã GV:</span>
          </label>
        </div>
        <div class="col-12 col-sm-5">
          <a-input
            placeholder="Mã GV"
            allow-clear
            v-model:value="ma_gv"
            :class="{
              input_danger: errors.ma_gv,
            }"
          />
          <div class="w-100"></div>
          <small v-if="errors.ma_gv" class="text-danger">{{ errors.ma_gv[0] }}</small>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-12 col-sm-3 text-start text-sm-end">
          <label>
            <span class="text-danger me-1">*</span>
            <span
              :class="{
                'text-danger': errors.mat_khau,
              }"
            ></span>
            <span>Mật khẩu:</span>
          </label>
        </div>
        <div class="col-12 col-sm-5">
          <a-input-password
            placeholder="Mật khẩu"
            v-model:value="mat_khau"
            :class="{
              input_danger: errors.mat_khau,
            }"
          />
          <div class="w-100"></div>
          <small v-if="errors.mat_khau" class="text-danger">{{ errors.mat_khau[0] }}</small>
        </div>
      </div>

      <div class="row">
        <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <router-link :to="{ name: 'admin-users' }">
            <a-button class="w-100">
              <span>Hủy</span>
            </a-button>
          </router-link>

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
      ma_gv: '',
      mat_khau: '',
    });

    const errors = ref({});

    const loginUser = () => {
      axios
        .post('/login', user)
        .then((response) => {
          if (response.status === 200) {
            message.success('Đăng nhập thành công');
            localStorage.setItem('token', response.data.token);
            router.push({ name: 'admin-users' });
          }
        })
        .catch((error) => {
          errors.value = error.response.data.errors || {};
          message.error('Đăng nhập thất bại');
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
