<template>
  <section>
    <!--播放全部 存储目录 搜索音乐-->
    <div class="manage--btn">
      <div>
        <el-button type="danger" :icon="CaretRight" @click="playAll">播放全部</el-button>
        <span class="save--path">存储目录：{{ download.songDir }}</span>
        <span class="open--path blue" @click="openPath(download.songDir)">打开目录</span>
      </div>
      <el-input
        v-model="search"
        style="width: 200px"
        placeholder="搜索我下载的音乐"
        :suffix-icon="Search"
      />
    </div>
    <LoadingComponent v-if="loading" />
    <CustomElementTable
      v-else-if="download.completeDownloadSongItem.length"
      :list="download.completeDownloadSongItem"
      :index="true"
      :operate="false"
      :operateLabel="false"
      :isShowLabel="true"
      nameMaxWidth="10vw"
      :downloadTime="true"
      :name="true"
      :album="true"
      :contextMenu="contextMenu"
      :size="true"
      :artist="true"
      layout="fixed"
      :total="download.completeDownloadSongItem.length"
      :pageSize="download.completeDownloadSongItem.length"
      :setOrigin="setOrigin"
    >
      <template #default> </template>
    </CustomElementTable>
    <LocalEmpty v-else-if="download.completeDownloadSongItem.length === 0">
      <template #empty> 还没有下载的歌曲噢 快去下载吧~ </template>
    </LocalEmpty>
  </section>
</template>

<script setup lang="ts">
import { useDownload } from "@/store/download";
import { play } from "@/utils/play";
import emitter from "@/utils/eventBus";
import { openPath } from "@/utils/folder";
//防抖
import { refDebounced } from "@vueuse/core";
import { CaretRight, Search } from "@element-plus/icons-vue";
import { contextMenuSong } from "@/contextMenu/song/normal";
import { SongDetailSongsItem } from "@/interface/api/api_song";

//加载
let loading = ref<boolean>(true);
let download = useDownload();

//对播放的歌曲进行一层封装
let setOrigin = () => {};

//设置loading
let setLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  });
};

onActivated(() => {
  download.updateSong();
  setLoading();
});

//搜索
let search = ref<string>("");
provide("search", search);

let debounced = refDebounced(search, 100);

//播放全部
let playAll = () => {
  play(download.completeDownloadSongItem, download.completeDownloadSongItem[0].id);
};

//监听搜索框
watch(debounced, () => {
  let val = debounced.value;
  if (val === "") {
    emitter.emit("search", {
      list: [],
    });
  } else {
    //拷贝一份数据 做修改
    let copyList = download.completeDownloadSongItem;
    copyList = copyList.filter((item) => {
      let result = false;
      //先遍历名称 看看是否包含
      if (item.name.toLowerCase().includes(val.toLowerCase())) {
        result = true;
      }
      //先遍历ar属性（歌手） 看看是否包含
      item.ar.forEach((items) => {
        if (items.name) {
          if (items.name.toLowerCase().includes(val.toLowerCase())) result = true;
        }
      });
      //在遍历专辑名称 看看是否包含
      if (item.al.name) {
        if (item.al.name.toLowerCase().includes(val.toLowerCase())) result = true;
      }
      return result;
    });
    emitter.emit("search", {
      list: copyList,
    });
  }
});

//右键菜单
let contextMenu = ($event: MouseEvent, row: SongDetailSongsItem, index: number) => {
  contextMenuSong($event, row, [], false);
};
</script>

<style scoped lang="scss">
//播放全部 存储的路径 搜索音乐
.manage--btn {
  margin-top: 20px;
  margin-left: 30px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 25px;
}

//存储目录
.save--path {
  margin-left: 10px;
}

//打开目录
.open--path {
  margin-left: 10px;
}
</style>
