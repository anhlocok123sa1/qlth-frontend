<template>
  <form @submit.prevent="updateUsers()">
    <a-card title="Cập nhật tài khoản giáo viên" style="width: 100%">
      <div class="row">
        <!-- ảnh đại diện -->
        <div class="col-12 col-sm-4">
          <div class="row">
            <div class="col-12 d-flex justify-content-center mb-3">
              <a-avatar shape="square" :size="200">
                <template #icon>
                  <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
                  <img
                    v-else
                    src="../../../assets/users.png"
                    alt="Default Avatar"
                  />
                </template>
              </a-avatar>
            </div>
            <div class="col-12 d-flex justify-content-center">
              <a-upload
                :show-upload-list="false"
                :before-upload="handleAvatarChange"
              >
                <a-button type="primary">
                  <span>Chọn ảnh</span>
                </a-button>
              </a-upload>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-8">
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mã GV:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input
                placeholder="Mã GV"
                allow-clear
                disabled
                v-model:value="ma_gv"
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
                v-model:value="ten_gv"
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

          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Ngày sinh:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <!-- <a-input
                placeholder="Ngày sinh"
                allow-clear
                v-model:value="ngay_sinh"
                :class="{
                  input_danger: errors.ngay_sinh,
                }"
              /> -->
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
        <div class="col-sm-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <router-link :to="{ name: 'admin-users-gv' }">
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
import { defineComponent, ref, reactive, toRefs } from "vue";
import { useMenu } from "../../../stores/use-menu.js";
import { useRoute, useRouter } from "vue-router";
import axios from "../../../axios.js";
import dayjs from "dayjs";
import constants from "../../../constants.js";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-users-gv"]);

    const router = useRouter();
    const route = useRoute();
    const users = reactive({
      ma_gv: "",
      ten_gv: "",
      ngay_sinh: "",
      phai: null,
      dia_chi: "",
      sdt: "",
      email: "",
      password: "",
      password_confirmation: "",
      change_password: false,
    });

    const errors = ref({});
    const avatarUrl = ref("");
    const imageUrl = ref("");
    const dateFormat = "YYYY-MM-DD";
    const getUsersEdit = () => {
      axios
        .get(`taikhoangv/${route.params.id}/edit`)
        .then((response) => {
          users.ma_gv = response.data.ma_gv;
          users.ten_gv = response.data.name;
          users.ngay_sinh = dayjs(response.data.ngay_sinh, dateFormat);
          users.phai = response.data.phai ? "1" : "0";
          users.dia_chi = response.data.dia_chi;
          users.sdt = response.data.sdt;
          users.email = response.data.email;
          if (response.data.avatar) {
            imageUrl.value = response.data.avatar;
            changeAvatar();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const updateUsers = () => {
      axios
        .put(`/taikhoangv/${route.params.id}`, {
          ten_gv: users.ten_gv,
          ngay_sinh: dayjs(users.ngay_sinh).format(dateFormat),
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
            router.push({ name: "admin-users-gv" });
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
    const changeAvatar = () => {
      avatarUrl.value = `${constants.BASE_AVATAR_URL}${imageUrl.value}`;
      // avatarUrl.value = `http://127.0.0.1:8000/storage/${imageUrl.value}`;
      // avatarUrl.value = `https://backend.quanlytruonghoc.id.vn/storage/app/public/${imageUrl.value}`;
      console.log(avatarUrl.value);
    };

    const handleAvatarChange = async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`/upload-avatar-gv/${route.params.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        // Kiểm tra URL từ phản hồi
        imageUrl.value = response.data.avatarUrl;
        message.success("Ảnh đại diện đã được cập nhật");
        changeAvatar();
      } catch (error) {
        message.error("Cập nhật ảnh đại diện thất bại");
        console.log(error);
      }

      return false;
    };

    getUsersEdit();
    return {
      ...toRefs(users),
      errors,
      filterOption,
      updateUsers,
      avatarUrl,
      handleAvatarChange
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
