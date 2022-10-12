<!--收藏的播客列表-->
<template>
  <div
    class="dj--list__item"
    @click="jumpBroadCastDetail(props.item.id)"
    @contextmenu="props.contextMenu && props.contextMenu($event, props.item)"
  >
    <DefaultImage
      :picUrl="props.item.intervenePicUrl"
      loadingWidth="30px"
      loadingHeight="30px"
      :param="60"
      :y="60"
      :lazy="false"
      style="width: 60px; height: 60px"
    >
      <template #count>
        <div class="count" v-if="props.item.newProgramCount > 0">
          {{ props.item.newProgramCount }}
        </div>
      </template>
    </DefaultImage>
    <div class="title">
      <span class="name gray">
        <span>{{ props.item.name }}</span>
      </span>
      <span class="info--flag">
        <span>{{ props.item.category }}</span>
      </span>
    </div>
    <div class="gray">
      <span>by </span>
      <span>{{ props.item?.dj?.nickname }}</span>
    </div>
    <div class="info">声音{{ props.item.programCount }}</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { RadioSublistItem } from "@/interface/api/api_radio";
interface Props {
  item: RadioSublistItem;
  contextMenu?: Function;
}
let props = defineProps<Props>();
let router = useRouter();

let jumpBroadCastDetail = (id: number) => {
  router.push({
    path: "/broadCastDetail",
    query: {
      id,
    },
  });
};
</script>

<style scoped lang="scss">
.dj--list__item {
  display: grid;
  grid-template-columns: 100px 3fr 2fr 1fr 1fr;
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

.count {
  background-color: rgb(255, 125, 128);
  color: white;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  min-height: 15px;
  border-radius: 50%;
}
</style>
