<template>
  <!--正在下载-->
  <div class="download--progress">
    <div class="progress__btn">
      <el-button :icon="Download" @click="start">全部开始</el-button>
      <el-button :icon="VideoPause" @click="pause">全部暂停</el-button>
      <el-button :icon="Delete" @click="clear">清空全部</el-button>
      <span class="save--path">存储目录：{{ download.songDir }}</span>
      <span class="open--path blue" @click="openPath(download.songDir)">打开目录</span>
    </div>
    <!--正在下载 列表-->
    <div class="progress__table">
      <el-table
        v-if="computedList.length"
        :data="computedList"
        :cell-class-name="cellClassName"
        style="width: 100%; flex: 1"
        row-key="id"
        table-layout="fixed"
        @row-dblclick="dbClick"
        :show-header="true"
        lazy
      >
        <el-table-column width="200" type="index"></el-table-column>
        <el-table-column label="音乐标题">
          <template #default="scope">
            <div class="el-table__column__info">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下载速度">
          <template #default="scope">
            <div>
              {{ diskSize(scope.row.downloadReceivedBytes, "M").slice(0, 5) + "MB/S" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下载进度">
          <template #default="scope">
            <el-progress
              style="width: 200px"
              :text-inside="true"
              :stroke-width="32"
              :percentage="scope.row.progress || scope.row.currentProgress"
              :status="
                scope.row.progress === 100 || scope.row.currentProgress === 100
                  ? 'success'
                  : ''
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="下载状态">
          <template #default="scope">
            <div class="el-table__column__info">
              {{ scope.row.downloadStatus }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <LocalEmpty v-if="computedList.length === 0">
        <template #empty> 还没有下载的音乐噢 快去下载吧~ </template>
      </LocalEmpty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { VideoPause, Download, Delete } from "@element-plus/icons-vue";
//歌曲声音MV下载
import { useDownload } from "@/store/download";
//格式化字节
import { diskSize } from "@/utils/filter";
import { openPath } from "@/utils/folder";
//加载回调事件
import { loadIpcRendererCb } from "@/utils/mvDownload";
//歌曲列表声明
import { SongDetailSongsItem } from "i/api/api_song.d";
//mv声明
import { downloadItem } from "i/view/videoDetail.d";

let download = useDownload();
loadIpcRendererCb();

//全部开始
//如果有下载中断的情况  就一个个遍历恢复
let start = () => {
  window.downloadAPI.resume("all");
  if (download.downloadSongsInterrupted.length) {
    download.downloadSongsInterrupted.forEach((item) => {
      window.downloadAPI.resumeInterrupted(JSON.stringify(item));
    });
  }
};

//全部暂停
let pause = () => {
  window.downloadAPI.pause("all");
};

//清空全部
//如果已经下载完成 那就把列表清除
//如果没有下载完成 那么就将文件移除
let clear = async () => {
  //找出没有下载完成的url
  let url: string[] = [];
  download.downloadSongs.forEach((item) => {
    if (item.downloadStatus !== "complete") {
      url.push(item.downloadUrl);
    }
  });
  download.downloadMVs.forEach((item) => {
    if (item.downloadStatus !== "complete") {
      url.push(item.downloadUrl);
    }
  });
  await window.downloadAPI.clear(JSON.stringify(url));
  download.downloadSongs = [];
  download.downloadMVs = [];
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

  if (rowIndex % 2 === 0) {
    cellstyle += "el-table__set__row_bgColor ";
  }

  return cellstyle;
};

//双击
let dbClick = (row: SongDetailSongsItem | downloadItem) => {
  if (row.downloadStatus === "begin" || row.downloadStatus === "resume") {
    window.downloadAPI.pause("single", row.downloadUrl);
  } else if (row.downloadStatus === "pause") {
    window.downloadAPI.resume("single", row.downloadUrl);
  } else if (row.downloadStatus === "interrupted") {
    if (row.id) {
      let index = download.downloadSongsInterrupted.findIndex(
        (item) => item.item.item.id === row.id
      );
      if (index !== -1) {
        //恢复之前下载的数据
        window.downloadAPI.resumeInterrupted(
          JSON.stringify(download.downloadSongsInterrupted[index])
        );
      }
    } else {
      let index = download.downloadMVsInterrupted.findIndex(
        (item) => item.item.item.mvId === row.mvId
      );
      if (index !== -1) {
        //恢复之前下载的数据
        window.downloadAPI.resumeInterrupted(
          JSON.stringify(download.downloadMVsInterrupted[index])
        );
      }
    }
  }
};

//监听download里面的歌曲下载列表
let computedList = computed(() => {
  // progressList.value.push(...download.downloadSongs).push(...download.downloadMVs);
  return download.downloadSongs.concat(download.downloadMVs);
});
</script>

<style scoped lang="scss">
//正在下载
.download--progress {
  margin-top: 20px;
}

//下载按钮
.progress__btn {
  margin-left: 30px;
}

//存储目录
.save--path {
  margin-left: 10px;
}

//打开目录
.open--path {
  margin-left: 10px;
}

//下载列表
.progress__table {
  margin-top: 20px;
}
</style>
