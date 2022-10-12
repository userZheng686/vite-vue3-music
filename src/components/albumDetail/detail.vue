<template>
  <div class="detail" v-if="props.descriptionArr.length">
    <div style="font-weight: bold; font-size: 18px">专辑介绍</div>
    <div
      style="margin-top: 10px"
      class="info"
      v-for="(item, index) in props.descriptionArr"
      :key="index"
    >
      {{ item }}
    </div>
  </div>
  <div
    class="info"
    style="display: flex; align-items: center; justify-content: center"
    v-else
  >
    暂无介绍
  </div>
</template>

<script setup lang="ts">
interface Props {
  descriptionArr: string[];
}

let props = defineProps<Props>();
</script>

<style scoped lang="scss">
.detail {
  margin-left: 30px;
  margin-right: 25px;
}
</style>
