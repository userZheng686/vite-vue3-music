<template>
  <section class="album--list">
    <div
      class="list__item"
      v-for="item in hotAlbumsList"
      :key="item.id"
      @contextmenu="contextMenuAlbum($event, item)"
    >
      <DefaultImage
        :picUrl="item.picUrl"
        loadingWidth="30px"
        loadingHeight="30px"
        :param="60"
        :y="60"
        :lazy="false"
        style="width: 60px; height: 60px"
      />
      <div class="name" @click="jumpAlbumDetail(item.id)">
        <span>{{ item.name }}</span>
        <span class="info" v-if="item.alias?.length">({{ item?.alias?.join("") }})</span>
      </div>
      <div class="size info">{{ item.size }}首</div>
      <div class="time info">
        <span>发行时间：</span>
        <span>{{ videoTime(item.publishTime) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Ref } from "vue";
import { ArtistAlbumItem } from "i/api/api_album";
import { contextMenuAlbum } from "@/contextMenu/album/normal";
import { videoTime } from "@/utils/filter";

let router = useRouter();
let hotAlbumsList = inject("hotAlbumsList") as Ref<ArtistAlbumItem[]>;
let getArtistAlbumList = inject("getArtistAlbumList") as Function;

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
.list__item {
  display: flex;
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

.name {
  flex: 1;
  margin-left: 20px;
  cursor: pointer;
}

.size {
  flex: 1;
}

.time {
  margin-right: 20px;
}
</style>
