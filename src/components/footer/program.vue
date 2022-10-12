<template>
  <div>
    <div
      class="comment"
      :class="{ comment__visible: !isScroll }"
      @click="openCommentDialog"
      :style="{ display: isRadioDetailVisible ? '' : 'none' }"
    >
      <i class="iconfont icon-xiezi"></i>
      <span style="margin-left: 5px">写评论</span>
    </div>
    <!--评论-->
    <div
      class="comment comment--suspension"
      :style="{ display: isRadioDetailVisible ? '' : 'none' }"
      :class="{ comment__visible: isScroll }"
      @click="openCommentDialog"
    >
      <i class="iconfont icon-xiezi"></i>
      <span style="margin-left: 5px">发表我的音乐评论</span>
    </div>
    <!--电台节目详情-->
    <div
      class="radio--detail"
      ref="radioDetail"
      @scroll="detailScroll"
      :class="{ 'radio--detail__show': isRadioDetailVisible }"
    >
      <!--节目标题 主播 创建时间 播放次数-->
      <div class="detail__title">
        <div class="detail__title__name" ref="name">
          {{ songList.list[songList.currentListIndex]?.name }}
        </div>
        <div class="detail__title__other">
          <span class="other__item">
            <span>主播: </span>
            <span
              class="blue"
              @click="
                jumpUserHomePage(songList.list[songList.currentListIndex]?.artists[0].id)
              "
              >{{ songList.list[songList.currentListIndex]?.artists[0].name }}</span
            >
          </span>
          <span class="other__item">
            <i class="iconfont icon-time"></i>
            <span>{{
              commentTime(
                songList.list[songList.currentListIndex]?.radio?.scheduledPublishTime
              )
            }}</span>
          </span>
          <span class="other__item">
            <i class="iconfont icon-play"></i>
            <span
              >{{
                songList.list[songList.currentListIndex]?.radio?.listenerCount || 0
              }}次</span
            >
          </span>
        </div>
        <div class="detail__radio">
          <DefaultImage
            :picUrl="songList.list[songList.currentListIndex]?.album?.picUrl"
            :param="300"
            :y="300"
            loadingWidth="150"
            loadingHeight="150"
            style="width: 300px; height: 300px; min-width: 300px"
            :lazy="false"
          />
          <div class="radio__name">
            <div class="name__left">
              <div style="font-size: 16px">
                {{ songList.list[songList.currentListIndex]?.radio?.name }}
              </div>
              <div style="font-size: 12px">
                <span>{{
                  songList.list[songList.currentListIndex]?.radio?.subCount
                }}</span>
                <span>人收藏</span>
              </div>
              <div class="description--wrap">
                <div
                  class="description"
                  v-for="(item, index) in programDetail.description"
                  :key="index"
                >
                  {{ item }}
                </div>
              </div>

              <div class="songs" v-if="filterSongs.length">
                <el-divider />
                <div style="font-weight: bold">声音包含歌曲</div>
                <div class="songs--wrap">
                  <div
                    class="songs--item"
                    v-for="item in filterSongs"
                    :key="item.id"
                    @click="openNewSong(Number(item.id))"
                  >
                    <DefaultImage
                      :picUrl="item?.album?.picUrl"
                      :param="50"
                      :y="50"
                      style="width: 50px; height: 50px; min-width: 50px"
                      loadingWidth="25px"
                      loadingHeight="25px"
                    />
                    <div class="songs--item__right">
                      <div>{{ item.name }}</div>
                      <span
                        class="ml2"
                        v-for="(items, index) in item.artists"
                        :key="items.id"
                      >
                        <span>{{ index > 0 ? " / " : "" }}</span>
                        <span class="gray" @click.stop.prevent="jumpArtists(items.id)">{{
                          items.name
                        }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-button
              @click="collectRadio(songList, elMessage)"
              type="danger"
              style="margin-left: 15px"
              >{{
                songList.list[songList.currentListIndex]?.radio?.subed ? "已收藏" : "收藏"
              }}</el-button
            >
          </div>
        </div>
        <div class="detail__comment">
          <div v-if="comment.comments.length">
            <div class="comment--title" v-if="comment.hotComments.length">
              全部评论({{ comment.total }})
            </div>
            <HotCommentList
              :hotComments="comment.hotComments"
              :hotMore="comment.hotMore"
              :id="computedSongId"
              :stick="stick"
              :resourceType="4"
            />
            <div class="comment--title" v-if="comment.comments.length">
              最新评论({{ comment.total }})
            </div>
            <NewCommentList
              :total="comment.total"
              :comments="comment.comments"
              :id="computedSongId"
              :resourceType="4"
            />
          </div>
          <CommentEmpty v-else />
        </div>
      </div>
      <!--评论弹窗-->
      <RadioComment
        v-if="typeof songList.list[songList.currentListIndex]?.id === 'number'"
        :total="comment.total"
        :comments="comment.comments"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRouter } from "vue-router";
//歌曲评论弹窗
import { useSongCommentStore } from "@/store/songPopup";
//控制header是否显示
import { useHeader } from "@/store/header";
//从store取数据
import { useSongStore } from "@/store/playList";
//获取电台节目评论
import { getDjComment } from "@/api/api_comment";
//获取电台节目详情 更新电台节目收听次数 更新电台收听次数
import {
  getProgramDetail,
  updateProgramListenCount,
  updateRadioListenCount,
} from "@/api/api_radio";

//收藏或者取消电台
import { collectRadio } from "./expand/useRadio";

//分享
import { comment as commentType, userInfo } from "i/view/videoDetail.d";
import { SongDetailSongsItem } from "i/api/api_song.d";

import emitter from "@/utils/eventBus";
import { commentTime } from "@/utils/filter";
import { getSongDetail } from "@/api/api_song";

//弹窗
let elMessage = inject("message") as any;

//header
let header = useHeader();
//是否滑动了
let isScroll = ref<boolean>(false);

let router = useRouter();

//store里面的歌曲list
let songList = useSongStore();

//评论列表
let comment = reactive<commentType>({
  total: 0,
  hotComments: [],
  hotMore: false,
  comments: [],
});

//电台节目详情
let programDetail = reactive<{
  description: string[];
  songs: SongDetailSongsItem[];
}>({
  description: [],
  songs: [],
});

//过滤空数据
let filterSongs = computed(() => {
  return programDetail.songs.filter((item) => {
    if (item.name) return true;
    else return false;
  });
});

//是否展开电台节目详情
let isRadioDetailVisible = inject("songDetailVisible") as Ref<boolean>;

//评论弹窗是否显示
let songCommentShow = useSongCommentStore();

//电台节目名字
let name = ref<null | HTMLDivElement>(null);

//侦听当前的歌曲id
let computedSongId = computed(() =>
  Number(songList.list[songList.currentListIndex]?.radio?.programId)
);

//评论弹窗打开
let openCommentDialog = () => {
  //置顶 这地方用dom操作
  let radioDetail = document.querySelector(".radio--detail");
  if (radioDetail) {
    radioDetail.scrollTo({ top: 0, behavior: "smooth" });
  }
  songCommentShow.setRadioCommentShow(true);
};

//观测元素是否在可视区域
let observer = new IntersectionObserver((entries, observer) => {
  let entry = entries[0];
  if (!isRadioDetailVisible.value) {
    header.setStickyStatus(false);
  } else if (entry.isIntersecting) {
    header.setName(songList.list[songList.currentListIndex].name);
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

//置顶方法
let stick = () => {
  let radioDetail = document.querySelector(".radio--detail");
  if (radioDetail) {
    radioDetail.scrollTo({ top: 0, behavior: "smooth" });
  }
};

//获取电台节目评论列表
let getSongCommentList = async (id: number) => {
  try {
    let { hotComments, comments, total } = await getDjComment(id);
    comment.total = total;
    comment.hotComments = hotComments.slice(0, 10);
    comment.comments = comments;
    comment.hotMore = hotComments.length > 10 ? true : false;
  } catch (e: any) {
    elMessage.error(e?.message || "请求电台节目评论出错 请检查你的网络是否有问题?");
  }
};

//获取电台节目详情
let getDjProgramDetail = async (programId: number) => {
  try {
    let {
      program: { description, songs, likedCount, listenerCount, id, liked, dj },
    } = await getProgramDetail(programId);
    if (songList.list[songList.currentListIndex].artists) {
      songList.list[songList.currentListIndex].artists[0].id = dj.userId;
    }

    programDetail.description = description.split(/\n/g);
    programDetail.songs = songs;
    //是否点赞过 因为在播客页面查不到点赞的数据
    if (liked) {
      songList.list[songList.currentListIndex].liked = liked;
    }
    updateRadioProgramListenCount(listenerCount, id);
    updateRadioListenerCount(id);
  } catch (e: any) {
    elMessage.error(e?.message || "请求电台节目详情出错 请检查你的网络是否有问题?");
  }
};

//电台节目收听次数更新
let updateRadioProgramListenCount = async (count: number, id: number) => {
  try {
    let res = await updateProgramListenCount(false, count, id);
    emitter.emit("updateProgramListenCount", {
      id,
      count,
    });
  } catch (e: any) {
    elMessage.error(e?.message || "更新电台节目收听次数出错 请检查你的网络是否有问题?");
  }
};

//电台收听次数更新
let updateRadioListenerCount = async (radioId: number) => {
  try {
    let res = await updateRadioListenCount(radioId);
  } catch (e: any) {
    elMessage.error(e?.message || "更新电台收听次数出错 请检查你的网络是否有问题?");
  }
};

//跳转到用户空间页面
let jumpUserHomePage = (id: number) => {
  header.setHeaderVisible(false);
  isRadioDetailVisible.value = false;
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
};

//跳转到歌手页
let jumpArtists = (id: number) => {
  header.setHeaderVisible(false);
  isRadioDetailVisible.value = false;
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
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
    isRadioDetailVisible.value = false;
    nextTick(() => {
      isRadioDetailVisible.value = true;
    });
  } catch (e: any) {}
};

//获取 评论
watchEffect(() => {
  if (
    songList.list[songList.currentListIndex]?.id &&
    songList.list[songList.currentListIndex]?.radio?.programId
  ) {
    getSongCommentList(songList.list[songList.currentListIndex]?.radio?.programId);
    getDjProgramDetail(songList.list[songList.currentListIndex]?.radio?.programId);
  }
});
</script>

<style scoped lang="scss">
//电台节目详情
.radio--detail {
  position: fixed;
  top: 100%;
  bottom: 120px;
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
.radio--detail__show {
  top: 60px;
  transform: translateY(0%);
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
  }

  .detail__title__other {
    margin-top: 16px;
    color: rgb(163 169 178);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .detail__radio {
    width: 80%;
    margin: 40px auto;
    display: flex;
    justify-content: center;
  }
}

.other__item {
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio__name {
  margin-left: 50px;
  display: flex;
  text-align: left;
  font-size: 12px;
  flex: 1;
}

.name__left {
  flex: 1;
}

.description--wrap {
  max-height: 30vh;
  overflow-y: scroll;
}

.description {
  color: rgb(163 169 178);
  margin-top: 20px;
}

.songs--wrap {
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
  -webkit-mask-image: linear-gradient(
    360deg,
    hsla(0deg, 0%, 100%, 0),
    hsla(0deg, 0%, 100%, 0.6) 0%,
    #fff 25%,
    #fff 75%,
    hsla(0deg, 0%, 100%, 0.6) 95%,
    hsla(0deg, 0%, 100%, 0)
  );
  max-height: 30vh;
  overflow-y: scroll;
}

.songs--item {
  display: flex;
  width: 50%;
  margin-top: 15px;
}

.songs--item:hover {
  background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  cursor: pointer;
}

.songs--item__right {
  margin-left: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}

//评论
.detail__comment {
  width: 60%;
  margin: auto;
  text-align: left;
}
</style>
