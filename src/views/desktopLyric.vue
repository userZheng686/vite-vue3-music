<template>
  <!--歌词弹窗-->
  <div
    class="lyric--dialog"
    ref="desktop"
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
        <span>{{ items.name }}</span>
      </span>
    </div>
    <!--歌词-->
    <div class="lyric--words">
      <div v-if="isLightMusic"><span class="title">纯音乐，请欣赏</span></div>
      <div
        v-for="item in computedLyricList"
        :key="item.text"
        class="text"
        :class="{ load: yrcLoad }"
      >
        {{ item.text.replace(/\[.*\]/, "") }}
      </div>
      <div
        v-for="item in computedTranslateLyricList"
        :key="item.text"
        class="text"
        :class="{ load: yrcLoad }"
      >
        {{ item.text.replace(/\[.*\]/, "") }}
      </div>
      <div class="t2">
        <div v-for="item in computedLyricList" :key="item.text" class="text">
          {{ item.text.replace(/\[.*\]/, "") }}
        </div>
        <div v-for="item in computedTranslateLyricList" :key="item.text" class="text">
          {{ item.text.replace(/\[.*\]/, "") }}
        </div>
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

const desktop = ref<null | HTMLElement>(null);

//动画效果
let yrcLoad = ref<boolean>(false);
//动画持续时间
let yrcTime = ref<string>("0.1s");
//动画开始位置（百分比）
let yrcStartPrecent = ref<string>("0%");

let close = () => {
  openLyric.value = false;
};

//监听时间
watch(
  () => lrcWords.value,
  (val) => {
    yrcStartPrecent.value = "0%";
    yrcLoad.value = false;
    val.forEach((item) => {
      if (item.show) {
        yrcTime.value = item.currentTime / 1000 + "s";
      }
      yrcLoad.value = true;
    });
  }
);

watch(
  () => audioTime.value,
  (val) => {
    lrcWords.value.forEach((item) => {
      if (item.show) {
        let percent = (Number(val) - item.startTime / 1000) / (item.currentTime / 1000);
        nextTick(() => {
          yrcStartPrecent.value = parseInt(String(percent * 100)) + "%";
        });
      }
    });
  }
);

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

  if (desktop.value) {
    desktop.value.addEventListener("mousedown", async function (e) {
      let { width: width1, height: height1 } = await window.desktopLyricAPI.getBounds();
      width = width1;
      height = height1;
      switch (e.button) {
        case 0:
          biasX = e.x;
          biasY = e.y;
          desktop.value.addEventListener("mousemove", moveEvent);
          break;
        case 2:
          break;
      }
    });

    desktop.value.addEventListener("mouseup", (e) => {
      biasX = 0;
      biasY = 0;
      desktop.value.removeEventListener("mousemove", moveEvent);
    });
    desktop.value.addEventListener("mouseleave", (e) => {
      biasX = 0;
      biasY = 0;
      desktop.value.removeEventListener("mousemove", moveEvent);
    });
  }
};

onMounted(() => {
  initDrag();
});
</script>

<style lang="scss">
body {
  min-width: 300px;
  min-height: 80px;
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

@keyframes scan {
  0% {
    background-size: 0% 100%;
  }

  100% {
    background-size: 100% 100%;
  }
}

//弹窗歌词
.lyric--words {
  box-sizing: border-box;
  margin: 10px;
  padding: 0 15px;
  font-size: 22px;
  /* color: white; */
  /* text-shadow: 1px 1px 5px #c62f2f, 1px -1px 3px #c62f2f; */

  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
  text-indent: 2px;
  overflow-x: auto;
  text-align: center;
  position: relative;

  .text {
    background: white -webkit-linear-gradient(top, #c62f2f, #c62f2f) no-repeat 0 0;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    transition-timing-function: linear;
    background-size: 0% 100%;
  }

  .t2 {
    position: absolute;
    top: 0;
    z-index: -1;
  }

  .t2 .text {
    text-shadow: 1px 1px 5px #c62f2f, 1px -1px 0px #c62f2f;
  }

  .load {
    background-size: 100% 100%;
    animation: scan v-bind(yrcTime) linear;
  }
}
</style>
