<template>
  <a-card title="Điểm danh" style="width: 100%">
    <form @submit.prevent="filterCalendar()">
      <a-card>
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-12 col-sm-9 d-flex flex-wrap flex-sm-nowrap">
                <div class="d-flex flex-column">
                  <span>Chọn đợt</span>
                  <a-select
                    v-model:value="province"
                    :options="provinceData.map((pro) => ({ value: pro }))"
                    class="me-2 mb-sm-0 mb-2 responsive-width"
                  ></a-select>
                </div>
                <div class="d-flex flex-column">
                  <span>Ngày điểm danh</span>
                  <a-date-picker v-model:value="selectedDate" class="me-2 mb-sm-0 mb-2 responsive-width" />
                </div>
                <div class="d-flex flex-column">
                  <span>Chọn lớp học phần</span>
                  <a-select
                    v-model:value="secondCity"
                    :options="cities.map((city) => ({ value: city }))"
                    class="me-2 mb-sm-0 mb-2 responsive-width"
                  ></a-select>
                </div>
              </div>
              <div
                class="col-12 col-sm-3 d-flex justify-content-end align-items-end mt-3 mt-sm-0"
              >
                <a-button type="primary" html-type="submit">
                  <span>Tìm lịch</span>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </form>

    <a-card class="mt-2">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Thứ 3: tiết 1 -> 3">
          <form @submit.prevent="sendLish()">
            <a-button html-type="submit" type="primary" class="me-2 mb-2"
              >Lưu điểm danh</a-button
            >
            <a-button type="primary" class="me-2 mb-2">Xuất excel</a-button>
            <a-table
              :row-selection="rowSelection"
              :dataSource="data.dataSource"
              :columns="data.columns"
              :scroll="{ x: 2000 }"
            >
              <template #bodyCell="{ column, index, record }">
                <template v-if="column.key === 'stt'">
                  <span>{{ index + 1 }}</span>
                </template>
                <template v-if="column.key === 'cophep'">
                  <a-checkbox v-model:checked="record.cophep" @click="toggleCoPhep(record)"></a-checkbox>
                </template>
                <template v-if="column.key === 'khongphep'">
                  <a-checkbox v-model:checked="record.khongphep" @click="toggleKhongPhep(record)"></a-checkbox>
                </template>
              </template>
            </a-table>
          </form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Thứ 5: tiết 4 -> 6" force-render
          >Content of Tab Pane 2</a-tab-pane
        >
        <a-tab-pane key="3" tab="Thứ 6: tiết 7 -> 9">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
</template>

<script>
const provinceData = [
  "Học kỳ 1 năm học 2024-2025",
  "Học kỳ 2 năm học 2024-2025",
  "Học kỳ 3 năm học 2024-2025",
];
const cityData = {
  "Học kỳ 1 năm học 2024-2025": [
    "Toán A1 (Hàm 1 biến, chuỗi)",
    "Thực hành Tin học đại cương",
    "Tiếng Anh 1",
  ],
  "Học kỳ 2 năm học 2024-2025": ["Kỹ thuật số", "Tiếng Anh 2", "Triết học Mác - Lênin"],
  "Học kỳ 3 năm học 2024-2025": [
    "Toán A2 (Hàm nhiều biến, giải tích vec tơ)",
    "Kinh tế chính trị Mác - Lênin",
    "Nhập môn lập trình",
  ],
};
import { useMenu, useUser } from "../../../stores/use-menu.js";
import { defineComponent, reactive, toRefs, computed, watch, ref, unref } from "vue";
import data from "./data.json";
import { Radio, Table } from "ant-design-vue";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-diemdanh"]);
    const userStore = useUser();
    const magv = computed(() => userStore.getmagv);
    const hocKy = ref([]);

    const province = provinceData[0];
    const state = reactive({
      province,
      provinceData,
      cityData,
      secondCity: cityData[province][0],
      selectedDate: null,
      data,
    });
    const cities = computed(() => {
      return cityData[state.province];
    });
    watch(
      () => state.province,
      (val) => {
        state.secondCity = state.cityData[val][0];
      }
    );
    const filterCalendar = () => {
      const formattedDate = state.selectedDate
        ? new Date(state.selectedDate).toLocaleDateString()
        : "";
    };
    //Table
    const selectedRowKeys = ref([]);

    const onSelectChange = (changableRowKeys) => {
      selectedRowKeys.value = changableRowKeys;
    };

    const toggleCoPhep = (record) => {
      record.cophep = !record.cophep;
      if (record.cophep) {
        record.comat = false;
        record.khongphep = false;
      }
    }

    const toggleKhongPhep = (record) => {
      record.khongphep = !record.khongphep;
      if (record.khongphep) {
        record.comat = false;
        record.cophep = false;
      }
    }

    const toggleCoMat = (record) => {
      record.comat = !record.comat;
      if (record.comat) {
        record.cophep = false;
        record.khongphep = false;
      }
    }

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        onSelect: toggleCoMat,
        hideDefaultSelections: true,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
          Table.SELECTION_NONE,
          {
            key: "odd",
            text: "Select Odd Row",
            onSelect: (changableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
                if (index % 2 !== 0) {
                  return false;
                }
                return true;
              });
              selectedRowKeys.value = newSelectedRowKeys;
            },
          },
          {
            key: "even",
            text: "Select Even Row",
            onSelect: (changableRowKeys) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
                if (index % 2 !== 0) {
                  return true;
                }
                return false;
              });
              selectedRowKeys.value = newSelectedRowKeys;
            },
          },
        ],
      };
    });

    const sendLish = () => {
      const collectedData = state.data.dataSource
    .map(record => ({
      key: record.key,
      mssv: record.mssv,
      name: record.name,
      cophep: record.cophep,
      khongphep: record.khongphep,
      comat: record.comat
    }));

      // Gửi dữ liệu lên server hoặc xử lý tiếp theo tại đây
      // Ví dụ gửi dữ liệu bằng axios
      /*
      axios.post('/api/attendance', collectedData)
        .then(response => {
          console.log('Dữ liệu đã được gửi thành công:', response.data);
        })
        .catch(error => {
          console.error('Lỗi khi gửi dữ liệu:', error);
        });
      */
    }

    return {
      ...toRefs(state),
      cities,
      filterCalendar,
      activeKey: ref("1"),
      selectedRowKeys,
      rowSelection,
      sendLish,
      toggleCoPhep,
      toggleKhongPhep,
      toggleCoMat
    };
  },
});
</script>
<style>
.responsive-width {
  width: 100%;
}

@media (min-width: 1024px) {
  .responsive-width {
    width: 230px;
  }
}
</style>
