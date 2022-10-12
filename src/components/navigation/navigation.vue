<template>
  <aside class="nav">
    <div class="resize"></div>
    <div class="line"></div>
    <section>
      <!--头部菜单-->
      <div
        class="nav--item"
        v-for="(item, index) in nav"
        :key="index"
        @click="handleClick(item.title, item.path, null, item.key)"
        :class="active === item.title ? 'is-active is-active--menu' : 'is-deactive'"
      >
        {{ item.title }}
        <el-badge
          :is-dot="count[item.key] ? true : false"
          v-if="count[item.key]"
        ></el-badge>
      </div>
      <!--我的音乐-->
      <div class="my--music" v-if="computedIsLogin">
        <div class="music--title">我的音乐</div>
        <div
          class="music--item"
          @click="handleClick(item.title, item.path, null, item.key)"
          v-for="(item, index) in my"
          :key="index"
          :class="active === item.title ? 'is-active' : 'is-deactive'"
        >
          <i class="iconfont" :class="item.icon ? `icon-${item.icon}` : ''"></i>
          <span>{{ item.title }}</span>
          <el-badge :is-dot="count[item.key]" v-if="count[item.key]"></el-badge>
        </div>
      </div>
      <!--创建的歌单-->
      <div class="create--songMenu" v-if="computedIsLogin">
        <!--标题-->
        <div
          class="create--title song--open"
          @click="
            collapseSongMenu.isOpenCreateSongMenu = !collapseSongMenu.isOpenCreateSongMenu
          "
        >
          <span
            >创建的歌单
            <span>
              <el-icon
                :class="
                  !collapseSongMenu.isOpenCreateSongMenu
                    ? 'song--open'
                    : 'song--open--icon song--open'
                "
              >
                <CaretRight />
              </el-icon>
            </span>
          </span>
          <el-icon
            class="create--plus"
            @click.stop.prevent="songMenu.createSongMenuShow = true"
          >
            <Plus />
          </el-icon>
        </div>
        <!--列表-->
        <div
          class="create-songMenu--list--wrap"
          :class="collapseSongMenu.isOpenCreateSongMenu ? '' : 'collapse--noOpen'"
        >
          <div
            class="create--songMenu--list"
            v-for="(item, index) in createSongMenu"
            @click="handleClick(item.title, item.path, item.id)"
            :class="active === item.title ? 'is-active' : 'is-deactive'"
            :key="index"
            @contextmenu="contextMenuNavigationPlaylist($event, item, index === 0, true)"
          >
            <i class="iconfont" :class="item.leftIcon ? `icon-${item.leftIcon}` : ''"></i>
            <span v-title class="list--title single-clamp">{{ item.title }}</span>
            <i
              v-show="item.rightIcon"
              class="iconfont icon--heart"
              :class="item.isLike ? `icon-xindong` : `icon-yinliang`"
              title="开启心动模式"
              @click="openHeart(item.id)"
              :style="{ color: item.open ? 'red' : '' }"
            ></i>
          </div>
        </div>
      </div>
      <!--收藏的歌单-->
      <div class="collect--songMenu" v-if="computedIsLogin">
        <!--标题-->
        <div
          class="collect--title song--open"
          @click="
            collapseSongMenu.isOpenCollectSongMenu = !collapseSongMenu.isOpenCollectSongMenu
          "
        >
          <span
            >收藏的歌单
            <span>
              <el-icon
                :class="
                  !collapseSongMenu.isOpenCollectSongMenu
                    ? 'song--open'
                    : 'song--open--icon song--open'
                "
              >
                <CaretRight />
              </el-icon>
            </span>
          </span>
        </div>
        <!--列表-->
        <div
          class="collect-songMenu--list--wrap"
          :class="collapseSongMenu.isOpenCollectSongMenu ? '' : 'collapse--noOpen'"
        >
          <div
            class="collect--songMenu--list"
            v-for="(item, index) in collectSongMenu"
            :class="active === item.title ? 'is-active' : 'is-deactive'"
            @click="handleClick(item.title, item.path, item.id)"
            :key="index"
            @contextmenu="contextMenuNavigationPlaylist($event, item, false, false)"
          >
            <i class="iconfont" :class="item.leftIcon ? `icon-${item.leftIcon}` : ''"></i>
            <span class="list--title single-clamp" v-title>{{ item.title }}</span>
            <i
              v-show="item.rightIcon"
              class="iconfont icon--heart"
              :class="item.isLike ? `icon-xindong` : `icon-yinliang`"
              :style="{ color: item.open ? 'red' : '' }"
            ></i>
          </div>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { CaretRight, Plus } from "@element-plus/icons-vue";
import { useUserInformation } from "@/store/user";
import { playlist } from "i/api/api_playList.d";
import { intelligencePlay } from "@/api/api_playList";
import { play } from "@/utils/play";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { useSongStore } from "@/store/playList";
import { contextMenuNavigationPlaylist } from "@/contextMenu/playlist/navigation";
import { useCount } from "@/store/count";

//路由实例
let router = useRouter();
//创建歌单弹窗
let songMenu = useSongMenuPopupStore();
//正在播放的歌曲列表
let songList = useSongStore();
//message
let elMessage = inject("message") as any;
//当前路由对象
let route = useRoute();
//用户信息
let userInfo = useUserInformation();
//count
let count = useCount();

/**path */
interface path {
  [propname: string]: string;
}

//歌单
interface songMenu {
  leftIcon: string;
  title: string;
  path: string;
  rightIcon: boolean;
  id: number;
  isLike: boolean;
  open: boolean;
  coverImgUrl: string;
}

let pathToTitle: path = {
  findMusic: "发现音乐",
  podCaster: "播客",
  category: "播客",
  video: "视频",
  mvAll: "视频",
  mvTopList: "视频",
  dynamics: "关注",
  live: "直播",
  personFM: "私人FM",
  recentlyPlay: "最近播放",
  localDownload: "本地与下载",
  recentPlaySong: "最近播放",
  musicDisk: "我的音乐云盘",
  broadCast: "我的播客",
  collect: "我的收藏",
  songMenuDetail: "歌曲详情",
  albumDetail: "专辑",
  look: "直播",
  personalFM: "私人FM",
};

/**导航栏 */
let nav = reactive<
  Array<{
    title: string;
    path: string;
    key: string;
  }>
>([
  {
    title: "发现音乐",
    path: "/findMusic",
    key: "",
  },
  {
    title: "播客",
    path: "/podCaster",
    key: "",
  },
  {
    title: "视频",
    path: "/video",
    key: "",
  },
  {
    title: "关注",
    path: "/dynamics",
    key: "eventCount",
  },
  {
    title: "直播",
    path: "/look",
    key: "",
  },
  {
    title: "私人FM",
    path: "/personalFM",
    key: "",
  },
]);

/**激活的菜单 */
let active = ref<string>("发现音乐");

/**我的音乐 */
let my = reactive<
  Array<{
    title: string;
    icon: string;
    path: string;
    key: string;
  }>
>([
  {
    title: "本地与下载",
    icon: "xiazai-wenjianxiazai-07",
    path: "/localDownload",
    key: "",
  },
  {
    title: "最近播放",
    icon: "zuijinliulan",
    path: "/recentPlaySong",
    key: "",
  },
  {
    title: "我的音乐云盘",
    icon: "yunpan",
    path: "/musicDisk",
    key: "",
  },
  {
    title: "我的播客",
    icon: "diantai",
    path: "/broadCast",
    key: "newProgramCount",
  },
  {
    title: "我的收藏",
    icon: "wodeshoucang",
    path: "/collect",
    key: "",
  },
]);

if (!window.downloadAPI) {
  my.shift();
}

/**创建的歌单 */
let createSongMenu = ref<Array<songMenu>>([]);

/**收藏的歌单 */
let collectSongMenu = ref<Array<songMenu>>([]);

/**是否展开列表面板 */
let collapseSongMenu = reactive<{
  isOpenCreateSongMenu: boolean;
  isOpenCollectSongMenu: boolean;
}>({
  isOpenCreateSongMenu: true,
  isOpenCollectSongMenu: true,
});

/*
处理点击事件
key  active key
val  active index
path 路由路径
*/
let handleClick = (title: string, path: string, id?: number, key?: string) => {
  active.value = title;
  if (id) {
    router.push({ path, query: { id } });
  } else {
    router.push(path);
  }
  if (key) {
    count[key] = 0;
  }
};

watch(
  () => route.path,
  () => {
    setActiveKey();
  }
);

watch(
  () => route.query,
  () => {
    let path = route.path;
    //对path做处理
    path = path.split("/")[1];
    if (pathToTitle[path] === "歌曲详情") {
      setActiveKey();
    }
  }
);

watch(
  () => songList.list[songList.currentListIndex],
  (val) => {
    if (val) {
      let name = val.from.name;
      if (name) {
        createSongMenu.value.forEach((item) => {
          if (
            name === item.title &&
            name !== `${userInfo.user_profile.nickname}喜欢的音乐`
          ) {
            item.rightIcon = true;
            item.open = true;
          } else if (item.title === `${userInfo.user_profile.nickname}喜欢的音乐`) {
            item.open = false;
          } else {
            item.open = false;
            item.rightIcon = false;
          }
        });
        collectSongMenu.value.forEach((item) => {
          if (name === item.title) {
            item.open = true;
            item.rightIcon = true;
          } else {
            item.open = false;
            item.rightIcon = false;
          }
        });
      }
    }
  }
);

//开启心动模式
let openHeart = async (playlistId: number) => {
  try {
    let likes = userInfo.likes;
    let songId = likes[(parseInt(String(Math.random() * likes.length)), 10)];
    // let songId = likes[0];
    let count = likes.length;
    let startMusicId = likes[(parseInt(String(Math.random() * likes.length)), 10)];
    // let startMusicId = likes[1];
    let { data } = await intelligencePlay(songId, playlistId, count, startMusicId);
    let list = data.filter((item) => {
      if (item.songInfo) {
        item.songInfo.from = {
          path: "songMenuDetail",
          name: `${userInfo.user_profile.nickname}喜欢的音乐`,
          val: {
            id: playlistId,
          },
        };
        item.songInfo.status = "play";
        item.songInfo.progress = 0;
      }
      return item.songInfo || false;
    });
    let songList = list.map((item) => item.songInfo);
    play(songList, songList[0].id);

    console.log("songList", songList);
    elMessage.success("已开启心动模式");
  } catch (e: any) {
    elMessage.error("心动模式开启失败");
  }
};

//根据当前的路由来设置activekey
let setActiveKey = () => {
  let path = route.path;
  //对path做处理
  path = path.split("/")[1];
  if (pathToTitle[path] === "歌曲详情") {
    let id = Number(route.query.id);
    let createRes = createSongMenu.value.findIndex((item) => {
      return item.id === id;
    });

    if (createRes !== -1) {
      active.value = createSongMenu.value[createRes]?.title;
    } else {
      let collectRes = collectSongMenu.value.findIndex((item) => {
        return item.id === id;
      });
      if (collectRes !== -1) {
        active.value = collectSongMenu.value[collectRes]?.title;
      }
    }
  } else {
    active.value = pathToTitle[path];
  }
};

//获取用户的歌单（创建 收藏）
let getSongMenuList = (arr: playlist[]) => {
  let createList: songMenu[] | playlist[] = arr.filter((item) => {
    return item.userId === userInfo.user_profile.userId;
  });
  let collectList: songMenu[] | playlist[] = arr.slice(createList.length, arr.length - 1);
  createSongMenu.value = normalizeSongMenuInfo(createList, "create");
  collectSongMenu.value = normalizeSongMenuInfo(collectList, "collect");
  setActiveKey();
};

//格式化处理歌单信息
let normalizeSongMenuInfo = (arr: playlist[], type: string): Array<songMenu> => {
  let info: songMenu[] = arr.map((item, index) => {
    let obj = {
      leftIcon: "",
      title: "",
      rightIcon: false,
      path: "",
      id: item.id,
      isLike: false,
      open: false,
      coverImgUrl: "",
    };
    if (type === "create" && index === 0) {
      Object.assign(obj, {
        leftIcon: "xihuan",
        title: `${userInfo.user_profile.nickname}喜欢的音乐`,
        rightIcon: true,
        path: "/songMenuDetail",
        isLike: true,
      });
    } else {
      Object.assign(obj, {
        leftIcon: item.privacy === 10 ? "simi" : "gedan",
        title: item.name,
        rightIcon: false,
        path: "/songMenuDetail",
        isLike: false,
        coverImgUrl: item.coverImgUrl,
      });
    }
    return obj;
  });
  return info;
};

//判断是否登录
let computedIsLogin = computed(() => {
  if (userInfo.user_profile.isLogin) {
    return true;
  } else {
    return false;
  }
});

//侦听用户歌单列表
watch(
  () => userInfo.songMenu.length,
  () => {
    getSongMenuList(userInfo.songMenu);
  }
);

onMounted(() => {
  getSongMenuList(userInfo.songMenu);
});
</script>

<style lang="scss" scoped>
@mixin item-style {
  display: flex;
  margin: 6px;
  padding: 6px;
  transition: all 0.2s;
  align-items: center;
  z-index: 2;
  cursor: pointer;
}

.nav {
  min-width: 200px;
  /* width: 200px; */
  max-width: 500px;
  display: flex;
  flex-direction: column;

  overflow: hidden;
  height: auto;
  position: relative;
}

section {
  inset: 0 4px 0 0;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  border-right: 1px solid #e6e6e6;
}

.resize {
  min-width: 200px;
  max-width: 500px;
  height: 16px;
  transform: scaleY(100);
  /* background-color: cadetblue; */
  overflow: scroll;
  resize: horizontal;
  opacity: 0;
}

.line {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  bottom: 0;
  background-image: -moz-linear-gradient(45deg, rgb(179, 255, 235), rgb(187, 153, 255));

  background-image: -webkit-linear-gradient(
    45deg,
    rgb(179, 255, 235),
    rgb(187, 153, 255)
  );

  background-image: linear-gradient(45deg, rgb(179, 255, 235), rgb(187, 153, 255));
  opacity: 0;
  transition: 0.3s;
  pointer-events: none;
}

.resize:hover + .line,
.resize:active + .line {
  opacity: 1;
}

.nav--item,
.music--item {
  @include item-style;

  i {
    margin-right: 5px;
    margin-top: 2px;
  }
}

.music--item:hover,
.nav--item:hover,
.create--songMenu--list:hover,
.collect--songMenu--list:hover {
  background-color: var(--dark-active-backgroundColor, #f6f6f7);
}

.is-active {
  background-color: var(--dark-active-backgroundColor, #f6f6f7);
}

.is-active--menu {
  /* color: #313131; */
  font-weight: 700;
  font-size: 18px !important;
}

.my--music,
.create--songMenu,
.collect--songMenu {
  display: flex;
  user-select: none;
  flex-direction: column;
}

.music--title,
.create--title,
.collect--title {
  display: flex;
  position: relative;
  margin: 6px;
  align-items: center;
  padding: 6px;
  font-size: 12px;
  color: rgba(153, 153, 153);
}

.song--open--icon {
  transform: rotate(90deg);
}

.song--open {
  cursor: pointer;
  transition: all 0.2s;
}

.create--plus {
  float: right;
  right: 6px;
  cursor: pointer;
  position: absolute;
}

.icon--heart {
  cursor: pointer;
  margin-left: 10px;
}

.create-songMenu--list--wrap,
.collect-songMenu--list--wrap {
  transition: all 0.2s;
}

.create--songMenu--list,
.collect--songMenu--list {
  display: flex;
  align-items: center;
  margin: 6px;
  position: relative;
  padding: 6px;
  transition: all 0.2s;
  cursor: pointer;
  font-size: 14px;
}

.list--title {
  margin-left: 5px;
  flex: 1;
}

.icon--heart:hover {
  color: red;
}

.collapse--noOpen {
  display: none;
}
</style>
