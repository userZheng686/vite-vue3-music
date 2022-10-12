<template>
  <!--下载时间-->
  <div style="width: 100%" class="el-table__column__info" >
    {{ recentlySongTime(props.item.downloadTime) }}
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
