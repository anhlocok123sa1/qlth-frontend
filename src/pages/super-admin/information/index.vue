<template>
  <form @submit.prevent="save()">
    <a-card title="Thông tin cá nhân" style="width: 100%">
      <div class="row">
        <!-- ảnh dại diện -->
        <div class="col-12 col-sm-4">
          <div class="row">
            <div class="col-12 d-flex justify-content-center mb-3">
              <a-avatar shape="square" :size="200">
                <template #icon>
                  <img src="../../../assets/users.png" alt="" />
                </template>
              </a-avatar>
            </div>
            <div class="col-12 d-flex justify-content-center">
              <a-button type="primary">
                <span>Chọn ảnh</span>
              </a-button>
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
              <a-input :value="users.username" :readonly="true"></a-input>
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
              <a-input
                v-model:value="taikhoang.full_name"
                :readonly="readonly"
                :class="{ 'edit-mode': !readonly }"
              ></a-input>
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
                v-model:value="taikhoang.email"
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
          <!-- Đổi mật khẩu -->
          <div class="row mb-3" v-if="!readonly">
            <div class="col-12 col-sm-3 text-start text-sm-end"></div>
            <div class="col-12 col-sm-5">
              <a-checkbox v-model:checked="taikhoang.change_password">
                Đổi mật khẩu
              </a-checkbox>
            </div>
          </div>

          <div class="row mb-3" v-if="taikhoang.change_password">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Mật khẩu"
                v-model:value="taikhoang.password"
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

          <div class="row mb-3" v-if="taikhoang.change_password">
            <div class="col-12 col-sm-3 text-start text-sm-end">
              <label>
                <span class="text-danger me-1">*</span>
                <span>Xác nhận mật khẩu:</span>
              </label>
            </div>
            <div class="col-12 col-sm-5">
              <a-input-password
                placeholder="Xác nhận mật khẩu"
                v-model:value="taikhoang.password_confirmation"
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
import { onMounted } from "vue";
import axios from "../../../axios";
import "../../../css/users/information.css";
import { defineComponent, ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { useMenu } from "../../../stores/use-menu.js";

export default defineComponent({
  setup() {
    // Lấy store từ usestore
    const store = useMenu();
    console.log(store);
    store.onSelectedKeys(["super-admin-information"]);
    const users = ref({});
    const readonly = ref(true);

    const taikhoang = reactive({
      email: "",
      full_name: "",
      username: "",
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

        const response = await axios.get("/thong-tin-admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        users.value = response.data;
        taikhoang.email = response.data.email;
        taikhoang.full_name = response.data.full_name;
        taikhoang.username = response.data.username;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    });

    // Edit
    const edit = () => {
      readonly.value = !readonly.value;
      // console.log(readonly.value);
    };
    const save = () => {
      axios
        .post("/editProfileAdmin", {
          email: taikhoang.email,
          username: users.value.username,
          full_name: taikhoang.full_name,
          password: taikhoang.change_password ? taikhoang.password : null,
          password_confirmation: taikhoang.change_password
            ? taikhoang.password_confirmation
            : null,
        })
        .then((response) => {
          if (response.status === 200) {
            message.success(response.data.message);
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
      taikhoang,
      errors,
    };
  },
});
</script>
