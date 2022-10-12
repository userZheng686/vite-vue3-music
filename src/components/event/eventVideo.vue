<template>
  <DefaultImage
    :picUrl="props.item.coverUrl"
    :param="400"
    :y="200"
    style="
      height: 200px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    "
    :style="props.needMaxWidth ? 'max-width : 400px' : ''"
    @click="jumpVideoDetail"
    paddingBottom=""
    :lazy="false"
  >
    <template #playCount>
      <div class="video--playCount">
        <i class="iconfont icon-play" style="margin-right: 5px"></i>
        <span>{{ filter(props.item.playTime) }}</span>
      </div>
    </template>
    <template #play>
      <!--播放按钮-->
      <div class="player--circle">
        <i class="iconfont icon-bofang" style="margin-left: 2px"></i>
      </div>
    </template>
    <template #mv>
      <div class="video single-clamp">
        <span class="info--flag">视频 </span>
        <span
          class="gray"
          @click.stop.prevent="jumpUserHomePage(props.item.creator.userId)"
          >{{ props.item.creator.nickname }}</span
        >
        <span class="single-clamp"> - {{ props.item.title }}</span>
      </div>
    </template>
  </DefaultImage>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Video } from "i/api/api_video";
import { filter } from "@/utils/filter";

interface Props {
  item: Video;
  needMaxWidth?: boolean;
}

let router = useRouter();
let props = withDefaults(defineProps<Props>(), {
  needMaxWidth: true,
});

//跳转到mv详情页面
let jumpVideoDetail = () => {
  router.push({
    path: "/videoDetail",
    query: {
      vid: props.item.videoId,
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
//播放次数
.video--playCount {
  position: absolute;
  z-index: 2;
  font-size: 12px;
  color: white;
  font-weight: 700;
  position: absolute;
  right: 10px;
  top: 10px;
  text-shadow: 1px 1px 5px #0a0101;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
}

.video {
  z-index: 2;
  display: flex;
  align-items: center;
  font-size: 12px;
  width: 60%;
  color: white;
  font-weight: 700;
  position: absolute;
  left: 10px;
  top: 10px;
  text-shadow: 1px 1px 5px #0a0101;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
}
</style>
