<template>
  <div>
    <h1>QUÉT MÃ ĐIỂM DANH</h1>
    <a-button type="primary" @click="onOffCamera" class="mb-3">
      {{ statusCamera ? "Tắt Camera" : "Bật Camera" }}
    </a-button>
    <VueQrcodeReader v-if="statusCamera" @decode="onDecode" class="width-camera"/>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { QrcodeStream as VueQrcodeReader } from "vue3-qrcode-reader";
import axios from "../../../axios.js";
import { format } from "date-fns";
import { message } from "ant-design-vue";
export default defineComponent({
  components: {
    VueQrcodeReader,
  },

  setup() {
    const result = ref<string>("");
    const statusCamera = ref<boolean>(false);

    // Hàm xử lý khi quét qr
    const onDecode = (decodedText: string) => {
      result.value = decodedText;
      senResult();
    };

    // hàm bật tắt camera
    const onOffCamera = () => {
      statusCamera.value = !statusCamera.value;
    };

    //gửi api
    const senResult = async () => {
      try {
        const response = await axios.post("sinh-vien-diem-danh", {
          ma_sv: localStorage.getItem("ma_sv"),
          code: result.value,
          thoi_gian_dd: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        });
        if (response.data.message) {
          message.success(response.data.message);
        } else {
          message.success("Điểm danh thành công");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(error.response.data.message);
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
      }
    };

    return {
      result,
      onDecode,
      statusCamera,
      onOffCamera,
      senResult,
    };
  },
});
</script>

<style scoped>
.decode-result {
  margin-top: 10px;
}
@media screen and (min-width: 600px) {
  .width-camera {
    width: 500px;
  } 
}

</style>
