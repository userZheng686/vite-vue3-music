<template>
  <div class="picture--list">
    <div
      class="list__item"
      v-for="item in hotAlbumsList"
      :key="item.id"
      @contextmenu="contextMenuAlbum($event, item)"
      @click="jumpAlbumDetail(item.id)"
    >
      <PlayImage
        :picUrl="item.picUrl"
        :param="225"
        :cursor="true"
        :y="225"
        :width="'100%'"
        :height="'100%'"
      />
      <!--作品名-->
      <div class="name more-clamp2 gray" v-title>
        <span>{{ item.name }}</span>
        <span class="info" v-if="item.alias?.length">({{ item.alias.join("") }})</span>
      </div>
      <!--发布事件-->
      <div class="time info">
        {{ videoTime(item.publishTime) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Ref } from "vue";
import { ArtistAlbumItem } from "i/api/api_album";
import { contextMenuAlbum } from "@/contextMenu/album/normal";
import {videoTime} from '@/utils/filter'

let router = useRouter();
let hotAlbumsList = inject("hotAlbumsList") as Ref<ArtistAlbumItem[]>;

//跳转到专辑详情
let jumpAlbumDetail = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};
</script>

<style scoped lang="scss">
.picture--list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  row-gap: 20px;
  margin-right: 20px;
}

.name {
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
