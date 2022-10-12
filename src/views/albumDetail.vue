<template>
  <!--专辑详情-->
  <div class="songmenu__detail">
    <div class="detail__top">
      <!--头部 封面-->
      <div class="top__picture">
        <DefaultImage
          style="width: 100%; height: 100%"
          :picUrl="albumInfo.blurPicUrl"
          loadingWidth="100px"
          loadingHeight="100px"
          :param="200"
          :y="200"
        />
      </div>
      <!--头部 其他-->
      <div class="top__info">
        <div class="info__category">
          <span class="category">专辑</span>
          <span class="category__title">{{ albumInfo.name }}</span>
        </div>
        <div class="info__btns">
          <el-button type="danger" :icon="CaretRight" @click="playAll"
            >播放全部</el-button
          >
          <el-button v-if="albumInfo.isSub" @click="subscribedAlbum(false)">
            <el-icon style="color: red">
              <StarFilled />
            </el-icon>
            <span>已收藏({{ albumInfo.subCount }})</span>
          </el-button>
          <el-button
            :icon="Star"
            v-else-if="!albumInfo.isSub"
            @click="subscribedAlbum(true)"
            >收藏({{ albumInfo.subCount }})
          </el-button>
          <el-button :icon="Download" @click="downloadAll">下载全部</el-button>
          <el-button :icon="Share" @click="shareList"
            >分享({{ albumInfo.shareCount }})</el-button
          >
        </div>
        <div class="info__artist">
          <div>
            歌手 ：
            <span v-for="(item, index) in albumInfo.artists" :key="item.id">
              <span>{{ index > 0 ? " / " : "" }}</span>
              <span class="blue" @click="jumpArtists(item.id)">{{ item.name }}</span>
            </span>
          </div>
        </div>
        <div class="info__createtime">
          <div>
            时间 ：<span>{{ albumTime(albumInfo.publishTime) }}</span>
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
                path: '/albumDetail',
                query: { id: route.query.id, type: `${index + 1}` },
              })
            "
          >
            <span
              >{{ item.title
              }}{{ index === 1 ? `(${albumInfo.commentCount})` : "" }}</span
            >
          </li>
        </ul>
      </div>
      <!--组件-->
      <transition name="el-fade-in">
        <keep-alive>
          <component
            :inputType="1"
            :id="Number(route.query.id)"
            :resourceType="3"
            :is="componentMap.list.get(componentMap.key)"
            :descriptionArr="albumInfo.descriptionArr"
          >
          </component>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collectAlbumSub, getAlbumDynamic, getAlbumPriviledge } from "@/api/api_album";
import { useRoute, useRouter } from "vue-router";
import {
  CaretRight,
  Star,
  Share,
  StarFilled,
  Download,
  Search,
} from "@element-plus/icons-vue";
//播放方法
import { play } from "@/utils/play";
//下载音乐
import { downloadMusic } from "@/utils/download";
//分享弹窗
import { useAlbumShare } from "@/utils/dialogShare";
import { albumTime } from "@/utils/filter";
import { SongDetailSongsItem } from "i/api/api_song";
import { loginCallback } from "@/utils/login";

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let offset = 0;
let albumInfo = reactive<{
  subCount: number;
  shareCount: number;
  commentCount: number;
  isSub: boolean;
  publishTime: number;
  blurPicUrl: string;
  name: string;
  artists: Array<{
    id: number;
    name: string;
  }>;
  descriptionArr: string[];
}>({
  subCount: 0,
  shareCount: 0,
  commentCount: 0,
  isSub: false,
  publishTime: 0,
  blurPicUrl: "",
  name: "",
  artists: [],
  descriptionArr: [],
});

let playList = ref<SongDetailSongsItem[]>([]);
let search = ref<string>("");
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
      key: "detail",
      title: "专辑详情",
    },
  ],
});

//引入组件
let shallowPlayList = markRaw(
  defineAsyncComponent(() => import("c/albumDetail/playlist.vue"))
);
let shallowComment = markRaw(defineAsyncComponent(() => import("c/comment/comment.vue")));
let shallowDetail = markRaw(
  defineAsyncComponent(() => import("c/albumDetail/detail.vue"))
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
  componentMap.list.set("detail", shallowDetail);
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
    componentMap.key = "detail";
  }
};

//获取当前路由
let getCurrentUrl = () => {
  if (route.query) {
    let type = route.query.type;
    setCurrentUrlComponent(String(type));
  }
};

//跳转到歌手页
let jumpArtists = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};

let getAlbumDetail = async () => {
  try {
    let { subCount, shareCount, commentCount, isSub, subTime } = await getAlbumDynamic(
      Number(route.query.id)
    );
    let {
      album: { blurPicUrl, name, id, publishTime, description, artists },
      songs,
    } = await getAlbumPriviledge(Number(route.query.id), offset);
    let descriptionArr: string[] = [];
    if (description) {
      descriptionArr = description.split("\n");
    }

    Object.assign(albumInfo, {
      subCount,
      shareCount,
      commentCount,
      isSub,
      blurPicUrl,
      publishTime,
      name,
      artists,
      descriptionArr,
    });
    songs.forEach((item, index: number) => {
      item.from = {
        path: "albumDetail",
        name,
        val: {
          id,
        },
      };
      //初始化进度
      item.progress = 0;
      //位置
      item.serialNum = index + 1;
      //专辑图片
      item.al.picUrl = blurPicUrl;
    });
    playList.value = songs;
  } catch (e: any) {}
};

//播放全部
let playAll = () => {
  play(playList.value, playList.value[0].id);
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

//分享专辑的回调事件
let shareListCallback = (res: { status: string }) => {
  if (res.status === "success") {
    albumInfo.shareCount++;
  }
};

//收藏或者取消收藏专辑
let subscribedAlbum = (collect: boolean) => {
  loginCallback(async () => {
    try {
      let res = await collectAlbumSub(Number(route.query.id), collect ? 1 : 0);
      albumInfo.isSub = collect;
      elMessage.success(`${collect ? "收藏" : "取消收藏"}成功`);
    } catch (e: any) {
      elMessage.error(`${collect ? "收藏" : "取消收藏"}失败`);
    }
  });
};

//分享专辑
let shareList = () => {
  let artists = albumInfo.artists.map((item) => item.name);
  useAlbumShare(
    Number(route.query.id),
    String(albumInfo.blurPicUrl),
    `${String(albumInfo.name)} by ${artists.join(",")}`,
    shareListCallback
  );
};

onActivated(() => {
  setMap();
  getCurrentUrl();
});

//监听当前路由
watch(
  () => route.query,
  (Query) => {
    if (route.name !== "AlbumDetail") return;
    let type = Query?.type;
    setCurrentUrlComponent(type ? String(type) : "1");
  }
);

watchEffect(() => {
  if (route.query?.id && route.name === "AlbumDetail") {
    getAlbumDetail();
  }
});
</script>

<style scoped lang="scss">
//专辑详情 头部
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

.top__picture {
  width: 200px;
  max-height: 212px;
  overflow: hidden;
  border: 1px solid rgba(241, 241, 241);
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
.info__artist,
.info__createtime {
  margin-top: 20px;
}
</style>
