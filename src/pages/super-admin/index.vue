<template>
  Ddaya la trang home
  <div>1 Khoa</div>
  <div>2 Lớp</div>
  <div>3 Sinh Viên</div>
  <div>4 Điểm danh</div>
  <div>....</div>
</template>
<script>
import { defineComponent } from 'vue'
import { useMenu } from '../../stores/use-menu'

export default defineComponent({
  setup() {
    const store = useMenu();
    store.onSelectedKeys(["home"]);
  },
})
</script>
