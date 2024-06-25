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
                    style="width: 230px"
                  ></a-select>
                </div>
                <div class="d-flex flex-column">
                  <span>Ngày điểm danh</span>
                  <a-date-picker
                    v-model:value="selectedDate"
                    class="me-2 mb-sm-0 mb-2"
                    style="width: 230px"
                  />
                </div>
                <div class="d-flex flex-column">
                  <span>Chọn lớp học phần</span>
                  <a-select
                    v-model:value="selectedMonHoc"
                    :options="filteredMonHoc"
                    class="me-2 mb-sm-0 mb-2"
                    style="width: 230px"
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
      <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
        <a-tab-pane
          v-for="tab in selectedTabs"
          :key="tab.ma_gd"
          :tab="`Nhóm: ${tab.nmh} - Tiết ${tab.st_bd} -> ${tab.st_kt}`"
        >
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
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'cophep'">
                  <a-checkbox
                    v-model:checked="record.cophep"
                    @change="togglePermission(record, 'cophep')"
                  ></a-checkbox>
                </template>
                <template v-if="column.key === 'khongphep'">
                  <a-checkbox
                    v-model:checked="record.khongphep"
                    @change="togglePermission(record, 'khongphep')"
                  ></a-checkbox>
                </template>
                <template v-if="column.key === 'ghichu'">
                  <a-input v-model:value="record.ghichu" placeholder="Ghi chú" />
                </template>
              </template>
            </a-table>
          </form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
</template>

<script>
import { useMenu, useUser } from "../../../stores/use-menu.js";
import { computed, defineComponent, onMounted, ref, unref, watch } from "vue";
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
    const getListMH = ref([]);
    const selectedTabs = ref([]);
    const activeKey = ref("");
    const keyATab = ref("");
    const users = ref([]);
    //Diem danh
    const selectedRowKeys = ref([]);
    const ma_gd_diemdanh = ref("");
    const ngay_diem_danh = ref("");

    const togglePermission = (record, permission) => {
      if (permission == "cophep") {
        if (record.khongphep) {
          record.khongphep = false;
        } else if (record.comat) {
          record.comat = false;
        selectedRowKeys.value = selectedRowKeys.value.filter(
          (key) => key !== record.key
        );
        }
      } else if (permission == "khongphep") {
        if (record.cophep) {
          record.cophep = false;
        } else if (record.comat) {
          record.comat = false;
          selectedRowKeys.value = selectedRowKeys.value.filter(
          (key) => key !== record.key
        );
        }
      }
    };

    const onSelectChange = (changableRowKeys) => {
      selectedRowKeys.value = changableRowKeys;
    };

    const onSelected = (record, selected) => {
      record.comat = selected;
      if (selected) {
        if (record.cophep) {
          record.cophep = false;
        } else if (record.khongphep) {
          record.khongphep = false;
        }
      }
    };

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        onSelect: onSelected,
        hideDefaultSelections: false,
        hideSelectAll: true,
      };
    });

    const sendLish = async () => {
      const students = users.value.map(user => ({
        ma_sv: user.ma_sv,
        ma_gd: ma_gd_diemdanh.value,
        ngay_diem_danh: ngay_diem_danh.value,
        co_mat: user.comat,
        co_phep: user.cophep,
        khong_phep: user.khongphep,
        ghi_chu: user.ghichu,
      }));
      console.log(students);
      // try {
      //   const response = await axios.post("/diemDanhSinhVien", {
      //     students
      //   });
      //   message.success("Điểm danh thành công!");
      // } catch (error) {
      //   console.error("Lỗi khi gửi danh sách điểm danh:", error);
      //   message.error("Lỗi khi gửi danh sách điểm danh!");
      // }
    };
    //Hien thi danh sach sinh vien
    const handleTabChange = (key) => {
      keyATab.value = key;
    };
    //Tim lich
    const getLich = async () => {
      if (magv.value) {
        try {
          const response = await axios.get(`getLichDiemDanh/${magv.value}`);
          extractLich(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const extractLich = (lichValue) => {
      getListMH.value = lichValue;
      const transformedHocKy = Array.from(
        new Set(lichValue.map((item) => item.hoc_ky))
      ).map((hoc_ky) => ({
        label: "Học Kỳ " + hoc_ky,
        value: hoc_ky,
      }));
      hocKy.value = transformedHocKy;
      const seen = new Set();
      const uniqueMonHoc = lichValue
        .filter((item) => {
          if (seen.has(item.ma_mh)) {
            return false;
          } else {
            seen.add(item.ma_mh);
            return true;
          }
        })
        .map((item) => ({
          hoc_ky: item.hoc_ky,
          label: item.ten_mh,
          value: item.ma_mh,
          ma_mh: item.ma_mh,
          st_bd: item.st_bd,
        }));
      monHoc.value = uniqueMonHoc;
    };

    //Hien thi danh sach sinh vien
    const filterCalendar = async () => {
      if (
        magv.value &&
        selectedHocKy.value &&
        selectedMonHoc.value &&
        selectedDate.value
      ) {
        try {
          const response = await axios.post("/getDanhSachSinhVien", {
            ma_gd: keyATab.value,
            ngay_hoc: dayjs(selectedDate.value).format("YYYY-MM-DD"),
          });
          ma_gd_diemdanh.value = keyATab.value;
          ngay_diem_danh.value = dayjs(selectedDate.value).format("YYYY-MM-DD");
          users.value = response.data.map((user) => ({
            ...user,
            cophep: false,
            khongphep: false,
            comat: false,
            ghichu: "",
          }));
        } catch (error) {
          console.error("Lỗi khi gửi yêu cầu điểm danh:", error);
          message.error(error.response.data.message);
        }
      } else {
        message.warn("Vui lòng chọn đầy đủ thông tin để tìm lịch điểm danh.");
      }
    };

    //watch loading
    watch(selectedHocKy, (newHocKy) => {
      filteredMonHoc.value = monHoc.value.filter(
        (item) => item.hoc_ky === newHocKy
      );
      if (filteredMonHoc.value.length > 0) {
        selectedMonHoc.value = filteredMonHoc.value[0].value;
      } else {
        selectedMonHoc.value = "";
      }
    });

    watch(selectedMonHoc, (newMonHoc) => {
      console.log(newMonHoc);
      selectedTabs.value = getListMH.value.filter(
        (item) => item.ma_mh === newMonHoc
      );
    });

    watch(magv, (newMagv) => {
      if (newMagv) {
        getLich();
      }
    });

    onMounted((magv) => {
      getLich();
    });
    //Table columns header
    const columns = [
      {
        title: "STT",
        dataIndex: "key",
        key: "id",
        fixed: true,
        width: "5%",
      },
      {
        title: "MSSV",
        dataIndex: "ma_sv",
        key: "mssv",
      },
      {
        title: "Họ tên",
        dataIndex: "ten_sv",
        key: "name",
      },
      {
        title: "Lớp học",
        dataIndex: "ma_lop",
        key: "class",
      },
      {
        title: "Có phép",
        dataIndex: "cophep",
        key: "cophep",
      },
      {
        title: "Không phép",
        dataIndex: "khongphep",
        key: "khongphep",
      },
      {
        title: "Ghi chú",
        dataIndex: "ghichu",
        key: "ghichu",
      }
    ];

    return {
      hocKy,
      filteredMonHoc,
      selectedHocKy,
      selectedMonHoc,
      selectedDate,
      filterCalendar,
      columns,
      users,
      getListMH,
      selectedTabs,
      activeKey,
      handleTabChange,
      keyATab,
      selectedRowKeys,
      rowSelection,
      togglePermission,
      sendLish
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
