<template>
  <!--歌曲详情-->
  <div>
    <div
      class="comment"
      :class="{ comment__visible: !isScroll }"
      @click="openCommentDialog"
      v-if="simiSongMenu.length || simiSong.length"
      :style="{ display: isSongDetailVisible ? '' : 'none' }"
    >
      <i class="iconfont icon-xiezi"></i>
      <span style="margin-left: 5px">写评论</span>
    </div>
    <!--评论-->
    <div
      class="comment comment--suspension"
      :style="{ display: isSongDetailVisible ? '' : 'none' }"
      :class="{ comment__visible: isScroll }"
      v-if="simiSongMenu.length || simiSong.length"
      @click="openCommentDialog"
    >
      <i class="iconfont icon-xiezi"></i>
      <span style="margin-left: 5px">发表我的音乐评论</span>
    </div>
    <!--歌曲详情-->
    <div
      class="song--detail"
      ref="songDetail"
      @scroll="detailScroll"
      :class="{ 'song--detail__show': isSongDetailVisible }"
    >
      <!--歌曲标题 别名 tns 作者-->
      <div class="detail__title" ref="name">
        <div class="detail__title__name">
          <span>{{ computedSongItem?.name }}</span>
          <div
            class="info--flag"
            style="margin-left: 10px"
            v-if="computedSongItem?.mv"
            @click="jumpMVDetail(computedSongItem?.mv)"
          >
            <span>mv</span>
            <el-icon>
              <CaretRight />
            </el-icon>
          </div>
        </div>
        <div v-if="computedSongItem?.alias">
          <span
            class="info"
            v-for="(item, index) in computedSongItem?.alias"
            :key="index"
          >
            {{ item }}
          </span>
        </div>
        <div class="single-clamp" style="width: 45%; margin: auto">
          <span v-for="(item, index) in computedSongItem?.ar" :key="item.id">
            {{ index > 0 ? " /" : "" }}
            <span class="gray" @click="jumpArtist(item.id)">{{ item.name }}</span>
          </span>
        </div>
        <span
          class="gray"
          v-if="computedSongItem?.al?.name || computedSongItem?.album?.name"
          @click="jumpAlbum(computedSongItem?.al?.id || computedSongItem?.album?.id)"
        >
          {{ computedSongItem?.al?.name || computedSongItem?.album?.name }}
        </span>
      </div>
      <!--唱片-->
      <div class="info__record">
        <div class="info__disc">
          <div class="info__disc__bg"></div>
          <div class="info__disc__cover" ref="cover">
            <div class="disc__img" ref="img" :class="{ play: songStatus }">
              <el-image
                class="u-img"
                :src="computedAlbumPicture(computedSongItem)"
                fit="cover"
              />
            </div>
          </div>
          <div class="disc__needle" :class="{ play: songStatus }"></div>
        </div>
      </div>
      <!--字幕-->
      <LyricList
        :lrcWords="songList.lrcWords"
        :translateLrcWords="songList.translationLrcWords"
        :isLightMusic="songList.isLightMusic"
      />
      <!--评论-->
      <div class="detail__comment" v-if="typeof computedSongItem?.id === 'number'">
        <div class="comment--title" v-if="comment.hotComments.length">
          全部评论({{ comment.total }})
        </div>
        <HotCommentList
          :hotComments="comment.hotComments"
          :hotMore="comment.hotMore"
          :id="computedSongId"
          :stick="stick"
          :resourceType="0"
        />
        <div class="comment--title" v-if="comment.comments.length">
          最新评论({{ comment.total }})
        </div>
        <NewCommentList
          :total="comment.total"
          :comments="comment.comments"
          :id="computedSongId"
          :resourceType="0"
        />
      </div>
      <!--推荐-->
      <div class="recommend">
        <!--相似歌单 歌曲-->
        <div class="info__simi" :style="{ transform: isCollapse ? '' : ' scale(0,0)' }">
          <div class="item__from">播放来源 ：{{ computedSongItem?.from?.name }}</div>
          <!--相似歌单-->
          <div class="simi__item">
            <div class="item__title" v-if="simiSongMenu.length">包含这首歌的歌单</div>
            <div class="item__list">
              <div
                class="list__item"
                v-for="item in simiSongMenu"
                :key="item.id"
                @click="jumpSongMenuDetail(item.id)"
              >
                <DefaultImage
                  style="width: 30px; height: 30px"
                  loadingWidth="15px"
                  loadingHeight="15px"
                  :picUrl="item?.coverImgUrl || ''"
                  :param="30"
                  :y="30"
                />
                <span class="single-clamp" v-title style="flex: 1; margin-left: 10px">{{
                  item.name
                }}</span>
              </div>
            </div>
          </div>
          <!--相似歌曲-->
          <div class="simi__item">
            <div class="item__title" v-if="simiSong.length">喜欢这首歌的人也在听</div>
            <div class="item__list">
              <div
                class="list__item"
                v-for="item in simiSong"
                :key="item.id"
                @click="openNewSong(item.id)"
              >
                <DefaultImage
                  style="width: 30px; height: 30px"
                  loadingWidth="15px"
                  loadingHeight="15px"
                  :picUrl="item?.album?.blurPicUrl || ''"
                  :param="30"
                  :y="30"
                />
                <div class="item__right single-clamp" style="margin-left: 10px" v-title>
                  <span v-title>{{ item.name }}</span>
                  <span style="color: #909399" v-if="item?.transNames?.length"
                    >({{ item.transNames.join("") }})</span
                  >
                  <span> - </span>
                  <span v-for="items in item.artists" :key="items.id">{{
                    items.name
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--展开 收缩-->
        <div class="collapse">
          <el-icon class="gray" v-show="!isCollapse" @click="isCollapse = !isCollapse">
            <DArrowRight />
          </el-icon>
          <el-icon class="gray" v-show="isCollapse" @click="isCollapse = !isCollapse">
            <DArrowLeft />
          </el-icon>
        </div>
      </div>
      <!--评论弹窗-->
      <SongComment
        v-if="typeof computedSongItem?.id === 'number'"
        :total="comment.total"
        :comments="comment.comments"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
//获取评论
import { getSongComment } from "@/api/api_comment";
//获取相似歌单
import { getSimiPlayList, getSimiSong } from "@/api/api_simi";
//唱片
import { correctCoverRotate } from "./expand/useRecord";
//控制header是否显示
import { useHeader } from "@/store/header";
//从store取数据
import { useSongStore } from "@/store/playList";
//歌曲评论弹窗
import { useSongCommentStore } from "@/store/songPopup";
import { useRouter } from "vue-router";
//接口声明
//歌曲
import { Playlists, SongItem } from "i/api/api_simi.d";
//分享
import { comment as commentType, userInfo } from "i/view/videoDetail.d";
import { SongDetailSongsItem } from "i/api/api_song";
import { getSongDetail } from "@/api/api_song";

//弹窗
let elMessage = inject("message") as any;
//header
let header = useHeader();
//router
let router = useRouter();
//歌曲名字信息
let name = ref<null | HTMLDivElement>(null);
//detail
let songDetail = ref<null | HTMLDivElement>(null);
//cover
let cover = ref<null | HTMLDivElement>(null);
//img
let img = ref<null | HTMLDivElement>(null);
//字幕外层
let lyricWrap = ref<null | HTMLDivElement>(null);

//是否展开歌曲详情
let isSongDetailVisible = inject("songDetailVisible") as Ref<boolean>;
//store里面的歌曲list
let songList = useSongStore();
//歌曲是否暂停还是播放?
let songStatus = ref<boolean>(true);
//当前歌曲播放时间
let currentTime = ref<string>("");
//相似歌单
let simiSongMenu = ref<Playlists[]>([]);
//相似歌曲
let simiSong = ref<SongItem[]>([]);
//侦听当前的歌曲id
let computedSongId = computed(() => Number(computedSongItem?.value?.id) || 0);
//是否滑动了
let isScroll = ref<boolean>(false);
//是否收缩侧边栏
let isCollapse = ref<boolean>(true);
//评论弹窗是否显示
let songCommentShow = useSongCommentStore();

//评论列表
let comment = reactive<commentType>({
  total: 0,
  hotComments: [],
  hotMore: false,
  comments: [],
});

let computedSongItem = computed(() => songList.list[songList.currentListIndex]);

//监听歌曲播放状态
watch(
  () => computedSongItem?.value?.status,
  (val) => {
    if (val === "play") songStatus.value = true;
    else songStatus.value = false;
    correctCoverRotate(cover, img, songStatus);
  }
);

//获取相似歌单 相似歌曲 评论
watch(
  () => computedSongItem?.value?.id,
  (val) => {
    if (typeof val === "number") {
      getSimiSongMenuList(val);
      getSimiSongList(val);
      getSongCommentList(val);
    } else {
      simiSongMenu.value = [];
      simiSong.value = [];
    }
  }
);

//监听当前歌曲列表是否展开?
watch(
  () => isSongDetailVisible.value,
  (val) => {
    if (songDetail.value) {
      songDetail.value.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (val === true && typeof computedSongItem?.value?.id === "number") {
      getSongCommentList(Number(computedSongItem?.value?.id));
      getSimiSongMenuList(Number(computedSongItem?.value?.id));
      getSimiSongList(Number(computedSongItem?.value?.id));
    }
  }
);

//获取相似歌单列表
let getSimiSongMenuList = async (id: number) => {
  try {
    let res = await getSimiPlayList(id);
    simiSongMenu.value = res.playlists;
  } catch (e: any) {
    elMessage.error(e?.message || "请求相似歌单出错 请检查你的网络是否有问题?");
  }
};

//获取相似歌曲列表
let getSimiSongList = async (id: number) => {
  try {
    let res = await getSimiSong(id);
    simiSong.value = res.songs;
  } catch (e: any) {
    elMessage.error(e?.message || "请求相似歌曲出错 请检查你的网络是否有问题?");
  }
};

//图片
let computedAlbumPicture = computed(() => {
  return function (item: SongDetailSongsItem) {
    if (item) {
      let picUrl = item.al?.picUrl || item.album?.picUrl;
      if (picUrl) {
        return (
          picUrl.replace(/http$/, "https") +
          "?imageView&enlarge=1&thumbnail=210y210&type=webp"
        );
      }
    }
  };
});

//获取歌曲评论列表
let getSongCommentList = async (id: number) => {
  try {
    let { hotComments, comments, total } = await getSongComment(id);
    comment.total = total;
    comment.hotComments = hotComments.slice(0, 10);
    comment.comments = comments;
    comment.hotMore = hotComments.length > 10 ? true : false;
  } catch (e: any) {
    elMessage.error(e?.message || "请求歌曲评论出错 请检查你的网络是否有问题?");
  }
};

//找到show节点
let showIndex = 0;

//置顶方法 用于打开热门评论
let stick = () => {
  if (songDetail.value) {
    songDetail.value.scrollTo({ top: 0, behavior: "smooth" });
  }
};

//观测元素是否在可视区域
let observer = new IntersectionObserver((entries, observer) => {
  let entry = entries[0];
  if (!isSongDetailVisible.value) {
    header.setStickyStatus(false);
  } else if (entry.isIntersecting) {
    header.setName(computedSongItem?.value?.name);
    header.setStickyStatus(false);
  } else {
    header.setStickyStatus(true);
  }
});

//下滑
let detailScroll = (e: Event) => {
  let target = e.target;
  if (target instanceof HTMLDivElement) {
    let scrollTop = target.scrollTop;
    if (scrollTop === 0) {
      isScroll.value = false;
    } else {
      isScroll.value = true;
    }
  }

  if (name.value) {
    observer.observe(name.value);
  }
};

//评论弹窗打开
let openCommentDialog = () => {
  //置顶 这地方用dom操作
  let songDetail = document.querySelector(".song--detail");
  if (songDetail) {
    songDetail.scrollTo({ top: 0, behavior: "smooth" });
  }
  songCommentShow.setSongCommentShow(true);
};

//跳转到歌单详情
let jumpSongMenuDetail = (id: number) => {
  isSongDetailVisible.value = false;
  header.setHeaderVisible(false);
  router.push({
    path: "/songMenuDetail",
    query: {
      id,
    },
  });
};

//跳转歌手页面
let jumpArtist = (id: number) => {
  isSongDetailVisible.value = false;
  header.setHeaderVisible(false);
  router.push({
    path: "/artists",
    query: {
      id,
    },
  });
};

//跳转专辑页面
let jumpAlbum = (id: number) => {
  isSongDetailVisible.value = false;
  header.setHeaderVisible(false);
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};

//跳转到mv详情页面
let jumpMVDetail = (id?: number) => {
  if (!id) return;
  isSongDetailVisible.value = false;
  header.setHeaderVisible(false);
  router.push({
    path: "/mvDetail",
    query: {
      mvid: id,
    },
  });
};

//打开新歌曲
let openNewSong = async (id: number) => {
  try {
    let { songs, privileges } = await getSongDetail(id + "");
    songs.forEach((item, index) => {
      item.from = {
        path: "",
        name: item.name,
      };
      item.progress = 0;
      item.status = "play";
      //音质
      item.plLevel = privileges[index].plLevel;
    });
    songList.list.splice(songList.currentListIndex + 1, 0, songs[0]);
    songList.currentListIndex++;
  } catch (e: any) {}
};
</script>

<style scoped lang="scss">
//歌曲详情
.song--detail {
  position: fixed;
  top: 100%;
  bottom: 75px;
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  overflow-y: scroll;
  z-index: 1;
  transition: all 0.2s;
  transform: translateY(100%);
  background-color: var(--dark-footer, white);
  background-image: -webkit-linear-gradient(
    top,
    var(--dark-footer, rgba(240, 242, 243)) 0%,
    var(--dark-footer, rgba(255, 255, 255, 1)) 100%
  );
}

//歌曲详情展开
.song--detail__show {
  top: 60px;
  transform: translateY(0%);
  padding-bottom: 90px;
}

//歌曲标题
.detail__title {
  text-align: center;
  flex-direction: column;
  margin-bottom: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  z-index: 50;

  .detail__title__name {
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

//歌曲标题 置顶
.detail__title__bg {
  z-index: 9999;
}

//歌曲信息（唱片 字幕 相似）
.detail__info {
  display: flex;
  flex-direction: column;
  width: 35%;
  margin: auto;
}

//唱片相关
.info__record {
  position: absolute;
  left: 2vw;
  top: 11vw;
}

.info__disc {
  position: relative;
  height: 296px;
  margin: 0 auto;
  width: 296px;
}

.info__disc__bg {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url(@/assets/image/disc-ip6.png) no-repeat center;
  background-size: contain;
}

.info__disc__cover {
  position: absolute;
  z-index: 1;
  width: 184px;
  height: 184px;
  left: 50%;
  top: 50%;
  margin-left: -92px;
  margin-top: -92px;
}

.disc__img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  font-size: 0;
}

.u-img {
  width: 100%;
}

.disc__img.play {
  animation: circle 10s linear infinite;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.disc__needle {
  position: absolute;
  z-index: 3;
  top: -82px;
  width: 96px;
  height: 137px;
  left: 112px;
  background: url(@/assets/image/needle-ip6.png) no-repeat;
  background-size: contain;
  transform: rotate(-30deg);
  transform-origin: left top;
  transition: transform 0.5s;
}

.disc__needle.play {
  transform: rotate(0);
}

//推荐
.recommend {
  display: flex;
  align-items: center;
  height: 250px;
  overflow-y: scroll;
  position: absolute;
  right: 0;
  top: 60px;
}

//相似歌单
.info__simi {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  height: 100%;
  width: 217px;
  overflow-y: scroll;
  -webkit-mask-image: linear-gradient(
    180deg,
    hsla(0deg, 0%, 100%, 0),
    hsla(0deg, 0%, 100%, 0.6) 0%,
    #fff 0%,
    #fff 90%,
    hsla(0deg, 0%, 100%, 0.6) 85%,
    hsla(0deg, 0%, 100%, 0)
  );
}

//相似歌单 元素
.simi__item {
  text-align: left;
  width: 100%;
}

//播放来源
.item__from {
  width: 100%;
  text-align: left;
  word-break: keep-all;
  font-size: 14px;
  margin-bottom: 10px;
}

//相似歌单 标题
.item__title {
  font-weight: bold;
}

//相似歌单 列表
.item__list {
  margin-top: 10px;
}

//相似歌单 列表元素
.list__item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  transition: all 0.2s;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
    border-radius: 8px;
  }
}

//相似歌单 右边
.item__right {
  flex: 1;
  width: auto;
}

//评论
.detail__comment {
  width: 60%;
  margin: auto;
}

//评论按钮
.comment {
  position: fixed;
  right: 12%;
  transition: all 0.2s;
  background: var(--dark-commentButton, rgba(241, 241, 241, 1));
  border-radius: 21px;
  width: 92px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  bottom: 0px;
  z-index: 2;
}

//评论悬浮
.comment--suspension {
  width: 148px;
  height: 35px;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}

.comment:hover,
.comment--suspension:hover {
  background: var(--dark-commentButton, rgba(225, 225, 225, 1));
}

//显示评论弹窗
.comment__visible {
  bottom: 128px;
}

//展开 搜索
.collapse {
  margin-left: 20px;
}
</style>
