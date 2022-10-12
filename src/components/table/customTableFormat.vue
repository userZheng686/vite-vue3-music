<template>
  <!--格式-->
  <div style="width: 100%">{{ props.item.type }}</div>
</template>

<script setup lang="ts">
interface props {
  item: any;
}

let props = defineProps<props>();
</script>

<style scoped lang="scss"></style>
