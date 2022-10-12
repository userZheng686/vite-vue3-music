<template>
  <div
    class="mini--dialog"
    ref="desktop"
    @contextmenu.prevent.stop="contextMenuMiniWrap($event)"
  >
    <div class="control">
      <DefaultImage
        :picUrl="computedPicUrl"
        :param="56"
        :y="56"
        loadingWidth="28px"
        loadingHeight="28px"
        style="width: 56px; height: 56px; border-right: 1px solid #eee; min-width: 56px"
      />
      <div
        class="info__wrapper mr15"
        @mouseenter="isShowBtnGroups = true"
        @mouseleave="isShowBtnGroups = false"
      >
        <div class="info single-clamp" v-show="!isShowBtnGroups">
          <div v-if="isPlay" class="single-clamp">
            <div v-if="isLightMusic"><span class="title">纯音乐，请欣赏</span></div>
            <div v-else-if="computedList.length === 0">{{ computedName }}</div>
            <template v-for="(item, index) in computedList" :key="index">
              <div class="single-clamp">
                {{ item.text.replace(/\[.*\]/, "") }}
              </div>
            </template>
          </div>
          <div v-else>
            <div class="single-clamp">
              <span>{{ computedName }}</span>
              <span class="info">{{ computedAlias(list[currentListIndex]) }}</span>
            </div>
            <div class="single-clamp">
              <span class="ml2" v-for="(items, index) in computedArtists" :key="items.id">
                <span>{{ index > 0 ? " / " : "" }}</span>
                <span class="gray">{{ items.name }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="btn__group" v-show="isShowBtnGroups || list.length === 0">
          <div class="btn__linear" @click="setPrevSong" title="上一首">
            <i class="iconfont icon-shangyishou"></i>
          </div>
          <div
            class="btn__linear"
            @click="setPlayMusic"
            :title="isPlay ? '暂停' : '播放'"
          >
            <i
              class="iconfont"
              :class="{ 'icon-bofang': !isPlay, 'icon-zanting': isPlay }"
            ></i>
          </div>
          <div class="btn__linear" @click="setNextSong" title="下一首">
            <i class="iconfont icon-xiayishou"></i>
          </div>
        </div>
      </div>
      <div class="icon mr15">
        <i
          :class="{
            'icon-xihuan1': !computedIsLike,
            'icon-xihuanfill like': computedIsLike,
          }"
          class="iconfont"
          v-if="computedIsSong"
          @click="setOperateMusic"
        ></i>
        <i
          class="iconfont"
          :class="{
            'icon-31dianzan': !computedIsRadioLiked,
            'icon-dianzan_kuai like': computedIsRadioLiked,
          }"
          v-if="computedIsRadio"
          @click="setOperateRadio"
        ></i>
        <i
          class="iconfont icon-shanchu"
          v-if="computedIsFm"
          title="垃圾箱"
          @click="rubbish"
        ></i>
        <el-popover trigger="hover" placement="top" :width="160">
          <el-slider
            size="small"
            v-model="volumn"
            style="width: 100%; margin-right: 20px"
          />
          <template #reference>
            <i class="iconfont icon-yinliang" title="音量"></i>
          </template>
        </el-popover>
        <i
          class="iconfont icon-24gf-playlistMusic2"
          title="显示列表"
          @click="listVisible = !listVisible"
        ></i>
        <div class="btn">
          <el-icon title="关闭" @click="close">
            <Close />
          </el-icon>
          <el-icon title="完整模式" @click="main">
            <FullScreen />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="list" :class="{ show: listVisible }">
      <div
        v-for="(item, index) in list"
        :key="item.id"
        @dblclick="dblclick(index)"
        class="list--item single-clamp"
        @contextmenu.prevent.stop="contextMenuMini($event, item, index)"
      >
        <i
          class="iconfont like"
          :class="{ 'icon-bofang': !isPlay, 'icon-zanting': isPlay }"
          :style="{ opacity: index == currentListIndex ? '' : '0' }"
        ></i>
        <span class="item__name">{{ item.name }}</span>
        <span class="info single-clamp">{{ computedAlias(item) }}</span>
        <div class="info--voice mr3" v-if="item.radio">
          <span>声音</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { contextMenuMini, contextMenuMiniWrap, getCommentInfo } from "@/contextMenu/mini";
import {
  list,
  currentListIndex,
  isPlay,
  lrcWords,
  volumn,
  likes,
  isLightMusic,
  changeMode,
} from "@/localStorage/init";
import {
  playSong,
  setNextSong,
  setPlayMusic,
  setPrevSong,
  setOperateRadio,
  setOperateMusic,
} from "@/localStorage/set";
import { SongDetailSongsItem } from "i/api/api_song";
import { fmTrash } from "@/api/api_private";

const desktop = ref<null | HTMLElement>(null);

let router = useRouter();
let listVisible = ref<boolean>(false);
let isShowBtnGroups = ref<boolean>(false);

let computedPicUrl = computed(() => {
  if (list.value[currentListIndex.value]?.album) {
    return list.value[currentListIndex.value]?.album?.picUrl;
  } else if (list.value[currentListIndex.value]?.al) {
    return list.value[currentListIndex.value]?.al?.picUrl;
  } else {
    return "";
  }
});

let computedName = computed(() => {
  return list.value[currentListIndex.value]?.name || "";
});

let computedAlias = computed(() => {
  return function (item: SongDetailSongsItem) {
    if (item?.alias?.length) {
      return `(${item.alias?.join("")})`;
    } else if (item?.tns?.length) {
      return `(${item.tns?.join("")})`;
    } else if (item?.alia?.length) {
      return `(${item.alia?.join("")})`;
    } else if (item?.transName) {
      return `(${item.transName})`;
    } else {
      return "";
    }
  };
});

let computedIsSong = computed(() => {
  let item = list.value[currentListIndex.value];
  if (item) {
    if (!item.radio) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});

let computedIsRadio = computed(() => {
  let item = list.value[currentListIndex.value];
  if (item?.radio) {
    return true;
  } else {
    return false;
  }
});

let computedIsRadioLiked = computed(() => {
  let item = list.value[currentListIndex.value];
  if (item?.liked) {
    return true;
  } else {
    return false;
  }
});

let computedIsLike = computed(() => {
  let item = list.value[currentListIndex.value];
  if (item) {
    return likes.value.includes(Number(item.id)) || false;
  } else {
    return false;
  }
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

let computedList = computed(() => {
  return lrcWords.value.filter((item) => item.show);
});

let computedIsFm = computed(() => {
  let from = list.value[currentListIndex.value]?.from;
  if (from) {
    if (from.name === "私人FM") return true;
    else return false;
  } else {
    return false;
  }
});

let initDrag = async function () {
  let { width, height } = await window.desktopLyricAPI.getBounds();
  let biasX = 0;
  let biasY = 0;

  const moveEvent = (e: MouseEvent) => {
    window.desktopMiniAPI.setBounds({
      x: e.screenX - biasX,
      y: e.screenY - biasY,
      width,
      height,
    });
  };

  if (desktop.value) {
    desktop.value.addEventListener("mousedown", async function (e) {
      let { width: width1, height: height1 } = await window.desktopMiniAPI.getBounds();
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

//双击
let dblclick = (index: number) => {
  playSong(index);
};

//垃圾箱
let rubbish = async () => {
  let id = list.value[currentListIndex.value].id;
  if (id) {
    let res = await fmTrash(Number(id), "alg_fm_red_i2i", 3);
    setNextSong();
  }
};

//隐藏弹窗
let close = () => {
  window.desktopMiniAPI.hide();
};

let main = () => {
  changeMode.value = 0;
};

watchEffect(() => {
  if (list.value?.length) {
    let songIds: number[] = [];
    let radioProgramIds: number[] = [];
    list.value.forEach((item) => {
      if (item.radio) {
        radioProgramIds.push(item.radio.programId);
      } else {
        songIds.push(Number(item.id));
      }
    });
    getCommentInfo(4, songIds, router);
    getCommentInfo(1, radioProgramIds, router);
  }
});

onMounted(() => {
  initDrag();
});
</script>

<style lang="scss">
body {
  min-width: auto;
  min-height: auto;
}

body::-webkit-scrollbar {
  display: none;
}

.mini--dialog {
  .control {
    margin-top: 80px;
    display: flex;
    align-items: center;
    background: white;
    box-shadow: 0px 0px 0px 1px #ededed inset;

    .info__wrapper {
      width: 180px;
      /* flex: 1; */

      .info {
        transition: all 0.2s;
      }

      .btn__group {
        display: flex;
        align-items: center;
        justify-content: center;

        transition: all 0.2s;

        .btn__linear {
          width: 28px;
          height: 28px;
          min-width: 28px;
        }
      }
    }

    .btn {
      display: flex;
      flex-direction: column;
      align-items: center;

      i {
        margin-bottom: 5px;
      }
    }

    .icon {
      min-width: 100px;
      display: flex;
      align-items: center;
      flex: 1;
      justify-content: space-between;
    }
  }

  .list {
    max-height: 320px;
    background: white;
    width: 100%;
    overflow-y: scroll;
    transition: all 0.2s;
    opacity: 0;
    box-shadow: 0px 0px 0px 1px #ededed inset;

    .list--item {
      padding-top: 5px;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
      font-size: 12px;
      cursor: pointer;

      i {
        margin-left: 5px;
        font-size: 12px;
      }

      .item__name {
        margin-left: 10px;
      }
    }

    .list--item:nth-child(even) {
      background-color: rgb(249, 249, 249);
    }

    .list--item:hover {
      background-color: rgb(249, 249, 249);
    }
  }

  i {
    font-size: 16px;
    cursor: pointer;
  }
}

.mr3 {
  margin-left: 3px;
}

.mr15 {
  margin-left: 15px;
}

.el-slider__bar {
  background: #ec4141;
}

.el-slider__button {
  border: 2px solid #ec4141;
  width: 12px;
  height: 12px;
}

.show {
  opacity: 1 !important;
}

.menus-item {
  width: 150px;
}
</style>
