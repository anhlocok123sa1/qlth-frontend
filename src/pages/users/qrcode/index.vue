<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h2>QR code</h2>
        <a-qrcode
          ref="qrcodeCanvasRef"
          :value="qrValue"
          class="qr-code"
          v-if="qrValue"
        />
        <a-spin v-else></a-spin>
        <br />
        <br />
        <a-button type="primary" @click="dowloadChange">Download</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useMenuUsers } from "../../../stores/use-menu-users.js";
import { ref } from "vue";
import axios from "../../../axios.js";

// Lấy store từ useMenuUsers
const store = useMenuUsers();
store.onSelectedKeys(["users-qrcode"]);
const qrValue = ref("");
const users = ref([]);
const user = ref(null);
const qrcodeCanvasRef = ref();
const dowloadChange = async () => {
  try {
    if (!user.value) {
      console.error("Dữ liệu người dùng không có sẵn.");
      return;
    }
    const url = await qrcodeCanvasRef.value.toDataURL();
    const a = document.createElement("a");
    a.download = "QRCode.png";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Lỗi khi tải mã QR:", error);
  }
};

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.get("/thong-tin-ca-nhan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = [response.data];
    user.value = users.value[0];

    qrValue.value = `${user.value.ma_sv}-${user.value.ten_sv}-${user.value.ma_lop}`;
  } catch (error) {
    console.error("Không thể tải hồ sơ người dùng:", error);
  }
});
</script>
