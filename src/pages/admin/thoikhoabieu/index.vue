<template>
  <a-card title="Thời khóa biểu" style="width: 100%">
    <form @submit.prevent="">
      <a-card>
        <a-select
          ref="select"
          v-model:value="value1"
          :options="hocKy"
          @change="handleChange"
          >{{ hocKy.value }}</a-select
        >
      </a-card>
    </form>
    <a-card class="mt-2">
      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1500, y: 300 }"
      >
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
import { useMenu, useUser } from "../../../stores/use-menu.js";
import { computed, defineComponent, ref, watch } from "vue";
import { columnstest, datatest } from "./data.json";
import axios from "../../../axios.js";
// import axios from "axios";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-thoikhoabieu"]);
    const userStore = useUser();
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const magv = computed(() => userStore.getmagv);

    const hocKy = ref([]);
    const value1 = ref("");
    const data = ref([]);

    const getHocKy = () => {
      axios
        .get(`hocky/${magv.value}`)
        .then((response) => {
          extractHocKy(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const extractHocKy = (lichValue) => {
      // Transform the hoc_ky strings to the desired format
      const transformedHocKy = lichValue.map((item) => {
        const parts = item.match(/Học kỳ (\d) năm học (\d{4})-\d{4}/);
        if (parts) {
          const hocKy = parts[1];
          const year = parts[2].slice(2);
          return {
            label: item,
            value: `${hocKy}${year}`,
          };
        }
        return { label: item, value: item }; // Fallback in case of unexpected format
      });

      hocKy.value = transformedHocKy;

      if (hocKy.value.length > 0) {
        value1.value = hocKy.value[0].value;
      }
    };

    const columns = columnstest;

    const handleChange = (value) => {
      // fetchLichGDByHocKy(value);
      console.log(value);
    };

    // const fetchLichGDByHocKy = (hocKy) => {
    //   axios
    //     .get(`lichgd/${magv.value}?hoc_ky=${hocKy}`)
    //     .then((response) => {
    //       data.value = response.data;
    //       console.log(response);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // };
    getHocKy();

    return {
      value1,
      data,
      columns,
      handleChange,
      hocKy,
    };
  },
});
</script>
