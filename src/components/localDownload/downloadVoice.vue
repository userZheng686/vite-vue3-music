<template>
  <section>
    <!--播放全部 存储目录 搜索音乐-->
    <div class="manage--btn">
      <div>
        <el-button type="danger" :icon="CaretRight" @click="playAll">播放全部</el-button>
        <span class="save--path">存储目录：{{ download.voiceDir }}</span>
        <span class="open--path blue" @click="openPath(download.voiceDir)">打开目录</span>
      </div>
      <el-input
        v-model="search"
        style="width: 200px"
        placeholder="搜索我下载的声音"
        :suffix-icon="Search"
      />
    </div>
    <LoadingComponent v-if="loading" />
    <LocalEmpty v-else-if="download.completeDownloadVoiceItem.length === 0">
      <template #empty> 还没有下载的声音噢 快去下载吧~ </template>
    </LocalEmpty>
    <div class="voice--label" v-else>
      <span></span>
      <span>声音标题</span>
      <span>主播</span>
      <span>播客</span>
      <span>大小</span>
      <span>下载时间</span>
    </div>
    <div
      style="text-align: center; margin-top: 20px"
      v-if="searchList.length === 0 && search"
    >
      未能找到与"<span class="blue">{{ search }}</span
      >"相关的任何声音
    </div>
    <div
      class="voice--list"
      v-else
      v-for="(item, index) in computedList"
      :key="item.id"
      @contextmenu="contextMenu($event, item)"
      @dblclick="ondblclick(item)"
    >
      <span class="list__index">
        <span
          v-if="computedCurrentSongIsInTablePlayStatus(Number(item.id)) === 'no-play'"
          >{{ index > 10 ? `0${index + 1}` : index + 1 }}</span
        >
        <i
          class="iconfont icon-24gl-volumeHigh"
          style="color: #f56c6c"
          n
          v-if="computedCurrentSongIsInTablePlayStatus(Number(item.id)) === 'play'"
        ></i>
        <i
          class="iconfont icon-24gl-volumeZero"
          style="color: #f56c6c"
          v-else-if="computedCurrentSongIsInTablePlayStatus(Number(item.id)) === 'pause'"
        ></i>
      </span>
      <span class="list__name single-clamp">
        <DefaultImage
          :picUrl="item.album.picUrl"
          :param="100"
          :y="100"
          loadingHeight="50px"
          loadingWidth="50px"
          style="width: 100px; height: 100px"
        />
        <span
          style="margin-left: 10px"
          class="single-clamp"
          v-brightenKeyword:[search,item.name]
        ></span>
      </span>
      <span class="single-clamp">
        <span class="ml2" v-for="(items, index) in item.artists" :key="items.id">
          <span>{{ index > 0 ? " / " : "" }}</span>
          <span
            class="gray"
            @click="jumpUserHomePage(items.id)"
            v-brightenKeyword:[search,items.name]
          ></span>
        </span>
      </span>
      <span
        class="gray single-clamp"
        v-brightenKeyword:[search,item.radio?.name]
        @click="jumpBroadCastDetail(item.radio?.id)"
      ></span>
      <span class="el-table__column__info__auto">{{ item.fileSize }}</span>
      <span class="el-table__column__info__auto">{{
        recentlySongTime(item.downloadTime)
      }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
//导入store里面的playList 主要是播放音乐 添加到列表里面 到时候播放器会自动取值
import { useSongStore } from "@/store/playList";
import { useDownload } from "@/store/download";
import { openPath } from "@/utils/folder";
import { play } from "@/utils/play";
import { recentlySongTime } from "@/utils/filter";
//接口声明
import { SongDetailSongsItem } from "i/api/api_song.d";
//防抖
import { refDebounced } from "@vueuse/core";
import { CaretRight, Search } from "@element-plus/icons-vue";
//右键菜单
import { contextMenuDjProgram } from "@/contextMenu/dj/program";

let download = useDownload();
//路由
let router = useRouter();
//搜索
let search = ref<string>("");
//搜索列表
let searchList = ref<SongDetailSongsItem[]>([]);
let debounced = refDebounced(search, 100);
provide("search", search);
//歌曲列表
let songList = useSongStore();
let loading = ref<boolean>(true);

//计算要展示的列表
let computedList = computed(() => {
  if (search.value.length && searchList.value.length) {
    return searchList.value;
  } else {
    return download.completeDownloadVoiceItem;
  }
});

//监听搜索框
watch(debounced, () => {
  let val = debounced.value;
  //拷贝一份数据 做修改
  let copyList = download.completeDownloadVoiceItem;
  copyList = copyList.filter((item) => {
    let result = false;
    //先遍历名称 看看是否包含
    if (item.name.toLowerCase().includes(val.toLowerCase())) {
      result = true;
    }
    //先遍历ar属性（歌手） 看看是否包含
    item.artists.forEach((items) => {
      if (items.name) {
        if (items.name.toLowerCase().includes(val.toLowerCase())) result = true;
      }
    });
    //在遍历专辑名称 看看是否包含
    if (item.radio?.name) {
      if (item.radio.name.toLowerCase().includes(val.toLowerCase())) result = true;
    }
    return result;
  });
  searchList.value = copyList;
});

//右键菜单
let contextMenu = (event: MouseEvent, item: SongDetailSongsItem) => {
  console.log("item", item);
  contextMenuDjProgram(event, {
    creativeId: item.radio.lastProgramId,
    mainTitle: item.name,
    imageurl: item.album.picUrl,
    radio: item.radio,
    mainSong: item,
  });
};

//双击
let ondblclick = (item: SongDetailSongsItem) => {
  play(download.completeDownloadVoiceItem, item.id);
};

//跳转到播客详情
let jumpBroadCastDetail = (id: number) => {
  if (id) {
    router.push({
      path: "/broadCastDetail",
      query: { id },
    });
  }
};

//跳转到用户空间页面
let jumpUserHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
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

//播放全部
let playAll = () => {
  play(download.completeDownloadVoiceItem, download.completeDownloadVoiceItem[0].id);
};

//设置loading
let setLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  });
};

onActivated(() => {
  setLoading();
  download.updateVoice();
});
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

//标题 列表
.voice--label,
.voice--list {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr 1fr 1fr;
  margin-left: 30px;
  margin-right: 25px;
  width: 100%;
}

//列表
.voice--list {
  height: 100px;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
}

.voice---list:nth-child(odd) {
  background-color: rgb(249, 249, 249);
}

.voice---list:hover {
  background-color: rgb(249, 249, 249);
}

//列表名称 列表索引
.list__name,
.list__index {
  display: flex;
  align-items: center;
}

.list__index {
  justify-content: center;
}
</style>
