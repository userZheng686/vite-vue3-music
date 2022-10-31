<script setup lang="ts">
import { useRouter } from "vue-router";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { setInstanceRouter } from "@/contextMenu/routerInstance";

let router = useRouter();
let locale = zhCn;
let count = 0;

let getOnlineStatus = () => {
  let status = navigator.onLine;
  if (window.desktopMainAPI.notification) {
    window.desktopMainAPI.notification(
      "网易云音乐",
      `${status ? "网络连接成功" : "网络连接失败，请检查你的网络是否有问题?"}`,
      status
    );
    console.log("status", status);
  }
};

getOnlineStatus();

window.addEventListener("online", getOnlineStatus);
window.addEventListener("offline", getOnlineStatus);

// nextTick(() => {
//   getOnlineStatus();
// });

setInstanceRouter(router);
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <transition name="el-fade-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </el-config-provider>
</template>

<style lang="scss">
@import "@/assets/scss/globalScrollBar.scss";

body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #2c3e50; */
  overflow: hidden;
  user-select: none;
  font-size: 14px;
}

image {
  user-select: none;
}

::-webkit-scrollbar {
  @include scroll-bar(6, 6);
}

::-webkit-scrollbar-thumb {
  @include scroll-bar-thumb(3, 3, #e0e0e0);
}
</style>
