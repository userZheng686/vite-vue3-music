<template>
  <!--发现音乐-->
  <div class="find--music">
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
        <component
          :is="componentMap.list.get(componentMap.key)"
        ></component>
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

//每日推荐
let shallowRecommend = markRaw(
  defineAsyncComponent(() => import("c/findMusic/recommend.vue"))
);
//专属定制
let shallowPrivateCustom = markRaw(
  defineAsyncComponent(() => import("c/findMusic/Custom.vue"))
);
//全部歌单
let shallowAllSongMenu = markRaw(
  defineAsyncComponent(() => import("c/findMusic/allSongMenu.vue"))
);
//精品歌单
let shallowEliteSongMenu = markRaw(
  defineAsyncComponent(() => import("c/findMusic/eliteSongMenu.vue"))
);
//排行榜
let shallowTopList = markRaw(
  defineAsyncComponent(() => import("c/findMusic/topList.vue"))
);
//歌手
let shallowArtist = markRaw(defineAsyncComponent(() => import("c/findMusic/artist.vue")));
//新音乐
let shallowNewMusic = markRaw(
  defineAsyncComponent(() => import("c/findMusic/newMusic.vue"))
);

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
      key: "recommend",
      title: "个性推荐",
    },
    {
      key: "privateCustom",
      title: "专属定制",
    },
    {
      key: "allSongMenu",
      title: "歌单",
    },
    {
      key: "topList",
      title: "排行榜",
    },
    {
      key: "artist",
      title: "歌手",
    },
    {
      key: "newMusic",
      title: "最新音乐",
    },
  ],
});
//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "recommend",
  list: new Map(),
});

//根据路由记录匹配组件
let setupComponent = () => {
  if (route.query.component && route.query.index) {
    handleComponent(String(route.query.component), Number(route.query.index));
  }
};

let handleComponent = (key: string, index: number) => {
  if (componentMap.list.get(String(key))) {
    componentMap.key = String(key);
    menu.active = index;
  }
};

watch(
  () => route.query,
  (Query) => {
    if (Query.component && Query.index) {
      handleComponent(String(Query.component), Number(Query.index));
    }
  }
);

//设置路由map
let setMap = () => {
  componentMap.list.set("recommend", shallowRecommend);
  componentMap.list.set("privateCustom", shallowPrivateCustom);
  componentMap.list.set("allSongMenu", shallowAllSongMenu);
  componentMap.list.set("eliteSongMenu", shallowEliteSongMenu);
  componentMap.list.set("topList", shallowTopList);
  componentMap.list.set("artist", shallowArtist);
  componentMap.list.set("newMusic", shallowNewMusic);
};

//打开组件
let handlerClick = (index: number, key: string) => {
  router.push({
    path: "/findMusic",
    query: {
      component: key,
      index,
    },
  });
};

onMounted(() => {
  setMap();
  setupComponent();
});
</script>

<style scoped lang="scss">
.find--music {
  min-width: 750px;
  width: 90%;
  max-width: 1200px;
  margin: auto;
}

</style>
