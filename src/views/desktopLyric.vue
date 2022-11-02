<template>
  <!--歌词弹窗-->
  <div
    class="lyric--dialog"
    ref="desktopLyric"
    :class="{ 'lyric--noLock': !lockLyric, 'lyric--lock': lockLyric }"
  >
    <!--弹窗按钮-->
    <div class="lyric--noLock__btns" v-if="!lockLyric">
      <i
        title="进入音乐详情页"
        class="iconfont icon-yinle"
        @click="setEnterSongDetail"
      ></i>
      <i title="快进5s时间" @click="setForward">+5s</i>
      <i title="后退5s时间" @click="setRewind">-5s</i>
      <i title="播放上一首" class="iconfont icon-shangyishou" @click="setPrevSong"></i>
      <i
        :title="isPlay ? '播放' : '暂停'"
        class="iconfont"
        :class="{ 'icon-bofang': !isPlay, 'icon-zanting': isPlay }"
        @click="setPlayMusic"
      ></i>
      <i title="下一首播放" class="iconfont icon-xiayishou" @click="setNextSong"></i>
      <el-icon title="锁定桌面歌词" @click="lockLyric = true">
        <Lock />
      </el-icon>
      <el-icon @click="close" title="关闭歌词弹窗">
        <Close />
      </el-icon>
    </div>
    <div class="lyric--lock__btn" v-else>
      <el-icon style="color: white" title="解锁桌面歌词" @click="lockLyric = false">
        <Unlock />
      </el-icon>
    </div>
    <div class="title">
      <span>{{ list[currentListIndex].name }}</span>
      <span v-if="computedAlias(list[currentListIndex])"
        >({{ computedAlias(list[currentListIndex]) }})</span
      >
      <span> - </span>
      <span v-for="(items, index) in computedArtists" :key="items.id">
        <span>{{ index > 0 ? " / " : "" }}</span>
        <span>{{ items?.name }}</span>
      </span>
    </div>
    <!--歌词-->
    <div class="lyric--words">
      <div v-if="isLightMusic"><span class="title">纯音乐，请欣赏</span></div>
      <div v-for="item in computedLyricList" :key="item.text" class="text">
        {{ item.text.replace(/\[.*\]/, "") }}
      </div>
      <div v-for="item in computedTranslateLyricList" :key="item.text" class="text2">
        {{ item.text.replace(/\[.*\]/, "") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { Ref } from "vue";
import { SongDetailSongsItem } from "i/api/api_song";
import {
  list,
  currentListIndex,
  isPlay,
  lrcWords,
  translationLrcWords,
  volumn,
  likes,
  isLightMusic,
  audioTime,
  lockLyric,
  openLyric,
} from "@/localStorage/init";
import {
  setEnterSongDetail,
  playSong,
  setForward,
  setRewind,
  setNextSong,
  setPlayMusic,
  setPrevSong,
} from "@/localStorage/set";

const desktopLyric = ref<null | HTMLElement>(null);

let close = () => {
  openLyric.value = false;
};

watch(
  () => audioTime.value,
  (val) => {
    let item = lrcWords.value.filter((item) => item.show);
    if (item && item.length) {
      let dom = document.querySelector(".text");
      let dom2 = document.querySelector(".text2");
      let { startTime, currentTime, text } = item[0];
      let percent = ((val - startTime) / currentTime) * 100;
      if (dom && dom2) {
        //后续优化 有比较明显的卡顿问题
        initialDom(dom, percent);
        initialDom(dom2, percent);
      }
    }
  }
);

let initialDom = (dom: Element, percent: number) => {
  window.requestAnimationFrame(() => {
    dom.style.backgroundImage =
      "-webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), -webkit-linear-gradient(left, #f00 " +
      percent +
      "%, #cdcdf7 0%)";
  });
};

let computedAlias = computed(() => {
  return function (item: SongDetailSongsItem) {
    if (item?.alias?.length) {
      return item.alias?.join("");
    } else if (item?.tns?.length) {
      return item.tns?.join("");
    } else if (item?.alia?.length) {
      return item.alia?.join("");
    } else if (item?.transName) {
      return item.transName;
    } else {
      return "";
    }
  };
});

let computedLyricText = computed(() => {
  return function (item: string) {
    return item.replace(/\[.*\]/, "");
  };
});

let computedArtists = computed(() => {
  let item = list.value[currentListIndex.value];
  if (item?.artists?.length) {
    return item?.artists;
  } else if (item?.ar) {
    return item?.ar;
  } else {
    return [];
  }
});

let computedLyricList = computed(() => {
  return lrcWords.value.filter((item) => item.show);
});

let computedTranslateLyricList = computed(() => {
  return translationLrcWords.value.filter((item) => item.show);
});

let initDrag = async function () {
  let { width, height } = await window.desktopLyricAPI.getBounds();
  let biasX = 0;
  let biasY = 0;

  const moveEvent = (e: MouseEvent) => {
    window.desktopLyricAPI.setBounds({
      x: e.screenX - biasX,
      y: e.screenY - biasY,
      width,
      height,
    });
  };

  if (desktopLyric.value) {
    desktopLyric.value.addEventListener("mousedown", async function (e) {
      let { width: width1, height: height1 } = await window.desktopLyricAPI.getBounds();
      width = width1;
      height = height1;
      switch (e.button) {
        case 0:
          biasX = e.x;
          biasY = e.y;
          desktopLyric.value.addEventListener("mousemove", moveEvent);
          break;
        case 2:
          break;
      }
    });

    desktopLyric.value.addEventListener("mouseup", (e) => {
      biasX = 0;
      biasY = 0;
      desktopLyric.value.removeEventListener("mousemove", moveEvent);
    });
    desktopLyric.value.addEventListener("mouseleave", (e) => {
      biasX = 0;
      biasY = 0;
      desktopLyric.value.removeEventListener("mousemove", moveEvent);
    });
  }
};

onMounted(() => {
  initDrag();
});
</script>

<style lang="scss">
body {
  min-width: auto;
  min-height: auto;
}

#app {
  width: 100%;
}

//歌词弹窗
.lyric--dialog {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(18, 18, 18, 0.5);
}

.lyric--noLock {
  &:hover {
    background-color: rgba(18, 18, 18, 0.5);

    .lyric--noLock__btns {
      opacity: 1;
    }
  }
}

.lyric--lock {
  &:hover {
    .lyric--lock__btn {
      opacity: 1;
    }
  }
}

//弹窗按钮
.lyric--noLock__btns {
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

.lyric--lock__btn {
  opacity: 0;
  transition: all 0.2s;

  i {
    user-select: none;
    font-size: 22px;
    cursor: pointer;
  }
}

.title {
  color: white;
  font-size: 22px;
  text-shadow: 1px 1px 5px #c62f2f, 1px -1px 0px #c62f2f;
}

//弹窗歌词
.lyric--words {
  box-sizing: border-box;
  margin: 10px;
  padding: 0 15px;
  font-size: 22px;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
  text-indent: 2px;
  overflow-x: auto;
  text-align: center;
  position: relative;
  color: white;

  .text,
  .text2 {
    position: relative;
    background: -webkit-linear-gradient(
        top,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      -webkit-linear-gradient(left, #f00 0%, #cdcdf7 0%);
    margin: 0;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-filter: drop-shadow(0px 0px 1px #f00);
  }

  .t2 {
    position: absolute;
    top: 0;
    z-index: -1;
  }
}
</style>
