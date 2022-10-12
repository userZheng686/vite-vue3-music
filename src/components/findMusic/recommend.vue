<template>
  <!--个性推荐-->
  <LoadingComponent v-if="!radio.length"></LoadingComponent>
  <div v-else class="recommend--wrap">
    <!--轮播图-->
    <div class="banner">
      <el-carousel :interval="2000" type="card" height="200px">
        <el-carousel-item
          v-for="item in list"
          :key="item.imageUrl"
          style="border-radius: 8px"
        >
          <DefaultImage
            :lazy="false"
            :param="1024"
            :normalSize="true"
            :y="1024"
            class="banner--img"
            :picUrl="item.imageUrl"
            @click="open(item.url)"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <template v-for="item in recommendMenuList" :key="item.order">
      <transition name="el-fade-in">
        <component :is="componentMap.list.get(item.component)" />
      </transition>
    </template>
    <!--拖拽-->
    <div class="drag">
      <div class="info">现在可以根据个人喜好，自由调整首页栏目顺序啦~</div>
      <el-button
        type="danger"
        round
        style="margin-top: 10px"
        @click="updatePopupShow = !updatePopupShow"
        >调整栏目顺序</el-button
      >
    </div>
    <UpdateMenuOrder />
  </div>
</template>

<script lang="ts" setup>
import { BannerItem } from "i/api/api_other.d";
import { Radio } from "i/api/api_radio.d";
import { RecommendMVItem } from "i/api/api_video.d";
import { SongDetailSongsItem } from "i/api/api_song";
import {
  RecommendSongMenuPersonalizedItem,
  PrivateContentItem,
} from "i/api/api_playList.d";
import { getPlayList } from "@/contextMenu/playlist/normal";
import { useRouter } from "vue-router";
import { getHomeBatch } from "@/api/api_batch";
import { recommendMenuList } from "@/localStorage/init";

//map component
let componentMap = reactive<{
  list: Map<string, any>;
}>({
  list: new Map(),
});

let router = useRouter();
let elMessage: any = inject("message") as any;
let updatePopupShow = ref<boolean>(false);
provide("updatePopupShow", updatePopupShow);

//轮播图
let list = ref<Array<BannerItem>>([
  { imageUrl: "", url: "" },
  { imageUrl: "", url: "" },
  { imageUrl: "", url: "" },
]);

//每日推荐歌单
let recommendSongMenu = reactive<{
  hover: number;
  list: Array<RecommendSongMenuPersonalizedItem>;
}>({
  hover: 0,
  list: [
    {
      name: "每日歌曲推荐",
      picUrl:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile.moyublog.com%2Fd%2Ffile%2F2020-11-28%2F53d20a1aec94a63fac46137428a4a6ea.jpg&refer=http%3A%2F%2Ffile.moyublog.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658306295&t=ca9e5df4590ed534939edc3f8c56ba20",
      playCount: 0,
      id: 0,
    },
  ],
});
provide("recommendSongMenu", recommendSongMenu);

//独家放送列表
let privateList = ref<Array<PrivateContentItem>>([]);
provide("privateList", privateList);

//最新音乐
let newTopMusic = ref<Array<SongDetailSongsItem>>([]);
provide("newTopMusic", newTopMusic);

//推荐mv
let recommendMV = ref<Array<RecommendMVItem>>([]);
provide("recommendMV", recommendMV);

//播客
let radio = ref<
  Array<{
    copywriter: string;
    id: number;
    name: string;
    picUrl: string;
    radio: Radio;
  }>
>([]);
provide("radio", radio);

//跳转链接
let open = (url: string) => {
  if (url !== null) {
    if (window.desktopMainAPI) {
      window.desktopMainAPI.href(url);
    } else {
      window.open(url);
    }
  }
};

//初始化组件
let initComponentMap = () => {
  let RecommendPlaylist = markRaw(
    defineAsyncComponent(() => import("c/findMusic/recommend/recommendPlaylist.vue"))
  );
  let RecommendPrivate = markRaw(
    defineAsyncComponent(() => import("c/findMusic/recommend/recommendPrivate.vue"))
  );
  let RecommendMusic = markRaw(
    defineAsyncComponent(() => import("c/findMusic/recommend/recommendMusic.vue"))
  );
  let RecommendMv = markRaw(
    defineAsyncComponent(() => import("c/findMusic/recommend/recommendMv.vue"))
  );
  let RecommendRadio = markRaw(
    defineAsyncComponent(() => import("c/findMusic/recommend/recommendRadio.vue"))
  );
  componentMap.list.set("RecommendPlaylist", RecommendPlaylist);
  componentMap.list.set("RecommendPrivate", RecommendPrivate);
  componentMap.list.set("RecommendMusic", RecommendMusic);
  componentMap.list.set("RecommendMv", RecommendMv);
  componentMap.list.set("RecommendRadio", RecommendRadio);
};

//获取首页数据
let getHomeList = async () => {
  let {
    "/api/mlivestream/entrance/audio": audio,
    "/api/personalized/djradio": djradio,
    "/api/personalized/mv": mv,
    "/api/personalized/newsong": newsong,
    "/api/personalized/playlist": playlist,
    "/api/personalized/privatecontent": privatecontent,
    "/api/recommend/live/get": live,
    "/api/v2/banner/get": banner,
  } = await getHomeBatch();

  //设置轮播图
  list.value = banner.banners;

  //设置推荐歌单
  recommendSongMenu.list.push(...playlist.result);
  getPlayList(recommendSongMenu.list);

  //设置独家放送
  privateList.value = privatecontent.result;

  //设置新歌速递
  newTopMusic.value = newsong.result.map((item, index) => {
    item.song.progress = 0;
    item.song.from = {
      path: "findMusic",
      name: "发现页",
      val: {
        component: "recommend",
        index: 0,
      },
    };
    item.song.alg = item.alg;
    return item.song;
  });

  //设置推荐MV
  recommendMV.value = mv.result;

  //设置播客数据
  radio.value = djradio.result;
};

//初始化
initComponentMap();
getHomeList();
</script>

<style scoped lang="scss">
/**个性推荐 */
.recommend--wrap {
  text-align: center;
}

/**轮播图 */
.banner {
  z-index: 0;
}

/**轮播图 图片*/
.banner--img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

/**拖拽 */
.drag {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  flex-direction: column;
}
</style>
