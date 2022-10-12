<template>
  <!--mv页-->
  <div class="mv">
    <!--最新mv-->
    <div class="mv--wrap">
      <!--最新mv头部 包括标题 分类-->
      <div class="wrap--top">
        <!--标题-->
        <div class="wrap--top__title" @click="handleOpenMvAllNew({ order: '最新' })">
          最新MV
          <el-icon><ArrowRight /></el-icon>
        </div>
        <!--地区分类-->
        <div class="wrap--top__category">
          <el-tag
            style="cursor: pointer; transition: all 0.2s; margin-left: 15px"
            @click="handlerNewAreaClick(item)"
            round
            :effect="newArea === item ? 'dark' : 'plain'"
            :type="newArea === item ? 'danger' : ''"
            v-for="(item, index) in areaList"
            :key="index"
            >{{ item }}</el-tag
          >
        </div>
      </div>
      <!--最新mv列表-->
      <el-skeleton :rows="3" animated :loading="newMVList.isLoading">
        <!--骨架屏-->
        <template #template>
          <!--视频列表-->
          <div class="el-skeleton--video--list">
            <!--视频列表 元素-->
            <div
              class="el-skeleton--video--list__item"
              v-for="(item, index) in 8"
              :key="index"
            >
              <!--视频列表 元素 封面 标题 作者-->
              <el-skeleton-item
                variant="image"
                class="el-skeleton--video--list__item__img"
              />
              <el-skeleton-item
                class="el-skeleton--video--list__item__name"
                variant="text"
              />
              <el-skeleton-item
                class="el-skeleton--video--list__item__name"
                variant="text"
              />
            </div>
          </div>
        </template>
        <!--内容区域-->
        <template #default>
          <div class="wrap--list">
            <MvListItem
              v-for="(item) in newMVList.list"
              :key="item.id"
              :item="item"
              titleClass="single-clamp"
              :contextMenu="contextMenuMVList"
              paddingBottom="70%"
            />
          </div>
        </template>
      </el-skeleton>
    </div>
    <!--热播mv-->
    <div class="mv--hot">
      <!--热播mv头部 包括标题 分类-->
      <div class="wrap--top">
        <!--标题-->
        <div class="wrap--top__title" @click="handleOpenMvAllNew({ order: '最热' })">
          热播MV
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      <!--热播mv列表-->
      <el-skeleton :rows="3" animated :loading="hotMVList.isLoading">
        <!--骨架屏-->
        <template #template>
          <!--视频列表-->
          <div class="el-skeleton--video--list">
            <!--视频列表 元素-->
            <div
              class="el-skeleton--video--list__item"
              v-for="(item, index) in 8"
              :key="index"
            >
              <!--视频列表 元素 封面 标题 作者-->
              <el-skeleton-item
                variant="image"
                class="el-skeleton--video--list__item__img"
              />
              <el-skeleton-item
                class="el-skeleton--video--list__item__name"
                variant="text"
              />
              <el-skeleton-item
                class="el-skeleton--video--list__item__name"
                variant="text"
              />
            </div>
          </div>
        </template>
        <!--内容区域-->
        <template #default>
          <div class="wrap--list">
            <MvListItem
              v-for="(item) in hotMVList.list"
              :key="item.id"
              :item="item"
              :contextMenu="contextMenuMVList"
              titleClass="single-clamp"
              paddingBottom="70%"
            />
          </div>
        </template>
      </el-skeleton>
    </div>
    <!--网易出品-->
    <div class="mv--wangyi">
      <!--网易出品头部 包括标题 分类-->
      <div class="wrap--top">
        <!--标题-->
        <div class="wrap--top__title" @click="handleOpenMvAllNew({ type: '网易出品' })">
          网易出品
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      <!--网易出品列表-->
      <el-skeleton :rows="3" animated :loading="wangyiMVList.isLoading">
        <!--骨架屏-->
        <template #template>
          <!--视频列表-->
          <div class="el-skeleton--video--list">
            <!--视频列表 元素-->
            <div
              class="el-skeleton--video--list__item"
              v-for="(item, index) in 8"
              :key="index"
            >
              <!--视频列表 元素 封面 标题 作者-->
              <el-skeleton-item
                variant="image"
                class="el-skeleton--video--list__item__img"
              />
              <el-skeleton-item
                class="el-skeleton--video--list__item__name"
                style="height: 40px"
                variant="text"
              />
            </div>
          </div>
        </template>
        <!--内容区域-->
        <template #default>
          <div class="wrap--list">
            <MvListItem
              v-for="(item) in wangyiMVList.list"
              :key="item.id"
              :item="item"
              :isShowAuthor="false"
              titleClass="more-clamp2"
              :contextMenu="contextMenuMVList"
              paddingBottom="70%"
            />
          </div>
        </template>
      </el-skeleton>
    </div>
    <!--mv排行榜-->
    <div class="mv--toplist">
      <div class="wrap--top">
        <!--标题-->
        <div class="wrap--top__title" @click="router.push({ path: '/mvTopList' })">
          MV排行榜
          <el-icon><ArrowRight /></el-icon>
        </div>
        <!--分类-->
        <div class="wrap--top__category">
          <el-tag
            style="cursor: pointer; transition: all 0.2s; margin-left: 15px"
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
      <!--mv排行榜列表-->
      <el-skeleton :rows="3" animated :loading="topMVList.isLoading">
        <!--骨架屏-->
        <template #template>
          <!--视频列表-->
          <div class="el-skeleton--mv--toplist">
            <!--视频列表 元素-->
            <div
              class="el-skeleton--mv--toplist__item"
              v-for="(item, index) in 8"
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
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import { getNewMv, getAllMv, getTopMv } from "@/api/api_mv";
import { NewMvItem, TopMvItem } from "i/api/api_mv.d";
import { normalizeAuthor } from "@/utils/author";
import {contextMenuMVList} from '@/contextMenu/mv/normal'

let elMessage = inject("message") as any;

//地区列表
let areaList = ["内地", "港台", "欧美", "日本", "韩国"];
//最新地区分类
let newArea = ref<string>("内地");
//排行榜地区分类
let topArea = ref<string>("内地");
//路由实例
let router = useRouter();

//最新列表
let newMVList = reactive<{
  list: NewMvItem[];
  isLoading: boolean;
}>({
  list: [],
  isLoading: true,
});

//热播列表
let hotMVList = reactive<{
  list: NewMvItem[];
  isLoading: boolean;
}>({
  list: [],
  isLoading: true,
});

//网易出品
let wangyiMVList = reactive<{
  list: NewMvItem[];
  isLoading: boolean;
}>({
  list: [],
  isLoading: true,
});

//mv排行榜
let topMVList = reactive<{
  list: TopMvItem[];
  isLoading: boolean;
}>({
  list: [],
  isLoading: true,
});

//处理地区分类点击事件
let handlerNewAreaClick = (item: string) => {
  newArea.value = item;
  // newMVList.isLoading = true;
  getNewMvList();
};

//处理地区分类点击事件
let handlerTopAreaClick = (item: string) => {
  topArea.value = item;
  // newMVList.isLoading = true;
  getTopMvList();
};

//加载最新mv列表
let getNewMvList = async () => {
  try {
    let { data } = await getNewMv(newArea.value, 8);
    newMVList.list = data;
    setTimeout(() => {
      newMVList.isLoading = false;
    }, 100);
  } catch (e: any) {
    elMessage.error(e?.message || "请求最新列表出错 请检查你的网络是否有问题?");
  }
};

//热播mv列表
let getHotMvList = async () => {
  try {
    let { data } = await getAllMv("全部", "全部", "最热", 8);
    hotMVList.list = data;
    setTimeout(() => {
      hotMVList.isLoading = false;
    }, 100);
  } catch (e: any) {
    elMessage.error(e?.message || "请求热播列表出错 请检查你的网络是否有问题?");
  }
};

//网易mv列表
let getWangyiMvList = async () => {
  try {
    let { data } = await getAllMv("全部", "网易出品", "上升最快", 8);
    wangyiMVList.list = data;
    setTimeout(() => {
      wangyiMVList.isLoading = false;
    }, 100);
  } catch (e: any) {
    elMessage.error(e?.message || "请求热播列表出错 请检查你的网络是否有问题?");
  }
};

//mv排行榜列表
let getTopMvList = async () => {
  try {
    let { data } = await getTopMv(10, topArea.value);
    topMVList.list = data;
    setTimeout(() => {
      topMVList.isLoading = false;
    }, 100);
  } catch (e: any) {
    elMessage.error(e?.message || "请求热播列表出错 请检查你的网络是否有问题?");
  }
};

//打开全部MV
let handleOpenMvAllNew = (param: { [propname: string]: string }) => {
  router.push({
    path: "/mvAll",
    query: param,
  });
};

getNewMvList();
getHotMvList();
getWangyiMvList();
getTopMvList();
</script>

<style scoped lang="scss">
/**样式复用 */
@mixin list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  row-gap: 10px;
}

@mixin list__item {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

@mixin list__item__img {
  width: 100%;
  height: 200px;
}

@mixin list__item__name {
  height: 20px;
  margin-top: 10px;
}

@mixin top__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  row-gap: 20px;
  margin-top: 20px;
}

/**mv页面 */
.mv {
  display: flex;
  flex-direction: column;
}

.mv--hot,
.mv--wangyi,
.mv--toplist {
  margin-top: 25px;
}

//最新mv头部
.wrap--top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
//最新mv头部 标题
.wrap--top__title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
//最新mv头部 分类
.wrap--top__category {
  display: flex;
  align-items: center;
}

//最新mv列表
.wrap--list {
  @include list;
}

//mv排行榜列表
.top--list {
  @include top__list;
}

/**骨架屏 */
/**视频列表 */
.el-skeleton--video--list {
  @include list;
}

/**视频列表元素 */
.el-skeleton--video--list__item {
  @include list__item;
}

/**视频列表封面 */
.el-skeleton--video--list__item__img {
  @include list__item__img;
}
/**视频列表元素 标题 作者  */
.el-skeleton--video--list__item__name {
  @include list__item__name;
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
  width: 300px;
  height: 200px;
}
/**mv排行榜 列表元素 作品名 作者 */
.el-skeleton--mv--toplist__item__name {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-self: self-start;
}
/**mv排行榜 列表元素 作品名 作者 */
.el-skeleton--mv--toplist__item__text {
  width: 80%;
  margin-top: 10px;
  margin-left: 20px;
}
</style>
