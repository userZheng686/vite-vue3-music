<template>
  <!--视频-->
  <div class="video">
    <!--导航路由-->
    <div class="router--list">
      <ul class="menu">
        <li
          class="menu--item gray"
          :class="menu.active === index ? 'is-active' : ''"
          v-for="(item, index) in menu.list"
          :key="index"
          @click="router.push({ path: '/video', query: { type: `${index + 1}` } })"
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
import { useRoute, useRouter } from "vue-router";

let route = useRoute();
let router = useRouter();

//这里要用markraw标记异步导入的组件 不然会有warning

//引入video组件
let shallowVideo = markRaw(defineAsyncComponent(() => import("c/video/videoList.vue")));

//引入mv组件
let shallowMV = markRaw(defineAsyncComponent(() => import("c/video/mvList.vue")));

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
      key: "video",
      title: "视频",
    },
    {
      key: "mv",
      title: "MV",
    },
  ],
});

//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "video",
  list: new Map(),
});

//设置路由map
let setMap = () => {
  componentMap.list.set("video", shallowVideo);
  componentMap.list.set("mv", shallowMV);
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
    if (type && route.name === "Video") {
      setCurrentUrlComponent(type ? String(type) : "1");
    }
  }
);

let setCurrentUrlComponent = (type: string) => {
  if (type === "1") {
    menu.active = 0;
    componentMap.key = "video";
  } else if (type === "2") {
    menu.active = 1;
    componentMap.key = "mv";
  }
};

onMounted(() => {
  setMap();
  getCurrentUrl();
});
</script>

<style lang="scss" scoped>
.video {
  max-width: 1200px;
  margin: auto;
  width: 90%;
}
</style>
