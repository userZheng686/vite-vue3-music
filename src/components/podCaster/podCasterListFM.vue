<template>
  <div
    class="fm--category"
    :class="[backgroundCurrentClass]"
    v-wheelAntiShake.stop="titleScroll"
    ref="category"
  >
    <div class="category--item__mark">
      <div class="item--mark__10" style="margin-top: 7px"></div>
      <div class="item--mark__20"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__20"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__20"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__20"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__20"></div>
      <div class="item--mark__10"></div>
      <div class="item--mark__active" ref="mark">
        <div class="line"></div>
        <div class="circle"></div>
      </div>
    </div>
    <div class="category--item__title" ref="title">
      <div
        v-for="(item, index) in fm"
        :key="item.id"
        class="item--title"
        :class="{
          'item--active': index === start,
          'item--up': titleStatus[index],
        }"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
  <div class="fm--container" :class="[backgroundCurrentClass]">
    <div class="container--title">随心听</div>
    <div class="container--info">
      <div class="container--info__name">
        <div class="info--name__title">
          {{ playList[currentListIndex]?.name }}
        </div>
        <div class="info--name__from">
          来自播客:
          {{ playList[currentListIndex]?.radio?.name }}
        </div>
      </div>
      <DefaultImage
        :picUrl="playList[currentListIndex]?.radio?.picUrl"
        :params="100"
        class="info--image"
        :y="100"
        loadingWidth="50px"
        loadingHeight="50px"
        style="width: 100px; height: 100px"
        @click="play(playList, playList[currentListIndex]?.id)"
      >
        <template #play>
          <!--播放按钮-->
          <div class="player--circle">
            <i
              class="iconfont icon-bofang"
              style="margin-left: 2px"
              v-show="computedPlayStatus === 'no-play' || computedPlayStatus === 'pause'"
            ></i>
            <img
              src="@/assets/image/live.gif"
              alt=""
              width="20"
              height="20"
              v-show="computedPlayStatus === 'play'"
            />
          </div>
        </template>
      </DefaultImage>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { getRadioVoiceFM, getRadioVoiceScene } from "@/api/api_radio";
//从store取数据
import { useSongStore } from "@/store/playList";
import { SongDetailSongsItem } from "i/api/api_song";
import { play } from "@/utils/play";

let elMessage: any = inject("message") as any;
//store里面的歌曲list
let songList = useSongStore();
//播放列表
let playList = ref<SongDetailSongsItem[]>([]);
//播放索引
let currentListIndex = ref<number>(0);

const category = ref<null | HTMLElement>(null);
const title = ref<null | HTMLElement>(null);
const mark = ref<null | HTMLElement>(null);

const { x, y, isOutside } = useMouseInElement(category);

//背景颜色样式
let backgroundClassName = [
  "fm-background__gray",
  "fm-background__black",
  "fm-background__green",
  "fm-background__blackGreen",
  "fm-background__red",
];
//背景颜色随机
let backgroundCurrentClass = ref<string>("fm-background__gray");
//fm
let fm = ref<
  Array<{
    id: string;
    title: string;
  }>
>([]);
//对应FM里面的title
//起始位置
let start = ref<number>(0);
//是否需要隐藏
let titleStatus = ref<boolean[]>([]);
//红线对应的位置
let markStyle = [
  "translateY(10px)",
  "translateY(44px)",
  "translateY(79px)",
  "translateY(115px)",
  "translateY(150px)",
];

//禁止页面滚动
let stopScroll = function (e: Event) {
  e.preventDefault();
};

//监听标题滚动事件
let titleScroll = (e: WheelEvent) => {
  if (title.value && mark.value) {
    if (e.deltaY < 0) {
      if (start.value > 0) {
        start.value--;
        if ((start.value + 1) % 5 === 0) {
          updateStatusFalse();
        }
        updateBackgroundColor();
      }
    } else {
      if (start.value < fm.value.length - 1) {
        start.value++;
        if (start.value % 5 === 0) {
          updateStatusTrue();
        }
        updateBackgroundColor();
      }
    }
    //设置红线位置
    let transfrom = markStyle[start.value % 5];
    mark.value.style.transform = transfrom;
    //获取列表
    getRadioSceneList();
  }
};

//更新isUp
let updateStatusTrue = () => {
  for (let i = 0; i < start.value; i++) {
    titleStatus.value[i] = true;
  }
};

let updateStatusFalse = () => {
  for (let i = start.value; i >= start.value - 4; i--) {
    titleStatus.value[i] = false;
  }
};

//监听当前播放列表
watch(
  () => songList.list[songList.currentListIndex],
  (val) => {
    if (val && val.radio) {
      let index = playList.value.findIndex((item) => item.id === val.id);
      if (index !== -1) {
        currentListIndex.value = index;
      }
    }
  }
);

//当前播放状态
let computedPlayStatus = computed(() => {
  let item = songList.list[songList.currentListIndex];
  if (item?.radio && item.id === playList.value[currentListIndex.value]?.id) {
    return item.status;
  } else {
    return "no-play";
  }
});

//更改背景颜色
let updateBackgroundColor = () => {
  let index = backgroundClassName.findIndex(
      (item) => item === backgroundCurrentClass.value
    ),
    prev = backgroundCurrentClass.value;
  if (index !== -1) {
    backgroundClassName.splice(index, 1);
  }
  let className =
    backgroundClassName[Math.round(Math.random() * (backgroundClassName.length - 1))];
  backgroundCurrentClass.value = className;
  backgroundClassName.push(prev);
};

//获取电台FM列表
let getRadioFMList = async () => {
  try {
    let res = await getRadioVoiceFM();
    let category = res.data[0].creatives.map((item) => {
      return {
        id: item.creativeId,
        title: item.uiElement.mainTitle.title,
      };
    });
    fm.value.push(...category);
    //找出节目名单
    let djPrograms = res.data[0].creatives[0].creativeExtInfoVO.djPrograms;
    //对节目名单数据进行封装 并填充到songList里面
    djPrograms?.forEach((item) => {
      item.mainSong.from = {
        name: "播客",
        path: "podCaster",
      };
      item.mainSong.status = "play";
      item.mainSong.progress = 0;
      //是否点赞
      item.mainSong.liked = item.liked || false;
      //图片
      item.mainSong.album.picUrl = item.coverUrl;
      //名字
      item.mainSong.artists[0].name = item.radio.name;
      //电台
      item.mainSong.radio = item.radio;
      //电台节目id
      item.mainSong.radio.programId = item.id;
      //节目收听数量
      item.mainSong.radio.listenerCount = item.listenerCount;
      //发布时间
      item.mainSong.radio.scheduledPublishTime = item.scheduledPublishTime;
      playList.value.push(item.mainSong);
      // songList.setSongList(item.mainSong);
    });
    // songList.setListIndex(0);
    titleStatus.value = new Array(category.length);
    titleStatus.value.fill(false);
  } catch (e: any) {
    elMessage.error(e?.message || "请求电台FM列表失败 请检查你的网络是否有问题?");
  }
};

//根据电台id获取FM
let getRadioSceneList = async () => {
  try {
    playList.value = [];
    let {
      data: { list },
    } = await getRadioVoiceScene(fm.value[start.value].id);
    songList.list = [];
    list.forEach((item) => {
      item.mainSong.from = {
        path: "podCaster",
        name: "播客",
      };
      item.mainSong.status = "play";
      item.mainSong.progress = 0;
      //是否点赞
      item.mainSong.liked = item.liked || false;
      //图片
      item.mainSong.album.picUrl = item.coverUrl;
      //名字
      item.mainSong.artists[0].name = item.radio.name;
      //电台
      item.mainSong.radio = item.radio;
      //电台节目id
      item.mainSong.radio.programId = item.id;
      //节目收听数量
      item.mainSong.radio.listenerCount = item.listenerCount;
      item.mainSong.radio = item.radio;
      playList.value.push(item.mainSong);
      // songList.setSongList(item.mainSong);
    });
    // songList.setListIndex(0);
  } catch (e: any) {
    elMessage.error(e?.message || "请求电台FM列表失败 请检查你的网络是否有问题?");
  }
};

watch(
  () => isOutside.value,
  (val) => {
    let poster = document.querySelector(".pod--caster");
    if (poster) {
      if (val) {
        poster.removeEventListener("mousewheel", stopScroll);
      } else {
        poster.addEventListener("mousewheel", stopScroll, { passive: false });
      }
    }
  }
);

getRadioFMList();
</script>

<style scoped lang="scss">
//fm 类别
.fm--category {
  color: white;
  height: 100%;
  width: 168px;
  min-width: 168px;
  transition: all 0.2s;
  overflow: hidden;
  background-image: linear-gradient(90deg, #706561, #6b5c59);
  border-radius: 8px 0px 0px 8px;
  display: flex;
}

//fm 内容区域
.fm--container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding-left: 20px;
  flex: 1;
  border-radius: 0px 8px 8px 0px;
  padding-right: 20px;
}

//fm 内容区域 标题
.container--title {
  margin-bottom: 10px;
  margin-top: 12px;
  color: rgb(199 199 199 / 50%);
}

//fm 内容区域 信息
.container--info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

//fm 内容区域 信息 名字
.container--info__name {
  flex: 1;
}

//fm 内容区域 图片
.info--image {
  width: 100px !important;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

//fm 内容区域 信息 标题
.info--name__title {
  margin-bottom: 10px;
  color: rgba(255, 251, 251, 0.6);
  font-size: 18px;
  height: 50px;
  overflow: hidden;
}

//fm 内容区域 信息 来源
.info--name__from {
  color: rgb(199 199 199 / 50%);
}

//fm 背景颜色
.fm-background__gray {
  background-image: linear-gradient(90deg, #5a595e, #5e5d62);
}

.fm-background__black {
  background-image: linear-gradient(90deg, rgb(63, 60, 60), rgb(78, 78, 75));
}

.fm-background__green {
  background-image: linear-gradient(90deg, rgb(100, 91, 57), rgb(113, 104, 73));
}

.fm-background__red {
  background-image: linear-gradient(90deg, rgb(86, 64, 83), rgb(100, 79, 78));
}

.fm-background__blackGreen {
  background-image: linear-gradient(90deg, rgb(81, 98, 97), rgb(94, 110, 109));
}

//fm 刻度尺
.category--item__mark {
  margin-left: 10px;
  position: relative;
}

//fm 类别 元素
.category--item__title {
  margin-right: 20px;
}

.category--item__title {
  overflow: hidden;
}

//fm 类别 元素 刻度
.item--mark__20 {
  width: 20px;
  background: rgb(145, 134, 136);
  height: 1px;
  margin-top: 6px;
}

.item--mark__10 {
  width: 10px;
  background: rgb(145, 134, 136);
  height: 1px;
  margin-top: 6px;
}

//fm 刻度 激活
.item--mark__active {
  position: absolute;
  transform: translateY(10px);
  top: 0px;
  align-items: center;
  display: flex;
  left: -4px;
}

.item--mark__active .line {
  background: rgb(255, 58, 58);
  height: 2px;

  transition: all 0.35s;
  width: 25px;
}

.item--mark__active .circle {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}

//fm 类别 元素 标题
.item--title {
  margin-left: 20px;
  height: 18%;
  text-align: left;
  margin-top: 4px;
  transition: all 0.2s;
  align-items: center;
}

.item--active {
  font-size: 18px;
  color: rgb(211, 211, 211);
}

//向上移
.item--up {
  display: none;
  /* transform: translateY(-35px); */
}
</style>
