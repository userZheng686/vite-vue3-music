<template>
  <!--MV排行榜-->
  <div class="mv--topList">
    <!--标题-->
    <div class="topList__title">MV排行榜</div>
    <!--副标题 包含分类-->
    <div class="topList--subtitle">
      <!--提示-->
      <div class="subtitle__left">
        <span style="margin-right: 5px">最近更新：今天</span>
        <el-popover
          placement="top"
          title=""
          :width="200"
          trigger="hover"
          content="选取云音乐中三个月内发布的热度最高的50支MV，每天更新。热度由MV播放，收藏，分享数量综合计算"
        >
          <template #reference>
            <i class="iconfont icon-bangzhu"></i>
          </template>
        </el-popover>
      </div>
      <!--分类-->
      <div class="subtitle__right">
        <el-tag
          style="cursor: pointer; transition: all 0.2s; margin-left: 20px"
          @click="handlerTopAreaClick(item)"
          round
          :effect="topArea === item ? 'dark' : 'plain'"
          :type="topArea === item ? 'danger' : ''"
          v-for="(item, index) in areaList"
          :key="index"
          >{{ item }}</el-tag
        >
      </div>
    </div>
    <!--列表外层-->
    <div class="topList--wrap">
      <!--mv排行榜列表-->
      <el-skeleton :rows="3" animated :loading="topMVList.isLoading">
        <!--骨架屏-->
        <template #template>
          <!--视频列表-->
          <div class="el-skeleton--mv--toplist">
            <!--视频列表 元素-->
            <div
              class="el-skeleton--mv--toplist__item"
              v-for="(item, index) in 10"
              :key="index"
            >
              <!--榜单位置-->
              <el-skeleton-item
                class="el-skeleton--mv--toplist__item__number"
                style="height: 40px"
                variant="text"
              />
              <!--视频列表 元素 封面-->
              <el-skeleton-item
                variant="image"
                class="el-skeleton--mv--toplist__item__img"
              />
              <!--视频列表 元素 作品名 作者-->
              <div class="el-skeleton--mv--toplist__item__name">
                <el-skeleton-item
                  class="el-skeleton--mv--toplist__item__text"
                  style="height: 40px"
                  variant="text"
                />
                <el-skeleton-item
                  class="el-skeleton--mv--toplist__item__text"
                  style="height: 40px"
                  variant="text"
                />
              </div>
            </div>
          </div>
        </template>
        <!--内容区域-->
        <template #default>
          <div class="top--list">
            <MvTopListItem
              v-for="(item, index) in topMVList.list"
              :key="item.id"
              :item="item"
              :index="index + 1"
              :contextMenu="contextMenuMVList"
            />
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { getTopMv } from "@/api/api_mv";
import { TopMvItem } from "i/api/api_mv.d";
import {contextMenuMVList} from '@/contextMenu/mv/normal'


//地区列表
let areaList = ["内地", "港台", "欧美", "日本", "韩国"];
//排行榜地区分类
let topArea = ref<string>("内地");

//mv排行榜
let topMVList = reactive<{
  list: TopMvItem[];
  isLoading: boolean;
}>({
  list: [],
  isLoading: true,
});

let elMessage = inject("message") as any;

//mv排行榜列表
let getTopMvList = async () => {
  try {
    let { data } = await getTopMv(50, topArea.value);
    topMVList.list = data;
    setTimeout(() => {
      topMVList.isLoading = false;
    }, 100);
  } catch (e: any) {
    elMessage.error(e?.message || "请求热播列表出错 请检查你的网络是否有问题?");
  }
};

let handlerTopAreaClick = (item: string) => {
  if (topArea.value === item) return;
  topArea.value = item;
  topMVList.isLoading = true;
  getTopMvList();
};

getTopMvList();
</script>

<style scoped lang="scss">
@mixin top__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  row-gap: 20px;
  margin-top: 20px;
}

//全部MV
.mv--topList {
  width: 90%;
  max-width: 1200px;
  margin: auto;
  overflow: scroll;
}

//标题
.topList__title {
  font-size: 24px;
  margin-top: 20px;
}

//副标题
.topList--subtitle {
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-between;
  width: 85%;
}

//列表
.topList--wrap {
  width: 85%;
}

//mv排行榜列表
.top--list {
  @include top__list;
}

/**mv排行榜 列表 */
.el-skeleton--mv--toplist {
  @include top__list;
}

/**mv排行榜 列表元素 */
.el-skeleton--mv--toplist__item {
  display: flex;
  align-items: center;
}

/**mv排行榜 列表元素 排行单 */
.el-skeleton--mv--toplist__item__number {
  width: 40px !important;
  margin-right: 20px;
}

/**mv排行榜 列表元素 封面 */
.el-skeleton--mv--toplist__item__img {
  width: 12vw;
  height: 17vh;
}

/**mv排行榜 列表元素 作品名 作者 */
.el-skeleton--mv--toplist__item__name {
  display: flex;
  flex-direction: column;
  align-self: self-start;
  width: 10vw;
}

/**mv排行榜 列表元素 作品名 作者 */
.el-skeleton--mv--toplist__item__text {
  /* width: 80%; */
  margin-top: 10px;
  margin-left: 20px;
}
</style>
