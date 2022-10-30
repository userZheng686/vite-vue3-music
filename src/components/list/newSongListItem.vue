<template>
  <div class="newsong--list__item">
    <el-avatar
      style="flex-shrink: 0"
      :src="props.item.info.blockTitle.imgUrl.replace('http', 'https')"
      alt="avatar"
    />
    <div class="other single-clamp">
      <div class="username">
        <span class="blue" @click="jumpArtists(props.item.info.blockTitle.artistId)">{{
          props.item.info.blockTitle.artistName
        }}</span>
        <span class="info" style="margin-left: 5px"
          >{{ props.item.info.blockTitle.publishDate }}上线{{ computedType }}</span
        >
      </div>
      <template v-if="computedType === '新歌'">
        <BlockTypeSong
          v-for="items in props.item.info.songLists"
          :key="items.id"
          :item="items"
        />
      </template>
      <template v-else>
        <BlockTypeAlbum :item="props.item" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArtistNewSongItem } from "i/api/api_artist";
interface Props {
  item: ArtistNewSongItem;
}

let props = defineProps<Props>();
let router = useRouter();

let computedType = computed(() => {
  if (props.item.info.blockType === "album") {
    return "专辑";
  } else {
    return "新歌";
  }
});

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
.newsong--list__item {
  display: flex;
  margin-top: 20px;
  overflow: hidden;
  contain: content;
  .other {
    margin-left: 30px;
    flex: 1;
  }
}
</style>
