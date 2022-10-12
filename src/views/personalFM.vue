<template>
  <div class="personal--fm">
    <div class="fm__name">
      <div class="name">
        <span style="margin-right: 5px"> {{ list[currentPlayIndex]?.name }}</span>
        <div
          class="info--flag"
          v-if="list[currentPlayIndex]?.mvid"
          @click="
            router.push({
              path: '/mvDetail',
              query: {
                mvid: list[currentPlayIndex]?.mvid,
              },
            })
          "
        >
          <span>MV</span>
          <el-icon>
            <CaretRight />
          </el-icon>
        </div>
      </div>
      <div class="transname" v-if="list[currentPlayIndex]?.transName">
        {{ list[currentPlayIndex]?.transName }}
      </div>
      <div class="alias" v-else>{{ list[currentPlayIndex]?.alias?.join("") }}</div>
      <div class="album">
        <div>
          专辑：<span
            class="gray"
            @click="
              router.push({
                path: '/albumDetail',
                query: {
                  id: list[currentPlayIndex]?.album?.id,
                },
              })
            "
            >{{ list[currentPlayIndex]?.album?.name }}</span
          >
        </div>
        <div style="margin-left: 20px">
          歌手：
          <span
            v-for="(item, index) in list[currentPlayIndex]?.artists"
            :key="item.id"
          >
            <span class="info">{{ index > 0 ? " / " : "" }} </span>
            <span class="blue" @click="jumpArtists(item.id)">{{ item.name }}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="fm__info">
      <div class="info__left">
        <div class="picture">
          <template v-for="(item, i) in list" :key="item.id">
            <DefaultImage
              :picUrl="item?.album?.picUrl"
              :class="{
                prev: i === currentPlayIndex - 1,
                middle: i === currentPlayIndex,
                next: i === currentPlayIndex + 1,
              }"
              @click="prevPlay(i)"
              class="image"
              :param="300"
              :y="300"
              loadingWidth="150px"
              loadingHeight="150px"
              :lazy="false"
            />
          </template>
        </div>
        <div class="btns">
          <div
            class="btn__linear"
            @click="playMusic(!isPlay)"
            :title="isPlay ? '暂停' : '播放'"
          >
            <i
              class="iconfont"
              :class="{ 'icon-bofang': !isPlay, 'icon-zanting': isPlay }"
            ></i>
          </div>
          <div class="btn__linear" @click="likeSong(!computedIsLikeSong)" title="喜欢">
            <i
              class="iconfont"
              :class="{
                'icon-xihuan1': !computedIsLikeSong,
                'icon-xihuanfill like': computedIsLikeSong,
              }"
            ></i>
          </div>
          <div
            class="btn__linear"
            @contextmenu.prevent="contextMenuFM($event, list[currentPlayIndex])"
            @click="contextMenuFM($event, list[currentPlayIndex])"
            title="垃圾箱"
          >
            <i class="iconfont icon-shanchu"></i>
          </div>
          <div class="btn__linear" @click="fmNextPlay" title="下一首">
            <i class="iconfont icon-xiayishou"></i>
          </div>
          <div
            class="btn__linear"
            @contextmenu.prevent="contextMenuFmMore($event, list[currentPlayIndex])"
            @click="contextMenuFmMore($event, list[currentPlayIndex])"
            title="更多"
          >
            <i class="iconfont icon-gengduo"></i>
          </div>
        </div>
      </div>
      <div class="lyric__wrap">
        <!--字幕-->
        <LyricList
          :lrcWords="computedLrcWords"
          :translateLrcWords="computedTranslateLrcWords"
          :isLightMusic="isLightMusic"
        />
      </div>
    </div>
    <div class="fm__comment">
      <Comment :inputType="1" :resourceType="0" :id="Number(computedId)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSongStore } from "@/store/playList";
import { useUserInformation } from "@/store/user";
import { play } from "@/utils/play";
import { splitLyric, splitTranslateLyric } from "@/utils/lyric";
//收藏歌曲到歌单
import { addSongToSongMenu } from "@/api/api_playList";
import { getLyric } from "@/api/api_lyric";
import { getPersonalFM, getPersonalFMSkip } from "@/api/api_private";
import { contextMenuFM, skipCallback } from "@/contextMenu/fm/normal";
import { contextMenuFmMore, getRouteInstance } from "@/contextMenu/fm/fmMore";
import { SongDetailSongsItem } from "i/api/api_song";

let elMessage = inject("message") as any;
//歌曲列表
let songList = useSongStore();
let user = useUserInformation();
let index = shallowRef<number>(0);
let list = shallowRef<SongDetailSongsItem[]>([]);
let router = useRouter();
//是否是轻音乐
let isLightMusic = shallowRef<boolean>(false);
//歌词
let lrcWords = ref<
  Array<{
    text: string;
    show: boolean;
  }>
>([]);
//翻译后字幕列表 用来动态控制字幕显示的
let translationLrcWords = ref<
  Array<{
    text: string;
    show: boolean;
  }>
>([]);

//未翻译的歌词
let computedLrcWords = computed(() => {
  if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") {
    return songList.lrcWords;
  } else {
    return lrcWords.value;
  }
});

//翻译的歌词
let computedTranslateLrcWords = computed(() => {
  if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") {
    return songList.translationLrcWords;
  } else {
    return translationLrcWords.value;
  }
});

//当前播放的index 默认为0
let currentPlayIndex = computed(() => {
  if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") {
    return songList.currentListIndex;
  } else {
    return index.value;
  }
});

//判断是否是喜欢的音乐
let computedIsLikeSong = computed(() => {
  return user.likes.includes(Number(computedId.value));
});

//是否正在播放
let isPlay = computed(() => {
  if (
    songList.list[songList.currentListIndex]?.status === "play" &&
    songList.list[songList.currentListIndex]?.from?.name === "私人FM"
  ) {
    return true;
  } else {
    return false;
  }
});

//id
let computedId = computed(() => {
  return list.value[currentPlayIndex.value]?.id || 0;
});

//获取私人FM列表
let getPersonalFmList = async () => {
  try {
    let { data } = await getPersonalFM();
    data.forEach((item) => {
      item.progress = 0;
      item.downloadStatus = "begin";
      item.from = {
        path: "personalFM",
        name: "私人FM",
      };
    });
    list.value = list.value.concat(data);
    getSongLyric();
  } catch (e: any) {}
};

//获取歌词
let getSongLyric = async () => {
  try {
    let { lrc, tlyric } = await getLyric(Number(computedId.value));

    //先判断是不是纯音乐 如果是纯音乐下面步骤跳过
    if (lrc.lyric.search("纯音乐，请欣赏") !== -1) {
      isLightMusic.value = true;
      lrcWords.value = [];
      translationLrcWords.value = [];
      return;
    } else {
      isLightMusic.value = false;
    }

    songList.isLightMusic = isLightMusic.value;

    if (lrc) {
      let dt =
        songList.list[songList.currentListIndex]?.dt ||
        songList.list[songList.currentListIndex]?.duration;
      let { lyricWords } = splitLyric(lrc.lyric, Number(dt));
      lrcWords.value = lyricWords;
    }

    if (tlyric) {
      let { tLyricWords } = splitTranslateLyric(tlyric.lyric);
      translationLrcWords.value = tLyricWords;
    }
  } catch (e: any) {}
};

let getPersonalFMSkipList = async (isPush: boolean) => {
  if (index.value + 1 < list.value.length) {
    return;
  }
  let { data } = await getPersonalFMSkip(Number(computedId.value));
  data.forEach((item) => {
    item.progress = 0;
    item.downloadStatus = "begin";
    item.from = {
      name: "私人FM",
      path: "personalFM",
    };
  });
  list.value = list.value.concat(data);
  if (isPush) {
    songList.list = [];
    list.value.forEach((item) => {
      songList.setSongList(item);
    });
  }
};

//点击上次的歌曲
let prevPlay = async (i: number) => {
  index.value = i;
  if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") {
    songList.setListIndex(index.value);
  }
  getSongLyric();
};

//播放音乐
let playMusic = (status: boolean) => {
  if (
    songList.list[songList.currentListIndex]?.name !==
    list.value[currentPlayIndex.value]?.name
  ) {
    play(list.value, Number(computedId.value));
  } else {
    songList.updateSongStatus(computedId.value, status ? "play" : "pause");
  }
};

//跳过当前歌曲 重新获取fm
let fmNextPlay = async () => {
  try {
    index.value++;
    if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") {
      getPersonalFMSkipList(true);
      songList.setListIndex(index.value);
    } else {
      getPersonalFMSkipList(false);
    }
  } catch (e: any) {
  } finally {
    getSongLyric();
  }
};

//喜欢/取消喜欢音乐
let likeSong = async (liked: boolean) => {
  try {
    let res = await addSongToSongMenu(
      `${liked ? "add" : "del"}`,
      Number(user.songMenu[0].id),
      Number(computedId.value)
    );
    if (liked) {
      user.likes.push(Number(computedId.value));
    } else {
      let index = user.likes.indexOf(Number(computedId.value));
      if (index !== -1) {
        user.likes.splice(index, 1);
      }
    }
    elMessage.success(`${liked ? "已成功添加到我喜欢的音乐" : "取消喜欢成功"}`);
  } catch (e: any) {
    elMessage.error("操作失败");
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

onMounted(() => {
  getPersonalFmList();
  getRouteInstance(router);
  skipCallback(fmNextPlay);
});

onActivated(() => {
  songList.fmNextPlay = fmNextPlay;
});
</script>

<style scoped lang="scss">
.personal--fm {
  min-width: 750px;
  width: 90%;
  margin: 20px auto;
}

.fm__name {
  text-align: center;
}

.name {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alias,
.album,
.transname {
  margin-top: 10px;
}

.album {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fm__info {
  display: flex;
  align-content: center;
  justify-content: center;
  margin-top: 20px;
  max-height: 400px;
}

.info__left {
  display: flex;
  flex-direction: column;

  .picture {
    position: relative;
    width: 300px;
    height: 300px;
    perspective: 460px;

    .image {
      width: 300px;
      height: 300px;
      min-width: 300px;
      min-height: 300px;
      left: 0;
      position: absolute;
      transition-duration: 0.3s;
      transition-delay: 0s;
      opacity: 0;

      &.prev {
        transform: translate3d(-125px, 0, -60px);
        opacity: 1;

        &:hover {
          transform: translate3d(-256px, 0, -60px);
        }
      }

      &.middle {
        opacity: 1;
      }

      &.next {
        transform: translate3d(289px, 0, 50px);
      }
    }
  }

  .btns {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.fm__comment {
  margin-top: 20px;
}
</style>
