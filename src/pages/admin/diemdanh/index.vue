<template>
  <a-card title="Điểm danh" style="width: 100%">
    <form @submit.prevent="filterCalendar()">
      <a-card>
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-12 col-sm-9 d-flex flex-wrap">
                <div class="d-flex flex-column">
                  <span>Chọn đợt</span>
                  <a-select
                    v-model:value="selectedHocKy"
                    :options="hocKy"
                    class="me-2 mb-sm-0 mb-2"
                    style="width: 230px;"
                  ></a-select>
                </div>
                <div class="d-flex flex-column">
                  <span>Ngày điểm danh</span>
                  <a-date-picker
                    v-model:value="selectedDate"
                    class="me-2 mb-sm-0 mb-2"
                    style="width: 230px;"
                  />
                </div>
                <div class="d-flex flex-column">
                  <span>Chọn lớp học phần</span>
                  <a-select
                    v-model:value="selectedMonHoc"
                    :options="filteredMonHoc"
                    class="me-2 mb-sm-0 mb-2"
                    style="width: 230px;"
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
              :dataSource="users"
              :columns="columns"
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
        <a-tab-pane key="3" tab="Thứ 6: tiết 7 -> 9"
          >Content of Tab Pane 3</a-tab-pane
        >
      </a-tabs>
    </a-card>
  </a-card>
</template>

<script>
import { useMenu, useUser } from "../../../stores/use-menu.js";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { Table } from "ant-design-vue";
import axios from "../../../axios";
import { message } from "ant-design-vue";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-diemdanh"]);

    const userStore = useUser();
    const magv = computed(() => userStore.getma);
    //Tim lich
    const hocKy = ref([]);
    const monHoc = ref([]);
    const selectedHocKy = ref("");
    const selectedMonHoc = ref("");
    const filteredMonHoc = ref([]);
    const selectedDate = ref("");
    //Hien thi danh sach sinh vien
    const columns = [
      {
        title: "STT",
        dataIndex: "id",
        key: "id",
        fixed: true,
        width: "5%",
      },
      {
        title: "MSSV",
        dataIndex: "ma_sv",
        key: "mssv"
      },
      {
        title: "Họ tên",
        dataIndex: "ten_sv",
        key: "name"
      },
      {
        title: "Lớp học",
        dataIndex: "ma_lop",
        key: "class"
      },
      {
        title: "Có phép",
        dataIndex: "cophep",
        key: "cophep"
      },
      {
        title: "Không phép",
        dataIndex: "khongphep",
        key: "khongphep"
      },
      {
        title: "Nhập số tiết",
        dataIndex: "nhapsotiet",
        key: "nhapsotiet"
      },
      {
        title: "Ghi chú",
        dataIndex: "ghichu",
        key: "ghichu"
      },
      {
        title: "Vắng có phép",
        dataIndex: "vangcophep",
        key: "vangcophep"
      },
      {
        title: "Vắng không phép",
        dataIndex: "vangkhongphep",
        key: "vangkhongphep"
      },
      {
        title: "Tổng số tiết",
        dataIndex: "tongsotiet",
        key: "tongsotiet"
      },
      {
        title: "Tỉ lệ vắng",
        dataIndex: "tilevang",
        key: "tilevang"
      }
    ];
    const users = ref([]);
    //Tim lich
    const getLich = async () => {
      if (magv.value) {
        try {
          const response = await axios.get(`getLichDiemDanh/${magv.value}`);
          extractLich(response.data);
          // console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const extractLich = (lichValue) => {
      const transformedHocKy = Array.from(new Set(lichValue.map(item => item.hoc_ky)))
        .map(hoc_ky => ({
          label: lichValue.find(item => item.hoc_ky === hoc_ky).hoc_ky_text,
          value: hoc_ky
        }));
      hocKy.value = transformedHocKy;

      monHoc.value = lichValue.map(item => ({
        hoc_ky: item.hoc_ky,
        label: item.ten_mh + " - Tiết " + item.st_bd,
        value: item.ma_gd,
        ma_mh: item.ma_mh,
        st_bd: item.st_bd
      }));
    };

    //Hien thi danh sach sinh vien
    const filterCalendar = () => {
      // Gửi yêu cầu tìm lịch điểm danh với các thông tin đã chọn
      // Thực hiện logic gửi request tới server với các thông tin đã chọn
      console.log(selectedMonHoc.value);
      console.log(dayjs(selectedDate.value).format('YYYY-MM-DD'));
      if (magv.value && selectedHocKy.value && selectedMonHoc.value && selectedDate.value) {
        axios.post('/getDanhSachSinhVien', {
          ma_gd: selectedMonHoc.value,
          ngay_diem_danh: dayjs(selectedDate.value).format("YYYY-MM-DD"),
        })
        .then(response => {
          // console.log('Lịch điểm danh đã được gửi lên server:', response.data);
          // Xử lý kết quả nếu cần
          console.log(response.data);
          users.value = response.data;
        })
        .catch(error => {
          console.error('Lỗi khi gửi yêu cầu điểm danh:', error);
          message.error(error.response.data.message);
        });
      } else {
        message.warn('Vui lòng chọn đầy đủ thông tin để tìm lịch điểm danh.');
      }
    };


    watch(selectedHocKy, (newHocKy) => {
      filteredMonHoc.value = monHoc.value.filter(item => item.hoc_ky === newHocKy);
      if (filteredMonHoc.value.length > 0) {
        selectedMonHoc.value = filteredMonHoc.value[0].value;
      } else {
        selectedMonHoc.value = "";
      }
    });

    // watch(selectedMonHoc, (newMonHoc) => {
    //   console.log(newMonHoc);
    // })

    watch(magv, (newMagv) => {
      if (newMagv) {
        getLich();
      }
    });
    onMounted((magv) => {
      getLich();
    });

    return {
      hocKy,
      filteredMonHoc,
      selectedHocKy,
      selectedMonHoc,
      selectedDate,
      filterCalendar,
      columns,
      users
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
