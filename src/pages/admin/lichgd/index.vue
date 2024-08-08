<template>
  <a-card title="DANH SÁCH LỊCH GIẢNG DẠY" style="width: 100%">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 d-sm-flex justify-content-sm-end">
          <router-link :to="{ name: 'admin-lichgiangday/create' }">
            <a-button type="primary" class="d-flex" style="margin-right: 2px">
              <p>Tạo lịch cố định</p>
            </a-button>
          </router-link>
          <router-link :to="{ name: 'admin-lichgiangday/create-custom' }">
            <a-button type="primary" class="d-flex" danger>
              <p>Custom</p>
            </a-button>
          </router-link>
        </div>
      </div>
      <br />

      <div class="row">
        <div class="col-sm-12">
          <a-table :data-source="teachingSchedules" bordered>
            <a-table-column key="stt" title="Mã môn học" data-index="ma_mh" />
            <a-table-column key="stt" title="Tên môn học" data-index="ten_mh" />
            <a-table-column key="stt" title="Nhóm môn học" data-index="nmh" />
            <a-table-column
              key="stt"
              title="Phòng học"
              data-index="phong_hoc"
            />
            <a-table-column
              key="stt"
              title="Số tiết bắt dầu"
              data-index="st_bd"
            />
            <a-table-column
              key="stt"
              title="Số tiết kết thúc"
              data-index="st_kt"
            />
            <a-table-column
              key="stt"
              title="Ngày bắt đầu"
              data-index="ngay_bd"
              width="125px"
            />
            <a-table-column
              key="stt"
              title="Ngày kết thúc"
              data-index="ngay_kt"
              width="120px"
            />
            <a-table-column
              key="stt"
              title="Học kỳ"
              data-index="hoc_ky"
              width="110px"
            />
            <a-table-column
              key="so_luong_sinh_vien"
              title="Sĩ số"
              data-index="so_luong_sinh_vien"
              width="70px"
            />

            <a-table-column key="action" title="Thao tác">
              <template #default="{ record }">
                <span>
                  <!-- view -->
                  <router-link
                    :to="{
                      name: 'admin-lichgiangday/edit',
                      params: {
                        ten_mh: record.ten_mh,
                        ma_gd: record.ma_gd,
                        nmh: record.nmh,
                      },
                    }"
                  >
                    <i
                      class="fa-solid fa-eye"
                      style="font-size: 18px; color: rebeccapurple"
                    ></i>
                  </router-link>
                  <br />
                  <!-- edit -->
                  <a @click="edit(record.ma_gd)"
                    ><i
                      class="fa-solid fa-pen-to-square mt-1"
                      style="font-size: 18px; color: brown"
                    ></i
                  ></a>
                  <br />
                  <!-- delete -->
                  <a
                    ><a-popconfirm
                      title="Cảnh báo nên xuất dữ liệu trước khi xóa"
                      ok-text="Yes"
                      cancel-text="No"
                      @confirm="() => confirm(record.ma_gd)"
                    >
                      <i
                        class="fa-solid fa-trash-can mt-1"
                        style="font-size: 18px; color: darkblue"
                      ></i> </a-popconfirm
                  ></a>
                </span>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </div>
    </div>
  </a-card>

  <a-modal v-model:open="openModalEdit" title="Edit" @ok="save" okText="Save">
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      Mã môn học
      <a-form-item>
        <a-input :disabled="true" v-model:value="schedule.ma_mh" />
      </a-form-item>
      Tên môn học
      <a-form-item>
        <a-input v-model:value="nameSubject" :disabled="true" />
      </a-form-item>

      Nhóm môn học
      <a-form-item>
        <a-input v-model:value="schedule.nmh" :disabled="true" />
      </a-form-item>

      Phòng học
      <a-form-item>
        <a-input maxlength="5" v-model:value="classroom" />
        <small v-if="errors.phong_hoc" class="text-danger">{{
          errors.phong_hoc[0]
        }}</small>
      </a-form-item>

      <span>Số tiết bắt đầu</span>
      <a-form-item>
        <a-input :disabled="true" v-model:value="schedule.st_bd" />
      </a-form-item>
      <span>Số tiết Kết thúc</span>
      <a-form-item>
        <a-input :disabled="true" v-model:value="schedule.st_kt" />
      </a-form-item>

      <span>Ngày bắt đầu</span>
      <a-form-item>
        <a-input :disabled="true" v-model:value="schedule.ngay_bd" />
      </a-form-item>

      <span>Ngày kết thúc</span>
      <a-form-item>
        <a-input :disabled="true" v-model:value="schedule.ngay_kt" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { onMounted, defineComponent, ref, computed, watch } from "vue";
import { useMenu, useUser } from "../../../stores/use-menu";
import axios from "../../../axios";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    const store = useMenu();
    const teachingSchedules = ref([]);
    const userStore = useUser();
    const magv = computed(() => userStore.getma);
    const openModalEdit = ref(false);
    const schedule = ref({});
    const classroom = ref("");
    const nameSubject = ref("");
    const errors = ref("");

    const save = () => {
      axios
        .post("save-schedule", {
          ma_gd: schedule.value.ma_gd,
          phong_hoc: classroom.value,
        })
        .then((response) => {
          message.success(response.data.message);
          setTimeout(() => {
            location.reload();
          }, 300);
          console.log(response.data);
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

    const edit = (ma_gd) => {
      axios
        .post("/edit-schedule", {
          ma_gd: ma_gd,
        })
        .then((response) => {
          schedule.value = response.data;
          nameSubject.value = response.data.mon_hoc["ten_mh"];
          classroom.value = response.data.phong_hoc;
          console.log(response.data);
          console.log(classroom.value);
        })
        .catch((error) => {});
      openModalEdit.value = true;
    };
    const confirm = (ma_gd) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000, {});
      }).then(() => {
        axios
          .delete(`/teaching-schedule/${ma_gd}`)
          .then((response) => {
            message.success(response.data.message);
            setTimeout(() => {
              location.reload();
            }, 300);
          })
          .catch((error) => {
            message.error(error.response.data.error);
          });
      });
    };
    watch(
      magv,
      (newValue) => {
        if (newValue) {
          axios
            .get(`/teaching-schedule/${newValue}`)
            .then((response) => {
              teachingSchedules.value = response.data;
            })
            .catch((error) => {
              console.error(
                "Error fetching teaching schedules:",
                error.response?.data?.message || error.message
              );
            });
        }
      },
      { immediate: true }
    );

    store.onSelectedKeys(["admin-lichgiangday"]);
    return {
      teachingSchedules,
      magv,
      confirm,
      edit,
      openModalEdit,
      schedule,
      save,
      nameSubject,
      classroom,
      errors,
    };
  },
});
</script>
<style>
a {
  text-decoration: none;
}
</style>
