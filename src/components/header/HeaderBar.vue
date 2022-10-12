<template>
  <header
    class="header"
    :class="{ hidden: header.isShowHeader, sticky: header.isSticky }"
  >
    <login></login>
    <!--icon-->
    <div class="bar--icon">
      <div class="header--icon" @click="backHome"></div>
      <el-icon
        @click="
          isSongDetailVisible = !isSongDetailVisible;
          header.setHeaderVisible(false);
        "
        class="header--arrow"
        style="cursor: pointer"
      >
        <ArrowDown />
      </el-icon>
    </div>
    <!--前进后退 搜索栏-->
    <div class="bar--tools">
      <!--前进后退-->
      <div class="bar--history">
        <button class="histry--circle" @click="go(-1)">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </button>
        <button class="histry--circle" style="margin-left: 10px" @click="go(1)">
          <el-icon>
            <ArrowRight />
          </el-icon>
        </button>
      </div>
      <!--搜索栏 closeSuggest-->
      <div class="bar--search">
        <el-input
          @click="showSuggest"
          @input="handleInput"
          v-model="searchInfo.keywords"
          class="w-50 m-2 bar--search__width"
          placeholder="搜索"
          :prefix-icon="Search"
          @keydown.enter="jumpSearch(searchInfo.keywords, 'song', 0)"
        />
        <transition name="el-fade-in">
          <!--弹出层-->
          <div class="search--info__tip" v-show="searchInfo.showInfoTip">
            <div class="tip--noKeywords" v-show="!searchInfo.keywords">
              <!--历史搜索-->
              <div class="history--search" v-if="searchHistoryList.length">
                <div class="his--title">
                  <span>搜索历史</span>
                  <el-icon class="his--delete" @click="deleteAllSearchHistoryList">
                    <Delete />
                  </el-icon>
                </div>
                <!--搜索记录-->
                <div class="his--tag">
                  <button
                    class="his--tag__node"
                    @mouseover="item.isOver = true"
                    @mouseleave="item.isOver = false"
                    v-for="item in searchHistoryList"
                    :key="item.keyword"
                    @click="jumpSearch(item.keyword, 'song', 0)"
                  >
                    {{ item.keyword }}
                    <el-icon
                      @click="delSearchKeyword(item.keyword)"
                      :style="item.isOver ? 'opacity:1' : 'opacity:0'"
                    >
                      <Close />
                    </el-icon>
                  </button>
                </div>
              </div>
              <!--热搜-->
              <div class="hot--search">
                <!--热搜标题-->
                <div class="hot--search--title">热搜榜</div>
                <!--热搜结果-->
                <div
                  class="hot--search--pointer"
                  :class="index < 3 ? 'top-item' : ''"
                  v-for="(item, index) in searchInfo.hotList"
                  :key="index"
                  @click="jumpSearch(item.searchWord, 'song', 0)"
                >
                  <div class="search--index">
                    {{ index + 1 }}
                  </div>
                  <div class="search--item">
                    <div class="search--keyword">
                      <span class="search--name">{{ item.searchWord }}</span>
                      <span class="search--heat">{{ item.score }}</span>
                    </div>
                    <!-- <div class="search--content" v-if="item.alg === 'featured'">
                      {{ item.content }}
                    </div> -->
                    <div class="search--content">
                      {{ item.content }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="tip--keywords"
              v-show="searchInfo.keywords && searchList.suggest?.length"
            >
              <div class="keywords--item gray" v-if="searchList.suggest?.length">
                <div class="item__left">
                  <el-icon><Search /></el-icon>
                </div>
                <h6 class="item__right">猜你想搜</h6>
              </div>
              <div class="keywords--item">
                <div class="item__left"></div>
                <div class="item__right">
                  <div
                    class="gray item__right__text"
                    v-for="item in searchList.suggest"
                    :key="item"
                    @click="jumpSearch(item, 'song', 0)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
              <div
                class="keywords--item gray"
                v-if="searchList.songs?.length"
                @click="jumpSearch(searchInfo.keywords, 'song', 0)"
              >
                <div class="item__left">
                  <el-icon><i class="iconfont icon-yinle"></i></el-icon>
                </div>
                <h6 class="item__right">单曲</h6>
              </div>
              <div class="keywords--item">
                <div class="item__left"></div>
                <div class="item__right">
                  <div
                    class="gray item__right__text"
                    v-for="item in searchList.songs"
                    :key="item.id"
                    @click="playOne(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <div
                class="keywords--item gray"
                v-if="searchList.artists?.length"
                @click="jumpSearch(searchInfo.keywords, 'artist', 1)"
              >
                <div class="item__left">
                  <el-icon><i class="iconfont icon-geren"></i></el-icon>
                </div>
                <h6 class="item__right">歌手</h6>
              </div>
              <div class="keywords--item">
                <div class="item__left"></div>
                <div class="item__right">
                  <div
                    class="gray item__right__text"
                    v-for="item in searchList.artists"
                    :key="item.id"
                    @click="jumpArtists(item.id)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <div
                class="keywords--item gray"
                v-if="searchList.albums?.length"
                @click="jumpSearch(searchInfo.keywords, 'album', 2)"
              >
                <div class="item__left">
                  <el-icon><i class="iconfont icon-zhuanji"></i></el-icon>
                </div>
                <h6 class="item__right">专辑</h6>
              </div>
              <div class="keywords--item">
                <div class="item__left"></div>
                <div class="item__right">
                  <div
                    class="gray item__right__text"
                    v-for="item in searchList.albums"
                    :key="item.id"
                    @click="jumpAlbumDetail(item.id)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <div
                class="keywords--item gray"
                v-if="searchList.playlists?.length"
                @click="jumpSearch(searchInfo.keywords, 'playlist', 4)"
              >
                <div class="item__left">
                  <el-icon><i class="iconfont icon-gedan"></i></el-icon>
                </div>
                <h6 class="item__right">歌单</h6>
              </div>
              <div class="keywords--item">
                <div class="item__left"></div>
                <div class="item__right">
                  <div
                    class="gray item__right__text"
                    v-for="item in searchList.playlists"
                    :key="item.id"
                    @click="jumpSongMenuDetail(item.id)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <Mask :click="closeSuggest"></Mask>
      </div>
    </div>
    <!--标题-->
    <div class="bar--name">{{ header.name }}</div>
    <!--用户-->
    <div class="bar--user">
      <!--用户头像-->
      <el-avatar
        :size="30"
        :src="
          userInfo.avatar?.replace(/http:\//, 'https:/') +
          '?imageView&enlarge=1&thumbnail=30y30&type=webp'
        "
        style="cursor: pointer"
        @click="openHomePage"
      />
      <!--用户名称-->
      <div class="user--wrap" @click="openDialog">
        <div class="bar--user--name">
          {{ userInfo.nickname }}
        </div>
        <el-icon class="user--down" v-if="userInfo.isLogin">
          <CaretBottom />
        </el-icon>
      </div>
      <div class="bar--sixin">
        <el-switch
          style="
            margin-right: 20px;
            --el-switch-on-color: #c52a2a;
            --el-switch-off-color: #363637;
          "
          v-model="mode"
          active-icon="Sunny"
          active-value="auto"
          inactive-value="dark"
          inactive-icon="Moon"
          inline-prompt
        />

        <el-icon style="font-size: 20px" @click="openLetter">
          <Message />
        </el-icon>
      </div>
      <!--菜单弹窗-->
      <transition name="el-fade-in">
        <Menu></Menu>
      </transition>
      <!--最小化 还原 关闭-->
      <div
        class="bar--btngroup"
        :style="{
          visibility: computedEnvironment === 'electron' ? 'initial' : 'hidden',
        }"
      >
        <i class="iconfont icon-minimize" title="mini模式" @click="mini"></i>
        <i class="iconfont icon-zuixiaohua" title="最小化" @click="minimize"></i>
        <i class="iconfont icon-24gl-minimize" title="还原" @click="revivification"></i>
        <el-icon title="关闭" @click="close">
          <Close />
        </el-icon>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePopupStore } from "@/store/popup";
import { useUserInformation } from "@/store/user";
import { Search, ArrowLeft } from "@element-plus/icons-vue";
import { getSuggest, getHotSearch } from "@/api/api_other";
import { useHeader } from "@/store/header";
import { getSearchBatch } from "@/api/api_search";
import { Album } from "i/api/api_album";
import { ArtistItem } from "i/api/api_artist";
import { playlist } from "i/api/api_playList";
import { SongDetailSongsItem } from "i/api/api_song";
import { SuggestsItem } from "i/api/api_search.d";
import { list, form } from "c/header/header.d";
import { playOne } from "@/utils/play";
import { getSongDetail } from "@/api/api_song";
import { searchHistoryList, mode, changeMode } from "@/localStorage/init";
import { ElMessageBox } from "element-plus";
import { toggleDark } from "@/utils/dark";

let elMessage = inject("message") as any;

//是否打开歌曲详情
let isSongDetailVisible = inject("songDetailVisible") as Ref<boolean>;

//header
let header = useHeader();

//路由实例
let route = useRoute();
let router = useRouter();

//弹窗实例
let Popup = usePopupStore();

//查看用户信息
let user = useUserInformation();

//回到首页
let backHome = () => {
  router.push({ path: "/" });
};

//前进
let go = (n: number): void => {
  router.go(n);
};

//定时器
let timer: NodeJS.Timer | number = 0;

//搜索表单 包含搜索的关键词 热搜列表 是否展示搜索框
let searchInfo = reactive<form>({
  keywords: "",
  hotList: [],
  showInfoTip: false,
});
//用户信息
let userInfo = reactive<{
  avatar: string;
  nickname: string;
  isLogin: boolean;
}>({
  avatar: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
  nickname: "未登录",
  isLogin: false,
});
//搜索列表
let searchList = reactive<{
  suggest: string[];
  albums: Album[];
  artists: ArtistItem[];
  songs: SongDetailSongsItem[];
  playlists: playlist[];
}>({
  suggest: [],
  albums: [],
  artists: [],
  songs: [],
  playlists: [],
});

//获取用户信息 做默认处理
let getUserInfo = (): void => {
  let user_profile = user?.user_profile;
  if (Object.keys(user_profile).length) {
    userInfo.avatar = user_profile.avatarUrl;
    userInfo.nickname = user_profile.nickname || "";
    userInfo.isLogin = user_profile.isLogin;
  }
};

watchEffect(() => {
  getUserInfo();
});

watch(
  () => searchInfo.keywords,
  () => {
    getSearch();
  }
);

watch(
  () => mode.value,
  (val) => {
    toggleDark();
  }
);

let init = () => {
  if (route.query?.keyword) {
    searchInfo.keywords = String(route.query.keyword);
  }
  getUserInfo();
};

init();

//跳转到搜索页
//keyword 关键词搜索
//key 具体跳转到那个组件
let jumpSearch = (keyword: string, key: string, index: number) => {
  if (!keyword) {
    keyword = searchInfo.hotList[0].searchWord;
  }
  searchInfo.keywords = keyword;
  searchInfo.showInfoTip = false;
  let searchIndex = searchHistoryList.value.findIndex((item) => item.keyword === keyword);
  if (searchIndex !== -1) {
    searchHistoryList.value.splice(searchIndex, 1);
  }
  searchHistoryList.value.unshift({
    keyword,
    isOver: false,
  });
  router.push({
    path: "/search",
    query: {
      keyword,
      component: key,
      index,
    },
  });
};

//删除所有搜索的关键词
let deleteAllSearchHistoryList = () => {
  ElMessageBox.confirm("确定删除历史记录?", "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    searchHistoryList.value = [];
    elMessage({
      type: "success",
      message: "删除成功",
    });
  });
};

//删除搜索关键词
let delSearchKeyword = (keyword: string) => {
  let searchIndex = searchHistoryList.value.findIndex((item) => item.keyword === keyword);
  if (searchIndex !== -1) {
    searchHistoryList.value.splice(searchIndex, 1);
  }
};

//跳转到歌手页
let jumpArtists = (id: number) => {
  searchInfo.showInfoTip = false;
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};

//跳转到专辑详情
let jumpAlbumDetail = (id: number) => {
  searchInfo.showInfoTip = false;
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};

//跳转到歌单详情
let jumpSongMenuDetail = (id: number) => {
  searchInfo.showInfoTip = false;
  router.push({
    path: "/songMenuDetail",
    query: {
      id,
    },
  });
};

//搜索
let getSearch = async () => {
  try {
    let {
      "/api/search/suggest/keyword/get": {
        data: { suggests },
      },
      "/api/search/suggest/web": {
        result: { albums, artists, playlists, songs: searchSong },
      },
    } = await getSearchBatch(searchInfo.keywords, 6);
    let suggest = suggests.map((item) => item.keyword);
    let { songs, privileges } = await getSongDetail(
      searchSong.map((item) => item.id).join(",")
    );
    songs.forEach((item, index) => {
      item.progress = 0;
      item.status = "play";
      item.from = {
        path: "search",
        name: "搜索页",
        val: {
          component: "song",
          index: 0,
          keyword: item.name,
        },
      };
      //音质
      item.plLevel = privileges[index].plLevel;
    });
    Object.assign(searchList, {
      suggest: suggest ? suggest : [],
      albums: albums ? albums : [],
      artists: artists ? artists : [],
      playlists: playlists ? playlists : [],
      songs: songs ? songs : [],
    });
  } catch (e: any) {}
};

//打开搜索款
let showSuggest = async () => {
  let hot = await getHotSearch();
  searchInfo.hotList = hot.data;

  if (searchInfo.keywords) {
    getSearch();
  }

  searchInfo.showInfoTip = true;
  Popup.isOpenMask = true;
  Popup.isOpenMenuPopup = false;
};

//关闭搜索框
let closeSuggest = () => {
  searchInfo.showInfoTip = false;
  Popup.isOpenMask = false;
};

//搜索
let handleInput = () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    showSuggest();
  }, 500);
};

//打开主页
let openHomePage = () => {
  router.push({
    path: "/homePage",
    query: {
      id: user.user_profile.userId,
    },
  });
};

//打开弹窗
let openDialog = () => {
  if (userInfo.isLogin) {
    searchInfo.showInfoTip = false;
    Popup.isOpenMenuPopup = true;
    Popup.isOpenMask = true;
  } else {
    Popup.isOpenLoginPopup = true;
  }
};

//打开私信
let openLetter = () => {
  if (userInfo.isLogin) {
    Popup.setPrivateLetterPopup(!Popup.isOpenPrivateLetter);
  } else {
    Popup.isOpenLoginPopup = true;
  }
};

//mini模式
let mini = () => {
  changeMode.value = 1;
};

//最小化
let minimize = () => {
  changeMode.value = 2;
};

//还原
let revivification = () => {
  window.desktopMainAPI.revivification();
};

let close = () => {
  window.desktopMainAPI.close();
};

//判断环境
let computedEnvironment = computed(() => {
  if (window.downloadAPI) {
    return "electron";
  } else {
    return "browser";
  }
});
</script>

<style scoped lang="scss">
* {
  -webkit-app-region: no-drag;
}

@import "@/assets/scss/globalScrollBar.scss";

.header {
  height: 60px;
  width: 100%;
  z-index: 11;
  background-color: var(--dark-header, #ec4141);
  position: fixed;
  display: flex;
  width: 100%;
  -webkit-app-region: drag;

  /* z-index: 100; */
  top: 0;
  transition: all 0.2s;
}

//歌曲详情打开
.hidden {
  background-color: var(--dark-header, rgb(240, 242, 243));

  .bar--icon {
    .header--icon {
      display: none;
    }
  }

  .header--arrow {
    display: block;
  }

  .bar--user {
    visibility: hidden;
  }

  .histry--circle {
    background-color: var(--dark-circle, rgb(231, 233, 234));
  }

  .bar--search {
    :deep(.el-input__wrapper) {
      background-color: var(--dark-circle, rgb(231, 233, 234));
    }
  }
}

//置顶
.sticky {
  .bar--tools {
    opacity: 0;
  }

  .bar--name {
    opacity: 1;
  }
}

.bar--icon {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 10px;
  cursor: pointer;

  i {
    color: white;
  }

  width: 176px;
}

.bar--tools {
  display: flex;
  transition: all 0.2s;
  margin-left: 90px;
}

.bar--name {
  display: flex;
  align-items: center;
  font-size: 18px;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  position: absolute;
  opacity: 0;
  transition: all 0.2s;
}

.bar--history {
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.histry--circle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  width: 26px;
  color: white;
  border-radius: 50%;
  outline: 0;
  border: 0;
  background-color: var(--dark-circle, #e13e3e);
  cursor: pointer;
}

.bar--search {
  margin-left: 10px;
  display: flex;
  height: 100%;
  align-items: center;

  .bar--search__width {
    width: 160px;
  }

  .search--info__tip {
    position: absolute;
    top: 64px;
    width: 340px;
    min-height: 340px;
    max-height: 420px;
    transition: all 0.5s;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0 1px 4px #dddddd;
    background-color: var(--dark-blackBackgroundColor, #fff);
    z-index: 100;
    /* color: #000; */
  }

  :deep(.el-input__wrapper) {
    height: 36px;
    line-height: 36px;
    background-color: var(--dark-circle, #e13e3e);
    border-radius: 16px;
    border: 0;
    color: snow;
    box-shadow: none;
  }

  :deep(.el-input__inner) {
    color: snow;
  }

  :deep(.el-input__icon) {
    color: snow;
  }
}

.tip--noKeywords {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tip--keywords {
  .keywords--item {
    display: flex;
    align-items: center;
    .item__left {
      width: 10px;
      margin-left: 10px;
      display: flex;
      align-items: center;
    }

    .item__right {
      flex: 1;
      margin-left: 10px;

      .item__right__text {
        padding: 5px;

        &:hover {
          background-color: var(--dark-item-backgroundHover, rgb(250, 250, 250));
        }
      }
    }
  }
}

.history--search {
  margin: 10px auto 0px 10px;
  display: flex;
  flex-direction: column;
}

.his--title {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
}

.his--delete {
  color: #676767;
  cursor: pointer;
  line-height: 22px;
  height: 19px;
  margin-left: 10px;
}

.his--tag {
  padding: 0 12px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.his--tag__node {
  margin: 0 10px 10px 0;
  border: 1px solid #d8d8d8;
  background-color: var(--dark-blackBackgroundColor, #fff);

  padding: 4px 14px;
  border-radius: 15px;
  cursor: pointer;

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.bar--user {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  flex: 1;
  -webkit-app-region: drag;

  .bar--user--name {
    margin-left: 15px;
    margin-right: 15px;
    color: snow;
    font-size: 12px;
    cursor: pointer;
  }

  i {
    cursor: pointer;
    color: white;
    margin-right: 20px;
  }
}

.hot--search {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.hot--search--title {
  color: #666;
  font-size: 14px;
  margin: 10px auto 10px 10px;
}

.hot--search--pointer {
  min-height: 50px;
  display: flex;
  font-size: 14px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.search--index {
  color: #c2c2c2;
  width: 40px;
  min-width: 40px;
  text-align: center;
}

.search--keyword {
  display: flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
}

.search--content {
  color: rgba(153, 153, 153);
}

.search--item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.search--heat {
  margin-left: 10px;
  font-size: 12px;
  color: rgb(194, 193, 193);
}

.search--name {
  font-size: 12px;
}

.top-item {
  .search--index {
    color: #e13e3e;
  }

  .search--name {
    font-weight: 700;
  }
}

::-webkit-scrollbar {
  @include scroll-bar(6, 6);
}

::-webkit-scrollbar-thumb {
  @include scroll-bar-thumb(3, 3, #e0e0e0);
}

.user--wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.user--down {
  margin-left: 10px;
  color: snow;
  margin-bottom: 2px;
}

.header--icon {
  background: url("https://s2.music.126.net/style/web2/img/frame/topbar.png?fb67a893ff7ff27150e8eceb60271353")
    no-repeat 0 9999px;
  background-position: 0 0;
  width: 176px;
  height: 69px;
}

.header--arrow {
  display: none;
  margin-left: 20px;
}

//私信 模式切换
.bar--sixin {
  display: flex;
  align-items: center;
}

//按钮 最小化 还原 关闭
.bar--btngroup {
  height: 100%;
  display: flex;
  align-items: center;
  color: white;
}
</style>
