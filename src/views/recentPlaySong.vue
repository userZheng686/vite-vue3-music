<template>
  <!--最近播放-->
  <div class="recent--playSong">
    <!--最近播放标题-->
    <div class="playSong--title">
      <div class="title_left">
        <span class="recent">最近播放</span>
        <span class="total">共{{ historyList.length }}首</span>
      </div>
      <div class="title_right blue" @click="historyList = []">清空列表</div>
    </div>
    <!--最近播放 播放全部-->
    <div class="playSong--play">
      <el-button @click="play(historyList,historyList[0].id)" type="danger" :icon="CaretRight" :disabled="historyList.length === 0">播放全部</el-button>
    </div>
    <!--最近播放列表-->
    <CustomElementTable
      v-if="historyList.length"
      :list="historyList"
      :index="true"
      :contextMenu="contextMenu"
      :isShowLabel="true"
      :name="true"
      :artist="true"
      layout="fixed"
      :setOrigin="setOrigin"
      :recentlyPlayed="true"
      :total="historyList.length"
      :pageSize="100"
    >
      <template #default>
        <div></div>
      </template>
    </CustomElementTable>
    <TableEmpty v-else>
      <template #empty>你还没播放任何音乐</template>
    </TableEmpty>
  </div>
</template>

<script setup lang="ts">
import { getRecentSong } from "@/api/api_record";
import { getSongDetail } from "@/api/api_song";
import { play } from "@/utils/play";
import { CaretRight } from "@element-plus/icons-vue";
//接口声明
import { SongDetailSongsItem } from "i/api/api_song.d";
import { historyList } from "@/localStorage/init";
import { contextMenuRecentlyPlaySong } from "@/contextMenu/song/recentlyPlaySong";
import { contextMenuRecentlyPlayProgram } from "@/contextMenu/dj/recentlyPlayProgram";

let message = inject("message") as any;
let search = ref<string>("");
provide("search", search);

//设置来源
let setOrigin = (row: SongDetailSongsItem) => {};

//右键菜单
let contextMenu = (event : MouseEvent,item : SongDetailSongsItem,index : number) => {
  if(item.radio) {
    contextMenuRecentlyPlayProgram(event,item)  
  } else {
    contextMenuRecentlyPlaySong(event,item)
  }
  console.log('item',item)
}
</script>

<style lang="scss" scoped>
//最近播放
.recent--playSong {
  flex: 1;
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
}

//最近播放标题
.playSong--title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  margin-left: 30px;
  margin-top: 20px;
}

//最近播放标题左边
.title_left {
  flex: 1;

  .recent {
    font-size: 24px;
    font-weight: bold;
    margin-right: 15px;
  }

  .total {
    color: #909399;
  }
}

//清空列表
.title_right {
  margin-right: 20px;
  cursor: pointer;
}

//最近播放 按钮
.playSong--play {
  width: 95%;
  margin-left: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
