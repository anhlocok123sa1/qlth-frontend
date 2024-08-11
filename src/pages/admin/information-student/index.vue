<template>
  <div class="row">
    <div class="content">
      <h2>Tra cứu thông tin sinh viên</h2>
      <a-input-search
        v-model:value="name"
        placeholder="Nhập thông tin sinh viên cần tìm"
        enter-button="Tra cứu"
        @search="onSearch"
      />
    </div>
  </div>
  <br />
  <div class="row">
    <div class="col-sm-12">
      <a-table :data-source="students" bordered>
        <a-table-column key="stt" title="Mã số sinh viên" data-index="ma_sv" />
        <a-table-column key="stt" title="Họ và tên" data-index="ten_sv" />
        <a-table-column key="stt" title="Tên lớp" data-index="ten_lop" />
        <a-table-column key="action" title="">
          <template #default="{ record }">
            <span>
              <!-- edit -->
              <router-link
                :to="{
                  name: 'admin-tracuuthongtin/see-details-student',
                  params: {
                    ma_sv: record.ma_sv,
                  },
                }"
              >
                <a-button style="background-color: lavender">Tra cứu</a-button>
              </router-link>
              <br />
            </span>
          </template>
        </a-table-column>
      </a-table>
    </div>
  </div>
</template>
<script>
import { onMounted, defineComponent, ref, computed, watch } from "vue";
import { useMenu, useUser } from "../../../stores/use-menu";
import axios from "../../../axios";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useMenu();
    const userStore = useUser();
    const magv = computed(() => userStore.getma);
    const name = ref("");
    const students = ref([]);

    const seeDetails = (ma_sv) => {
      message.warn(ma_sv);
    };

    const onSearch = () => {
      if (name.value === "") {
        message.warn("Vui lòng nhập thông tin");
        return;
      }

      axios
        .post("/look-up-information", {
          ma_gv: magv.value,
          name: name.value,
        })
        .then((response) => {
          students.value = response.data;
          if (response.data.length === 0) {
            message.warn("Không tìm thấy thông tin");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    store.onSelectedKeys(["admin-tracuuthongtin"]);
    return { onSearch, name, students, seeDetails };
  },
});
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}
.row {
  justify-content: center;
}
.content {
  text-align: center;
  max-width: 500px;
  width: 100%;
}
h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.a-input-search {
  width: 100%;
}
</style>
