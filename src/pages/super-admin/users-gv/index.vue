<template>
  <a-card title="Tài khoản giáo viên" style="width: 100%">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <router-link :to="{ name: 'admin-users-gv-create' }">
          <a-button type="primary">
            <i class="fa-solid fa-plus"></i>
          </a-button>
        </router-link>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-mb-4 col-sm-4 d-flex justify-content-end">
        <a-input-search
          v-model:value="data"
          placeholder="Nhập tên hoặc mã giáo viên"
          enter-button
          allow-clear
          @search="onSearch"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <a-table :dataSource="users" :columns="columns" :scroll="{ x: 576 }">
          <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'index'">
              <span>{{ index + 1 }}</span>
            </template>

            <template v-if="column.key == 'sex'">
              <span v-if="record.phai === 1">Nam</span>
              <span v-else>Nữ</span>
            </template>

            <template v-if="column.key === 'actions'">
              <router-link
                :to="{
                  name: 'admin-users-gv-edit',
                  params: { id: record.ma_gv },
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
                @click="deleteUsers(record.ma_gv)"
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
// import axios from "axios";
import axios from "../../../axios.js";
import { Modal } from "ant-design-vue";
import { message } from "ant-design-vue";
import { useMenu } from "../../../stores/use-menu.js";
import { defineComponent, ref, createVNode, onMounted } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-users-gv"]);
    const data = ref("");
    const users = ref([]);
    const columns = [
      {
        title: "#",
        dataIndex: "id",
        key: "index",
        width: "5%",
      },
      {
        title: "Tài khoản",
        dataIndex: "ma_gv",
        key: "username",
      },
      {
        title: "Họ tên",
        dataIndex: "name",
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

    const getUsers = () => {
      axios
        .get("taikhoangvs", {
          params: {
            nameOrID: data.value,
          },
        })
        .then((response) => {
          users.value = response.data;
          console.log(response.data);
          if (users.value.length == 0) {
            message.warn("Không tìm thấy ");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const deleteUsers = (id) => {
      Modal.confirm({
        title: "Bạn có muốn xóa tài khoản này?",
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          axios
            .delete(`/taikhoangv/${id}`)
            .then((response) => {
              if (response.status == 200) {
                message.success("Xóa tài khoản thành công!");
                getUsers();
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

    const onSearch = () => {
      getUsers();
    };
    onMounted(() => {
      getUsers();
    });

    return { users, columns, deleteUsers, data, onSearch };
  },
});
</script>
