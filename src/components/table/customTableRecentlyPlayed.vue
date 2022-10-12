<template>
  <!--播放时间-->
  <div class="el-table__column__info" style="width: 100%">
    {{ recentlySongTime(props.item.playTime) }}
  </div>
</template>

<script setup lang="ts">
import {recentlySongTime} from '@/utils/filter'
interface props {
  item: any;
}

let props = defineProps<props>();
</script>

<style scoped lang="scss"></style>
