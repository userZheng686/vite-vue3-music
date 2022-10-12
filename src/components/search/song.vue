<template>
  <section>
    <tableEmpty v-if="count === 0 && !loading">
      <template #empty
        >未能找到与<span class="like">"{{ keyword }}"</span>相关的任何单曲</template
      >
    </tableEmpty>
    <template v-else>
      <div class="info">找到{{ count }}首单曲</div>
      <div class="btn">
        <el-button type="danger" :icon="CaretRight" @click="playAll">播放全部</el-button>
        <el-button :icon="Download" @click="downloadAll">下载全部</el-button>
      </div>
      <CustomElementTable
        :list="songList"
        :index="true"
        :isShowLabel="true"
        :name="true"
        :operate="true"
        :operateLabel="false"
        :album="true"
        :heat="true"
        :duration="true"
        :artist="true"
        layout="fixed"
        :setOrigin="setOrigin"
        :pageSize="50"
        :total="count"
        :turnPage="turnPage"
        :contextMenu="contextMenuPlaylist"
        :isShowSerialNum="true"
        :isSearchPage="true"
      >
        <template #default>
          <div></div>
        </template>
      </CustomElementTable>
    </template>
  </section>
</template>

<script setup lang="ts">
import { getSearch } from "@/api/api_search";
import { SongDetailSongsItem } from "@/interface/api/api_song";
import { play } from "@/utils/play";
import { contextMenuPlaylist } from "@/contextMenu/song/playlist";
//下载音乐
import { downloadMusic } from "@/utils/download";
import { onActivated } from "vue";
import { useRoute } from "vue-router";
import { CaretRight, Download } from "@element-plus/icons-vue";

let elMessage = inject("message") as any;
let route = useRoute();
let count = ref<number>(0);
let offset = 0;
let songList = ref<SongDetailSongsItem[]>([]);
let search = ref<string>("");
let loading = ref<boolean>(true);

provide("search", search);

let setOrigin = () => {};

let keyword = computed(() => {
  return String(route.query.keyword) || "";
});

let getSongList = async () => {
  try {
    let {
      result: { songs, songCount },
    } = await getSearch(String(route.query.keyword), 1, 50, offset);
    search.value = String(route.query.keyword);
    count.value = songCount || 0;
    if (songs?.length) {
      songs?.forEach((item, index) => {
        item.from = {
          path: "/search",
          name: "搜索页",
          val: {
            keyword: route.query.keyword,
            component: "song",
            index: 0,
          },
        };
        item.progress = 0;
        item.status = "play";
        //位置
        item.serialNum = index + 1 + offset;
      });
      songList.value = songs;
    }
  } catch (e: any) {
    elMessage.error("获取列表失败");
  } finally {
    loading.value = false;
  }
}; 

let turnPage = async (page: number) => {
  offset = page * 50 - 50;
  getSongList();
};

//播放全部
let playAll = () => {
  play(songList.value, songList.value[0].id);
};

//下载全部
let downloadAll = () => {
  //找出没有下载过的歌曲 并且歌曲不是vip
  let downloadList = songList.value.filter((item) => {
    if (!item.songUrl && item.fee === 0) {
      return true;
    } else {
      return false;
    }
  });
  downloadList.forEach((item) => {
    downloadMusic(item);
  });
};

//监听当前的keyword
watch(
  () => route?.query?.keyword,
  () => {
    getSongList();
  }
);

onActivated(() => {
  getSongList();
});
</script>

<style scoped>
.btn {
  margin-top: 10px;
}
</style>
