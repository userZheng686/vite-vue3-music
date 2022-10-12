<template>
  <!--歌单详情-->
  <section class="songmenu__detail">
    <!--歌单详情 头部-->
    <div class="detail__top">
      <!--头部 封面-->
      <div class="top__picture">
        <DefaultImage
          style="width: 200px; height: 200px"
          :picUrl="detail?.coverImgUrl"
          loadingWidth="100px"
          loadingHeight="100px"
          :param="200"
          :y="200"
        />
      </div>
      <!--头部 其他-->
      <div class="top__info">
        <div class="info__category">
          <span class="category">歌单</span>
          <span class="category__title">{{ detail?.name }}</span>
          <el-icon
            v-if="
              detail?.specialType !== 5 && user.user_profile.userId === detail?.userId
            "
            style="margin-left: 10px"
            class="gray"
            :size="20"
            @click="jumpUpdateSongMenuDetail"
          >
            <Edit />
          </el-icon>
        </div>
        <div class="info__user">
          <el-avatar
            :size="50"
            :src="
              detail?.creator?.avatarUrl.replace(/http:\//, 'https:/') +
              '?imageView&enlarge=1&thumbnail=50y50&type=webp'
            "
            style="cursor: pointer"
            @click="jumpUserHomePage"
          />
          <span class="user__name blue" @click="jumpUserHomePage">{{
            detail?.creator?.nickname
          }}</span>
          <span style="margin-left: 10px">{{
            videoTime(Number(detail?.createTime))
          }}</span>
          <span>创建</span>
        </div>
        <div class="info__btns">
          <el-button type="danger" :icon="CaretRight" @click="playAll"
            >播放全部</el-button
          >
          <el-button
            v-if="detail?.subscribed"
            @click="subscribedSongMenu(true)"
            :disabled="user.user_profile.userId === detail?.userId"
          >
            <el-icon style="color: red">
              <StarFilled />
            </el-icon>
            <span>已收藏({{ detail?.subscribedCount }})</span>
          </el-button>
          <el-button
            :icon="Star"
            v-else-if="!detail?.subscribed"
            @click="subscribedSongMenu(false)"
            :disabled="user.user_profile.userId === detail?.userId"
            >收藏({{ detail?.subscribedCount }})</el-button
          >
          <el-button :icon="Share" @click="shareList"
            >分享({{ detail?.shareCount }})</el-button
          >
          <el-button :icon="Download" @click="downloadAll">下载全部</el-button>
        </div>
        <div class="info__other">
          <div
            class="other__item"
            v-if="
              detail?.specialType !== 5 &&
              (detail?.tags?.length || user.user_profile.userId === detail?.userId)
            "
          >
            <span>标签 ：</span>
            <span class="blue" v-for="(item, index) in detail?.tags" :key="index">
              <span style="margin-left: 5px">{{ index > 0 ? " / " : "" }}</span>
              <span>{{ item }}</span>
            </span>
            <span
              class="blue"
              @click="dialogSongMenuCategoryVisible = true"
              v-if="!detail?.tags?.length && user.user_profile.userId === detail?.userId"
              >添加标签</span
            >
          </div>
          <div class="other__item">
            <span class="item__mr5">歌曲 ：{{ detail?.trackIds?.length }}</span>
            <span>播放 ：{{ filter(Number(detail?.playCount)) }}</span>
          </div>
          <div
            class="other__item"
            v-if="
              detail?.specialType !== 5 &&
              (desc.length || user.user_profile.userId === detail?.userId)
            "
          >
            <span style="min-width: 46px">简介 ：</span>
            <span v-if="desc.length === 0" class="blue" @click="jumpUpdateSongMenuDetail"
              >添加简介</span
            >
            <span v-else style="flex: 1; display: flex" class="info">
              <span :class="{ 'more-clamp1': isMore }" style="flex: 1">
                <span class="desc">
                  {{ desc[0] }}
                </span>
                <div
                  class="info__introduction"
                  v-for="(item, index) in desc"
                  :key="index"
                >
                  {{ index > 0 ? item : "" }}
                </div>
              </span>
              <el-icon
                style="float: right; margin-right: 25px; right: 0; top: 2px"
                v-if="desc.length >= 1"
                @click="isMore = !isMore"
              >
                <ArrowDownBold v-if="isMore" />
                <ArrowUpBold v-else />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!--歌单详情 底部-->
    <div class="detail__bottom">
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
                path: '/songMenuDetail',
                query: { id: route.query.id, type: `${index + 1}` },
              })
            "
          >
            <span
              >{{ item.title }}{{ index === 1 ? `(${detail?.commentCount})` : "" }}</span
            >
          </li>
        </ul>
        <el-input
          v-if="menu.active === 0"
          v-model="search"
          style="width: 200px; margin-right: 25px"
          placeholder="搜索歌单音乐"
          :suffix-icon="Search"
        />
      </div>
      <!--组件-->
      <transition name="el-fade-in">
        <keep-alive>
          <component
            :is="componentMap.list.get(componentMap.key)"
            :detail="detail"
            :id="computedId"
            :inputType="1"
            :resourceType="2"
            :getSongMenuDetailInfo="getSongMenuDetailInfo"
            :type="2"
          >
          </component>
        </keep-alive>
      </transition>
    </div>
    <EditSongMenuCategory
      :songMenuCategoryList="songMenuCategoryList"
      :updateSongMenuDetail="updateSongMenuDetail"
    />
  </section>
</template>

<script setup lang="ts">
import {
  getSongMenuDetail,
  getEditSongMenuCategory,
  updatePlaylist,
  collectSongMenu,
} from "@/api/api_playList";
import { getSongDetail } from "@/api/api_song";
import { useUserInformation } from "@/store/user";
import { useRoute, useRouter } from "vue-router";
//防抖
import { refDebounced } from "@vueuse/core";
import {
  CaretRight,
  Star,
  Share,
  StarFilled,
  Download,
  Search,
} from "@element-plus/icons-vue";
import { SongDetailSongsItem } from "i/api/api_song.d";
import { playlist, EditSongMenuCategoryItem } from "i/api/api_playList.d";
import { videoTime, filter } from "@/utils/filter";
//下载音乐
import { downloadMusic } from "@/utils/download";
import emitter from "@/utils/eventBus";
//分享弹窗
import { useLISTShare } from "@/utils/dialogShare";
//播放方法
import { play } from "@/utils/play";
import { loginCallback } from "@/utils/login";

let elMessage: any = inject("message") as any;
let route = useRoute();
let router = useRouter();
let detail = ref<playlist>();
let user = useUserInformation();
//简介长度是否超过了一般的长度
let isMore = ref<boolean>(false);
//简介
let desc = ref<string[]>([]);
//搜索
let search = ref<string>("");
let debounced = refDebounced(search, 100);
//歌曲列表
let playList = ref<SongDetailSongsItem[]>([]);
//歌单标签
let songMenuCategoryList = ref<
  Array<{
    title: string;
    list: EditSongMenuCategoryItem[];
  }>
>([]);
//选中的歌单标签名称
let checkCategoryName = ref<string[]>([]);
//歌单标签弹窗
let dialogSongMenuCategoryVisible = ref<boolean>(false);
provide("dialogVisible", dialogSongMenuCategoryVisible);
provide("checkCategory", checkCategoryName);
provide("playList", playList);
provide("search", search);

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
      key: "playlist",
      title: "歌曲列表",
    },
    {
      key: "comment",
      title: "评论",
    },
    {
      key: "subscriber",
      title: "收藏者",
    },
  ],
});

//引入组件
let shallowPlayList = markRaw(
  defineAsyncComponent(() => import("c/songMenuDetail/playlist.vue"))
);
let shallowComment = markRaw(defineAsyncComponent(() => import("c/comment/comment.vue")));
let shallowSubscriber = markRaw(
  defineAsyncComponent(() => import("c/broadCastDetail/subscriber.vue"))
);

//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "playlist",
  list: new Map(),
});

//设置路由map
let setMap = () => {
  componentMap.list.set("playlist", shallowPlayList);
  componentMap.list.set("comment", shallowComment);
  componentMap.list.set("subscriber", shallowSubscriber);
};

//获取歌单详情
let getSongMenuDetailInfo = async () => {
  try {
    let { playlist } = await getSongMenuDetail(Number(route.query.id), 20);
    detail.value = playlist;
    handleTrackList();
    if (playlist.description) {
      desc.value = playlist.description.split(/\n/);
      if (desc.value.length >= 1) {
        isMore.value = true;
      }
    }
  } catch (e: any) {
    elMessage.error("请求歌单详情失败 请重新打开试试");
  }
};

//获取添加歌单标签
let getEditCategory = async () => {
  try {
    let { categories, tags } = await getEditSongMenuCategory();
    for (let [k, v] of Object.entries(categories)) {
      songMenuCategoryList.value.push({
        title: v,
        list: tags.filter((item) => item.category === Number(k)),
      });
    }
  } catch (e: any) {
    elMessage.error(e?.message || "获取歌单标签失败 请检查你的网络是否有问题");
  }
};

//更新歌单详情
let updateSongMenuDetail = async (category: string) => {
  try {
    if (detail.value) {
      let res = await updatePlaylist(
        Number(detail.value.id),
        detail.value?.name,
        detail.value?.description,
        category
      );
      detail.value.tags = checkCategoryName.value;
      elMessage.success("修改成功");
    }
  } catch (e: any) {
    elMessage.error(e?.message || "更新歌单失败 请检查你的网络是否有问题");
  }
};

//跳转到用户空间页面
let jumpUserHomePage = () => {
  let id = detail?.value?.userId;
  if (id) {
    router.push({
      path: "/homePage",
      query: {
        id,
      },
    });
  }
};

//跳转到修改歌单详情页面
let jumpUpdateSongMenuDetail = () => {
  router.push({
    path: "/updateSongMenuDetail",
    query: {
      id: detail.value?.id,
    },
  });
};

getEditCategory();

//ResourceCommentInfoItem

//将detail.tracks做进一步处理
let handleTrackList = async () => {
  let ids = detail?.value?.tracks.map((item) => item.id);
  let dt = detail?.value?.tracks.map((item) => item.dt);
  if (ids?.length && dt?.length) {
    let { songs, privileges } = await getSongDetail(ids.join(","));
    songs.forEach((item, index) => {
      item.from = {
        name: String(detail?.value?.name),
        path: "songMenuDetail",
        val: {
          id: Number(detail?.value?.id),
        },
      };
      //初始化进度
      item.progress = 0;
      //音质
      item.plLevel = privileges[index].plLevel;
    });
    playList.value = songs;
  } else {
    playList.value = [];
  }
};

//id
let computedId = computed(() => {
  if (detail?.value?.id) {
    return detail?.value?.id;
  } else {
    return 0;
  }
});

let initOption = () => {
  desc.value = [];
};

onActivated(() => {
  setMap();
  getCurrentUrl();
});

watch(
  () => route.query.id,
  (val) => {
    if (Number(val) === detail?.value?.id) return;
    else if (route.name === "SongMenuDetail") {
      initOption();
      getSongMenuDetailInfo();
    }
  }
);

onActivated(() => {
  initOption();
  getSongMenuDetailInfo();
});

//监听当前路由
watch(
  () => route.query,
  (Query) => {
    if (route.name !== "SongMenuDetail") return;
    let type = Query?.type;
    setCurrentUrlComponent(type ? String(type) : "1");
  }
);

//监听搜索框
watch(debounced, () => {
  let val = debounced.value;
  if (val === "") {
    emitter.emit("search", {
      list: [],
    });
  } else {
    //拷贝一份数据 做修改
    let copyList = playList.value;
    copyList = copyList.filter((item) => {
      let result = false;
      //先遍历名称 看看是否包含
      if (item.name.toLowerCase().includes(val.toLowerCase())) {
        result = true;
      }
      //遍历tns
      if (item.tns?.length) {
        let tns = item.tns.join("");
        if (tns.toLowerCase().includes(val.toLowerCase())) result = true;
      }
      //先遍历ar属性（歌手） 看看是否包含
      item.ar.forEach((items) => {
        if (items.name) {
          if (items.name.toLowerCase().includes(val.toLowerCase())) result = true;
        }
      });
      //在遍历专辑名称 看看是否包含
      if (item.al.name) {
        if (item.al.name.toLowerCase().includes(val.toLowerCase())) result = true;
      }
      return result;
    });
    emitter.emit("search", {
      list: copyList,
    });
  }
});

//获取当前路由
let getCurrentUrl = () => {
  if (route.query) {
    let type = route.query.type;
    setCurrentUrlComponent(String(type));
  }
};

//分享歌单的回调事件
let shareListCallback = (res: { status: string }) => {
  if (res.status === "success" && detail.value) {
    detail.value.shareCount++;
  }
};

//分享歌单
let shareList = () => {
  useLISTShare(
    detail?.value?.id || 0,
    String(detail?.value?.coverImgUrl),
    `${String(detail?.value?.name)} by ${String(detail?.value?.creator?.nickname)}`,
    shareListCallback
  );
};

let setCurrentUrlComponent = (type: string) => {
  if (type === "1") {
    menu.active = 0;
    componentMap.key = "playlist";
  } else if (type === "2") {
    menu.active = 1;
    componentMap.key = "comment";
  } else if (type === "3") {
    menu.active = 2;
    componentMap.key = "subscriber";
  }
};

//播放全部
let playAll = () => {
  play(playList.value, playList.value[0].id);
};

//收藏歌单
let subscribedSongMenu = (collect: boolean) => {
  loginCallback(async () => {
    try {
      let res = await collectSongMenu(collect ? 2 : 1, Number(detail?.value?.id));
      if (detail.value) {
        detail.value.subscribed = !collect;
      }
      elMessage.success(`${collect ? "取消收藏" : "收藏"}成功`);
      user.updateSoneMenu();
    } catch (e: any) {
      elMessage.error(`${collect ? "取消收藏" : "收藏"}失败`);
    }
  });
};

//下载全部
let downloadAll = () => {
  loginCallback(() => {
    //找出没有下载过的歌曲 并且歌曲不是vip
    let downloadList = playList.value.filter((item) => {
      if (!item.songUrl && item.fee === 0) {
        return true;
      } else {
        return false;
      }
    });
    downloadList.forEach((item) => {
      downloadMusic(item);
    });
  });
};
</script>

<style scoped lang="scss">
//歌单详情
.radio__detail {
  flex: 1;
  overflow-y: scroll;
}

//电台详情 头部
.detail__top {
  margin-left: 30px;
  margin-top: 20px;
  display: flex;
}

.top__picture {
  width: 200px;
  max-height: 212px;
  overflow: hidden;
  /* border: 1px solid rgba(241, 241, 241); */
  border-radius: 8px;
}

//头部 信息
.top__info {
  flex: 1;
  margin-left: 20px;
}

//分类 外层
.info__category {
  display: flex;
  align-items: center;
}

//分类
.category {
  border: 1px solid rgb(254, 174, 196);
  color: rgb(254, 174, 196);
  padding: 2px;
  border-radius: 4px;
  font-size: 12px;
  word-break: keep-all;
}

//名字
.category__title {
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
}

//用户
.info__user {
  margin-top: 10px;
  display: flex;
  align-items: center;
  line-height: 18px;
}

//用户名
.user__name {
  margin-left: 10px;
}

//按钮 其他
.info__btns,
.info__other {
  margin-top: 20px;
}

.other__item {
  margin-bottom: 2px;
  position: relative;
  display: flex;
  align-items: center;
  line-height: 18px;
}

.other__item:last-child {
  align-items: stretch;
}

.item__mr5 {
  margin-right: 5px;
}

//简介
.info__introduction {
  font-size: 14px;
}

.info__introduction:first-child {
  margin-top: 10px;
}
</style>
