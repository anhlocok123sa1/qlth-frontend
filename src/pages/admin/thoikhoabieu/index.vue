<template>
  <a-card title="Thời khóa biểu" style="width: 100%">
    <form @submit.prevent="">
      <a-card>
        <a-select
          ref="select"
          v-model:value="value1"
          :options="datas"
          @change="handleChange"
          >{{ datas.value }}</a-select
        >
      </a-card>
    </form>
    <a-card class="mt-2">
      <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a>action</a>
          </template>
        </template>
      </a-table>
      <!-- {{ handleChangevalue }} -->
    </a-card>
  </a-card>
</template>

<script>
import { useMenu } from "../../../stores/use-menu.js";
import { ref } from "vue";
import { columnstest, datatest } from "./data.json";
// import axios from "axios";
export default {
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-thoikhoabieu"]);

    const value1 = ref("Học kỳ 1 năm học 2024-2025");

    const columns = columnstest;
    const data = datatest;

    const datas = ref([
      {
        label: "Học kỳ 1 năm học 2024-2025",
        value: "1",
      },
      {
        label: "Học kỳ 2 năm học 2024-2025",
        value: "2",
      },
      {
        label: "Học kỳ 3 năm học 2024-2025",
        value: "3",
      },
    ]);

    const handleChangevalue = ref();

    const handleChange = (value) => {
      handleChangevalue.value = value;
      // axios
      //   .post("https://backend.quanlytruonghoc.id.vn/api/users", {
      //     handleChangevalue: handleChangevalue.value,
      //   })
      //   .then((response) => {
      //     users.value = response.data;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    };

    return {
      datas,
      value1,
      data,
      columns,
      handleChange,
      handleChangevalue,
    };
  },
};
</script>
