<template>
  <!--本地音乐-->
  <div class="local--music">
    <!--本地音乐 头部-->
    <div class="music--top">
      <span>本地共有{{ file.length }}首歌曲</span>
      <span class="blue" @click="isShowFolderVisible = true">选择目录</span>
    </div>
    <!--本地音乐 按钮 搜索-->
    <div class="music--btn">
      <div style="display: flex; align-items: center">
        <el-button type="danger" :icon="CaretRight" @click="playAll">播放全部</el-button>
        <el-button :icon="Refresh" @click="matchMusic">匹配音乐</el-button>
        <el-progress
          :percentage="progress"
          v-if="isLoading"
          style="width: 200px; margin-left: 10px"
          :status="status"
        />
      </div>
      <el-input
        v-model="search"
        style="width: 200px"
        placeholder="搜索本地音乐"
        :suffix-icon="Search"
      />
    </div>
    <!--列表-->
    <div class="music--list">
      <CustomElementTable
        :list="file"
        :index="true"
        :isShowLabel="true"
        nameMaxWidth="6vw"
        :name="true"
        :album="true"
        :size="true"
        :duration="true"
        :artist="true"
        :contextMenu="contextMenu"
        layout="fixed"
        :setOrigin="setOrigin"
        :total="file.length"
        :pageSize="file.length"
      >
        <template #default>
          <LoadingComponent v-if="loading && !search" />
        </template>
      </CustomElementTable>
    </div>
    <!--audio-->
    <audio class="local--audio" ref="matchAudio" :volume="0.5" :src="firstPath"></audio>
    <CheckFolder />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from "vue";
import { CaretRight, Search, Refresh } from "@element-plus/icons-vue";

import { contextMenuSong } from "@/contextMenu/song/normal";

//用户选择的文件夹
import { useFolder } from "@/store/folder";

//消息通知
import { ElNotification } from "element-plus";

//接口声明
import { SongDetailSongsItem } from "i/api/api_song.d";

//防抖
import { refDebounced } from "@vueuse/core";

//指纹
import { init } from "./useLoadFP";

import { play } from "@/utils/play";

import emitter from "@/utils/eventBus";
import { contextMenuLocalSong } from "@/contextMenu/song/local";

//audio
let matchAudio = ref<null | HTMLAudioElement>(null);

//搜索
let search = ref<string>("");
provide("search", search);
let file = ref<SongDetailSongsItem[]>([]);
//loading
let loading = ref<boolean>(true);
//去重
let duplicate: Array<string | number> = [];
//匹配过后的结果
let matchFile = ref<SongDetailSongsItem[]>([]);
//没有匹配到的结果
let noMatchFile = ref<number>(0);
//是否已经第一次加载init函数
let isFirstInit = false;
//是否在匹配音乐加载中
let isLoading = ref<boolean>(false);
//进度
let progress = ref<number>(0);
//加载的状态
let status = ref<string>("");

//是否有注释（163key  对应网易的歌曲注释）
let have163Key: SongDetailSongsItem[] = [];
let without163Key = ref<SongDetailSongsItem[]>([]);
//第一个音频链接
let firstPath = computed(() => {
  if (without163Key.value.length) {
    return "atom:///" + without163Key.value[0].songUrl;
  }
});

//监听是否匹配完了歌曲信息
watch(
  () => matchFile.value.length,
  (val) => {
    let shouldMatchTotal = file.value.length - have163Key.length;
    progress.value = Number(parseInt(String((val / shouldMatchTotal) * 100)));
    if (val === shouldMatchTotal) {
      status.value = "success";
      let successMatch = matchFile.value.length - noMatchFile.value;
      ElNotification({
        title: "匹配结果",
        message: `一共匹配了${matchFile.value.length}首歌曲,总共有${successMatch}首成功，有${noMatchFile.value}首失败`,
        type: "success",
      });
      have163Key = [];
      without163Key.value = [];
      duplicate = [];
      readDirsFile();
    }
  }
);

//文件夹
let folder = useFolder();

//是否打开选择本地音乐的文件夹
let isShowFolderVisible = ref<boolean>(false);
provide("folderVisible", isShowFolderVisible);

//监听用户选择的文件夹
watch(
  () => folder.checkScanFolder,
  (val) => {
    file.value = [];
    readDirsFile();
  }
);

//常用的音频格式文件
const usuallyAudioForm = [
  "mp3",
  "flac",
  "wav",
  "wmc",
  "midi",
  "ra",
  "ape",
  "aac",
  "cda",
  "mov",
];

//扫描目录 读取文件
//第一步  先将用户目录的文件扫描出来 并做格式化处理（加上绝对路径）
//第二步  将文件详情读取出来
//第三步  比对本地的数据 如果本地有（已经找到了） 那就替换处理 只有音频链接需要读取本地的链接
let readDirsFile = async () => {
  //目录
  let dirFilesName: string[] = [];
  dirFilesName = await normalizeFileName(dirFilesName);
  //flac文件识别不出来 先不处理了
  // let res = await window.readAPI.readMusic(dirFilesName[0]);
  // ("path", dirFilesName[0], res, "res");
  if (dirFilesName.length === 0) {
    loading.value = false;
  } else {
    dirFilesName.forEach(async (item, index) => {
      try {
        //提取专辑 歌名 音频 ...信息
        let obj = await window.readAPI.readFileMusic(dirFilesName[index]);
        obj = JSON.parse(obj);

        if (!duplicate.includes(obj.id)) {
          if (obj.is163key) {
            obj.from = {
              path: "localDownload",
              name: "本地音乐",
              val: {
                type: 2,
              },
            };
            //如果没有163key 那就是需要匹配的信息
            have163Key.push(obj);
          } else {
            obj.from = {
              path: "localDownload",
              name: "本地音乐",
              val: {
                type: 2,
              },
            };
            without163Key.value.push(obj);
          }
          duplicate.push(obj.id);
        }

        if (
          have163Key.length + without163Key.value.length ===
          dirFilesName.length - (dirFilesName.length - duplicate.length)
        ) {
          file.value = have163Key.concat(without163Key.value);
          loading.value = false;
        }
      } catch (e) {}
    });
  }
};

//格式化文件（目录文件）
let normalizeFileName = (dirFilesName: string[]): Promise<string[]> => {
  return new Promise((resolve) => {
    folder.checkScanFolder.forEach(async (item: string, index: number) => {
      let res = await window.readAPI.readDir(item);
      let i = 0;
      res.forEach((items: string, index2: number) => {
        i = index2;
        let type = items.split(".");
        if (usuallyAudioForm.includes(type[type.length - 1])) {
          dirFilesName.push(item + "\\" + items);
        }
      });
      if (index === folder.checkScanFolder.length - 1 && i === res.length - 1) {
        resolve(dirFilesName);
      }
    });
  });
};

let debounced = refDebounced(search, 100);

//监听搜索框
watch(debounced, () => {
  let val = search.value;
  if (val === "") {
    emitter.emit("search", {
      list: [],
    });
  } else {
    //拷贝一份数据 做修改
    let copyList = file.value;
    copyList = copyList.filter((item) => {
      let result = false;
      //先遍历名称 看看是否包含
      if (item?.name.toLowerCase().includes(val.toLowerCase())) {
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

//对播放的歌曲进行一层封装
let setOrigin = () => {};

//匹配音乐
let matchMusic = () => {
  if (matchAudio.value) {
    if (without163Key.value.length && !isFirstInit) {
      isLoading.value = true;
      isFirstInit = true;
      matchAudio.value.play();
      init(without163Key.value, matchFile.value, noMatchFile.value);
    } else {
    }
    // init();
  }
};

//右键菜单
let contextMenu = ($event: MouseEvent, row: SongDetailSongsItem, index: number) => {
  if (typeof row.id === "string") {
    contextMenuLocalSong($event, row);
  } else {
    contextMenuSong($event, row, [], false);
  }
};

//播放全部
let playAll = () => {
  play(file.value, file.value[0].id);
};

onActivated(() => {
  readDirsFile();
});
</script>

<style scoped lang="scss">
//样式复用 头部 按钮
@mixin top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 25px;
}

//本地音乐头部
.music--top {
  @include top;
  margin-left: 30px;
}

//本地音乐 按钮
.music--btn {
  margin-top: 20px;
  @include top;
  margin-left: 30px;
  margin-bottom: 20px;
}
</style>
