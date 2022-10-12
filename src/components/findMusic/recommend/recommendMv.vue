<template>
  <!--推荐MV-->
  <div class="recommend--mv">
    <!--标题-->
    <div class="recommend--title gray" style="margin-top: 10px" @click="jumpMVList">
      <span class="recommend--text">推荐MV</span>
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
    <!--列表-->
    <div class="recommend--list">
      <div
        class="recommend--list__item"
        v-for="item in recommendMV"
        @contextmenu="contextMenuMVList($event, item, recommendMV, true)"
        :key="item.artistId"
      >
        <!--mv封面-->
        <DefaultImage
          :picUrl="item.picUrl"
          class="recommend--cover"
          :param="260"
          :y="149"
          paddingBottom="60%"
          @click="jumpMVDetail(item.id)"
        />
        <!--mv头部-->
        <div class="recommend--top">
          <!--头部的阴影框-->
          <div class="recommend--top--shadow">最新热门MV推荐</div>
          <!--头部右边-->
          <div class="recommend-top__right">
            <!--mv播放按钮-->
            <el-icon class="recommend--icon">
              <VideoPlay />
            </el-icon>
            <!--播放量-->
            <div class="recommend--mv--playCount">
              {{ filter(item.playCount) }}
            </div>
          </div>
        </div>
        <!--mv标题-->
        <div
          v-title
          class="gray single-clamp"
          @click="jumpMVDetail(item.id)"
          style="width: 100%; text-align: left; margin-top: 5px"
        >
          {{ item.name }}
        </div>
        <!--mv作者-->
        <div style="text-align: left; margin-top: 5px">
          <span class="ml2" v-for="(items, index) in item.artists" :key="items.id">
            <span>{{ index > 0 ? " / " : "" }}</span>
            <span class="gray" @click="jumpArtists(items.id)">{{ items.name }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RecommendMVItem } from "i/api/api_video.d";
import { Ref } from "vue";
import { useRouter } from "vue-router";
import { contextMenuMVList } from "@/contextMenu/mv/normal";
import { filter } from "@/utils/filter";

let router = useRouter();
let recommendMV = inject("recommendMV") as Ref<RecommendMVItem[]>;

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

//跳转到MV详情
let jumpMVDetail = (id: number) => {
  router.push({
    path: "/mvDetail",
    query: {
      mvid: id,
    },
  });
};

//跳转到mv列表
let jumpMVList = () => {
  router.push({
    path: "/video",
    query: {
      type: 2,
    },
  });
};
</script>

<style scoped lang="scss">
.recommend--mv {
  display: flex;
  margin-top: 20px;
  flex-direction: column;
}

.recommend--title {
  display: flex;
  align-items: center;
}

.recommend--text {
  font-weight: 700;
  font-size: 20px;
}

/**推荐MV 列表 列表元素  */
.recommend--list {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 22px;
  overflow: hidden;
}

.recommend--list__item {
  position: relative;
  min-width: 240px;
}

/**mv播放量 */
.recommend-top__right {
  position: absolute;
  top: 4px;
  color: white;
  font-size: 20px;
  right: 15px;
  display: flex;
  align-items: center;
}

/**mv播放按钮 */
.recommend--icon {
  margin-right: 10px;
}

/**推荐MV 封面 */
.recommend--cover {
  width: 100% !important;
  /* height: 200px !important; */
}

/**mv头部 */
.recommend--cover:hover + .recommend--top .recommend--top--shadow {
  opacity: 1;
}

/**mv头部 */
.recommend--cover:hover + .recommend--top .recommend--icon {
  opacity: 0;
}

/**mv头部 */
.recommend--cover:hover + .recommend--top .recommend--mv--playCount {
  opacity: 0;
}

/**mv头部 标题阴影框*/
.recommend--top--shadow {
  position: absolute;
  top: 0;
  width: 100%;
  opacity: 0;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px 8px 0px 0px;
  transition: all 0.2s ease-in;
}
</style>
