<template>
  <!--element table封装-->
  <div class="radio--table">
    <el-table
      :data="props.list"
      :cell-class-name="cellClassName"
      style="width: 100%; flex: 1; overflow: scroll"
      row-key="id"
      :table-layout="props.layout"
      @row-dblclick="dbClick"
      @row-contextmenu="contextmenu"
      :show-header="false"
      lazy
    >
      <el-table-column width="50">
        <template #default="scope">
          <span
            class="el-table__column__info"
            v-if="
              computedCurrentSongIsInTablePlayStatus(scope.row?.mainSong?.id) ===
              'no-play'
            "
            >{{ scope.row?.serialNum }}</span
          >
          <i
            class="iconfont icon-24gl-volumeHigh"
            style="color: #f56c6c"
            v-if="
              computedCurrentSongIsInTablePlayStatus(scope.row?.mainSong?.id) === 'play'
            "
          ></i>
          <i
            class="iconfont icon-24gl-volumeZero"
            style="color: #f56c6c"
            v-else-if="
              computedCurrentSongIsInTablePlayStatus(scope.row?.mainSong?.id) === 'pause'
            "
          ></i>
        </template>
      </el-table-column>
      <el-table-column min-width="240">
        <template #default="scope">
          <div class="radio--table__name">
            <PlayImage
              :picUrl="scope.row?.coverUrl"
              :cursor="false"
              :param="60"
              :y="60"
              :width="'60px'"
              :height="'60px'"
            />
            <span style="margin-left: 20px">{{ scope.row?.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="">
        <template #default="scope">
          <div v-if="scope.row?.progress === 100">已播完</div>
          <div class="el-table__column__info" v-else-if="scope.row?.progress">
            已播{{ scope.row?.progress }}%
          </div>
        </template>
      </el-table-column>
      <el-table-column width="">
        <template #default="scope">
          <div style="display: flex; align-items: center" class="el-table__column__info">
            <el-icon><VideoPlay /></el-icon>
            <span style="margin-left: 5px">{{ scope.row?.listenerCount }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="">
        <template #default="scope">
          <div style="display: flex; align-items: center" class="el-table__column__info">
            <i class="iconfont icon-dianzan" :class="{ like: scope.row?.liked }"></i>
            <span style="margin-left: 5px; word-break: normal">{{
              scope.row?.likedCount
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="">
        <template #default="scope">
          <div class="el-table__column__info">
            {{ computedTime(scope.row?.createTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="">
        <template #default="scope">
          <div class="el-table__column__info">
            {{ playTime(scope.row?.duration) }}
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <slot name="default"></slot>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
//导入store里面的playList 主要是播放音乐 添加到列表里面 到时候播放器会自动取值
import { useSongStore } from "@/store/playList";
//导入user store里面的数据 主要用来判断是否是喜欢的音乐 收藏等等
import { useUserInformation } from "@/store/user";
//下载的所有歌曲
import { useDownload } from "@/store/download";
//检查音乐是否可用
import { getSongStatus } from "@/api/api_song";

//接口声明
import { RadioProgramDetailItem } from "i/api/api_radio.d";
//时间处理
import { formDate, playTime } from "@/utils/filter";
import { play } from "@/utils/play";
import { Column } from "element-plus";

//layout 对应table的layout
interface Props {
  layout?: string;
  list: RadioProgramDetailItem[];
  row?: string;
  contextMenu?: Function;
}

let props = withDefaults(defineProps<Props>(), {
  layout: "fixed",
  row: "even",
});

//右键菜单
let contextmenu = (row: RadioProgramDetailItem, column: Column, event: Event) => {
  props.contextMenu && props.contextMenu(event, row);
};

//歌曲列表
let songList = useSongStore();
//用户信息
let userInfo = useUserInformation();
//下载
let download = useDownload();

//双击
let dbClick = async (row: RadioProgramDetailItem) => {
  let mainSong = props.list.map((item) => item.mainSong);
  play(mainSong, row.mainSong.id);
};

//首先先设置索引位置居中 然后单/双行颜色背景
let cellClassName = ({
  columnIndex,
  rowIndex,
}: {
  columnIndex: number;
  rowIndex: number;
}) => {
  let cellstyle = "el-table__set__row__normalheight ";
  if (columnIndex === 0) {
    cellstyle += "el-table__column__center ";
  }

  if (props.row === "odd") {
    if (rowIndex % 2 === 0) {
      cellstyle += "el-table__set__row_bgColor ";
    }
  } else {
    if (rowIndex % 2 === 0) {
      cellstyle += "el-table__set__row_bgColor ";
    }
  }

  return cellstyle;
};

//判断当前播放的歌曲 是否表格里面也有相同的歌曲?是否正在播放 暂停 没有播放?
let computedCurrentSongIsInTablePlayStatus = computed(() => {
  return function (id: number) {
    if (songList.list[songList.currentListIndex]?.id === id) {
      if (songList.list[songList.currentListIndex]?.status === "play") {
        return "play";
      } else if (songList.list[songList.currentListIndex]?.status === "pause") {
        return "pause";
      }
    } else {
      return "no-play";
    }
  };
});

//创建时间
let computedTime = computed(() => {
  return function (item: number) {
    let { y, month, d } = formDate(item);
    return `${y}-${month}-${d}`;
  };
});
</script>

<style scoped lang="scss">
.radio--table {
  overflow-y: scroll;
}

.radio--table__name {
  display: flex;
  align-items: center;
}
</style>
