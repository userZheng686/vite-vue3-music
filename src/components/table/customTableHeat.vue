<template>
  <!--热度-->
  <el-progress :percentage="props.item.pop" style="width: 100%" :color="customColor" />
</template>

<script setup lang="ts">
interface props {
  item: any;
}

let props = defineProps<props>();

const customColor = ref("rgb(236, 65, 65)");
</script>

<style scoped lang="scss"></style>
