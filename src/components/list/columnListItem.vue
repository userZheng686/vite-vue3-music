<!--收藏的播客列表-->
<template>
  <div
    class="column--list__item"
    @click="jumpColumnLink(props.item.id)"
    @contextmenu="props.contextMenu && props.contextMenu($event, props.item)"
  >
    <DefaultImage
      :picUrl="props.item.coverUrl"
      loadingWidth="30px"
      loadingHeight="30px"
      :param="60"
      :y="60"
      :lazy="false"
      style="width: 60px; height: 60px"
    />
    <div class="name gray">
      {{ props.item.name }}
    </div>
    <div class="gray">文章{{ props.item.topicCount }}</div>
    <div class="info">
      阅读<span>{{ filter(props.item.readCount) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColumnCreateListItem } from "i/api/api_column";
import { useUserInformation } from "@/store/user";
import { filter } from "@/utils/filter";

interface Props {
  item: ColumnCreateListItem;
  contextMenu?: Function;
}
let props = defineProps<Props>();
let user = useUserInformation();

let jumpColumnLink = (id: number) => {
  let href = `https://music.163.com/#/series?id=${id}&userid=${user.user_profile.userId}`;
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(href);
  } else {
    window.open(href);
  }
};
</script>

<style scoped lang="scss">
.column--list__item {
  display: grid;
  grid-template-columns: 100px 3fr 1fr 1fr;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  &:nth-child(odd) {
    background-color: var(--dark-item-backgroundOdd, rgb(250, 250, 250));
  }
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.title {
  display: flex;
  align-items: center;

  .name {
    margin-right: 10px;
  }
}
</style>
