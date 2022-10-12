<template>
  <!--推荐歌单-->
  <div class="recommend--songMenu">
    <!--标题-->
    <div class="songMenu--title gray" @click="jumpPlaylist">
      <span class="songMenu--text">推荐歌单</span>
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
    <!--列表-->
    <div class="songMenu--list">
      <!--列表卡片-->
      <SongMenuListItem
        v-for="(item, index) in recommendSongMenu.list"
        :key="index"
        :param="1024"
        :y="1024"
        :lazy="false"
        :index="index"
        :item="item"
        :day="day"
        :contextMenu="contextMenu"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { contextMenuRecommendPlaylist } from "@/contextMenu/playlist/daily";
import { contextMenuPlaylist } from "@/contextMenu/playlist/normal";
import { RecommendSongMenuPersonalizedItem } from "i/api/api_playList";
import { useRouter } from "vue-router";
let day = new Date().getDate();
let router = useRouter();

let recommendSongMenu = inject("recommendSongMenu") as {
  list: Array<RecommendSongMenuPersonalizedItem>;
  hover: number;
};

//歌单右键菜单
let contextMenu = (event: MouseEvent, item: any) => {
  if (item.name === "每日歌曲推荐") {
    return contextMenuRecommendPlaylist(event);
  } else {
    return contextMenuPlaylist(event, item, true);
  }
};

let jumpPlaylist = () => {
  router.push({
    path: "/findMusic",
    query: {
      component: "allSongMenu",
      index: 2,
    },
  });
};
</script>

<style scoped lang="scss">
.recommend--songMenu {
  margin-top: 20px;
}

.songMenu--title {
  display: flex;
  align-items: center;
}

.songMenu--text {
  font-weight: 700;
  font-size: 20px;
}

/**推荐歌单 列表 */
.songMenu--list {
  display: grid;
  margin-top: 10px;
  column-gap: 15px;
  row-gap: 10px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

/**推荐歌单 列表 元素*/
.songMenu--list--item {
  display: flex;
  width: 18%;
  margin-top: 10px;
  flex-direction: column;
  cursor: pointer;
}
</style>
