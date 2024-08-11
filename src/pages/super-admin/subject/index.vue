<template>
  <div class="container-fluid department">
    <div class="row">
      <div class="col-sm-12 d-sm-flex">
        <div class="col-12 col-sm-6"><h2>DANH SÁCH MÔN HỌC</h2></div>
        <div class="col-12 col-sm-6 d-sm-flex justify-content-sm-end">
          <a-button type="primary" @click="add">
            <i class="fa-solid fa-circle-plus" style="margin-right: 2px"> </i>
            <span> Thêm mới</span>
          </a-button>
        </div>
      </div>
    </div>

    <!-- search name khoa -->
    <div class="row mt-2 mb-2">
      <div class="col-sm-12">
        <div class="col-sm-4">
          <a-input-search
            v-model:value="searchValue"
            placeholder="Nhập mã hoặc tên môn học cần tìm"
            enter-button="Tìm kiếm"
            size="smoll"
            allow-clear
            @search="onSearch()"
          />
        </div>
      </div>
    </div>

    <!-- table -->
    <div class="row">
      <div class="col-sm-12">
        <a-table :data-source="subjects">
          <a-table-column key="stt" title="STT" data-index="stt" />
          <a-table-column key="stt" title="Mã môn học" data-index="ma_mh" />
          <a-table-column key="stt" title="Tên môn học" data-index="ten_mh">
          </a-table-column>
          <a-table-column key="action" title="Thao tác">
            <template #default="{ record }">
              <span>
                <router-link
                  :to="{
                    name: 'subject-edit',
                    params: { ma_mh: record.ma_mh },
                  }"
                >
                  <i
                    class="fa-solid fa-pen-to-square"
                    style="margin-right: 10px"
                  ></i>
                </router-link>
                <a>
                  <a-popconfirm
                    :title="`Bạn có muốn xóa mã khoa ${record.ma_mh}`"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="() => confirm(record.ma_mh)"
                  >
                    <a href="#">Delete</a>
                  </a-popconfirm>
                </a>
              </span>
            </template>
          </a-table-column>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useMenu } from "../../../stores/use-menu.js";

import "../../../css/supper_admin/department.css";
import axios from "../../../axios.js";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const store = useMenu();
    const subjects = ref([]);
    const searchValue = ref("");
    const router = useRouter();
    const getListSubject = () => {
      axios
        .get("list-subject", {
          params: {
            ten_mh: searchValue.value,
          },
        })
        .then((response) => {
          subjects.value = response.data;
          console.log(subjects.value);
          if (subjects.value.length == 0) {
            message.warn("Không tìm thấy ");
            return;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    //tìm kiếm theo tên
    const onSearch = () => {
      getListSubject();
    };
    // chuyen hướng qua trang thêm sinh viên
    const add = () => {
      router.push({ name: "subject-create" });
    };
    const confirm = (ma_mh) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000, {});
      }).then(() => {
        axios
          .delete(`/delete-subject/${ma_mh}`)
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
    //=====================*===============
    store.onSelectedKeys(["subject"]);
    getListSubject();
    return {
      subjects,
      getListSubject,
      onSearch,
      searchValue,
      add,
      confirm,
    };
  },
});
</script>
