<template>
  <form @submit.prevent="updateUsers()">
    <a-card title="Cập nhật tài khoản sinh viên" style="width: 100%">
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
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mã số sinh viên:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                placeholder="Mã GV"
                allow-clear
                disabled
                v-model:value="ma_sv"
                :class="{
                  input_danger: errors.ma_sv,
                }"
              />
              <div class="w-100"></div>
              <small v-if="errors.ma_sv" class="text-danger">{{
                errors.ma_sv[0]
              }}</small>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Họ và tên:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                placeholder="Họ và tên"
                allow-clear
                v-model:value="ten_sv"
                :class="{
                  input_danger: errors.ten_sv,
                }"
              />
              <div class="w-100"></div>
              <small v-if="errors.ten_sv" class="text-danger">{{
                errors.ten_sv[0]
              }}</small>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Lớp:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-select
                ref="select"
                show-search
                v-model:value="ma_lop"
                style="width: 130px"
                :options="allMaLop"
                @change="handleChangeSelect"
                >{{ ma_lop }}</a-select
              >
              <div class="w-100"></div>
              <small v-if="errors.ma_lop" class="text-danger">{{
                errors.ma_lop[0]
              }}</small>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Ngày sinh:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-date-picker
                placeholder="Ngày sinh"
                style="width: 100%"
                v-model:value="ngay_sinh"
                :class="{ input_danger: errors.ngay_sinh }"
              />
              <div class="w-100"></div>
              <small v-if="errors.ngay_sinh" class="text-danger">{{
                errors.ngay_sinh[0]
              }}</small>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Giới tính:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-radio-group
                v-model:value="phai"
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

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Địa chỉ:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                placeholder="Địa chỉ"
                allow-clear
                v-model:value="dia_chi"
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

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Số điện thoại:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                placeholder="Số điện thoại"
                allow-clear
                v-model:value="sdt"
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

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Email:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                placeholder="Email"
                allow-clear
                v-model:value="email"
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

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end"></div>
            <div class="col-12 col-sm-5">
              <a-checkbox v-model:checked="change_password">
                Đổi mật khẩu
              </a-checkbox>
            </div>
          </div>

          <div class="row mb-3" v-if="change_password">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Mật khẩu"
                v-model:value="password"
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

          <div class="row mb-3" v-if="change_password">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Xác nhận mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Xác nhận mật khẩu"
                v-model:value="password_confirmation"
              />
            </div>
          </div>

          <!-- <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Lần đăng nhập gần đây:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <span>{{ login_at }}</span>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Lần đổi mật khẩu gần đây:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <span>{{ change_password_at }}</span>
            </div>
          </div> -->
        </div>
      </div>

      <div class="row">
        <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <router-link :to="{ name: 'admin-users-sv' }">
            <a-button class="w-100">
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
import { defineComponent, ref, reactive, toRefs, computed } from "vue";
import { useMenu } from "../../../stores/use-menu.js";
import { useRoute, useRouter } from "vue-router";
import axios from "../../../axios.js";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-users-sv"]);

    const router = useRouter();
    const route = useRoute();
    const allMaLop = ref([]);
    const users = reactive({
      ma_sv: "",
      ten_sv: "",
      ngay_sinh: "",
      phai: null,
      dia_chi: "",
      sdt: "",
      email: "",
      ma_lop: "",
      password: "",
      password_confirmation: "",
      change_password: false,
      // login_at: "",
      // change_password_at: "",
    });

    const errors = ref({});
    const dateFormat = "YYYY-MM-DD";
    const getUsersEdit = () => {
      axios
        .get(`taikhoansv/${route.params.id}/edit`)
        .then((response) => {
          users.ma_sv = response.data.ma_sv;
          users.ten_sv = response.data.ten_sv;
          users.ngay_sinh = dayjs(response.data.ngay_sinh, dateFormat);
          users.phai = response.data.phai ? "1" : "0";
          users.dia_chi = response.data.dia_chi;
          users.sdt = response.data.sdt;
          users.email = response.data.email;
          users.ma_lop = response.data.ma_lop;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const getLop = () => {
      axios
        .get(`lop`)
        .then((response) => {
          allMaLop.value = response.data.map((item) => {
            return {
              label: item.ma_lop,
              value: item.ma_lop,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const updateUsers = () => {
      axios
        .put(`/taikhoansv/${route.params.id}`, {
          ten_sv: users.ten_sv,
          ngay_sinh: dayjs(users.ngay_sinh).format(dateFormat),
          ma_lop: users.ma_lop,
          phai: users.phai == "1" ? 1 : 0,
          dia_chi: users.dia_chi,
          sdt: users.sdt,
          email: users.email,
          password: users.change_password ? users.password : null,
          password_confirmation: users.change_password
            ? users.password_confirmation
            : null,
        })
        .then((response) => {
          if (response.status == 200) {
            message.success("Cập nhật thành công!");
            router.push({ name: "admin-users-sv" });
          }
        })
        .catch((error) => {
          console.log(error);
          errors.value = error.response.data.errors;
        });
    };

    const filterOption = (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    getUsersEdit();

    const handleChangeSelect = (value) => {
      users.ma_lop = value
    };
    getLop();
    return {
      ...toRefs(users),
      errors,
      filterOption,
      updateUsers,
      allMaLop,
      handleChangeSelect
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
