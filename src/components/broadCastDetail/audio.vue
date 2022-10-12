<template>
  <!--声音-->
  <div class="audio">
    <!--排序-->
    <div
      style="
        margin-left: 30px;
        font-size: 12px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <span>共{{ songList?.radio?.programCount }}期</span>
      <div>
        <span style="margin-right: 5px">排序</span>
        <el-icon
          :class="{ sort_active: !sort }"
          style="cursor: pointer"
          title="降序"
          @click="sort = !sort"
        >
          <SortDown />
        </el-icon>
        <el-icon
          :class="{ sort_active: sort }"
          style="cursor: pointer"
          title="升序"
          @click="sort = !sort"
        >
          <SortUp />
        </el-icon>
      </div>
    </div>
    <div class="currentPlay" v-if="currentPlay.mainSongName">
      <div>上次听到：</div>
      <span class="mr10">{{ currentPlay.mainSongSerialNum }}</span>
      <DefaultImage
        :picUrl="currentPlay.mainSongPicUrl"
        :param="50"
        :y="50"
        loadingWidth="25px"
        :lazy="false"
        loadingHeight="25px"
        style="width: 50px; height: 50px; margin-left: 10px"
      />
      <span class="mr10">{{ currentPlay.mainSongName }}</span>
    </div>
    <RadioElementTable :list="programList" :contextMenu="contextMenu">
      <template #default>
        <div style="display: flex; align-items: center; justify-content: center">
          <el-icon class="is-loading">
            <Loading />
          </el-icon>
          <span style="margin-left: 5px">载入中...</span>
        </div>
      </template>
    </RadioElementTable>
    <!--分页-->
    <div class="page">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="20"
        :pager-count="9"
        :hide-on-single-page="songList?.radio?.programCount <= 20"
        layout="prev, pager, next"
        :total="songList?.radio?.programCount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import { getRadioProgramDetail } from "@/api/api_radio";
import { useSongStore } from "@/store/playList";
import { useDownload } from "@/store/download";
import { radio } from "@/localStorage/init";
import emitter from "@/utils/eventBus";
import { CurrentPlay, RadioItem } from "i/localStorage/interface";
import { RadioProgramDetailItem } from "i/api/api_radio.d";
import { contextMenuDjProgram } from "@/contextMenu/dj/program";

let route = useRoute();
let songList = useSongStore();
let download = useDownload();
let elMessage = inject("message") as any;

//节目列表
let programList = inject("programList") as Ref<RadioProgramDetailItem[]>;
//当前页数
let currentPage = ref<number>(1);
//排序(默认降序)
let sort = ref<boolean>(false);
//rid
let rid = 0;
//上次播放
let currentPlay = reactive<CurrentPlay>({
  mainSongId: 0,
  mainSongName: "",
  mainSongPicUrl: "",
  mainSongSerialNum: 0,
  progress: 0,
});

let contextMenu = (event: MouseEvent, row: RadioProgramDetailItem) => {
  return contextMenuDjProgram(event, {
    creativeId: row.id,
    mainTitle: row.name,
    imageurl: row.coverUrl,
    radio: row.radio,
    mainSong: row.mainSong,
  });
};

//获取电台节目详情
let getBroadCastProgramDetail = async () => {
  try {
    let radioItem: undefined | RadioItem;
    if (radio) {
      radioItem = radio.value[rid];
      if (radioItem?.currentPlay) {
        Object.assign(currentPlay, radioItem.currentPlay);
      }
    }

    let res = await getRadioProgramDetail(
      rid,
      20,
      currentPage.value * 20 - 20,
      sort.value
    );
    programList.value = res.programs;
    programList.value.forEach((item) => {
      item.mainSong.from = {
        path: "broadCastDetail",
        name: item.radio.name,
        val: {
          id: Number(route.query.id),
        },
      };
      //找到已经下载好的节目索引
      let voiceIndex = download.completeDownloadVoiceItem.findIndex(
        (items) => items.id === item.mainSong.id
      );
      if (voiceIndex !== -1) {
        item.mainSong.songUrl = download.completeDownloadVoiceItem[voiceIndex].songUrl;
        item.mainSong.downloadStatus =
          download.completeDownloadVoiceItem[voiceIndex].downloadStatus;
        // item.mainSong.from.path = "本地";
      }

      //是否点赞
      item.mainSong.liked = item.liked;
      //图片
      item.mainSong.album.picUrl = item.coverUrl;
      //名字
      // item.mainSong.artists[0].name = item.radio.name;
      //电台
      item.mainSong.radio = item.radio;
      //电台节目id
      item.mainSong.radio.programId = item.id;
      //节目收听数量
      item.mainSong.radio.listenerCount = item.listenerCount;
      //发布时间
      item.mainSong.radio.scheduledPublishTime = item.scheduledPublishTime;
      //设置播放进度
      if (radioItem && radioItem?.program[item.id]) {
        item.progress = radioItem.program[item.id].progress;
      } else {
        item.progress = 0;
      }
      //记录上次的播放进度
      item.mainSong.lastProgress = item.progress;
      //电台节目序号
      item.mainSong.serialNum = item.serialNum;
    });
  } catch (e: any) {
    elMessage.error(e?.message || "获取电台详情失败 请重新打开页面试试");
  }
};

onActivated(() => {
  if (route.query.id) {
    rid = Number(route.query.id);
  } else {
    rid = Number(songList?.radio?.id);
  }
  //重置上次播放
  Object.assign(currentPlay, {
    mainSongId: 0,
    mainSongName: "",
    mainSongPicUrl: "",
    mainSongSerialNum: 0,
    progress: 0,
  });
  currentPage.value = 1;
  getBroadCastProgramDetail();
});

//监听翻页事件
watch(currentPage, async function (page: number) {
  try {
    getBroadCastProgramDetail();
  } catch (e: any) {
    elMessage.error(e?.message || "请求失败 ");
  }
});

//监听是升序还是降序
watch(sort, function (val) {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  } else {
    getBroadCastProgramDetail();
  }
});

//更新节目是否点赞
emitter.on("updateProgramLike", function (item) {
  let { id, liked } = item as { id: number; liked: boolean };
  programList.value.forEach((item) => {
    if (item.radio.programId === id) {
      item.liked = liked;
      liked ? item.likedCount++ : item.likedCount--;
    }
  });
});

//更新节目播放次数
emitter.on("updateProgramListenCount", function (item) {
  let { id, count } = item as { id: number; count: number };
  programList.value.forEach((item) => {
    if (item.radio.programId === id) {
      item.listenerCount = count;
    }
  });
});

//更新当前播放进度
emitter.on("updateProgramProgress", function (item) {
  let { id, progress } = item as { id: number; progress: number };
  programList.value.forEach((item) => {
    if (item.radio.programId === id) {
      item.progress = progress;
      item.mainSong.lastProgress = progress;
    }
  });
});
</script>

<style scoped lang="scss">
.page {
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sort_active {
  background-color: gray;
  cursor: pointer;
}

//上次播放
.currentPlay {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.mr10 {
  margin-left: 10px;
}
</style>
