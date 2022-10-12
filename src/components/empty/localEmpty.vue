<template>
  <div class="local--empty">
    <img alt="" src="@/assets/image/empty.jpg" />
    <slot name="empty"></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.local--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #909399;
}
</style>
