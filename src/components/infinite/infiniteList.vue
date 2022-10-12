<template>
  <!--无限加载列表组件-->
  <div
    class="infinite--list"
    :class="props.customClass"
    :style="{
      gridTemplateColumns: props.columns ? props.columns : '',
      gridTemplateRows: props.rows ? props.rows : '',
    }"
  >
    <slot />
  </div>
  <el-button
    class="more"
    v-if="props.hasMore"
    type="danger"
    style="width: 100px; margin: 20px auto"
    @click="infiniteLoad"
    >加载更多</el-button
  >
</template>

<script setup lang="ts">
import { ElLoading } from "element-plus";

interface Props {
  request: Function;
  hasMore?: boolean;
  rows?: string;
  columns?: string;
  customClass?: string;
}

let props = withDefaults(defineProps<Props>(), {
  request: () => {},
  hasMore: true,
  rows: "1fr 1fr 1fr 1fr 1fr",
  columns: "1fr 1fr 1fr 1fr 1fr",
});

let infiniteLoad = () => {
  const elLoading = ElLoading.service({
    lock: true,
    text: "加载列表中... 请稍后",
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(() => {
    props.request();
    elLoading.close();
  }, 500);
};
</script>

<style scoped lang="scss">
.infinite--list {
  width: 100%;
  display: grid;
  column-gap: 10px;
  row-gap: 15px;
  min-height: 5vh;
  height: auto;
}

.no--found {
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
