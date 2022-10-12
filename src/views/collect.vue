<template>
  <div class="collect">
    <!--导航路由-->
    <div class="router--list">
      <ul class="menu">
        <li
          class="menu--item gray"
          :class="menu.active === index ? 'is-active' : ''"
          v-for="(item, index) in menu.list"
          :key="index"
          @click="handlerClick(index, item.key)"
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

//菜单
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
      key: "album",
      title: "专辑",
    },
    {
      key: "artist",
      title: "歌手",
    },
    {
      key: "video",
      title: "视频",
    },
    {
      key: "column",
      title: "专栏",
    },
  ],
});

//专辑
let shallowAlbum = markRaw(defineAsyncComponent(() => import("c/collect/album.vue")));

//歌手
let shallowArtist = markRaw(defineAsyncComponent(() => import("c/collect/artist.vue")));

//视频
let shallowVideo = markRaw(defineAsyncComponent(() => import("c/collect/video.vue")));

//专栏
let shallowColumn = markRaw(defineAsyncComponent(() => import("c/collect/column.vue")));

//打开组件
let handlerClick = (index: number, key: string) => {
  router.push({
    path: "/collect",
    query: {
      component: key,
      index,
    },
  });
};

watch(
  () => route.query,
  (Query) => {
    if (Query.component && Query.index) {
      handleComponent(String(Query.component), Number(Query.index));
    }
  }
);

//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "album",
  list: new Map(),
});

let handleComponent = (key: string, index: number) => {
  if (componentMap.list.get(String(key))) {
    componentMap.key = String(key);
    menu.active = index;
  }
};

//根据路由记录匹配组件
let setupComponent = () => {
  if (route.query.component && route.query.index) {
    handleComponent(String(route.query.component), Number(route.query.index));
  }
};

//设置路由map
let setMap = () => {
  componentMap.list.set("album", shallowAlbum);
  componentMap.list.set("artist", shallowArtist);
  componentMap.list.set("video", shallowVideo);
  componentMap.list.set("column", shallowColumn);
};

onMounted(() => {
  setMap();
  setupComponent();
});
</script>

<style scoped lang="scss">
.collect {
  padding-bottom: 20px;
}
</style>
