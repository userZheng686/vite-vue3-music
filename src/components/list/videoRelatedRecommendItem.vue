<template>
  <!--视频相关推荐列表区域列表-->
  <div class="related--recommend--list">
    <!--视频相关推荐列表区域列表元素-->
    <div
      class="recommend--list__item"
      
      v-for="(item, index) in props.recommendList"
      :key="index"
    >
      <!--视频推荐左侧-->
      <div class="recommend--left" @click="openVideo(item.vid, item.type)">
        <!--封面-->
        <el-image
          :lazy="false"
          style="width: 100%; height: 15vh; cursor: pointer; border-radius: 10px"
          :src="
            item.coverUrl.replace(/http:\//, 'https:/') +
            '?imageView&enlarge=1&thumbnail=286y141&type=webp'
          "
          fit="cover"
        >
          <template #error>
            <div class="image-slot-error">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
          <template #placeholder>
            <ImageLoading />
          </template>
        </el-image>
        <!--播放数量-->
        <div class="recommend--list__item__playCount">
          <i class="iconfont icon-play" style="margin-right: 5px"></i>
          <span >{{ filter(item.playTime) }}</span>
        </div>
        <!--播放时长-->
        <div class="recommend--list__item__durationms" >
          {{ playTime(item.durationms) }}
        </div>
      </div>
      <!--视频推荐右侧-->
      <div class="recommend--right">
        <!--视频推荐右侧 标题-->
        <div class="right--title gray more-clamp2" @click="openVideo(item.vid, item.type)">{{ item.title }}</div>
        <!--视频推荐右侧 作者-->
        <div class="right--author">
          <span style="color: #909399; margin-right: 5px">by</span>
          <span v-for="(items, index) in item.creator" :key="items.userId" @click="jumpUserHomePage(items.userId)">
            <span class="gray">{{ items.userName }}</span>
            <span
              v-if="index !== item.creator.length - 1"
              style="
                margin-left: 10px;
                margin-right: 10px;
                height: 18px;
                line-height: 16px;
              "
              >/</span
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { videoRelatedRecommendItem } from "i/api/api_video.d";
import {filter,playTime} from '@/utils/filter'

//路由实例
let router = useRouter();

let props = defineProps<{
  recommendList: videoRelatedRecommendItem[];
}>();

let openVideo = (vid: string, type: number) => {
  if (type === 1) {
    router.push({
      path: "/videoDetail",
      query: { vid },
    });
  } else {
    router.push({
      path: "/mvDetail",
      query: { mvid: vid },
    });
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
//视频相关推荐区域列表
.related--recommend--list {
  display: flex;
  flex-direction: column;
}

//视频相关推荐左侧
.recommend--left {
  display: flex;
  width: 50%;
  position: relative;
}

//视频相关推荐右侧
.recommend--right {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  margin-left: 10px;
  text-align: left;
}

//视频相关推荐右侧 标题
.right--title {
  margin-bottom: 10px;
}

//视频相关推荐右侧 作者
.right--author {
  text-align: left;
}

//视频相关推荐区域列表元素
.recommend--list__item {
  display: flex;
  margin-top: 20px;
}

//播放次数
.recommend--list__item__playCount {
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

//播放时长
.recommend--list__item__durationms {
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: white;
}
</style>
