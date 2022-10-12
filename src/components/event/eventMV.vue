<template>
  <DefaultImage
    :picUrl="props.item.imgurl"
    :param="400"
    :y="200"
    style="
      height: 200px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    "
    :style="props.needMaxWidth ? 'max-width : 400px' : ''"
    :lazy="false"
    paddingBottom=""
    @click="jumpMVDetail"
  >
    <template #playCount>
      <div class="mv--playCount">
        <i class="iconfont icon-play" style="margin-right: 5px"></i>
        <span>{{ filter(props.item.playCount) }}</span>
      </div>
    </template>
    <template #play>
      <!--播放按钮-->
      <div class="player--circle">
        <i class="iconfont icon-bofang" style="margin-left: 2px"></i>
      </div>
    </template>
    <template #mv>
      <div class="mv single-clamp">
        <span class="info--flag">mv </span>
        <span class="single-clamp"> {{ props.item.name }}</span>
        <span class="gray" @click.stop.prevent="jumpArtists(props.item.id)">
          - {{ props.item.artistName }}</span
        >
      </div>
    </template>
  </DefaultImage>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { MV } from "i/api/api_mv";
import { filter } from "@/utils/filter";

interface Props {
  item: MV;
  needMaxWidth?: boolean;
}

let router = useRouter();
let props = withDefaults(defineProps<Props>(), {
  needMaxWidth: true,
});

//跳转到mv详情页面
let jumpMVDetail = () => {
  router.push({
    path: "/mvDetail",
    query: {
      mvid: props.item.id,
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
//播放次数
.mv--playCount {
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

.mv {
  z-index: 2;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: white;
  font-weight: 700;
  width: 60%;
  position: absolute;
  left: 10px;
  top: 10px;
  text-shadow: 1px 1px 5px #0a0101;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
}
</style>
