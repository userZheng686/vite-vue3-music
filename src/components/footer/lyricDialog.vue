<template>
  <!--歌词弹窗-->
  <div class="lyric--dialog" :style="style" ref="lyric" v-show="visible">
    <!--弹窗按钮-->
    <div class="lyric--btns">
      <i title="进入音乐详情页" class="iconfont icon-yinle" @click="enterSongDetail"></i>
      <i title="快进5s时间" @click="forward">+5s</i>
      <i title="后退5s时间" @click="rewind">-5s</i>
      <i title="播放上一首" class="iconfont icon-shangyishou" @click="prevSong"></i>
      <i
        :title="isPlay ? '播放' : '暂停'"
        class="iconfont"
        :class="{ 'icon-bofang': !isPlay, 'icon-zanting': isPlay }"
        @click="playMusic"
      ></i>
      <i title="下一首播放" class="iconfont icon-xiayishou" @click="nextSong"></i>
      <el-icon @click="visible = false" title="关闭歌词弹窗">
        <Close />
      </el-icon>
    </div>
    <!--歌词-->
    <div class="lyric--words">
      <!--歌曲名字 作者
      是否是纯音乐
      原歌词
      逻辑：
      首先先展示歌曲名字和作者
      只会判断是不是纯音乐 是的话就展示
      -->
      <div class="prototype">
        <div>
          <span>{{ songList.list[songList.currentListIndex]?.name }}</span>
          <span v-if="artistsName"> - </span>
          <span
            v-for="(item, index) in songList.list[songList.currentListIndex]?.ar"
            :key="item.id ? item.id : index"
            >{{ index > 0 ? "/ " + item.name : item.name }}</span
          >
        </div>
        <span v-if="isLightMusic">纯音乐，请欣赏</span>
        <template v-for="(item, index) in lrcWords" :key="index">
          <span v-if="item.show">{{ item.text.replace(/\[.*\]/, "") }}</span>
        </template>
        <template v-for="(item, index) in translationLrcWords" :key="index">
          <span v-if="item.show">{{ item.text.replace(/\[.*\]/, "") }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useDraggable } from "@vueuse/core";

//控制header是否显示
import { useHeader } from "@/store/header";
//获取歌词
import { getLyric } from "@/api/api_lyric";
//从store取数据
import { useSongStore } from "@/store/playList";
//处理字幕
import { diffLyricTime, splitLyric, splitTranslateLyric } from "@/utils/lyric";
//yrcWords
import {
  yrcWords,
  lrcWords,
  translationLrcWords,
  isLightMusic,
} from "@/localStorage/init";

//header
let header = useHeader();
//弹窗
const lyric = ref<null | HTMLElement>(null);
//store里面的歌曲list
let songList = useSongStore();
let elMessage = inject("message") as any;
//歌词弹窗是否打开
let visible = inject("dialogLyricVisible") as Ref<boolean>;
//是否打开歌曲详情
let isSongDetailVisible = inject("songDetailVisible") as Ref<boolean>;
//当前歌曲播放时间(带毫秒)
// let audioStartMill = inject("audioStartMill") as Ref<string>;
//歌曲播放方法 从父组件身上接收
let enterSongDetail = inject("prevSong") as () => {};
let prevSong = inject("prevSong") as () => {};
let playMusic = inject("playMusic") as () => {};
let nextSong = inject("nextSong") as () => {};
let forward = inject("forward") as () => {};
let rewind = inject("rewind") as () => {};
//歌曲播放状态
let isPlay = inject("isPlay") as Ref<boolean>;

let artistsName = computed(() => {
  if (songList.list[songList.currentListIndex]?.ar?.length) {
    return songList.list[songList.currentListIndex]?.ar[0].name;
  } else if (songList.list[songList.currentListIndex]?.artists?.length) {
    return songList.list[songList.currentListIndex]?.artists[0].name;
  }
});

//监听当前播放的歌曲是否发生了改变？
watch(
  () => songList.list[songList.currentListIndex],
  async () => {
    let val = songList.currentListIndex;
    //清空
    lrcWords.value = [];
    translationLrcWords.value = [];
    isLightMusic.value = false;
    songList.setLyricTimeArr([]);
    songList.setTranslationLyricTimeArr([]);
    if (songList.currentListIndex > songList.list.length) return;
    //电台不请求
    if (songList.list[songList.currentListIndex]?.radio) return;
    let id = songList.list[val]?.id;
    if (id) {
      getLyricWords(id);
    }
  }
);

//将字幕的时间提取出来成数组 方便下次判断
let lrcTimeArr: Array<string> = [];
let translationLrcTimeArr: Array<string> = [];

let latestTimeLyric: {
  index: number | undefined;
  item: {
    [propname: string]: any;
  };
} = {
  index: undefined,
  item: {},
};
let latestTimeTranslationLyric: {
  index: number | undefined;
  item: {
    [propname: string]: any;
  };
} = {
  index: undefined,
  item: {},
};

//核心逻辑
/**
首先先判断当前的时间是否找到了对应的文本
如果没有就通过最近的节点来复用文本
 */
watch(
  () => songList.audioStartMill,
  (val) => {
    // val = val.replace(/\..*/, "");
    diffLyricTime(lrcWords.value, lrcTimeArr, latestTimeLyric, val);
    diffLyricTime(
      translationLrcWords.value,
      translationLrcTimeArr,
      latestTimeTranslationLyric,
      val
    );
  }
);

const { x, y, style } = useDraggable(lyric, {
  initialValue: { x: 700, y: 300 },
});

//获取歌词
/**
实现的逻辑
首先先字幕切割成数组 根据[00:00]这种格式切割
切割完之后先将空的内容过滤掉 比如换行之类的 然后将[00:00]这种的弄成一个数组 方便找最近的字幕来复用
之后将字幕整合一下 弄个show状态 通过watch监听播放时间来动态控制是否显示？
 */
let getLyricWords = async (id: number | string) => {
  try {
    //如果id为string类型 那就不做任何处理
    if (typeof id !== "number") return;
    let res = await getLyric(id);

    if (!res?.lrc && !res?.tlyric) {
      return;
    }
    let { lrc, tlyric, yrc } = res;
    //先判断是不是纯音乐 如果是纯音乐下面步骤跳过
    if (lrc.lyric.search("纯音乐，请欣赏") !== -1) {
      isLightMusic.value = true;
      return;
    }

    //如果是逐字渲染的歌词 需要跨窗口进行渲染 所以需要用到localStorage
    if (yrc) {
      let splitYrc = yrc.lyric.split("\n");
      let formatYrc: string[] = [];
      //找出符合条件的歌词
      splitYrc.forEach((item, index) => {
        formatYrc[index] = item.replace(/\(\d*,\d*,\d\)/g, "");
      });
      formatYrc = formatYrc.filter((item) => {
        if (item.replace(/\[.*\]/g, "").length === 0) return false;
        else return true;
      });
      yrcWords.value = formatYrc;
    } else {
      yrcWords.value = [];
    }

    let dt =
      songList.list[songList.currentListIndex]?.dt ||
      songList.list[songList.currentListIndex]?.duration ||
      0;
    let { lyricTimeArr, lyricWords } = splitLyric(lrc.lyric, Number(dt));
    let { tLyricTimeArr, tLyricWords } = splitTranslateLyric(tlyric.lyric);

    lrcTimeArr = lyricTimeArr;
    lrcWords.value = lyricWords;
    translationLrcTimeArr = tLyricTimeArr;
    translationLrcWords.value = tLyricWords;

    //store更新
    songList.setLyricTimeArr(lrcTimeArr);
    songList.setTranslationLyricTimeArr(translationLrcTimeArr);
  } catch (e) {
    //这地方就不做任何处理了
    // ("e", e);
    // elMessage.error("获取歌词失败 请检查你的网络是否有问题?");
  }
};
</script>

<style scoped lang="scss">
//歌词弹窗
.lyric--dialog {
  position: fixed;
  z-index: 9999;
  /* background-color: rgba(18, 18, 18, 0.5); */
  width: 40vw;
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lyric--dialog:hover {
  background-color: rgba(18, 18, 18, 0.5);

  .lyric--btns {
    opacity: 1;
  }
}

//弹窗按钮
.lyric--btns {
  color: white;
  display: flex;
  align-items: center;
  margin-top: 20px;
  justify-content: space-between;
  width: 60%;
  transition: all 0.2s;
  opacity: 0;

  i {
    user-select: none;
    font-size: 22px;
    cursor: pointer;
  }
}

//弹窗歌词
.lyric--words {
  color: #ec4141;
  font-size: 30px;
  margin-top: 25px;
  user-select: none;
  text-align: center;
}

//未翻译的歌词
.prototype {
  display: flex;
  flex-direction: column;
}
</style>
