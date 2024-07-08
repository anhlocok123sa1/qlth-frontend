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
          >{{ hocKy.value }}</a-select
        >
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
    <a-card class="mt-2" style="overflow: hidden; overflow-x: auto">
      <table v-if="selectView" class="styled-table">
        <thead>
          <tr>
            <th>Mã môn học</th>
            <th>Tên môn học</th>
            <th>NMH</th>
            <th>Số tiết</th>
            <th>Tiết bắt đầu</th>
            <th>Tiết kết thúc</th>
            <th>Phòng</th>
            <th>CBGV</th>
            <th>Tuần</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.key">
            <td>{{ item.MaMH }}</td>
            <td>{{ item.TenMH }}</td>
            <td>{{ item.NMH }}</td>
            <td>{{ item.SoTiet }}</td>
            <td>{{ item.TietBD }}</td>
            <td>{{ item.ST }}</td>
            <td>{{ item.Phong }}</td>
            <td>{{ item.TenGV }}</td>
            <td>{{ item.NgayBD }} - {{ item.NgayKT }}</td>
            <td><a>action</a></td>
          </tr>
        </tbody>
      </table>
      <ThoiKhoaBieu v-else :data="tkbWeek" />
    </a-card>
  </a-card>
</template>
<script>
import { useMenuUsers } from "../../../stores/use-menu-users.js";
import { ref, onMounted, watchEffect, watch, defineComponent } from "vue";
import ThoiKhoaBieu from "../../../components/ThoiKhoaBieu.vue";
import axios from "../../../axios.js";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    ThoiKhoaBieu,
  },
  setup() {
    // Lấy store từ useMenuUsers
    const store = useMenuUsers();
    store.onSelectedKeys(["users-timetable"]);
    const token = localStorage.getItem("token");
    const value1 = ref("");
    const value2 = ref("TKB học kỳ cá nhân");
    const value3 = ref("");
    const hocKy = ref([]);
    const tuan = ref([]);
    const tuanStart = ref(0);
    const namRaw = ref("");
    const hocKyRaw = ref("");
    const selectView = ref(true);
    const dataSource = ref();
    const tkbWeek = ref([]);
    const data = ref([]);
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
    const handleChangeSelect = (value) => {
      fetchLichGDByHocKy(value);
      updateTuan(value);
    };
    const handleChangeSelectStyle = (value) => {
      selectView.value = !selectView.value;
    };

    const handleChangeSelectTuan = async (value) => {
      const response = await axios.get(`getTKBWeek/${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      tkbWeek.value = response.data;
    };

    const getHocKy = () => {
      axios
        .get(`hocky`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          extractHocKy(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
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
      axios
        .get(`thoi-khoa-bieu/${hocKy}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          watchEffect(() => {
            data.value = response.data;
          });
        })
        .catch((error) => {
          console.log(error);
        });
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
      let firstMonday =
        firstDayOfSeptember.day() === 1
          ? firstDayOfSeptember
          : firstDayOfSeptember.add(8 - firstDayOfSeptember.day(), "day");

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
      value1,
      value2,
      value3,
      hocKy,
      tuan,
      styleTKB,
      tkbWeek,
      selectView,
      handleChangeSelect,
      handleChangeSelectStyle,
      handleChangeSelectTuan,
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
