<template>
  <div class="layout">
    <!--bar-->
    <HeaderBar />
    <!--歌曲详情-->
    <SongDetail />
    <!--分享-->
    <Share />
    <!--动态转发-->
    <EventCloudDynamic />
    <!--分享动态-->
    <ShareEventDynamic />
    <div class="main" :class="{ detail: !computedRoute(route.path) }">
      <router-view v-slot="{ Component, route }">
        <Navigation v-show="computedRoute(route.path)" />
        <div class="wrap" style="flex: 1; overflow-y: scroll; overflow-x: hidden">
          <MessageControl class="message" v-show="popup.isOpenPrivateLetter" />
          <!--回到顶部-->
          <el-backtop target=".wrap" :right="50" :bottom="140"></el-backtop>
          <transition name="el-fade-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </div>
      </router-view>
    </div>
    <footer class="footer" v-show="computedRoute(route.path)">
      <MusicPlay />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { usePopupStore } from "@/store/popup";
import { useRoute } from "vue-router";

let route = useRoute();
let popup = usePopupStore();

//是否打开歌曲详情
let isSongDetailVisible = ref<boolean>(false);

//注入歌曲详情
provide("songDetailVisible", isSongDetailVisible);

let computedRoute = (path: string) => {
  if (path === "/videoDetail" || path === "/mvDetail") {
    return false;
  } else {
    return true;
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/globalScrollBar.scss";

.layout {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main {
  display: flex;
  flex: 1;
  /* overflow-y: scroll; */
  position: fixed;
  top: 60px;
  overflow-x: hidden;
  width: 100vw;
  left: 0;
  right: 0;
  bottom: 120px;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 120px;
  z-index: 2;
  background-color: var(--dark-footer, white);
  border-top: 1px solid #e6e6e6;
}

.detail {
  bottom: 0px;
}

.message {
  position: fixed;
  right: 0;
  top: 60px;
  bottom: 120px;
  width: 550px;
  z-index: 9999;
  overflow-y: scroll;
  background-color: var(--dark-normalBackgroundColor, white);
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 8px;
}

::-webkit-scrollbar {
  @include scroll-bar(6, 6);
}

::-webkit-scrollbar-thumb {
  @include scroll-bar-thumb(3, 3, #e0e0e0);
}
</style>
