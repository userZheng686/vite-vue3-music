<template>
  <div class="song" @click="jumpDjRadio(props.item.id)">
    <DefaultImage
      :picUrl="props.item.picUrl"
      loadingWidth="25px"
      loadingHeight="25px"
      fit="cover"
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
      :lazy="false"
      :y="50"
    >
    </DefaultImage>
    <div class="title">
      <div class="category">
        <span class="info--flag"
          ><span>{{ props.item.category }}</span></span
        >
        <span>{{ props.item.name }}</span>
      </div>
      <div class="info">
        <span>by </span>
        <span class="gray" @click.stop.prevent="jumpUserHomePage(props.item.dj.userId)">{{
          props.item.dj.nickname
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Radio } from "i/api/api_radio";
import { useRouter } from "vue-router";

interface Props {
  item: Radio;
}

let props = defineProps<Props>();
let router = useRouter();

let jumpDjRadio = (id: number) => {
  router.push({
    path: "/broadCastDetail",
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
      margin-bottom: 5px;
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
