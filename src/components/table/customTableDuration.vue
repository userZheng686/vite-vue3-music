<template>
  <!--播放时长-->
  <span
    style="min-width: 38px; display: inline-block; width: 100%"
    class="el-table__column__info"
  >
    {{ transTime(props.item.dt / 1000 || props.item.duration / 1000) }}
  </span>
</template>

<script setup lang="ts">
import {transTime} from '@/utils/filter'
interface props {
  item: any;
}

let props = defineProps<props>();
</script>

<style scoped lang="scss"></style>
