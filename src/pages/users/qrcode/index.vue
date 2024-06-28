<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h2>QR code</h2>
        <a-qrcode ref="qrcodeCanvasRef" :value="qrValue" class="qr-code" />
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
// import users from "../../../router/users.js";
import axios from "../../../axios.js";
const qrValue = ref("");
const users = ref([]);
const user = ref(null);
const qrcodeCanvasRef = ref();
const dowloadChange = async () => {
  try {
    if (!user.value) {
      console.error("User data not available.");
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
    console.error("Error downloading QR code:", error);
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
    console.error("Failed to fetch user profile:", error);
  }
  const menuUsersStore = useMenuUsers();
  menuUsersStore.onSelectedKeys(["users-qrcode"]);
});
</script>
