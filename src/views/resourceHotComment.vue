<template>
  <div class="hot--comment">
    <div class="title">精彩评论</div>
    <HotComment
      :resourceType="(Number(route.query.resourceType) as ResourceType)"
      :id="route.query.id"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

//0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
type ResourceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

let route = useRoute();
</script>

<style scoped lang="scss">
.hot--comment {
  margin-left: 30px;
  margin-right: 25px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
