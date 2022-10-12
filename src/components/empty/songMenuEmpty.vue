<template>
  <div v-if="props.userId === props.createUserId">
    <div class="empty">赶快去收藏你喜欢的音乐</div>
    <div class="empty info">
      点击“<i class="iconfont icon-shoucang1"></i>”，将音乐加入歌单
    </div>
  </div>
  <div v-else class="empty info">暂无歌曲</div>
</template>

<script setup lang="ts">
interface Props {
  userId: number;
  createUserId: number;
}

let props = defineProps<Props>();
</script>

<style scoped lang="scss">
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.info {
  color: #909399;
}
</style>
