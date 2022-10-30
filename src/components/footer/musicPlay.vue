<template>
  <!--音乐播放器-->
  <div class="music-play">
    <!--歌曲封面 名称 作者 是否喜欢-->
    <div
      class="play__song"
      :style="{ visibility: currentPlaySong ? 'initial' : 'hidden' }"
    >
      <!--歌曲详情 未打开-->
      <div
        class="song__info"
        :class="{ song__info__hidden: isSongDetailVisible }"
        :style="{ display: currentPlaySong ? 'flex' : 'none' }"
      >
        <DefaultImage
          :normalSize="true"
          loadingWidth="30px"
          loadingHeight="30px"
          class="song__img"
          :lazy="false"
          style=""
          :picUrl="
            songList?.list[songList?.currentListIndex]?.al?.picUrl ||
            songList?.list[songList?.currentListIndex]?.album?.picUrl ||
            songList?.list[songList?.currentListIndex]?.radio?.picUrl
          "
        >
          <template #player>
            <!--往上滑-->
            <div class="song__img__up" @click="openSongDetailVisible">
              <el-icon>
                <ArrowUp />
              </el-icon>
            </div>
          </template>
        </DefaultImage>
        <!--歌曲名称 作者 是否喜欢或者点赞-->
        <div class="play__songName" ref="songName">
          <div style="display: flex">
            <div class="name">
              <!--如果过长就做动画效果-->
              <div
                class="animation__name"
                ref="animationName"
                v-title
                @mousemove="animationStart($event, 'animation__name__start')"
                @animationend="animationEnd($event, 'animation__name__start')"
              >
                <b class="gray" style="font-weight: normal">{{
                  songList?.list[songList?.currentListIndex]?.name
                }}</b>
                <b
                  style="font-weight: normal"
                  class="info"
                  v-if="songList?.list[songList?.currentListIndex]?.tns?.length"
                  >({{ songList?.list[songList?.currentListIndex]?.tns?.join("") }})</b
                >
                <b
                  style="font-weight: normal"
                  class="info"
                  v-else-if="songList?.list[songList?.currentListIndex]?.alia?.length"
                  >({{ songList?.list[songList?.currentListIndex]?.alia?.join("") }})</b
                >
              </div>
            </div>
            <i
              class="iconfont"
              v-if="!computedSongIsProgram"
              :class="{
                'icon-xihuan1': !computedIsLikeSong,
                'icon-xihuanfill like': computedIsLikeSong,
              }"
              @click="operateMusic(songList, elMessage, userInfo)"
              ref="like"
            ></i>
            <i
              class="iconfont"
              v-if="computedSongIsProgram"
              :class="{
                'icon-31dianzan': !songList.list[songList.currentListIndex]?.liked,
                'icon-dianzan_kuai like': songList.list[songList.currentListIndex]?.liked,
              }"
              @click="operateRadio(songList, elMessage)"
              ref="like"
            ></i>
          </div>
          <div class="author" ref="authorParent">
            <div
              class="animation__author gray"
              ref="animationAuthor"
              @mousemove="animationStart($event, 'animation__author__start')"
              @animationend="animationEnd($event, 'animation__author__start')"
            >
              <span v-if="computedSongIsProgram">{{
                songList?.list[songList.currentListIndex]?.radio?.name
              }}</span>
              <span v-else-if="songList.list[songList.currentListIndex]?.pc">{{
                songList.list[songList.currentListIndex]?.pc?.ar
              }}</span>
              <span
                v-else-if="computedArtists?.length"
                v-for="(item, index) in computedArtists"
                :key="item.id ? item.id : index"
                >{{ index > 0 ? " / " + item.name : item.name }}</span
              >
              <span v-else>未知歌手</span>
            </div>
          </div>
        </div>
      </div>
      <!--歌曲详情 已打开-->
      <div
        class="song__btngroup"
        :class="{ song__btngroup__hidden: !isSongDetailVisible }"
      >
        <el-icon
          @click="
            isSongDetailVisible = !isSongDetailVisible;
            header.setHeaderVisible(false);
          "
          style="cursor: pointer"
        >
          <ArrowDown />
        </el-icon>
        <div class="btngroup__right">
          <div
            class="btn__linear"
            title="点赞"
            @click="operateRadio(songList, elMessage)"
            v-if="computedSongIsProgram"
          >
            <i
              class="iconfont"
              :class="{
                'icon-31dianzan': !songList.list[songList.currentListIndex]?.liked,
                'icon-dianzan_kuai like': songList.list[songList.currentListIndex]?.liked,
              }"
            ></i>
          </div>
          <div
            class="btn__linear"
            title="喜欢"
            @click="operateMusic(songList, elMessage, userInfo)"
            v-else
          >
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
            title="收藏"
            v-if="!computedSongIsProgram"
            @click="subSong"
          >
            <i class="iconfont icon-shoucang1"></i>
          </div>
          <div
            class="btn__linear"
            :title="downloadStatusTitle(songList.list[songList.currentListIndex])"
            @click="downloadMusic(songList.list[songList.currentListIndex])"
          >
            <i
              class="iconfont"
              :class="downloadStatus(songList.list[songList.currentListIndex])"
            ></i>
          </div>
          <div
            v-if="typeof songList.list[songList.currentListIndex]?.id === 'number'"
            class="btn__linear"
            title="分享"
            @click="shareSong"
          >
            <i class="iconfont icon-fenxiang"></i>
          </div>
        </div>
      </div>
    </div>
    <!--播放器按钮 播放时长 这里样式用拟态看看-->
    <div class="play__btn">
      <!--按钮 循环 上一首 播放/暂停 下一首 歌词-->
      <div
        class="btn__group"
        :class="{
          btn_linear__disable: currentPlaySong ? false : true,
        }"
      >
        <div class="btn__linear" @click="changeRule">
          <i class="iconfont icon-shunxubofang" v-if="rule === '0'" title="顺序播放"></i>
          <i
            class="iconfont icon-liebiaoxunhuan"
            v-else-if="rule === '1'"
            title="列表循环"
          ></i>
          <i
            class="iconfont icon-hanhan-01-01"
            v-else-if="rule === '2'"
            title="单曲循环"
          ></i>
          <i
            o
            class="iconfont icon-22_suijibofang"
            v-else-if="rule === '3'"
            title="随机播放"
          ></i>
          <!-- <i class="iconfont icon-xindong" v-else-if="rule === '4'" title="心动模式"></i> -->
        </div>
        <div class="btn__linear" @click="prevSong" title="上一首">
          <i class="iconfont icon-shangyishou"></i>
        </div>
        <div class="btn__linear" @click="playMusic" :title="isPlay ? '暂停' : '播放'">
          <i
            class="iconfont"
            :class="{ 'icon-bofang': !isPlay, 'icon-zanting': isPlay }"
          ></i>
        </div>
        <div class="btn__linear" @click="nextSong" title="下一首">
          <i class="iconfont icon-xiayishou"></i>
        </div>
        <div
          class="btn__linear"
          title="收藏"
          @click="collectRadio(songList, elMessage)"
          v-if="computedSongIsProgram"
        >
          <el-icon v-if="!songList?.list[songList.currentListIndex]?.radio?.subed">
            <Star />
          </el-icon>
          <el-icon v-else style="color: red">
            <StarFilled />
          </el-icon>
        </div>
        <div class="btn__linear" title="歌词" @click="openLyricDialog" v-else>
          <i class="iconfont icon-geciweidianji"></i>
        </div>
      </div>
      <!--时长 开始时间 拖动条 结束时间-->
      <div class="bar--playTime">
        <span
          class="start"
          :style="{ visibility: currentPlaySong ? 'initial' : 'hidden' }"
          >{{ audioStart }}</span
        >
        <input
          type="range"
          class="time__progress"
          ref="audioRange"
          min="0"
          max="100"
          :value="audioValue"
          @input="audioInput"
          :disabled="!currentPlaySong"
        />
        <span
          class="end"
          :style="{ visibility: currentPlaySong ? 'initial' : 'hidden' }"
          >{{ duration }}</span
        >
        <audio
          ref="audio"
          @timeupdate="updateProgress"
          :src="audioSrc"
          id="audio"
          preload="auto"
          @canplay="canplay"
          @ended="playEnd"
        />
      </div>
    </div>
    <!--音质 音量键 菜单展开（所有歌曲）-->
    <div
      class="play__menu"
      :style="{ visibility: currentPlaySong ? 'initial' : 'hidden' }"
    >
      <div class="menu__quantity" :class="{ info: computedQuantity === '本地' }">
        {{ computedQuantity }}
      </div>
      <div class="btn__linear menu__volumn">
        <i class="iconfont icon-yinliang"></i>
      </div>
      <el-slider size="small" v-model="volumn" style="width: 20%; margin-right: 20px" />
      <!--当前播放歌曲列表-->
      <div
        v-if="!computedIsPersonalFm"
        class="btn__linear menu__collapse"
        @click="openSongListVisible"
      >
        <i class="iconfont icon-24gf-playlistMusic2"></i>
      </div>
    </div>
    <!--当前歌曲播放列表-->
    <PlaySongList />
    <!--歌词弹窗-->
    <LyricDialog />
    <!--歌单收藏弹窗-->
    <CollectSong />
    <!--歌单创建弹窗-->
    <CreateSong />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { getSongUrl } from "@/api/api_song";
//从store取数据
import { useSongStore } from "@/store/playList";
//控制header是否显示
import { useHeader } from "@/store/header";
//歌曲评论弹窗
import { useSongCommentStore } from "@/store/songPopup";
//收藏的弹窗
import { useSongMenuPopupStore } from "@/store/songMenuPopup";

//下载音乐
import { downloadMusic } from "@/utils/download";
import { useRadioProgramShare, useSongShare } from "@/utils/dialogShare";
//导入音频时间格式化
import { transTime } from "@/utils/filter";

//标题
import setTitle from "./expand/useSetTitle";
//下载状态
import { downloadStatus, downloadStatusTitle } from "./expand/useDownloadStatus";
//喜欢或者取消喜欢音乐
import { operateMusic } from "./expand/useOperateMusic";
//收藏或者取消电台
import {
  collectRadio,
  operateRadio,
  updateRadioProgress,
  useSkipTime,
} from "./expand/useRadio";
//导入user store里面的数据 主要用来判断是否是喜欢的音乐 收藏等等
import { useUserInformation } from "@/store/user";
//localstorage方法 用于多窗口通信
import "@/localStorage/index.js";
import { isPlay, audioTime, historyList, rule, openLyric } from "@/localStorage/init";
import { initRouterInstance } from "@/localStorage/instance";
import { initPlayCallback } from "@/localStorage/callback";

let elMessage = inject("message") as any;

//store里面的歌曲list
let songList = useSongStore();
//歌曲评论弹窗
let songCommentShow = useSongCommentStore();
//收藏弹窗
let songMenu = useSongMenuPopupStore();
//header
let header = useHeader();
//用户信息
let userInfo = useUserInformation();
//store里面当前播放的歌曲
let currentPlaySong = computed(() => songList.list[songList.currentListIndex]);
let router = useRouter();

//audio实例
const audio = ref<null | HTMLAudioElement>(null);
//音频轨迹条
const audioRange = ref<null | HTMLInputElement>(null);
//歌曲名字
const animationName = ref<null | HTMLDivElement>(null);
//歌曲作者
const animationAuthor = ref<null | HTMLDivElement>(null);
//喜欢
const like = ref<null | HTMLElement>(null);
//作者
const songName = ref<null | HTMLElement>(null);
//作者 父节点
const authorParent = ref<null | HTMLElement>(null);

//声音播放链接
let audioSrc = ref<string>("");
//开始时间
let audioStart = ref<string>("00:00");
//音频总时间
let duration = ref<string>("0:00");
//音频播放轨迹值
let audioValue = ref<string>("0");
//是否打开歌曲列表
let isSongListVisible = ref<boolean>(false);
//是否打开歌曲详情
let isSongDetailVisible = inject("songDetailVisible") as Ref<boolean>;

//歌词弹窗
let isLyricDialogVisible = ref<boolean>(false);
//音量
const volumn = useStorage("volumn", 50);

//注入歌曲列表
provide("songListVisible", isSongListVisible);
//歌词弹窗
provide("dialogLyricVisible", isLyricDialogVisible);

//返回作者
let computedArtists = computed(() => {
  if (songList?.list[songList?.currentListIndex]?.artists?.length) {
    return songList?.list[songList?.currentListIndex]?.artists;
  } else if (songList?.list[songList?.currentListIndex]?.ar?.length) {
    return songList?.list[songList?.currentListIndex]?.ar;
  }
});

//判断当前播放的歌曲是否是电台节目
let computedSongIsProgram = computed(() => {
  if (songList.list[songList?.currentListIndex]?.radio) {
    return true;
  } else {
    return false;
  }
});

//判断是否是喜欢的音乐
let computedIsLikeSong = computed(() => {
  if (songList.list[songList?.currentListIndex]?.id) {
    return userInfo.likes.includes(Number(songList.list[songList?.currentListIndex]?.id));
  }
});

//判断是否是私人FM
let computedIsPersonalFm = computed(() => {
  if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") return true;
  else return false;
});

//音质
let computedQuantity = computed(() => {
  let item = songList.list[songList.currentListIndex];
  if (songList.list[songList.currentListIndex]) {
    if (item.songUrl) {
      return "本地";
    } else {
      let quantity = "标准";
      switch (item.plLevel) {
        case "standard":
          {
            quantity = "标准";
          }
          break;
        case "exhigh":
          {
            quantity = "极高";
          }
          break;
        case "lossless":
          {
            quantity = "无损";
          }
          break;
        case "hires":
          {
            quantity = "Hi·Res";
          }
          break;
      }
      return quantity;
    }
  } else {
    return "标准";
  }
});

/**打开歌曲详情 */
let openSongDetailVisible = () => {
  if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") {
    router.push({
      path: "/personalFM",
    });
    return;
  } else {
    isSongDetailVisible.value = !isSongDetailVisible.value;
    header.setHeaderVisible(true);
    songCommentShow.setSongCommentShow(false);
  }
};

//打开当前播放的歌单列表
let openSongListVisible = () => {
  if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") return;
  isSongListVisible.value = true;
};

//监听store里面的currentIndex是否发生了改变？
//如果发生了改变 那么就先去获取对应的id 然后加载url等相关数据
//然后播放音乐
watch(
  () => songList.list[songList.currentListIndex],
  () => {
    let val = songList.currentListIndex;
    if (val <= songList.list.length) {
      initPlayer();
      getMusicDetail();
      songList.list[songList.currentListIndex].playTime = new Date().getTime();
      if (historyList.value.length >= 100) {
        historyList.value.pop();
      }
      let index = historyList.value.findIndex(
        (item) => item.id === songList.list[songList.currentListIndex].id
      );
      if (index !== -1) {
        historyList.value.splice(index, 1);
      }
      historyList.value.unshift(songList.list[songList.currentListIndex]);
    } else {
      initPlayer();
      isPlay.value = false;
    }
    //设置标题
    setTitle(songList.list[songList.currentListIndex]);
    setStyleSongName();
    setStyleSongAuthor();
  }
);

//监听音乐状态
watch(
  () => isPlay.value,
  (val) => {
    if (window.ipcRenderer) {
      window.ipcRenderer.updateStatus(val);
    }
    if (audio.value && audio.value?.src !== window.location.href.split("#")[0]) {
      if (val) {
        audio.value.play();
      } else {
        audio.value.pause();
      }
    }
  }
);

//监听音量拖动
watch(volumn, (val) => {
  if (audio.value) {
    audio.value.volume = val / 100;
  }
});

//初始化播放器状态 用于watch监听时调用
let initPlayer = () => {
  audioValue.value = "0";
  audioStart.value = "00:00";
  audioSrc.value = window.location.href.split("#")[0];

  if (audio.value) {
    isPlay.value = true;
  }
  if (audioRange.value) {
    audioRange.value.style.background = `#c9ccd3`;
  }
};

//获取音乐详情
//获取音乐id 去加载url
//音乐id从store里面取值
let getMusicDetail = async () => {
  try {
    //如果是本地文件 就需要自定义协议 对应主进程文件
    if (songList.list[songList.currentListIndex]?.songUrl) {
      audioSrc.value =
        "atom:///" + String(songList.list[songList.currentListIndex].songUrl);
      // audio.value.src =
      //   "atom:///" + String(songList.list[songList.currentListIndex].songUrl);
    } else {
      let { data } = await getSongUrl(
        Number(songList.list[songList.currentListIndex].id)
      );
      audioSrc.value = data[0].url.replace("http", "https");
      // audio.value.src = data[0].url.replace("http", "https");
    }
    nextTick(() => {
      if (audio.value) {
        audio.value.play();
        //如果是播客里面的节目 就根据上次的播放进度进行跳转
        if (songList.list[songList.currentListIndex]?.radio) {
          audio.value.currentTime = Number(useSkipTime(songList));
        }
      }
    });
  } catch (e: any) {
    elMessage.error(e?.message || "播放失败 请检查你的网络是否有问题?");
  }
};

//播放音乐
let playMusic = () => {
  if (audio.value?.src === window.location.href.split("#")[0]) return;
  isPlay.value = !isPlay.value;
  let play = !isPlay.value;

  if (!play) {
    songList.updateSongStatus(songList.list[songList.currentListIndex]?.id, "play");
    audio.value?.play();
  } else {
    songList.updateSongStatus(songList.list[songList.currentListIndex]?.id, "pause");
    audio.value?.pause();
  }
};

//音乐播放结束
let playEnd = () => {
  //播放结束后 先重置状态
  isPlay.value = false;
  songList.list[songList.currentListIndex].status = "pause";
  //根据rule来加载不同的事件
  playRule[rule.value]();
};

//检测浏览器可以播放媒体
let canplay = () => {
  if (audio.value) {
    duration.value = transTime(audio.value.duration);
    if (audio.value.volume >= 0) return;
    audio.value.volume = 0.5;
  }
};

//取两位小数
function changeTwoDecimal(x: string) {
  let f_x = parseFloat(x);
  f_x = Math.round(f_x * 100) / 100;
  return f_x;
}

//根据播放时间更新拖动条
let updateProgress = (e: Event) => {
  if (e.target instanceof HTMLAudioElement) {
    if (isNaN(e.target.duration)) return;
    let value: string | number = e.target.currentTime / e.target.duration;

    value = changeTwoDecimal(String(value));
    //更新开始时间
    if (audio.value) {
      // audioTime.value = audio.value.currentTime;
      audioStart.value = transTime(audio.value.currentTime);
      songList.setCurrentSongPlayTime(transTime(audio.value.currentTime, true));
    }
    //更新滚动条位置
    if (audioRange.value) {
      //解决前面播放 进度条更不上的问题
      let computedValue = value * 100;
      if (computedValue <= 9) computedValue += 1.5;
      updateRadioProgress(songList, value * 100);
      audioRange.value.style.background = `linear-gradient(to right, #ec4141 0%, #ec4141 ${computedValue}%, rgba(228, 231, 237, 1) ${computedValue}%)`;
      if (!isNaN(e.target.duration)) {
        audioValue.value = String(value * 100);
      }
    }
  }
};

//监听音频拖动条进度
let audioInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    let value = event.target.value;
    audioValue.value = value;
    if (audio.value) {
      let durations = audio.value.duration;
      let percent = durations / 100;
      let skipTime = Number(value) * percent;
      audio.value.currentTime = skipTime;
    }

    if (audioRange.value) {
      audioRange.value.style.background = `linear-gradient(to right, #ec4141 0%, #ec4141 ${value}%, rgba(228, 231, 237, 1) ${value}%, rgba(228, 231, 237, 1) 100%)`;
    }
  }
};

//设置快进
let forward = () => {
  if (audio.value) {
    audio.value.currentTime += 5;
  }
};

//跳转到指定时间
/**
@params val : '04:45.784'
 */
let skipAssignTime = (val: string) => {
  nextTick(() => {
    if (audio.value && audio.value?.src !== window.location.href.split("#")[0]) {
      let match = val.split(/:|\./g);
      if (match) {
        let minute: number | string = match[0] || 0;
        let second: number | string = match[1] || 0;
        let mill: number | string = match[3] || 0;
        let result = Number(minute) * 60 + Number(second);
        mill = Number(mill);
        if (mill) {
          result += Number(String(result) + "." + mill);
        }

        audio.value.currentTime = result;
      }
    }
  });
};
//更新跳转时间的方法
songList.setSkipAssignTime(skipAssignTime);

//设置后退
let rewind = () => {
  if (audio.value) {
    audio.value.currentTime -= 5;
  }
};

//设置一下歌曲名字样式
let setStyleSongName = () => {
  nextTick(() => {
    //主要设置名字 和 icon
    if (animationName.value) {
      let width = animationName.value.clientWidth;
      if (width > 150) {
        animationName.value.className = "animation__name animation__define";
      } else {
        animationName.value.className = "animation__name";
      }
    }
  });
};

//收藏热门歌曲
let subSong = () => {
  songMenu.collectSongIds = [Number(currentPlaySong.value)];
  songMenu.collectSongMenuShow = true;
};

//设置一下歌曲作者名字样式
let setStyleSongAuthor = () => {
  //nexttick
  nextTick(() => {
    //主要设置名字 和 icon
    if (animationAuthor.value && authorParent.value) {
      let parentClientWidth = authorParent.value.clientWidth;
      let authorClientWidth = animationAuthor.value.clientWidth;
      if (authorClientWidth > parentClientWidth) {
        animationAuthor.value.className = "animation__author animation__define";
      } else {
        animationAuthor.value.className = "animation__author";
      }
    }
  });
};

//动画开始播放
let animationStart = (e: Event, className: string) => {
  if (e.target instanceof HTMLDivElement) {
    if (!e.target.classList.contains("animation__define")) return;
    e.target.classList.add(className);
  }
};

//动画播放结束
let animationEnd = (e: Event, className: string) => {
  if (e.target instanceof HTMLDivElement) {
    e.target.classList.remove(className);
  }
};

//改变歌曲播放规则
let changeRule = async () => {
  if (!songList.list[songList.currentListIndex]) {
    return;
  } else {
    if (rule.value === "3") {
      rule.value = "0";
    } else {
      rule.value = String(Number(rule.value) + 1);
    }
  }
};

//监听窗口是否发生了变化?
let listenerWindowResize = () => {
  const pieResizeObserver = new ResizeObserver((entries) => {
    if (authorParent.value && animationAuthor.value) {
      let {
        contentRect: { width },
      } = entries[0];
      let parentClientWidth = authorParent.value.clientWidth;
      let authorClientWidth = animationAuthor.value.clientWidth;
      if (authorClientWidth > parentClientWidth) {
        animationAuthor.value.className = "animation__author animation__define";
      } else {
        animationAuthor.value.className = "animation__author";
      }
    }
  });

  if (songName.value) {
    pieResizeObserver.observe(songName.value);
  }
};

//顺序播放
let orderPlay = () => {
  if (songList.list.length - 1 > songList.currentListIndex) {
    songList.setListIndex(songList.currentListIndex + 1);
  }
};

//列表循环
let listRepeatPlay = () => {
  if (songList.currentListIndex === 0 && songList.list.length == 1) {
    //这地方其实是走单曲循环了
    songRepeatPlay();
  } else if (songList.currentListIndex === songList.list.length - 1) {
    songList.setListIndex(0);
  } else {
    songList.setListIndex(songList.currentListIndex + 1);
  }
};

//单曲循环
let songRepeatPlay = () => {
  getMusicDetail();
  nextTick(() => {
    songList.list[songList.currentListIndex].status = "play";
    isPlay.value = true;
  });
};

//随机播放
let randomPlay = () => {
  //随机选取数字 如果这个数字还是更之前一样继续选 直到不是同一个数字 然后触发页面更新
  let newIndex: number = 10000;
  let getIndex = () => {
    let index = parseInt(String(Math.round(Math.random() * (songList.list.length - 1))));
    if (index === songList.currentListIndex) {
      getIndex();
    } else {
      if (newIndex === 10000) newIndex = index;
    }
  };
  getIndex();
  songList.setListIndex(newIndex);
};

//心动模式
let heartPlay = () => {};

//根据不同的规则加载不同的事件
let playRule: {
  [propname: string]: Function;
} = {
  "0": orderPlay,
  "1": listRepeatPlay,
  "2": songRepeatPlay,
  "3": randomPlay,
  "4": heartPlay,
};

//上一首播放
let prevSong = () => {
  if (!songList.list[songList.currentListIndex]) {
    return;
  } else if (songList.currentListIndex > 0) {
    songList.currentListIndex--;
  } else {
    songList.currentListIndex = songList.list.length - 1;
  }
};

//下一首播放
let nextSong = () => {
  if (songList.list[songList.currentListIndex]?.from?.name === "私人FM") {
    songList.fmNextPlay();
  } else {
    if (!songList.list[songList.currentListIndex]) {
      return;
    } else if (songList.currentListIndex >= songList.list.length - 1) {
      songList.currentListIndex = 0;
    } else {
      songList.setListIndex(songList.currentListIndex + 1);
    }
  }
};

//进入歌曲详情
let enterSongDetail = () => {
  header.setHeaderVisible(true);
  isSongDetailVisible.value = true;
};

//注入歌曲播放函数
provide("enterSongDetail", enterSongDetail);
provide("prevSong", prevSong);
provide("playMusic", playMusic);
provide("nextSong", nextSong);
provide("forward", forward);
provide("rewind", rewind);

initPlayCallback({
  enterSongDetail,
  prevSong,
  playMusic,
  nextSong,
  forward,
  rewind,
  operateRadio,
  operateMusic,
});

initRouterInstance(router);

//判断当前歌曲是暂停还是在播放
provide("isPlay", isPlay);

//打开歌词弹窗
let openLyricDialog = () => {
  if (!songList.list[songList.currentListIndex]) {
    return;
  } else if (window.desktopLyricAPI) {
    openLyric.value = !openLyric.value;
  } else {
    isLyricDialogVisible.value = !isLyricDialogVisible.value;
  }
};

//音乐分享
let shareSong = () => {
  //置顶 这地方用dom操作
  let songDetail = document.querySelector(".song--detail");
  if (songDetail) {
    songDetail.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (songList.list[songList.currentListIndex]?.radio) {
    useRadioProgramShare(
      songList.list[songList.currentListIndex]?.radio?.programId,
      songList.list[songList.currentListIndex].album.picUrl,
      songList.list[songList.currentListIndex].name,
      (res: { status: string }) => {
        console.log(res);
      }
    );
  } else {
    useSongShare(
      Number(songList.list[songList.currentListIndex].id),
      songList.list[songList.currentListIndex].album?.picUrl ||
        songList.list[songList.currentListIndex].al?.picUrl,
      songList.list[songList.currentListIndex].name
    );
  }
};

onMounted(() => {
  listenerWindowResize();
});
</script>

<style scoped lang="scss">
//音乐播放器
.music-play {
  /* border: 1px solid #e6e6e6; */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

//歌曲信息
.play__song {
  margin-left: 20px;
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow: hidden;
}

//歌曲详情 未打开
.song__info {
  display: flex;
  align-items: center;
  width: 100%;
  transition: all 0.4s;
  position: absolute;
  top: 25%;
}

//歌曲详情 打开
.song__info__hidden {
  transform: translateY(-200%);
}

//打开音乐详情后的按钮
.song__btngroup {
  display: flex;
  align-items: center;
  transition: all 0.4s;
  width: 100%;
  position: absolute;
  top: 30%;

  i {
    font-size: 20px !important;
  }

  .btngroup__right {
    margin-left: 3vw;
    display: flex;
  }
}

//歌曲详情未打开
.song__btngroup__hidden {
  transform: translateY(200%);
}

//歌曲封面
.song__img {
  width: 60px;
  height: 60px;
  min-width: 60px;
  min-height: 60px;
}

.song__img:hover {
  .song__img__up {
    opacity: 1;
  }
}

//往上滑动
.song__img__up {
  position: absolute;
  top: 0;
  width: 100%;
  background-color: rgba(23, 18, 19, 0.5);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  opacity: 0;

  i {
    color: white;
    font-size: 24px;
  }
}

//歌曲名称 作者 是否喜欢
.play__songName {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  flex: 1;

  div {
    margin-bottom: 4px;
  }

  .name {
    overflow: hidden;
    width: 150px;
    position: relative;
    height: 22px;
  }

  .animation__name {
    white-space: nowrap;
    position: absolute;
    transition: all 0.2s;
    animation-play-state: paused;
  }

  .animation__name::-webkit-scrollbar {
    display: none;
  }

  .author {
    overflow: hidden;
    width: 20vw;
    position: relative;
    height: 22px;
  }

  .animation__author {
    white-space: nowrap;
    position: absolute;
    transition: all 0.2s;
    animation-play-state: paused;
  }

  i {
    cursor: pointer;
    /* margin-left: 214px; */
    font-size: 20px;
    margin-left: 5px;
    /* position: absolute; */
  }
}

//动画定义 主要是用于判断是不是需要加载动画效果
/* .animation__define {
  
} */

//启动动画 针对歌曲名字
.animation__name__start {
  animation: nameWordsLoop 5s linear 0s 2 alternate forwards !important;
  animation-play-state: running !important;
}

//启动动画 针对作者名字
.animation__author__start {
  animation: authorWordsLoop 5s linear 0s 2 alternate forwards !important;
  animation-play-state: running !important;
}

//动画
@keyframes nameWordsLoop {
  0% {
    transform: translateX(0px);
  }

  100% {
    transform: translateX(calc(150px - 100%));
  }
}

//动画
@keyframes authorWordsLoop {
  0% {
    transform: translateX(0px);
  }

  100% {
    transform: translateX(calc(20vw - 100%));
  }
}

//播放按钮外层 包含播放时长
.play__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  min-width: 430px;
}

//按钮组
.btn__group {
  display: flex;
  align-items: center;
  justify-content: center;
}

//播放条外层
.bar--playTime {
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
}

//起始时间 结束时间
.start,
.end {
  width: 40px;
  height: 20px;
  line-height: 20px;
}

//拖动条
.time__progress {
  width: 100%;
  height: 5px;
  background: rgba(228, 231, 237, 1);
  cursor: pointer;
  background-image: linear-gradient(
    -180deg,
    rgba(228, 231, 237, 1) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  background-blend-mode: lighten;
  margin-left: 10px;
  margin-right: 10px;
  -webkit-appearance: none;
}

//拖动条 颜色
.time__progress__bar {
  background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  transition: all 0.2s;
  height: 100%;
  cursor: pointer;
}

//菜单 音质 音量  菜单栏展开
.play__menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  flex: 1;
}

//音质 音量按钮 菜单按钮（歌单）
.menu__quantity,
.menu__volumn,
.menu__collapse {
  margin-right: 20px;
}

//音质
.menu__quantity {
  border: 1px solid #909399;
  padding: 2px;
}

//打开音量弹窗
.menu__volumn:hover + .volumn__progress {
  display: flex;
  position: relative;
}

//拖动条 滑动栏
.time__progress::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  border: 2px solid #ec4141;
  cursor: pointer;
}

:deep(.el-slider__bar) {
  background: #ec4141;
}

:deep(.el-slider__button) {
  border: 2px solid #ec4141;
  width: 12px;
  height: 12px;
}
</style>
