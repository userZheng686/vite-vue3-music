<template>
  <div class="song" @click="jumpArtists(props.item.id)">
    <DefaultImage
      :picUrl="props.item.picUrl || props.item.coverImgUrl"
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
      :param="50"
      :y="50"
      :lazy="false"
    >
    </DefaultImage>
    <div class="title">
      <div>
        歌手 ：
        {{ props.item.name || props.item.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventArtist } from "i/api/api_artist";
import { useRouter } from "vue-router";

interface Props {
  item: EventArtist;
}

let props = defineProps<Props>();
let router = useRouter();

//跳转到歌手页
let jumpArtists = (id: number) => {
  if (props.item.webviewUrl) {
    if (window.desktopMainAPI) {
      window.desktopMainAPI.href(props.item.webviewUrl);
    } else {
      window.open(props.item.webviewUrl);
    }
  } else {
    router.push({
      path: "/artists",
      query: {
        type: 1,
        id,
      },
    });
  }
};
</script>

<style scoped lang="scss">
.song {
  margin-top: 10px;
  display: flex;
  align-items: center;

  .title {
    margin-left: 10px;
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
