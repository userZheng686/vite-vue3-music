<template>
  <!--本地与下载-->
  <div class="local">
    <!--导航路由-->
    <div class="router--list">
      <ul class="menu">
        <li
          class="menu--item gray"
          :class="menu.active === index ? 'is-active' : ''"
          v-for="(item, index) in menu.list"
          :key="index"
          @click="
            router.push({
              path: '/localDownload',
              query: { type: `${index + 1}` },
            })
          "
        >
          <span>{{ item.title }}</span>
        </li>
      </ul>
    </div>
    <!--组件-->
    <transition name="el-fade-in">
      <keep-alive>
        <component :is="componentMap.list.get(componentMap.key)"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

//路由实例
let route = useRoute();
let router = useRouter();

//这里要用markraw标记异步导入的组件 不然会有warning

let shallowDownloadManage = markRaw(
  defineAsyncComponent(() => import("c/localDownload/downloadManage.vue"))
);

let shallowLocalMusic = markRaw(
  defineAsyncComponent(() => import("c/localDownload/localMusic.vue"))
);

//菜单列表
let menu = reactive<{
  active: number;
  list: Array<{
    key: string;
    title: string;
  }>;
}>({
  active: 0,
  list: [
    {
      key: "downloadManage",
      title: "下载管理",
    },
    {
      key: "localMusic",
      title: "本地音乐",
    },
  ],
});

//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "downloadManage",
  list: new Map(),
});

//设置路由map
let setMap = () => {
  componentMap.list.set("downloadManage", shallowDownloadManage);
  componentMap.list.set("localMusic", shallowLocalMusic);
};

//获取当前路由
let getCurrentUrl = () => {
  if (route.query) {
    let type = route.query.type;
    setCurrentUrlComponent(String(type));
  }
};

//监听当前路由
watch(
  () => route.query,
  (Query) => {
    let type = Query?.type;
    setCurrentUrlComponent(type ? String(type) : "1");
  }
);

let setCurrentUrlComponent = (type: string) => {
  if (type === "1") {
    menu.active = 0;
    componentMap.key = "downloadManage";
  } else if (type === "2") {
    menu.active = 1;
    componentMap.key = "localMusic";
  }
};

onMounted(() => {
  setMap();
  getCurrentUrl();
});
</script>

<style scoped lang="scss">
@mixin left {
  margin-left: 30px;
}
</style>
