<template>
  <!--来源-->
  <i
    class="iconfont icon-caidan"
    style="width: 100%; cursor: pointer"
    @click="jumpSource"
  ></i>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
interface Props {
  item: any;
}

let router = useRouter();
let props = defineProps<Props>();

let jumpSource = () => {
  router.push({
    path: props.item.from.path,
    query: props.item.from.val,
  });
};
</script>

<style scoped lang="scss"></style>
