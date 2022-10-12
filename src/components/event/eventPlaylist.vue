<template>
  <div class="song" @click="jumpPlaylist(props.item.id)">
    <DefaultImage
      :picUrl="props.item.coverImgUrl"
      loadingWidth="25px"
      loadingHeight="25px"
      style="
        width: 50px;
        height: 50px;
        position: relative;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        justify-content: center;
      "
      :param="50"
      :lazy="false"
      :y="50"
    >
    </DefaultImage>
    <div class="title">
      <div class="category">
        <span class="info--flag"><span>歌单</span></span>
        <span>{{ props.item.name }}</span>
      </div>
      <div class="info">
        <span>by </span>
        <span
          class="gray"
          @click.stop.prevent="jumpUserHomePage(props.item.creator.userId)"
          >{{ props.item.creator.nickname }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { playlist } from "i/api/api_playList";
import { useRouter } from "vue-router";

interface Props {
  item: playlist;
}

let props = defineProps<Props>();
let router = useRouter();

let jumpPlaylist = (id: number) => {
  router.push({
    path: "/songMenuDetail",
    query: {
      id,
    },
  });
};

//跳转到用户空间页面
let jumpUserHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
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
    .category {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
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
