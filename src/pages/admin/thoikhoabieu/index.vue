<template>
  <a-card title="Thời khóa biểu" style="width: 100%">
    <form @submit.prevent="">
      <a-card>
        <a-select
          ref="select"
          v-model:value="value1"
          :options="hocKy"
          @change="handleChangeSelect"
          @focus="focus"
          class="mb-2 me-2"
        >{{ hocKy.value }}</a-select>
        <a-select
          ref="select"
          v-model:value="value2"
          :options="styleTKB"
          style="width: 200px"
          @change="handleChangeSelectStyle"
          class="mb-2 me-2"
        ></a-select>
        <a-select
          ref="select"
          v-model:value="value3"
          :options="tuan"
          style="width: 270px"
          @change="handleChangeSelectTuan"
          v-if="!selectView"
        >
        </a-select>
      </a-card>
    </form>
    <a-card class="mt-2">
      <table v-if="selectView" class="styled-table">
        <thead>
          <tr>
            <th>Mã môn học</th>
            <th>Tên môn học</th>
            <th>Số tiết</th>
            <th>Thứ</th>
            <th>Tiết bắt đầu</th>
            <th>Tiết kết thúc</th>
            <th>Phòng</th>
            <th>Tuần</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.key">
            <td>{{ item.MaMH }}</td>
            <td>{{ item.TenMH }}</td>
            <td>{{ item.SoTiet }}</td>
            <td>{{ item.Thu }}</td>
            <td>{{ item.TietBD }}</td>
            <td>{{ item.ST }}</td>
            <!-- <td>{{ item.Phong }}</td> -->
            <td>{{ item.NgayBD }} - {{ item.NgayKT }}</td>
            <td>{{ item.Tuan }}</td>
            <td><a>action</a></td>
          </tr>
        </tbody>
      </table>
    </a-card>
  </a-card>
</template>

<script>
import { useMenu, useUser } from "../../../stores/use-menu.js";
import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import axios from "../../../axios.js";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-thoikhoabieu"]);
    const userStore = useUser();
    const magv = computed(() => userStore.getma);
    const hocKy = ref([]);
    const value1 = ref("");
    const data = ref([]);
    const dataSource = ref();
    
    const value2 = ref("TKB học kỳ cá nhân");
    const value3 = ref("");
    const tuanStart = ref(0);
    const tuan = ref([]);
    const namRaw = ref("");
    const hocKyRaw = ref("");
    const selectView = ref(true);
    const styleTKB = ref([
      {
        value: 0,
        label: "TKB học kỳ cá nhân",
      },
      {
        value: 1,
        label: "TKB theo tuần",
      },
    ]);

    const getHocKy = () => {
      if (magv.value) {
        axios
          .get(`hocky/${magv.value}`)
          .then((response) => {
            extractHocKy(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    const extractHocKy = (lichValue) => {
      const uniqueHocKySet = new Set();
      const transformedHocKy = [];

      lichValue.forEach((item) => {
        if (!uniqueHocKySet.has(item.hoc_ky)) {
          uniqueHocKySet.add(item.hoc_ky);
          transformedHocKy.push({
            label: item.hoc_ky_text,
            value: item.hoc_ky,
          });
        }
      });

      hocKy.value = transformedHocKy;

      if (hocKy.value.length > 0) {
        value1.value = hocKy.value[0].value;
        fetchLichGDByHocKy(value1.value);
        updateTuan(value1.value);
      }
    };

    const fetchLichGDByHocKy = (hocKy) => {
      if (magv.value) {
        axios
          .get(`lichgd/${magv.value}?hoc_ky=${hocKy}`)
          .then((response) => {
            watchEffect(() => {
              data.value = response.data;
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    const handleChangeSelect = (value) => {
      fetchLichGDByHocKy(value);
      updateTuan(value);
    };

    const updateTuan = (hocKy) => {
      hocKyRaw.value = parseInt(hocKy / 100);
      namRaw.value = hocKy % 100;
      let startWeek, endWeek;
      if (hocKyRaw.value == 1) {
        startWeek = 1;
        endWeek = 24;
      } else if (hocKyRaw.value == 2) {
        startWeek = 25;
        endWeek = 43;
      } else if (hocKyRaw.value == 3) {
        startWeek = 44;
        endWeek = 52;
      }
      tuanStart.value = startWeek;
      tuan.value = [];
      // Calculate the first Monday of September for the given year
      let firstDayOfSeptember = dayjs(`20${namRaw.value}-09-01`);
      let firstMonday = firstDayOfSeptember.day() === 1
        ? firstDayOfSeptember
        : firstDayOfSeptember.add(8 - firstDayOfSeptember.day(), 'day');

      let startDate = firstMonday;

      for (let i = startWeek; i <= endWeek; i++) {
        let weekStart = startDate.add((i - 1) * 7, "day").format("DD/MM/YYYY");
        let weekEnd = startDate.add(i * 7 - 1, "day").format("DD/MM/YYYY");
        tuan.value.push({
          value: `${weekStart.replace(/\//g, "")}`,
          label: `Tuần ${i} (${weekStart} - ${weekEnd})`,
        });
      }
    };

    const handleChangeSelectStyle = (value) => {
      selectView.value = !selectView.value;
    };

    const handleChangeSelectTuan = async (value) => {
      console.log(value);
      const token = localStorage.getItem("token");
      const response = await axios.get(`getTKBWeek/${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    };

    watch(magv, (newMagv) => {
      if (newMagv) {
        getHocKy();
      }
    });

    watch(data, (newData) => {
      if (newData) {
        dataSource.value = data.value;
      }
    });

    onMounted(() => {
      getHocKy();
    });

    return {
      data,
      tuan,
      hocKy,
      value1,
      value2,
      value3,
      styleTKB,
      selectView,
      handleChangeSelect,
      handleChangeSelectTuan,
      handleChangeSelectStyle,
    };
  },
});
</script>

<style>
.styled-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  width: 100%;
  display: block;
  overflow-x: auto;
  white-space: nowrap;
}
.styled-table thead tr {
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.88);
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}
.styled-table th {
  padding: 12px 15px;
  font-weight: 600;
}
.styled-table td {
  padding: 12px 15px;
}
.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #ffffff;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 1px solid #f0f0f0;
}
</style>
