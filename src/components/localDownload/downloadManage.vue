<template>
  <!--下载管理-->
  <div class="download--manage">
    <!--下载文件的类别-->
    <div class="manage--type">
      <div
        class="type__item gray"
        :class="{ type_item_check: index === menu.active }"
        @click="checkChange(item.key)"
        v-for="(item, index) in menu.list"
        :key="index"
      >
        {{ item.title }}
      </div>
    </div>
    <!--列表-->
    <div class="download--list">
      <transition name="el-fade-in">
        <!--组件-->
        <keep-alive>
          <component :is="componentMap.list.get(componentMap.key)"></component>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

//路由实例
let route = useRoute();
let router = useRouter();

let shallowSong = markRaw(defineAsyncComponent(() => import("./downloadSong.vue")));
let shallowVoice = markRaw(defineAsyncComponent(() => import("./downloadVoice.vue")));
let shallowMV = markRaw(defineAsyncComponent(() => import("./downloadMV.vue")));
let shallowProgress = markRaw(
  defineAsyncComponent(() => import("./downloadProgress.vue"))
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
      key: "song",
      title: "已下载单曲",
    },
    {
      key: "voice",
      title: "已下载声音",
    },
    {
      key: "mv",
      title: "已下载MV",
    },
    {
      key: "progress",
      title: "正在下载",
    },
  ],
});

//获取当前路由
let getCurrentUrl = () => {
  if (route.query) {
    let key = route.query.key || "song";
    setCurrentUrlComponent(String(key));
  }
};

//监听当前路由
watch(
  () => route.query,
  (Query) => {
    let key = Query?.key;
    setCurrentUrlComponent(key ? String(key) : "song");
  }
);

let setCurrentUrlComponent = (key: string) => {
  if (key) {
    componentMap.key = key;
  }

  if (key === "song") {
    menu.active = 0;
  } else if (key === "voice") {
    menu.active = 1;
  } else if (key === "mv") {
    menu.active = 2;
  } else if (key === "progress") {
    menu.active = 3;
  }
};

//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "song",
  list: new Map(),
});

//设置路由map
let setMap = () => {
  componentMap.list.set("song", shallowSong);
  componentMap.list.set("voice", shallowVoice);
  componentMap.list.set("mv", shallowMV);
  componentMap.list.set("progress", shallowProgress);
};

//改变选中的类别
let checkChange = (key: string) => {
  router.push({
    path: "/localDownload",
    query: { type: 1, key },
  });
};

onMounted(() => {
  setMap();
  getCurrentUrl();
});
</script>

<style scoped lang="scss">
//下载文件的类别
.manage--type {
  display: flex;
  align-items: center;
  margin-left: 30px;
}

//类别元素
.type__item {
  padding: 10px;
  margin-right: 10px;
  transition: all 0.2s;
}

//选中的类别
.type_item_check {
  border-radius: 5px;
  color: rgb(255, 122, 158);
  background-color: rgb(256, 248, 248);
}

//选中的类别 选中
.type_item_check:hover {
  color: rgb(255, 122, 158);
}
</style>
