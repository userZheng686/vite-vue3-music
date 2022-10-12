<template>
  <!--上传时间-->
  <div class="el-table__column__info" style="width: 100%">{{ computedTime }}</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

//时间处理
import { formDate } from "@/utils/filter";

interface props {
  item: any;
}

let props = defineProps<props>();

let computedTime = computed(() => {
  let { y, month, d } = formDate(props.item.addTime);
  return `${y}-${month}-${d}`;
});
</script>

<style scoped lang="scss"></style>
