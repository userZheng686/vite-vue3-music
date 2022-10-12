<template>
  <div class="song" @click="jumpAlbum(props.item.id)">
    <DefaultImage
      :picUrl="props.item.blurPicUrl"
      loadingWidth="25px"
      loadingHeight="25px"
      style="
        width: 50px;
        height: 50px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      "
      :lazy="false"
      :param="50"
      :y="50"
    >
    </DefaultImage>
    <div class="title">
      <div>
        {{ props.item.name }}
      </div>
      <div>
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
import { Album } from "i/api/api_album";
import { useRouter } from "vue-router";

interface Props {
  item: Album;
}

let props = defineProps<Props>();
let router = useRouter();

let jumpAlbum = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};

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
