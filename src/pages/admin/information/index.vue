<template>
  <form @submit.prevent="save()">
    <a-card title="Thông tin cá nhân" style="width: 100%">
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
        <!-- Thông tin cá nhân -->
        <div class="col-12 col-sm-8">
          <!-- Mã giáo viên -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Mã giáo viên</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input :value="users.ma_gv" :readonly="true"></a-input>
            </div>
          </div>
          <!-- Họ và tên -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Họ và tên</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input :value="users.ten_gv" :readonly="true"></a-input>
            </div>
          </div>
          <!-- Ngày sinh -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Ngày sinh</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input
                placeholder="Ngày sinh"
                allow-clear
                v-model:value="users.ngay_sinh"
                :class="{
                  input_danger: errors.ngay_sinh,
                }"
                :readonly="true"
              />
            </div>
          </div>
          <!-- Giới tính -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Giới tính</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input
                :value="users.phai === 1 ? 'Nam' : 'Nữ'"
                :readonly="true"
              ></a-input>
            </div>
          </div>
          <!-- Địa chỉ -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Địa chỉ</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input
                placeholder="Địa chỉ"
                allow-clear
                v-model:value="users.dia_chi"
                :class="{
                  input_danger: errors.dia_chi,
                }"
                :readonly="true"
              />
            </div>
          </div>
          <!-- email -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span
                  :class="{
                    'text-danger': errors.email,
                  }"
                >
                  Email
                </span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input
                v-model:value="taikhoangv.email"
                :readonly="readonly"
                :class="{ 'edit-mode': !readonly }"
              ></a-input>
              <div class="w-100">
                <small v-if="errors.email" class="text-danger">{{
                  errors.email[0]
                }}</small>
              </div>
            </div>
          </div>
          <!-- SĐT -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span
                  :class="{
                    'text-danger': errors.sdt,
                  }"
                  >Số điện thoại</span
                >
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input
                v-model:value="taikhoangv.sdt"
                :readonly="readonly"
                :class="{ 'edit-mode': !readonly }"
              ></a-input>
              <div class="w-100">
                <small v-if="errors.sdt" class="text-danger">{{
                  errors.sdt[0]
                }}</small>
              </div>
            </div>
          </div>
          <!-- Đổi mật khẩu -->
          <div class="row mb-3" v-if="!readonly">
            <div class="col-12 col-sm-3 text-start text-sm-end"></div>
            <div class="col-12 col-sm-5">
              <a-checkbox v-model:checked="taikhoangv.change_password">
                Đổi mật khẩu
              </a-checkbox>
            </div>
          </div>

          <div class="row mb-3" v-if="taikhoangv.change_password">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Mật khẩu"
                v-model:value="taikhoangv.password"
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

          <div class="row mb-3" v-if="taikhoangv.change_password">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Xác nhận mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Xác nhận mật khẩu"
                v-model:value="taikhoangv.password_confirmation"
              />
            </div>
          </div>

          <!-- Edit -->
        </div>
      </div>
      <div class="row">
        <div class="col-12 d-grid d-sm-flex justify-content-sm-end mx-auto">
          <a-button type="primary" @click="edit" class="me-sm-2 mb-3"
            ><span>{{ readonly ? "Edit" : "Hủy" }}</span></a-button
          >
          <a-button html-type="submit" v-if="!readonly"
            ><span>Save</span></a-button
          >
        </div>
      </div>
    </a-card>
  </form>
</template>
<script>
import { onMounted, toRef } from "vue";
import axios from "../../../axios";
import "../../../css/users/information.css";
import { defineComponent, ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useMenu } from "../../../stores/use-menu.js";
import constants from "../../../constants.js";

export default defineComponent({
  setup() {
    // Lấy store từ useMenuUsers
    const store = useMenu();
    const users = ref({});
    const readonly = ref(true);
    const router = useRouter();
    const avatarUrl = ref("");
    const imageUrl = ref("");

    const taikhoangv = reactive({
      email: "",
      sdt: "",
      password: "",
      password_confirmation: "",
      change_password: false,
    });
    const errors = ref({});
    onMounted(() => {
      store.onSelectedKeys(["admin-information"]);
    });
    onMounted(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("/profileGiaoVien", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        users.value = response.data;
        taikhoangv.email = response.data.email;
        taikhoangv.sdt = response.data.sdt;
        if (response.data.avatar) {
          imageUrl.value = response.data.avatar;
          changeAvatar();
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    });
    const changeAvatar = () => {
      avatarUrl.value = `${constants.BASE_AVATAR_URL}${imageUrl.value}`;
      // avatarUrl.value = `http://127.0.0.1:8000/storage/${imageUrl.value}`;
      // avatarUrl.value = `https://backend.quanlytruonghoc.id.vn/storage/app/public/${imageUrl.value}`;
    };
    const handleAvatarChange = async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("/upload-avatar", formData, {
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

    // Edit
    const edit = () => {
      readonly.value = !readonly.value;
      taikhoangv.change_password = !readonly.value;
      // console.log(readonly.value);
    };
    const save = () => {
      axios
        .post("/editProfileGiaoVien", {
          sdt: taikhoangv.sdt,
          email: taikhoangv.email,
          ma_gv: users.value.ma_gv,
          password: taikhoangv.change_password ? taikhoangv.password : null,
          password_confirmation: taikhoangv.change_password
            ? taikhoangv.password_confirmation
            : null,
        })
        .then((response) => {
          // console.log(response);
          if (response.status === 200) {
            if (response.data.message) {
              message.success(response.data.message);
            } else {
              message.success("Cập nhật thành công");
            }
            setTimeout(() => {
              location.reload();
            }, 500);
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
        });
    };

    return {
      edit,
      save,
      users,
      errors,
      readonly,
      avatarUrl,
      taikhoangv,
      handleAvatarChange,
    };
  },
});
</script>
