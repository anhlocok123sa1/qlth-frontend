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
            <a-button type="primary" class="me-2 mb-2" @click="showModalSetQR"
              >QR điểm danh</a-button
            >
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
                  <a-input
                    v-model:value="record.ghichu"
                    placeholder="Ghi chú"
                  />
                </template>
              </template>
            </a-table>
          </form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
  <a-modal v-model:open="modalVisible" :title="value.value.value">
    <div class="qr-container">
      <a-qrcode
        class="large-qrcode"
        error-level="H"
        :value="qrValue"
        icon="https://upload.wikimedia.org/wikipedia/commons/a/ae/Logo_STU.png"
      />
    </div>
  </a-modal>
  <!-- Modal Khởi tảo QR -->

  <a-modal v-model:open="setQR" title="Khởi Tạo QR Điểm danh" @ok="handleOk">
    <div>
      <table>
        <tr>
          <td><label for="">Điểm danh lần: </label></td>
          <td>
            <a-select
              v-model:value="value"
              label-in-value
              style="width: 120px"
              :options="options"
              @change="handleChange"
            ></a-select>
          </td>
        </tr>
        <tr>
          <td><label for="">Hết hạn sau </label></td>
          <td>
            <a-input-number
              id="inputNumber"
              v-model:value="valueExpires"
              :min="1"
              :max="10"
            />
          </td>
          <td></td>
        </tr>
      </table>
      <div>
        <a-button type="primary" style="margin-right: 10px" @click="createQr"
          >Tạo mới</a-button
        >
        <a-button type="primary" @click="showCodeAgain"
          >Hiển thị lại mã</a-button
        >
      </div>
    </div>
  </a-modal>
</template>

<script>
import { useMenu, useUser } from "../../../stores/use-menu.js";
import { format } from "date-fns";
import { Table } from "ant-design-vue";
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
    // Khởi Tạo QR
    const modalVisible = ref(false);
    const setQR = ref(false);

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
    const idTKB = ref([]);
    const qrValue = ref("");
    const valueExpires = ref(2);

    //hiển thị lại mã
    const showCodeAgain = () => {
      if (localStorage.getItem("code")) {
        const currentTime = new Date().getTime();
        const localStorageTime = localStorage.getItem("timeExpires");
        if (localStorageTime && currentTime < localStorageTime) {
          modalVisible.value = true;
          setQR.value = false;
          qrValue.value = localStorage.getItem("code");
        } else {
          message.warn("Mã đã hết hạn. Vui lòng tạo lại");
        }
      } else {
        message.warn("Không tồn tại mã. Vui lòng tạo mới");
      }
    };
    // set giá trị QR code
    const value = ref({
      value: "1",
      label: "1",
    });
    const options = ref([
      {
        value: "1",
        label: "1",
      },
      {
        value: "2",
        label: "2",
      },
    ]);
    const showModalSetQR = () => {
      setQR.value = true;
    };

    // sinh qr code điểm danh
    const createQr = () => {
      if (users.value.length > 0) {
        axios
          .post("getIdTKB", {
            ma_gd: keyATab.value,
            ngay_hoc: dayjs(selectedDate.value).format("YYYY-MM-DD"),
          })
          .then((response) => {
            idTKB.value = response.data;
            const now = new Date();
            now.setMinutes(now.getMinutes() + valueExpires.value);
            const expires_at = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            qrValue.value = `${idTKB.value.ma_tkb}-${value.value.value}-${expires_at}`;
            const code = qrValue.value;

            // lưu mã qr vào local nếu muons hiển thị lại
            localStorage.setItem("code", code);
            localStorage.setItem(
              "timeExpires",
              new Date().getTime() + valueExpires.value * 60 * 1000
            );
            //Gửi qr đến server
            axios
              .put("saveQr", {
                code: code,
              })
              .catch((error) => {
                console.error("Lỗi khi gửi mã Qr:", error);
                message.error(error.response.data.message);
              });
          });
        modalVisible.value = true;
        setQR.value = false;
      } else {
        message.warn("Vui lòng chọn đầy đủ thông tin để khởi tạo mã QR.");
      }
    };
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
      const students = users.value.map((user) => ({
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
    // xử lý khi selectedHocKy thay đổi
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
    // xử lý khi selectedMonHoc thay đổi
    watch(selectedMonHoc, (newMonHoc) => {
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
    // cột hiển thị danh sách sinh viên
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
      },
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
      modalVisible,
      createQr,
      qrValue,
      showModalSetQR,
      setQR,
      options,
      value,
      valueExpires,
      showCodeAgain,
      selectedRowKeys,
      rowSelection,
      togglePermission,
      sendLish,
    };
  },
});
</script>
<style>
.responsive-width {
  width: 100%;
}
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

@media (min-width: 1024px) {
  .responsive-width {
    width: 230px;
  }
}
</style>
