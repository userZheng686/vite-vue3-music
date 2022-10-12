<template>
  <section class="tray">
    <div class="tray-item" :class="{ info: list.length === 0 }" @click="changeMode = 0">
      <i class="left-icon iconfont icon-geren"></i>
      <span>{{ name }}</span>
    </div>
    <div class="tray-item" :class="{ info: list.length === 0 }" @click="changePlay">
      <i class="left-icon iconfont icon-24gl-playCircle"></i>
      <span>{{ isPlay ? "暂停" : "播放" }}</span>
    </div>
    <div
      v-for="(item, index) in menus"
      :key="item.text"
      class="tray-item"
      :class="{
        'tray-item-divider': item.divider,
        info: index < 2 && list.length === 0,
      }"
      @click="item.click()"
    >
      <i :class="leftIcon(item)" class="left-icon"></i>
      <span>{{ text(item) }}</span>
      <i
        :class="item.rightIcon"
        class="right-icon"
        @click.stop.prevent="contextMenu($event, item)"
      ></i>
    </div>
  </section>
</template>

<script setup lang="ts">
import { contextMenuTrayPlayOrder, contextMenuTrayMode } from "@/contextMenu/tray";
import {
  list,
  currentListIndex,
  isPlay,
  isPrevSong,
  isNextSong,
  changeMode,
  rule,
  lockLyric,
  openLyric,
} from "@/localStorage/init";

interface Item {
  leftIcon: string;
  text: string;
  rightIcon: string;
  divider: boolean;
  menuName: string;
  click: Function;
}

let name = computed(() => {
  let text = "";
  if (list.value[currentListIndex.value]) {
    let artistName =
      list.value[currentListIndex.value]?.ar?.map((item) => item.name).join("/") ||
      list.value[currentListIndex.value]?.artists?.map((item) => item.name).join("/");
    text = list.value[currentListIndex.value].name + " - " + artistName;
  } else {
    text = "没有正在播放的音乐";
  }
  return text;
});

//左边的图标
let leftIcon = computed(() => {
  return function (item: Item) {
    if (item.menuName === "mode") {
      let icon = "iconfont icon-";
      switch (changeMode.value) {
        case 0:
          {
            icon += "full";
          }
          break;
        case 1:
          {
            icon += "minimize";
          }
          break;
        case 2:
          {
            icon += "zuixiaohua";
          }
          break;
      }
      return icon;
    } else if (item.menuName === "order") {
      let icon = "iconfont icon-";
      switch (rule.value) {
        case "0":
          {
            icon += "shunxubofang";
          }
          break;
        case "1":
          {
            icon += "liebiaoxunhuan";
          }
          break;
        case "2":
          {
            icon += "hanhan-01-01";
          }
          break;
        case "3":
          {
            icon += "22_suijibofang";
          }
          break;
      }
      return icon;
    } else {
      return item.leftIcon;
    }
  };
});

//中间文字
let text = computed(() => {
  return function (item: Item) {
    if (item.menuName === "mode") {
      let title = "";
      switch (changeMode.value) {
        case 0:
          {
            title += "完整模式";
          }
          break;
        case 1:
          {
            title += "mini模式";
          }
          break;
        case 2:
          {
            title += "最小化";
          }
          break;
      }
      return title;
    } else if (item.menuName === "order") {
      let title = "";
      switch (rule.value) {
        case "0":
          {
            title += "顺序播放";
          }
          break;
        case "1":
          {
            title += "列表循环";
          }
          break;
        case "2":
          {
            title += "单曲循环";
          }
          break;
        case "3":
          {
            title += "随机播放";
          }
          break;
      }
      return title;
    } else if (item.menuName === "lockLyric") {
      return lockLyric.value ? "解锁桌面歌词" : "锁定桌面歌词";
    } else if (item.menuName === "openLyric") {
      return openLyric.value ? "关闭桌面歌词" : "打开桌面歌词";
    } else {
      return item.text;
    }
  };
});

//菜单
let menus = ref<Array<Item>>([
  {
    leftIcon: "iconfont icon-shangyishou-yuanshijituantubiao",
    text: "上一首",
    rightIcon: "",
    divider: false,
    menuName: "",
    click: () => {
      if (!list.value.length) return;
      isPrevSong.value = true;
    },
  },
  {
    leftIcon: "iconfont icon-xiayishou-yuanshijituantubiao",
    text: "下一首",
    rightIcon: "",
    divider: true,
    menuName: "",
    click: () => {
      if (!list.value.length) return;
      isNextSong.value = true;
    },
  },
  {
    leftIcon: "iconfont icon-hanhan-01-01",
    text: "单曲循环",
    rightIcon: "iconfont icon-bofang",
    divider: false,
    menuName: "order",
    click: () => {},
  },
  {
    leftIcon: "iconfont icon-zuixiaohua",
    text: "最小化",
    rightIcon: "iconfont icon-bofang",
    divider: false,
    menuName: "mode",
    click: () => {},
  },
  {
    leftIcon: "iconfont icon-dakai",
    text: "打开桌面歌词",
    rightIcon: "",
    divider: false,
    menuName: "openLyric",
    click: () => {
      if (!list.value[currentListIndex.value]) return;
      openLyric.value = !openLyric.value;
    },
  },
  {
    leftIcon: "iconfont icon-lock",
    text: "锁定桌面歌词",
    rightIcon: "",
    divider: true,
    menuName: "lockLyric",
    click: () => {
      lockLyric.value = !lockLyric.value;
    },
  },
  {
    leftIcon: "iconfont icon-tuichu",
    text: "退出",
    rightIcon: "",
    divider: false,
    menuName: "",
    click: () => {
      window.desktopMainAPI.exit();
    },
  },
]);

let changePlay = () => {
  if (!list.value.length) return;
  isPlay.value = !isPlay.value;
};

let contextMenu = (event: MouseEvent, item: Item) => {
  if (!item.rightIcon) return;
  if (item.menuName === "order") {
    return contextMenuTrayPlayOrder(event);
  } else {
    return contextMenuTrayMode(event);
  }
};
</script>

<style lang="scss">
.tray {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.tray-item {
  flex: 1;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;

  .divider {
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #eee;
  }

  &:hover {
    background-color: rgb(241, 242, 243);
  }
}

.tray-item-divider {
  border-bottom: 1px solid #eee;
}

.left-icon {
  margin-right: 10px;
}

.right-icon {
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
