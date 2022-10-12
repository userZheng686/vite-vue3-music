<template>
  <!--遮罩-->
  <div id="mask" @click="closeDialog" v-show="Popup.isOpenMask"></div>
</template>

<script setup lang="ts">
import { usePopupStore } from "@/store/popup";
let Popup = usePopupStore();
let isShow = ref<boolean>(true);

let props: any = defineProps({
  click: Function,
});

let closeDialog = () => {
  props && props.click();
  isShow.value = false;
};
</script>

<style>
#mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
