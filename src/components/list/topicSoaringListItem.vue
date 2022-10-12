<template>
  <div class="soaring--list__item">
    <div class="index" :style="{ color: props.index <= 3 ? 'red' : '' }">
      {{ props.index }}
    </div>
    <div class="other">
      <DefaultImage
        :picUrl="props.item.sharePicUrl"
        :param="77"
        :y="77"
        style="width: 77px; height: 77px"
        loadingWidth="38px"
        loadingHeight="38px"
      />
      <div class="detail">
        <div class="title">#{{ props.item.title }}#</div>
        <div class="info">{{ props.item.participateCount }}人参与</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HotTopicItem } from "i/api/api_topic";

interface Props {
  item: HotTopicItem;
  index: number;
}

let props = defineProps<Props>();
</script>

<style scoped lang="scss">
.soaring--list__item {
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;

  .index {
    width: 42px;
    margin-right: 5px;
    font-size: 16px;
    text-align: center;
  }

  .other {
    display: flex;
    align-items: center;

    .detail {
      margin-left: 15px;

      .title {
        font-size: 16px;
      }
    }
  }

  &:nth-child(even) {
    background-color: var(--dark-item-backgroundOdd, rgb(250, 250, 250));
  }
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}
</style>
