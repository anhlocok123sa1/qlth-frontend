<template>
  <form @submit.prevent="createGiaoVien()">
    <a-card title="Tạo mới tài khoản giáo viên" style="width: 100%">
      <div class="row">
        <div class="col-12 col-sm-4">
          <div class="row">
            <div class="col-12 d-flex justify-content-center mb-3">
              <a-avatar shape="square" :size="200">
                <template #icon>
                  <img src="../../../assets/users.png" alt="users" />
                </template>
              </a-avatar>
            </div>
            <div class="col-12 d-flex justify-content-center">
              <a-button type="primary">
                <i class="fa-solid fa-plus me-2"></i>
                <span>Chọn ảnh</span>
              </a-button>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-8">
          <!-- Mã GV -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mã GV:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                v-model:value="taikhoangv.ma_gv"
                placeholder="Mã GV"
                allow-clear
                :class="{
                  input_danger: errors.ma_gv,
                }"
              />
              <div class="w-100"></div>
              <small v-if="errors.ma_gv" class="text-danger">{{
                errors.ma_gv[0]
              }}</small>
            </div>
          </div>
          <!-- Họ và tên -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Họ và tên:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                v-model:value="taikhoangv.ten_gv"
                placeholder="Họ và tên"
                allow-clear
                :class="{
                  input_danger: errors.ten_gv,
                }"
              />
              <div class="w-100"></div>
              <small v-if="errors.ten_gv" class="text-danger">{{
                errors.ten_gv[0]
              }}</small>
            </div>
          </div>
          <!-- Ngày sinh -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Ngày sinh:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-date-picker
                v-model:value="taikhoangv.ngay_sinh"
                placeholder="Ngày sinh"
                style="width: 100%"
                :class="{ input_danger: errors.ngay_sinh }"
              />
              <div class="w-100"></div>
              <small v-if="errors.ngay_sinh" class="text-danger">{{
                errors.ngay_sinh[0]
              }}</small>
            </div>
          </div>
          <!-- Giới tính -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Giới tính:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-radio-group
                v-model:value="taikhoangv.phai"
                :class="{ input_danger: errors.phai }"
              >
                <a-radio value="1">Nam</a-radio>
                <a-radio value="0">Nữ</a-radio>
              </a-radio-group>
              <div class="w-100"></div>
              <small v-if="errors.phai" class="text-danger">{{
                errors.phai[0]
              }}</small>
            </div>
          </div>
          <!-- Địa chỉ -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Địa chỉ:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                v-model:value="taikhoangv.dia_chi"
                placeholder="Địa chỉ"
                allow-clear
                :class="{
                  input_danger: errors.dia_chi,
                }"
              />
              <div class="w-100"></div>
              <small v-if="errors.dia_chi" class="text-danger">{{
                errors.dia_chi[0]
              }}</small>
            </div>
          </div>
          <!-- Số điện thoại -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Số điện thoại:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                v-model:value="taikhoangv.sdt"
                placeholder="Số điện thoại"
                allow-clear
                :class="{
                  input_danger: errors.sdt,
                }"
              />
              <div class="w-100"></div>
              <small v-if="errors.sdt" class="text-danger">{{
                errors.sdt[0]
              }}</small>
            </div>
          </div>
          <!-- Email -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Email:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                v-model:value="taikhoangv.email"
                placeholder="Email"
                allow-clear
                :class="{
                  input_danger: errors.email,
                }"
              />
              <div class="w-100"></div>
              <small v-if="errors.email" class="text-danger">{{
                errors.email[0]
              }}</small>
            </div>
          </div>
          <!-- Mật khẩu -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                v-model:value="taikhoangv.mat_khau"
                placeholder="Mật khẩu"
              />
              <div class="w-100"></div>
              <small v-if="errors.password" class="text-danger">{{
                errors.password[0]
              }}</small>
            </div>
          </div>
          <!-- Xác nhận mật khẩu -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Xác nhận mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                v-model:value="taikhoangv.password_confirmation"
                placeholder="Xác nhận mật khẩu"
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
        </div>
      </div>
      <!-- Nút hành động -->
      <div class="row">
        <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <router-link :to="{ name: 'admin-users-gv' }">
            <a-button class="col-12 justify-content-sm-end">
              <span>Hủy</span>
            </a-button>
          </router-link>
          <a-button
            type="primary"
            html-type="submit"
            class="ms-0 ms-sm-2 mt-3 mt-sm-0"
          >
            <span>Lưu</span>
          </a-button>
        </div>
      </div>
    </a-card>
  </form>
</template>

<script>
import { message } from "ant-design-vue";
import { defineComponent, ref, reactive, toRefs } from "vue";
import { useMenu } from "../../../stores/use-menu.js";
import axios from "../../../axios.js"; // Import axios instance
import { useRouter } from "vue-router";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-users-gv"]);

    const router = useRouter();

    // Khởi tạo đối tượng taikhoangv với các thuộc tính cần thiết
    const taikhoangv = reactive({
      ma_gv: "",
      ten_gv: "",
      ngay_sinh: "",
      phai: null,
      dia_chi: "",
      sdt: "",
      email: "",
      mat_khau: "",
      password_confirmation: "",
    });

    const errors = ref({});

    const createGiaoVien = () => {
      axios
        .post("/taikhoangv", {
          ma_gv: taikhoangv.ma_gv,
          ten_gv: taikhoangv.ten_gv,
          ngay_sinh: dayjs(taikhoangv.ngay_sinh).format("YYYY-MM-DD"),
          phai: taikhoangv.phai,
          dia_chi: taikhoangv.dia_chi,
          sdt: taikhoangv.sdt,
          email: taikhoangv.email,
          password: taikhoangv.mat_khau,
          password_confirmation: taikhoangv.password_confirmation,
        })
        .then((response) => {
          if (response.status === 200) {
            message.success("Tạo mới thành công");
            router.push({ name: "admin-users-gv" });
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            errors.value = error.response.data.errors;
            console.log(errors);
          }
        });
    };

    return {
      taikhoangv,
      errors,
      createGiaoVien,
    };
  },
});
</script>

<style>
.select_danger {
  border: 1px solid red;
}
.input_danger {
  border-color: red;
}
</style>
