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
                <a-button
                  style="background-color: darkslategrey"
                  type="primary"
                  html-type="submit"
                >
                  <span>Tìm lịch</span>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </form>

    <a-card>
      <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
        <a-tab-pane
          v-for="tab in selectedTabs"
          :key="tab.ma_gd"
          :tab="`Nhóm: ${tab.nmh} - Tiết ${tab.st_bd} -> ${tab.st_kt}`"
        >
          <form @submit.prevent="sendLish()">
            <!-- Lưu điểm danh -->
            <a-button html-type="submit" type="primary" class="me-2 mb-2"
              >Lưu điểm danh</a-button
            >

            <!-- Xuát excel -->
            <!-- <a-button type="primary" class="me-2 mb-2">Xuất excel</a-button> -->

            <!-- Hiện mã QR -->
            <a-button
              type="primary"
              danger
              class="me-2 mb-2"
              @click="showModalSetQR"
              @ok="handleOk"
              >QR điểm danh</a-button
            >
            <!-- Quét mã điểm danh -->
            <a-button
              style="background-color: darkcyan; color: white"
              class="me-2 mb-2"
              @click="showModalScanQR"
              @ok="handleOk"
              >Quét mã</a-button
            >
            <a-table
              :row-selection="rowSelection"
              :dataSource="users"
              :columns="columns"
              size="small"
              :scroll="{ x: 1200 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'diemdanh1'">
                  <div v-if="record.diemdanh1">
                    <a-checkbox checked disabled></a-checkbox>
                  </div>
                  <div v-else>
                    <a-checkbox disabled></a-checkbox>
                  </div>
                </template>
                <template v-if="column.key === 'diemdanh2'">
                  <div v-if="record.diemdanh2">
                    <a-checkbox checked disabled></a-checkbox>
                  </div>
                  <div v-else>
                    <a-checkbox disabled></a-checkbox>
                  </div>
                </template>
                <template v-if="column.key === 'cophep'">
                  <a-checkbox
                    v-model:checked="record.cophep"
                    @change="togglePermission(record, 'cophep')"
                  ></a-checkbox>
                </template>
                <!-- <template v-if="column.key === 'khongphep'">
                  <a-checkbox
                    v-model:checked="record.khongphep"
                    @change="togglePermission(record, 'khongphep')"
                  ></a-checkbox>
                </template> -->
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
  <a-modal
    footer=""
    v-model:open="modalVisible"
    :title="'(Còn lại: ' + countdown + ' giây)'"
    @ok="handleOk"
  >
    <div class="qr-container">
      <a-qrcode
        class="large-qrcode"
        error-level="H"
        :value="qrValue"
        icon="https://upload.wikimedia.org/wikipedia/commons/a/ae/Logo_STU.png"
      />
    </div>
  </a-modal>
  <!-- Modal Khởi tạo QR -->
  <a-modal
    footer=""
    v-model:open="setQR"
    title="Khởi Tạo QR Điểm danh"
    @ok="handleOk"
  >
    <div>
      <table>
        <tr>
          <td><label for="">Điểm danh lần: </label></td>
          <td>
            <a-select
              v-model:value="value"
              label-in-value
              style="width: 90px"
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
              :min="0.3"
              :max="10"
            />
          </td>
          <td><span>Phút</span></td>
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
  <!-- Modal Quét mã điểm danh -->
  <a-modal
    footer=""
    v-model:open="scanQR"
    :title="`Quét mã điểm danh lần ${valueAttendance}`"
    @ok="handleOk"
  >
    <a-radio-group v-model:value="valueAttendance" :hidden="statusCamera">
      <a-radio :style="radioStyle" :value="1">1</a-radio>
      <a-radio :style="radioStyle" :value="2">2</a-radio>
    </a-radio-group>
    <a-button type="primary" @click="onOffCamera" class="mb-3">
      {{ statusCamera ? "Tắt Camera" : "Bật Camera" }}
    </a-button>
    <VueQrcodeReader v-if="statusCamera" @decode="onDecode" />
    <h1>{{ result }}</h1>
  </a-modal>
</template>

<script>
import { useMenu, useUser } from "../../../stores/use-menu.js";
import { format } from "date-fns";
import { computed, defineComponent, onMounted, ref, unref, watch } from "vue";

import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { QrcodeStream as VueQrcodeReader } from "vue3-qrcode-reader";
import axios from "../../../axios.js";

export default defineComponent({
  components: {
    VueQrcodeReader,
  },
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["admin-diemdanh"]);
    const userStore = useUser();
    const magv = computed(() => userStore.getma);

    // Khởi Tạo QR
    const modalVisible = ref(false);
    const setQR = ref(false);
    const scanQR = ref(false);

    //Tim lich
    const hocKy = ref([]);
    const monHoc = ref([]);
    const selectedHocKy = ref("");
    const selectedMonHoc = ref("");
    const filteredMonHoc = ref([]);
    const selectedDate = ref(dayjs());
    const getListMH = ref([]);
    const selectedTabs = ref([]);
    const activeKey = ref(null);
    const keyATab = ref("");
    const users = ref([]);
    const idTKB = ref([]);
    const qrValue = ref("");
    const valueExpires = ref(1);
    const tkb = ref("");
    const countdown = ref(valueExpires.value * 60); // Thời gian đếm ngược (giây)
    //Diem danh
    const selectedRowKeys = ref([]);
    const ma_gd_diemdanh = ref("");
    const ngay_diem_danh = ref("");

    // Quét mã điểm danh
    const result = ref("");
    const statusCamera = ref(false);
    const valueAttendance = ref(1);

    const onDecode = async (decodedText) => {
      result.value = decodedText;
      try {
        const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        const response = await axios.post("quet-ma-sinh-vien", {
          code: result.value,
          attendace: valueAttendance.value,
          attendaceTime: date,
          ma_gd: keyATab.value,
          day: dayjs(selectedDate.value).format("YYYY-MM-DD"),
        });

        if (response.data.message) {
          filterCalendar();
          console.log(response);
          message.success(response.data.message);
        } else {
          alert("Không tìm thấy sinh viên");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(error.response.data.message);

          result.value = "";
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại.");
          result.value = "";
        }
      }
    };
    const showModalScanQR = () => {
      scanQR.value = true;
    };
    const handleOk = (e) => {
      scanQR.value = false;
      setQR.value = false;
      modalVisible.value = false;
    };
    const onOffCamera = () => {
      if (users.value.length == 0) {
        message.warn("Không tìm thấy danh sách sinh viên");
      } else {
        result.value = "";
        statusCamera.value = !statusCamera.value;
      }
    };

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

            // Chuyển đổi giá trị từ phút sang giây
            const expiresInSeconds = valueExpires.value * 60;
            const now = new Date();
            now.setSeconds(now.getSeconds() + expiresInSeconds);
            const expires_at = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

            qrValue.value = `${idTKB.value.ma_tkb}-${value.value.value}-${expires_at}`;
            const code = qrValue.value;

            localStorage.setItem("code", code);
            localStorage.setItem(
              "timeExpires",
              new Date().getTime() + expiresInSeconds * 1000
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
            countdown.value = valueExpires.value * 60;
            const interval = setInterval(() => {
              countdown.value--;
              if (countdown.value <= 0) {
                clearInterval(interval);
                modalVisible.value = false; // Ẩn modal
              }
            }, 1000);
          });
        modalVisible.value = true;
        setQR.value = false;
      } else {
        message.warn("Không tìm thấy danh sách sinh viên.");
      }
    };

    //Toggle có phép, không phép, có mặt
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

    const onSelectChange = (changableRowKeys, selectedRows) => {
      selectedRowKeys.value = changableRowKeys;
      selectedRows.forEach((row) => {
        row.comat = true;
        if (row.cophep) {
          row.cophep = false;
        }
      });
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

    const rowSelection = computed(() => ({
      selectedRowKeys: selectedRowKeys.value,
      onChange: onSelectChange,
      onSelect: onSelected,
    }));

    //Gửi danh sách sinh viên điểm danh
    const sendLish = async () => {
      if (users.value.length == 0) {
        message.warn("Không tìm thấy danh sách sinh viên");
        return;
      }
      const students = users.value.map((user) => ({
        ma_sv: user.ma_sv,
        ma_gd: ma_gd_diemdanh.value,
        ngay_diem_danh: ngay_diem_danh.value,
        co_mat: user.comat,
        co_phep: user.cophep,
        khong_phep: user.khongphep,
        ghi_chu: user.ghichu,
      }));

      try {
        const response = await axios.post("/diemDanhSinhVien", {
          students,
        });
        filterCalendar();
        selectedRowKeys.value = [];
        message.success("Điểm danh thành công!");
      } catch (error) {
        console.log(error);
        console.error("Lỗi khi gửi danh sách điểm danh:", error);
        message.error("Lỗi khi gửi danh sách điểm danh!");
      }
    };

    //Hien thi danh sach sinh vien
    const handleTabChange = (key) => {
      keyATab.value = key;
      // filterCalendar();
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
      ).map((hoc_ky) => {
        const nam_hoc = lichValue.find(
          (item) => item.hoc_ky === hoc_ky
        ).nam_hoc;
        return {
          label: nam_hoc,
          value: hoc_ky,
        };
      });

      hocKy.value = transformedHocKy;
      // Đặt giá trị đầu tiên của hocKy vào selectedHocKy
      if (transformedHocKy.length > 0) {
        selectedHocKy.value = transformedHocKy[0].value;
      }
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
          console.log(response.data);
          ma_gd_diemdanh.value = keyATab.value;
          ngay_diem_danh.value = dayjs(selectedDate.value).format("YYYY-MM-DD");
          users.value = response.data.map((user, index) => ({
            ...user,
            cophep: false,
            khongphep: false,
            comat: false,
            ghichu: "",
            stt: index + 1,
          }));
        } catch (error) {
          ma_gd_diemdanh.value = 0;
          users.value = [];
          selectedRowKeys.value = [];
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
      // handleTabChange();
      selectedTabs.value = getListMH.value.filter(
        (item) => item.ma_mh === newMonHoc
      );
      // Tự động chọn tab đầu tiên nếu có tab
      if (selectedTabs.value.length > 0) {
        keyATab.value = selectedTabs.value[0].ma_gd;
        activeKey.value = selectedTabs.value[0].ma_gd;
      } else {
        activeKey.value = null; // Nếu không có tab nào, đặt activeKey là null
      }
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
        dataIndex: "stt",
        key: "id",
        fixed: true,
        width: 50,
      },
      {
        title: "Điểm danh lần 1",
        dataIndex: "diemdanh1",
        key: "diemdanh1",
        width: "5%",
      },
      {
        title: "Điểm danh lần 2",
        dataIndex: "diemdanh2",
        key: "diemdanh2",
        width: "5%",
      },
      {
        title: "MSSV",
        dataIndex: "ma_sv",
        key: "mssv",
        width: 100,
      },
      {
        title: "Họ tên",
        dataIndex: "ten_sv",
        key: "name",
        width: 200,
      },
      {
        title: "Lớp học",
        dataIndex: "ma_lop",
        key: "class",
        width: 100,
      },
      {
        title: "Có phép",
        dataIndex: "cophep",
        key: "cophep",
        width: 100,
      },
      // {
      //   title: "Không phép",
      //   dataIndex: "khongphep",
      //   key: "khongphep",
      //   width: 100,
      // },
      // {
      //   title: "Ghi chú",
      //   dataIndex: "ghichu",
      //   key: "ghichu",
      //   width: 300,
      // },
    ];
    watch(scanQR, (newVal) => {
      if (!newVal) {
        result.value = "";
        statusCamera.value = false; // Tắt camera khi modal đóng
      }
    });

    return {
      hocKy,
      value,
      setQR,
      users,
      scanQR,
      result,
      options,
      columns,
      keyATab,
      qrValue,
      getListMH,
      activeKey,
      selectedDate,
      selectedTabs,
      modalVisible,
      valueExpires,
      rowSelection,
      statusCamera,
      selectedHocKy,
      filteredMonHoc,
      selectedMonHoc,
      selectedRowKeys,
      valueAttendance,
      sendLish,
      handleOk,
      onDecode,
      createQr,
      onOffCamera,
      showCodeAgain,
      showModalSetQR,
      filterCalendar,
      handleTabChange,
      showModalScanQR,
      togglePermission,
      countdown,
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
