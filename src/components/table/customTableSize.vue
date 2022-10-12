<template>
  <!--大小-->
  <div style="width: 100%" class="el-table__column__info">
    {{ props.item.fileSize }}MB
  </div>
</template>

<script setup lang="ts">
interface props {
  item: any;
}

let props = defineProps<props>();
</script>

<style scoped lang="scss"></style>
