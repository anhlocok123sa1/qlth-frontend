<template>
  <div class="container-fluid department">
    <div class="row">
      <div class="col-sm-12 d-sm-flex">
        <div class="col-12 col-sm-6"><h2>DANH SÁCH KHOA</h2></div>
        <div class="col-12 col-sm-6 d-sm-flex justify-content-sm-end">
          <a-button type="primary" @click="add">
            <i class="fa-solid fa-circle-plus" style="margin-right: 2px"> </i>
            <span> Thêm mới</span>
          </a-button>
        </div>
      </div>
    </div>

    <!-- search name khoa -->
    <div class="row mt-2">
      <div class="col-sm-12">
        <div class="col-sm-4">
          <a-input-search
            v-model:value="searchValue"
            placeholder="Nhập mã hoặc tên khoa cần tìm"
            enter-button="Tìm kiếm"
            size="smoll"
            allow-clear
            @search="onSearch()"
          />
        </div>
      </div>
    </div>

    <!-- table -->
    <div class="row-">
      <div class="col-sm-12">
        <a-table :data-source="departments">
          <a-table-column key="stt" title="STT" data-index="stt" />
          <a-table-column key="stt" title="Mã khoa" data-index="ma_khoa" />
          <a-table-column key="stt" title="Tên khoa" data-index="ten_khoa">
          </a-table-column>
          <a-table-column key="action" title="Thao tác">
            <template #default="{ record }">
              <span>
                <router-link
                  :to="{
                    name: 'department-edit',
                    params: { ma_khoa: record.ma_khoa },
                  }"
                >
                  <i
                    class="fa-solid fa-pen-to-square"
                    style="margin-right: 10px"
                  ></i>
                </router-link>
                <a>
                  <a-popconfirm
                    :title="`Bạn có muốn xóa mã khoa ${record.ma_khoa}`"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="() => confirm(record.ma_khoa)"
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
    const departments = ref([]);
    const searchValue = ref("");
    const router = useRouter();
    const getListDepartment = () => {
      axios
        .get("list-department", {
          params: {
            ten_khoa: searchValue.value,
          },
        })
        .then((response) => {
          departments.value = response.data;
          if (departments.value.length == 0) {
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
      getListDepartment();
    };
    // chuyen hướng qua trang thêm sinh viên
    const add = () => {
      router.push({ name: "department-create" });
    };
    const confirm = (ma_khoa) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000, {});
      }).then(() => {
        axios
          .delete(`/delete-department/${ma_khoa}`)
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
    store.onSelectedKeys(["department"]);
    getListDepartment();
    return {
      departments,
      getListDepartment,
      onSearch,
      searchValue,
      add,
      confirm,
    };
  },
});
</script>
