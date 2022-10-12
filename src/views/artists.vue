<template>
  <div class="artists--detail">
    <div class="userinfo">
      <DefaultImage
        :picUrl="userInfo.img1v1Url"
        style="width: 180px; height: 180px"
        loadingWidth="90px"
        loadingHeight="90px"
        :param="180"
        :lazy="false"
        :y="180"
      />
      <div class="info">
        <div class="name">{{ userInfo.name }}</div>
        <div>{{ userInfo.alias.join(";") }}</div>
        <el-button class="btn" @click="isSubArtist">
          <el-icon :style="{ color: userInfo.isFollow ? 'red' : '' }">
            <StarFilled />
          </el-icon>
          <span>{{ userInfo.isFollow ? "已收藏" : "收藏" }}</span>
        </el-button>
        <el-button class="btn" v-if="userInfo.accountId" @click="jumpUserHome">
          <el-icon><User /></el-icon>
          <span>个人主页</span>
        </el-button>
        <div class="size">
          <span>单曲数:{{ userInfo.musicSize }}</span>
          <span>专辑数:{{ userInfo.albumSize }}</span>
          <span>MV数:{{ userInfo.mvSize }}</span>
        </div>
      </div>
    </div>
    <div class="tag">
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
                path: '/artists',
                query: { id: route.query.id, type: `${index + 1}` },
              })
            "
          >
            <span
              >{{ item.title
              }}{{ item.title === "演出" ? `(${userInfo.onlineCount})` : "" }}</span
            >
          </li>
        </ul>
        <div class="icon__right" v-show="menu.active === 0">
          <i
            class="iconfont icon-datu"
            @click="albumKey = 'picturePreview'"
            :class="{ active: albumKey === 'picturePreview' }"
            title="大图模式"
          ></i>
          <i
            class="iconfont icon-liebiao"
            @click="albumKey = 'list'"
            :class="{ active: albumKey === 'list' }"
            title="列表模式"
          ></i>
          <i
            class="iconfont icon-relituliebiao"
            @click="albumKey = 'chartList'"
            :class="{ active: albumKey === 'chartList' }"
            title="图列模式"
          ></i>
        </div>
      </div>
      <!--组件-->
      <transition name="el-fade-in">
        <keep-alive>
          <component :is="componentMap.list.get(componentMap.key)"> </component>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getArtistAlbum } from "@/api/api_album";
import { getArtistDetail, getArtistDetailDynamic, subArtist } from "@/api/api_artist";
import { SongDetailSongsItem } from "i/api/api_song";
import { ArtistAlbumItem } from "i/api/api_album";
import { useRoute, useRouter } from "vue-router";
import { loginCallback } from "@/utils/login";

let route = useRoute();
let router = useRouter();
let elMessage = inject("message") as any;

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
      key: "album",
      title: "专辑",
    },
    {
      key: "mv",
      title: "MV",
    },
    {
      key: "detail",
      title: "歌手详情",
    },
    {
      key: "simi",
      title: "相似歌手",
    },
  ],
});

//引入组件
let shallowAlbum = markRaw(defineAsyncComponent(() => import("c/artists/album.vue")));
let shallowMV = markRaw(defineAsyncComponent(() => import("c/artists/mv.vue")));
let shallowDetail = markRaw(defineAsyncComponent(() => import("c/artists/detail.vue")));
let shallowSimi = markRaw(defineAsyncComponent(() => import("c/artists/simi.vue")));
let shallowConcert = markRaw(defineAsyncComponent(() => import("c/artists/concert.vue")));

//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "album",
  list: new Map(),
});

//设置路由map
let setMap = () => {
  componentMap.list.set("album", shallowAlbum);
  componentMap.list.set("mv", shallowMV);
  componentMap.list.set("detail", shallowDetail);
  componentMap.list.set("simi", shallowSimi);
  componentMap.list.set("concert", shallowConcert);
};

let setCurrentUrlComponent = (type: string) => {
  if (type === "1") {
    menu.active = 0;
    componentMap.key = "album";
  } else if (type === "2") {
    menu.active = 1;
    componentMap.key = "mv";
  } else if (type === "3") {
    menu.active = 2;
    componentMap.key = "detail";
  } else if (type === "4") {
    menu.active = 3;
    componentMap.key = "simi";
  } else if (type === "5") {
    menu.active = 4;
    componentMap.key = "concert";
  }
};

//获取当前路由
let getCurrentUrl = () => {
  if (route.query) {
    let type = route.query.type;
    setCurrentUrlComponent(String(type));
  }
};

let userInfo = reactive<{
  name: string;
  alias: string[];
  albumSize: number;
  musicSize: number;
  mvSize: number;
  img1v1Url: string;
  tranNames: string[];
  isFollow: boolean;
  onlineCount: number;
  isSettle: boolean;
  accountId: number;
}>({
  name: "",
  alias: [],
  albumSize: 0,
  musicSize: 0,
  mvSize: 0,
  img1v1Url: "",
  tranNames: [],
  isFollow: false,
  onlineCount: 0,
  isSettle: false,
  accountId: 0,
});
let hotAlbumsList = ref<ArtistAlbumItem[]>([]);
let hotSongList = ref<SongDetailSongsItem[]>([]);
let albumKey = ref<string>("chartList");
let isMore = ref<boolean>(true);
provide("albumKey", albumKey);
provide("hotAlbumsList", hotAlbumsList);
provide("hotSongList", hotSongList);
provide("isMore", isMore);

let offset = 0;

let getArtistDetailInfo = async () => {
  try {
    let { artist, hotSongs } = await getArtistDetail(Number(route.query.id));
    let {
      followed,
      concert: { onlineCount },
    } = await getArtistDetailDynamic(Number(route.query.id));
    if (onlineCount > 0) {
      if (menu.list[menu.list.length - 1].title != "演出") {
        menu.list.push({
          key: "concert",
          title: "演出",
        });
      }
    } else {
      if (menu.list[menu.list.length - 1].title === "演出") {
        menu.list.pop();
      }
    }

    Object.assign(userInfo, {
      ...artist,
      isFollow: followed,
      onlineCount,
      isSettle: artist?.identifyTag?.length ? true : false,
    });
    hotSongs.forEach((item, index) => {
      item.progress = 0;
      item.from = {
        path: "artists",
        name: userInfo.name,
        val: {
          id: Number(route.query.id),
        },
      };
    });
    hotSongList.value = hotSongs;
  } catch (e: any) {}
};

let getArtistAlbumList = () => {
  return new Promise(async (resolve, reject) => {
    let { hotAlbums, more } = await getArtistAlbum(Number(route.query.id), offset);
    offset += hotAlbums.length;
    hotAlbumsList.value = hotAlbumsList.value.concat(hotAlbums);
    isMore.value = more;
    resolve("1");
  });
};
provide("getArtistAlbumList", getArtistAlbumList);

//收藏/取消收藏歌手
let isSubArtist = () => {
  loginCallback(async () => {
    //判断是要收藏歌手还是取消收藏歌手 2为取消收藏 1为收藏
    let collect = userInfo.isFollow ? 2 : 1;
    try {
      let res = await subArtist(Number(route.query.id), collect);
      elMessage.success(`${collect === 2 ? "取消收藏成功" : "收藏成功"}`);
      userInfo.isFollow = !userInfo.isFollow;
    } catch (e: any) {
      elMessage.success(`${collect === 2 ? "取消收藏失败" : "收藏失败"}`);
    }
  });
};

//跳转到个人主页
let jumpUserHome = () => {
  router.push({
    path: "/homePage",
    query: {
      id: userInfo.accountId,
    },
  });
};

//监听当前路由
watch(
  () => route.query,
  (Query) => {
    if (route.name !== "Artists") return;
    let type = Query?.type;
    setCurrentUrlComponent(type ? String(type) : "1");
  }
);

watch(
  () => route?.query?.id,
  (val) => {
    if (route.name !== "Artists") return;
    hotAlbumsList.value = [];
    isMore.value = true;
    offset = 0;
    getArtistDetailInfo();
  }
);

onActivated(() => {
  getArtistDetailInfo();
});

onMounted(() => {
  setMap();
  getCurrentUrl();
});
</script>

<style scoped lang="scss">
.artists--detail {
  margin-left: 30px;
  margin-top: 20px;

  .userinfo {
    display: flex;
  }
}

.info {
  margin-left: 20px;

  .name {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 5px;
  }

  .btn {
    margin-top: 10px;
  }

  .size {
    margin-top: 10px;

    span {
      margin-right: 20px;
    }
  }
}

.icon__right {
  margin-right: 20px;
  display: flex;
  align-items: center;

  i {
    font-size: 14px;
    background-color: rgb(242, 242, 242);
    color: black;
    padding: 5px;
    margin-left: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .active {
    background-color: rgb(191, 191, 191);
  }
}
</style>
