<template>
  <section>
    <div class="recommend__top">
      <i class="iconfont day" :class="'icon-rili' + day"></i>
      <div class="title">
        <div class="daily">每日歌曲推荐</div>
        <div class="info">根据你的音乐口味生成，每天6:00更新</div>
      </div>
    </div>
    <div class="recommend__button">
      <el-button type="danger" :icon="CaretRight" @click="playAll">播放全部</el-button>
      <el-button @click="subAll">
        <el-icon>
          <Star />
        </el-icon>
        <span>收藏全部</span>
      </el-button>
    </div>

    <CustomElementTable
      :list="list"
      :index="true"
      :isShowLabel="true"
      :name="true"
      :operate="true"
      :album="true"
      :duration="true"
      :artist="true"
      layout="fixed"
      :setOrigin="setOrigin"
      :pageSize="50"
      :total="list.length"
      :contextMenu="contextMenu"
      :isShowSerialNum="true"
    >
      <template #default>
        <loadingComponent v-if="loading" />
        <div></div>
      </template>
    </CustomElementTable>
  </section>
</template>

<script setup lang="ts">
//播放方法
import { play } from "@/utils/play";
import { getRecommendSongs } from "@/api/api_playList";
import {
  CaretRight,
  Star,
  Share,
  StarFilled,
  Download,
  Search,
} from "@element-plus/icons-vue";
import { SongDetailSongsItem } from "i/api/api_song";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { loginCallback } from "@/utils/login";
import { contextMenuSong } from "@/contextMenu/song/normal";

//收藏弹窗
let songMenu = useSongMenuPopupStore();
let elMessage = inject("message") as any;
let loading = ref<boolean>(true);
let list = ref<SongDetailSongsItem[]>([]);
let search = ref<string>("");
provide("search", search.value);
let offset = 0;

//日期
let day = new Date().getDate();

let getRecommendSongsList = async () => {
  try {
    let { recommend } = await getRecommendSongs(offset);
    recommend.forEach((item) => {
      item.from = {
        path: "recommendPlaylist",
        name: "每日歌曲推荐",
      };
      item.progress = 0;
    });
    list.value = recommend;
    loading.value = false;
  } catch (e: any) {
    elMessage.error(e?.message || "请求每日歌曲推荐失败");
  }
};

let setOrigin = () => {};

//播放全部
let playAll = () => {
  play(list.value, list.value[0].id);
};

//收藏全部
let subAll = () => {
  loginCallback(() => {
    songMenu.collectSongIds = list.value.map((item) => Number(item.id));
    songMenu.collectSongMenuShow = true;
  });
};

//菜单
let contextMenu = (event: MouseEvent, row: SongDetailSongsItem, index: number) => {
  return contextMenuSong(event, row, [], false);
};

onActivated(() => {
  getRecommendSongsList();
});
</script>

<style scoped lang="scss">
.recommend__top,
.recommend__button {
  margin-left: 30px;
  margin-top: 20px;
  display: flex;
  align-items: center;

  .day {
    font-size: 72px;
    color: rgb(236, 65, 65);
  }

  .title {
    margin-left: 10px;

    .daily {
      font-size: 24px;
      font-weight: bold;
    }
  }
}
</style>
