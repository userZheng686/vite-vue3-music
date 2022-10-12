<template>
  <section>
    <h1 class="title">搜索 {{ route.query.keyword }}</h1>
    <div class="suggest" v-if="matchList.length">
      <div class="info">你可能感兴趣</div>
      <div class="list">
        <div
          class="list__item"
          v-for="item in matchList"
          :key="item.resourceType"
          @click="jumpPage(item)"
        >
          <el-avatar
            :src="item?.resourceDTO?.uiElement?.image?.imageUrl"
            alt="avatar"
            class="img"
            :size="40"
          ></el-avatar>
          <div class="single-clamp">
            <div>{{ item?.resourceDTO?.uiElement?.mainTitle?.title }}</div>
            <div class="info single-clamp">
              {{ item?.resourceDTO?.uiElement?.subTitle?.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <transition
      name="el-fade-in"
      class="mr_20"
      :class="needLeftMargin.includes(componentMap.key) ? 'component' : ''"
    >
      <keep-alive>
        <component :is="componentMap.list.get(componentMap.key)"></component>
      </keep-alive>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { getBestMatch } from "@/api/api_search";
import { resDTOListItem } from "@/interface/api/api_search";
import { useRoute, useRouter } from "vue-router";

//路由实例
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
      key: "song",
      title: "单曲",
    },
    {
      key: "artist",
      title: "歌手",
    },
    {
      key: "album",
      title: "专辑",
    },
    {
      key: "video",
      title: "视频",
    },
    {
      key: "playlist",
      title: "歌单",
    },
    {
      key: "lyric",
      title: "歌词",
    },
    {
      key: "dj",
      title: "播客",
    },
    {
      key: "djProgram",
      title: "声音",
    },
    {
      key: "user",
      title: "用户",
    },
  ],
});
//map component
let componentMap = reactive<{
  key: string;
  list: Map<string, any>;
}>({
  key: "recommend",
  list: new Map(),
});

//需要间距的组件
let needLeftMargin = ref<string[]>(["song", "lyric"]);

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

//最佳匹配
let matchList = ref<Array<resDTOListItem>>([]);

//单曲
let shallowSong = markRaw(defineAsyncComponent(() => import("c/search/song.vue")));
//歌手
let shallowArtist = markRaw(defineAsyncComponent(() => import("c/search/artist.vue")));
//专辑
let shallowAlbum = markRaw(defineAsyncComponent(() => import("c/search/album.vue")));
//视频
let shallowVideo = markRaw(defineAsyncComponent(() => import("c/search/video.vue")));
//歌单
let shallowPlaylist = markRaw(
  defineAsyncComponent(() => import("c/search/playlist.vue"))
);
//歌词
let shallowLyric = markRaw(defineAsyncComponent(() => import("c/search/lyric.vue")));
//播客
let shallowDj = markRaw(defineAsyncComponent(() => import("c/search/dj.vue")));
//声音
let shallowDjProgram = markRaw(
  defineAsyncComponent(() => import("c/search/djProgram.vue"))
);
//声音
let shallowUsers = markRaw(
  defineAsyncComponent(() => import("@/components/search/users.vue"))
);

//设置路由map
let setMap = () => {
  componentMap.list.set("song", shallowSong);
  componentMap.list.set("artist", shallowArtist);
  componentMap.list.set("album", shallowAlbum);
  componentMap.list.set("video", shallowVideo);
  componentMap.list.set("playlist", shallowPlaylist);
  componentMap.list.set("lyric", shallowLyric);
  componentMap.list.set("dj", shallowDj);
  componentMap.list.set("djProgram", shallowDjProgram);
  componentMap.list.set("user", shallowUsers);
};

watch(
  () => route.query,
  (Query) => {
    if (Query.component && Query.index) {
      handleComponent(String(Query.component), Number(Query.index));
      getMatchList();
    }
  }
);

//打开组件
let handlerClick = (index: number, key: string) => {
  router.push({
    path: "/search",
    query: {
      component: key,
      index,
      keyword: route.query.keyword,
    },
  });
};

//跳转页面
let jumpPage = (item: resDTOListItem) => {
  let type = item.subType || item.resourceType;
  let id = item.resourceDTO.resourceId;
  switch (type) {
    case "artist":
      {
        router.push({
          path: "/artists",
          query: {
            type: 1,
            id,
          },
        });
      }
      break;
    case "album":
      {
        router.push({
          path: "/albumDetail",
          query: {
            id,
          },
        });
      }
      break;
    case "mv":
      {
        router.push({
          path: "/mvDetail",
          query: {
            mvid: id,
          },
        });
      }
      break;
    case "playlist":
      {
        router.push({
          path: "/songMenuDetail",
          query: {
            id,
          },
        });
      }
      break;
  }
};

//获取最佳匹配列表
let getMatchList = async () => {
  try {
    let {
      data: { resDTOList },
    } = await getBestMatch(String(route.query.keyword));
    let matchType = ["artist", "album", "mv", "playlist"];
    resDTOList = resDTOList.filter((item) =>
      matchType.includes(item.subType ? item.subType : item.resourceType)
    );
    matchList.value = resDTOList;
  } catch (e: any) {}
};

onMounted(() => {
  setMap();
  setupComponent();
});

onActivated(() => {
  getMatchList();
});
</script>

<style scoped lang="scss">
.title,
.suggest,
.component {
  margin-left: 30px;
}

.mr_20 {
  margin-right: 20px;
}

.list {
  display: flex;
  align-items: center;
  margin-top: 10px;
  .list__item {
    display: flex;
    align-items: center;
    background-color: var(--dark-circle, rgb(245, 245, 245));
    padding: 10px;
    max-width: 370px;
    width: 370px;
    margin-right: 20px;
    border-radius: 8px;
    cursor: pointer;
    .img {
      margin-right: 20px;
    }

    &:hover {
      background-color: var(--dark-circle, rgb(250, 250, 250));
    }
  }
}
</style>
