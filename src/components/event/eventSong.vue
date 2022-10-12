<template>
  <div class="song" @click="playOne(props.item)">
    <DefaultImage
      :picUrl="props.item.album.picUrl"
      loadingWidth="25px"
      loadingHeight="25px"
      style="
        width: 50px;
        height: 50px;
        position: relative;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
      "
      :lazy="false"
      :param="50"
      :y="50"
    >
      <template #play>
        <!--播放按钮-->
        <div class="player--circle">
          <i class="iconfont icon-bofang" style="margin-left: 2px'font-size:12px;"></i>
        </div>
      </template>
    </DefaultImage>
    <div class="title">
      <div>
        <span>{{ props.item.name }}</span>
        <span class="info" v-if="props.item?.alias?.length">
          ({{ props.item.alias.join("") }})
        </span>
      </div>
      <div class="single-clamp">
        <span class="ml2" v-for="(items, index) in props.item.artists" :key="items.id">
          <span>{{ index > 0 ? " / " : "" }}</span>
          <span class="gray" @click.stop.prevent="jumpArtists(items.id)">{{
            items.name
          }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SongDetailSongsItem } from "i/api/api_song";
import { playOne } from "@/utils/play";
import { useRouter } from "vue-router";

interface Props {
  item: SongDetailSongsItem;
}

let props = defineProps<Props>();
let router = useRouter();

//跳转到歌手页
let jumpArtists = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};
</script>

<style scoped lang="scss">
.song {
  margin-top: 10px;
  display: flex;
  align-items: center;

  .title {
    margin-left: 10px;
    margin-right: 10px;
  }
  background-color: var(--dark-normalBackgroundColor, rgb(243, 243, 243));
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: var(--dark-normalBackgroundColor, rgb(239, 240, 240));
  }
}
</style>
