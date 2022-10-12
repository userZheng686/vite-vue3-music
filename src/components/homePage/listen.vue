<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="最近一周" name="week">
      <week></week>
    </el-tab-pane>
    <el-tab-pane label="所有时间" name="all">
      <all></all>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { getUserRecord } from "@/api/api_playList";
import { getSongDetail } from "@/api/api_song";
import { useRoute, useRouter } from "vue-router";
import type { TabsPaneContext } from "element-plus";
import { SongDetailSongsItem } from "i/api/api_song";
import { useUserInformation } from "@/store/user";

let route = useRoute();
let router = useRouter();
let user = useUserInformation();
let elMessage = inject("message") as any;
let activeName = ref<string>("week");
let weekList = ref<SongDetailSongsItem[]>([]);
provide("weekList", weekList);
let allList = ref<SongDetailSongsItem[]>([]);
provide("allList", allList);

let getUserRecordList = async (type: number) => {
  try {
    let { weekData, allData } = await getUserRecord(Number(route.query.id), type);
    let Data = weekData ? weekData : allData;
    if (Data) {
      let ids = Data.map((item) => item.song.id);
      let { songs, privileges } = await getSongDetail(ids.join(","));
      songs.forEach((item, index) => {
        if (Data) {
          item.playCount = Data[index].playCount;
          item.from = {
            path: "homePage",
            name: "听歌排行",
            val: {
              component: "listen",
              index: 2,
              id: Number(route.query.id),
            },
          };
          item.status = "play";
          item.progress = 0;
          //音质
          item.plLevel = privileges[index].plLevel;
        }
      });
      if (type === 1) {
        weekList.value = songs;
      } else {
        allList.value = songs;
      }
    }
  } catch (e: any) {
    elMessage.error("获取听歌排行列表失败");
  }
};

let handleClick = (tab: TabsPaneContext, event: Event) => {
  if (Number(tab.index) === 0) {
    getUserRecordList(1);
  } else {
    getUserRecordList(0);
  }
};

onActivated(() => {
  getUserRecordList(1);
});
</script>

<style scoped></style>
