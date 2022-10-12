<template>
  <div class="song" @click="jumpColumnLink(props.item.id)">
    <div class="title">
      <div class="category">
        <span class="info--flag"><span>专栏</span></span>
        <span>{{ props.item.mainTitle }}</span>
      </div>
      <div class="info">
        <span style="margin-right: 5px">by</span>
        <span
          class="gray"
          @click.stop.prevent="jumpUserHomePage(props.item.creator.userId)"
          >{{ props.item.creator.nickname }}</span
        >
      </div>
    </div>
    <DefaultImage
      :picUrl="props.item.coverUrl"
      loadingWidth="45px"
      loadingHeight="45px"
      style="
        width: 140px;
        height: 90px;
        position: relative;
        display: flex;
        align-items: center;
        margin-right: 20px;
        flex-shrink: 0;
        justify-content: center;
      "
      :lazy="false"
      :param="140"
      :y="90"
    >
    </DefaultImage>
  </div>
</template>

<script setup lang="ts">
import { Topic } from "i/api/api_topic";
import { useRouter } from "vue-router";

interface Props {
  item: Topic;
}

let props = defineProps<Props>();
let router = useRouter();

let jumpColumnLink = (id: number) => {
  let href = `https://music.163.com/#/topic?id=${id}`;
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(href);
  } else {
    window.open(href);
  }
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
* {
  word-break: keep-all;
}

.song {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
