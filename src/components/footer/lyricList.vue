<template>
  <!--字幕-->
  <div
    style="
      height: 38vh;
      width: 40%;
      margin: 50px auto;
      min-width: 400px;
      max-width: 400px;
    "
  >
    <div class="info__lyric" ref="lyricWrap">
      <div
        v-for="(item, index) in props.lrcWords"
        :key="index"
        class="info__lyric__item"
        :class="{
          show: item.show,
        }"
      >
        <span class="lyric__item__time"> {{ computedLyricTime(item.text) }}</span>
        <div class="lyric__item__text">
          <span style="margin-bottom: 5px; display: inline-block">{{
            item.text.replace(/\[.*\]/g, "")
          }}</span>
          <span style="display: inline-block">{{
            diffTranslationLyricTime(item.text)
          }}</span>
        </div>
        <span class="lyric__item__right">
          <el-icon @click="handleJumpAssignLyric(item.text)">
            <CaretRight />
          </el-icon>
        </span>
      </div>
      <div
        style="font-weight: bold; font-size: 18px; margin-top: 100px"
        v-if="props.isLightMusic && props.lrcWords.length === 0"
      >
        纯音乐，请欣赏
      </div>
      <div
        style="font-weight: bold; font-size: 18px; margin-top: 100px"
        v-else-if="props.lrcWords.length === 0"
      >
        还没有歌词呢~
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//从store取数据
import { useSongStore } from "@/store/playList";

interface Props {
  lrcWords: Array<{
    text: string;
    show: boolean;
  }>;
  translateLrcWords: Array<{
    text: string;
    show: boolean;
  }>;
  isLightMusic: boolean;
}

let props = defineProps<Props>();

//store里面的歌曲list
let songList = useSongStore();
//字幕外层
let lyricWrap = ref<null | HTMLDivElement>(null);
//找到show节点
let showIndex = 0;
//当前歌曲播放时间
let currentTime = ref<string>("");

//处理当前字幕时间
let computedLyricTime = computed(() => {
  return function (item: string): string {
    let match = item.match(/\d{2}:\d{2}/g);
    if (match) {
      return match[0];
    } else {
      return "";
    }
  };
});

//计算翻译后的字幕更未翻译的字幕时间是否匹配上?
let diffTranslationLyricTime = (lyric: string) => {
  let result = "";
  let lyricTime = lyric?.match(/\[.*\]/g);
  //根据这个时间去songList.translationLrcWords找
  if (lyricTime) {
    //判断长度是否小于11
    let splitLrc = lyricTime[0].split("");
    let lrc = lyricTime[0];
    if (splitLrc.length < 11) {
      splitLrc.splice(9, 0, "0");
      lrc = splitLrc.join("");
    }
    for (let i = 0; i < props.translateLrcWords.length; i++) {
      if (props.translateLrcWords[i].text.includes(lrc)) {
        result = props.translateLrcWords[i].text.replace(/\[.*\]/g, "");
        break;
      }
    }
  }

  return result;
};

//跳转到指定时间
let handleJumpAssignLyric = (text: string) => {
  let match = text.match(/\d{2}:\d{2}\.\d{1,3}/g);
  if (match) {
    songList.useSkipAssignTime(match[0]);
    songList.list[songList.currentListIndex].status = "play";
  }
};

//如果播放到下一首歌曲 那就置顶
watch(
  () => songList.list[songList.currentListIndex],
  (val) => {
    if (val && lyricWrap.value) {
      lyricWrap.value.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
);

//监听歌曲播放时间 主要是更新字幕位置
watch(
  () => songList.audioStartMill,
  (val) => {
    let match = val.match(/\d{2}:\d{2}/g);
    if (match) {
      val = match[0];
      if (currentTime.value !== val) {
        currentTime.value = val;
      }
    }
    //更新滚动位置
    if (lyricWrap.value) {
      let newIndex = 0;
      //实时计算高度
      let computedHeight = 0;
      for (let i = 0; i < lyricWrap.value.children.length; i++) {
        if (i >= 1) {
          computedHeight += lyricWrap.value.children[i - 1].scrollHeight + 50;
        }

        if (lyricWrap.value.children[i].className.includes("show")) {
          newIndex = i;
          break;
        }
      }
      if (showIndex !== newIndex) {
        showIndex = newIndex;
        lyricWrap.value.scrollTo({ top: computedHeight, behavior: "smooth" });
      }
    }
  }
);
</script>

<style scoped lang="scss">
//字幕
.info__lyric {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
  -webkit-mask-image: linear-gradient(
    180deg,
    hsla(0deg, 0%, 100%, 0),
    hsla(0deg, 0%, 100%, 0.6) 15%,
    #fff 25%,
    #fff 75%,
    hsla(0deg, 0%, 100%, 0.6) 95%,
    hsla(0deg, 0%, 100%, 0)
  );
}

//字幕列表元素
.info__lyric__item:first-child {
  margin-top: 100px;
}

.info__lyric__item {
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
}

.info__lyric__item:hover {
  .lyric__item__time,
  .lyric__item__right {
    opacity: 1;
  }
}

//唱片时间
.lyric__item__time {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s;
}

.lyric__item__time::after {
  content: "";
  width: 40px;
  height: 2px;
  margin-left: 5px;
  background-color: rgb(84, 85, 85, 0.5);
}

.show {
  .lyric__item__text {
    font-weight: bold;
    color: var(--dark-lyric-show, rgba(0, 0, 0, 1)) !important;
    /* font-size: 16px; */
  }
}

.lyric__item__text {
  transition: all 0.2s;
  display: flex;
  text-align: center;
  flex-direction: column;
  color: var(--dark-lyric-text, rgb(86 97 97 / 73%));
}

//唱片字幕右边 箭头
.lyric__item__right {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  transition: all 0.3s;
  opacity: 0;
}

.lyric__item__right::before {
  content: "";
  width: 40px;
  height: 2px;
  margin-left: 5px;
  background-color: rgb(84, 85, 85, 0.5);
}
</style>
