<template>
   <el-dialog
    v-model="sharePopup.childWXShow"
    title="分享到微信"
    width="30%"
    center
    destroy-on-close
    :modal="false"
    :lock-scroll="false"
    custom-class="wx--dialog"
  >
    <qrcode-vue
      :value="sharePopup.source + '&from=qr'"
      :size="200"
      :title="sharePopup.source + '&from=qr'"
      level="H"
    />
    <div class="info" style="text-align:center">打开微信，扫一扫</div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useSharePopupStore } from '@/store/sharePopup';
import QrcodeVue from "qrcode.vue";


let sharePopup = useSharePopupStore();
</script>

<style >
.wx--dialog{
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>