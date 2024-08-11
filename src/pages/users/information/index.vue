<template>
  <form @submit.prevent="save">
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
          <!-- mssv -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Mã sinh viên</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input :value="users.ma_sv" :readonly="true"></a-input>
            </div>
          </div>
          <!-- ho ten -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Họ và tên</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input :value="users.ten_sv" :readonly="true"></a-input>
            </div>
          </div>
          <!-- malop -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Tên lớp</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input :value="users.ma_lop" :readonly="true"></a-input>
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
              <a-input :value="users.ngay_sinh" :readonly="true"></a-input>
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
          <!-- malop -->
          <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span>Địa chỉ</span>
              </label>
            </div>
            <div class="col-12 col-sm-4">
              <a-input :value="users.dia_chi" :readonly="true"></a-input>
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
                v-model:value="taikhoansv.email"
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
                v-model:value="taikhoansv.sdt"
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
              <a-checkbox v-model:checked="taikhoansv.change_password">
                Đổi mật khẩu
              </a-checkbox>
            </div>
          </div>

          <div class="row mb-3" v-if="taikhoansv.change_password && !readonly">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Mật khẩu"
                v-model:value="taikhoansv.password"
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

          <div class="row mb-3" v-if="taikhoansv.change_password && !readonly">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Xác nhận mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Xác nhận mật khẩu"
                v-model:value="taikhoansv.password_confirmation"
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
import { useMenuUsers } from "../../../stores/use-menu-users.js";
import { onMounted } from "vue";
import axios from "../../../axios";
import { ref, reactive } from "vue";
import "../../../css/users/information.css";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useMenuUsers();
    store.onSelectedKeys(["users-information"]);
    const users = ref({});
    const readonly = ref(true);
    const router = useRouter();
    const avatarUrl = ref("");

    const imageUrl = ref("");

    const taikhoansv = reactive({
      email: "",
      sdt: "",
      password: "",
      password_confirmation: "",
      change_password: false,
    });
    const errors = ref({});
    onMounted(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("/thong-tin-ca-nhan", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        users.value = response.data;
        taikhoansv.email = response.data.email;
        taikhoansv.sdt = response.data.sdt;
        if (response.data.avatar) {
          imageUrl.value = response.data.avatar;
          changeAvatar();
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    });
    const edit = () => {
      readonly.value = !readonly.value;
    };
    const changeAvatar = () => {
      avatarUrl.value = `http://127.0.0.1:8000/storage/${imageUrl.value}`;
      // avatarUrl.value = `https://backend.quanlytruonghoc.id.vn/storage/app/public/${imageUrl.value}`;
      console.log(avatarUrl.value);
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

    const save = () => {
      axios
        .post("/edit", {
          sdt: taikhoansv.sdt,
          email: taikhoansv.email,
          ma_sv: users.value.ma_sv,
          password: taikhoansv.change_password ? taikhoansv.password : null,
          password_confirmation: taikhoansv.change_password
            ? taikhoansv.password_confirmation
            : null,
        })
        .then((response) => {
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
      users,
      readonly,
      edit,
      save,
      taikhoansv,
      errors,
      avatarUrl,
      handleAvatarChange,
    };
  },
};
</script>
