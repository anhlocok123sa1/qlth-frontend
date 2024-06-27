<template>
  <a-card title="Tài khoản sinh viên" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <router-link :to="{ name: 'admin-users-sv-create' }">
          <a-button type="primary">
            <i class="fa-solid fa-plus"></i>
          </a-button>
        </router-link>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <a-table
          :dataSource="users"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          :scroll="{ x: 576 }"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ (currentPage - 1) * pageSize + index + 1 }}</span>
            </template>

            <template v-if="column.key == 'sex'">
              <span v-if="record.phai === 1">Nam</span>
              <span v-else>Nữ</span>
            </template>

            <template v-if="column.key === 'actions'">
              <router-link
                :to="{
                  name: 'admin-users-sv-edit',
                  params: { id: record.ma_sv },
                }"
              >
                <a-button type="primary" class="me-sm-2">
                  <i class="fa-solid fa-pen-to-square"></i>
                </a-button>
              </router-link>
              <a-button
                type="primary"
                danger
                class="mt-2"
                @click="deleteUsers(record.ma_sv)"
              >
                <i class="fa-solid fa-trash"></i>
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-card>
</template>

<script>
import axios from "../../../axios.js";
import { Modal } from "ant-design-vue";
import { message } from "ant-design-vue";
import { useMenu } from "../../../stores/use-menu.js";
import { defineComponent, ref, createVNode, computed } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-users-sv"]);

    const users = ref([]);
    const totalUsers = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const loading = ref(false);

    const columns = [
      {
        title: "#",
        dataIndex: "id",
        key: "index",
        width: "5%",
      },
      {
        title: "Tài khoản",
        dataIndex: "ma_sv",
        key: "username",
      },
      {
        title: "Họ tên",
        dataIndex: "ten_sv",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Giới tính",
        dataIndex: "phai",
        key: "sex",
      },
      {
        title: "Công cụ",
        key: "actions",
        fixed: "right",
      },
    ];

    const getUsers = (params = {}) => {
      loading.value = true;
      axios
        .get("taikhoansvs", { params })
        .then((response) => {
          users.value = response.data.data;
          totalUsers.value = response.data.total;
          currentPage.value = response.data.current_page;
          pageSize.value = response.data.per_page;
          loading.value = false;
        })
        .catch((error) => {
          console.log(error);
          loading.value = false;
        });
    };

    const pagination = computed(() => ({
      total: totalUsers.value,
      current: currentPage.value,
      pageSize: pageSize.value,
      showSizeChanger: false,
    }));

    const handleTableChange = (pagination, filters, sorter) => {
      const params = {
        page: pagination.current,
        per_page: pagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      };
      getUsers(params);
    };

    const deleteUsers = (id) => {
      Modal.confirm({
        title: "Bạn có muốn xóa tài khoản này?",
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          axios
            .delete(`/taikhoansv/${id}`)
            .then((response) => {
              if (response.status == 200) {
                message.success("Xóa tài khoản thành công!");
                getUsers({ page: currentPage.value, per_page: pageSize.value });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },
        cancelText: "Hủy",
        onCancel() {
          Modal.destroyAll();
        },
      });
    };

    getUsers({ page: currentPage.value, per_page: pageSize.value });

    return {
      users,
      columns,
      currentPage,
      pageSize,
      totalUsers,
      loading,
      handleTableChange,
      deleteUsers,
      pagination,
    };
  },
});
</script>
