<template>
  <!--视频相关推荐列表区域列表-->
  <div class="related--recommend--list">
    <!--视频相关推荐列表区域列表元素-->
    <div class="recommend--list__item" @click="openMv(item.id)" v-for="(item, index) in props.recommendList"
      :key="index">
      <!--视频推荐左侧-->
      <div class="recommend--left">
        <!--封面-->
        <el-image :lazy="false" style="width: 100%; height: 15vh; cursor: pointer; border-radius: 10px" :src="
          item.cover.replace(/http:\//, 'https:/') +
          '?imageView&enlarge=1&thumbnail=1024y1024&type=webp'
        " fit="cover">
          <template #error>
            <div class="image-slot-error">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
          <template #placeholder>
            <!-- <el-icon class="is-loading image-slot-loading"><Loading /></el-icon> -->
            <ImageLoading />
          </template>
        </el-image>
        <!--播放数量-->
        <div class="recommend--list__item__playCount">
          <i class="iconfont icon-play"></i>
          <span >{{ filter(item.playCount) }}</span>
        </div>
        <!--播放时长-->
        <div class="recommend--list__item__durationms" >
          {{ playTime(item.duration) }}
        </div>
      </div>
      <!--视频推荐右侧-->
      <div class="recommend--right">
        <!--视频推荐右侧 标题-->
        <div class="right--title gray more-clamp2">{{ item.name }}</div>
        <!--视频推荐右侧 作者-->
        <div class="right--author gray">by {{ item.artistName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SimiMvItem } from "i/api/api_mv.d";
import { useRouter } from "vue-router";
import {playTime,filter} from '@/utils/filter'

//路由实例
let router = useRouter();

let props = defineProps<{
  recommendList: SimiMvItem[];
}>();

//跳转到mv详情页面
let openMv = (mvid: number) => {
  router.push({
    path: "/mvDetail",
    query: { mvid },
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
  right: 3px;
  z-index: 2;
  font-size: 12px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  font-weight: 700;
  top: 3px;
  display: flex;
  align-items: center;
}

//播放时长
.recommend--list__item__durationms {
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: white;
}
</style>
