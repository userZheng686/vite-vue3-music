<template>
  <section>
    <tableEmpty v-if="count === 0 && !loading">
      <template #empty
        >未能找到与<span class="like">"{{ keyword }}"</span>相关的任何歌单</template
      >
    </tableEmpty>
    <template v-else>
      <div class="info ml_30">找到{{ count }}个歌单</div>
      <div
        class="list__item"
        v-for="item in playList"
        :key="item.id"
        @contextmenu="contextMenuPlaylist($event, item, false)"
        @click="jumpSongMenuDetail(item.id)"
      >
        <DefaultImage
          :picUrl="item.coverImgUrl"
          loadingWidth="25px"
          loadingHeight="25px"
          :lazy="false"
          class="ml_30"
          style="width: 50px; height: 50px"
        />
        <div class="name gray" v-brightenKeyword:[keyword,item.name]>
          {{ item.name }}
        </div>
        <div class="count info">{{ item.trackCount }}首</div>
        <div class="creator info">
          by
          <span
            class="gray"
            v-brightenKeyword:[keyword,item.creator.nickname]
            @click.stop.prevent="jumpUserHomePage(item.creator.userId)"
            >{{ item.creator.nickname }}</span
          >
        </div>
        <div class="playcount info">
          <el-icon><VideoPlay /></el-icon
          ><span class="ml_5">{{ filter(item.playCount) }}</span>
        </div>
      </div>
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="50"
        :pager-count="9"
        :hide-on-single-page="count <= 50"
        layout="prev, pager, next"
        :total="count"
        class="pagination"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { getSearch } from "@/api/api_search";
import { contextMenuPlaylist } from "@/contextMenu/playlist/normal";
import { filter } from "@/utils/filter";
import { playlist } from "i/api/api_playList";
import { useRoute, useRouter } from "vue-router";

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let offset = 0;
let count = ref<number>(0);
let playList = ref<playlist[]>([]);
let currentPage = ref<number>(1);
let loading = ref<boolean>(true);

let keyword = computed(() => {
  return String(route.query.keyword) || "";
});

let getPlayList = async () => {
  try {
    let {
      result: { playlistCount, playlists },
    } = await getSearch(String(route.query.keyword), 1000, 50, offset);
    if (playlistCount && playlists?.length) {
      count.value = playlistCount;
      playList.value = playlists;
    }
  } catch (e: any) {
    elMessage.error("获取歌单列表失败");
  } finally {
    loading.value = false;
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

//跳转到歌单详情
let jumpSongMenuDetail = (id: number) => {
  router.push({
    path: "/songMenuDetail",
    query: {
      id,
    },
  });
};

watch(currentPage, (val) => {
  offset = val * 50 - 50;
  getPlayList();
});

onActivated(() => {
  getPlayList();
});
</script>

<style scoped lang="scss">
.ml_30 {
  margin-left: 30px;
}

.ml_5 {
  margin-left: 5px;
}

.list__item {
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(245, 245, 245));
  }

  .name {
    margin-left: 10px;
    width: 50%;
  }

  .count {
    width: 20%;
  }

  .creator {
    width: 20%;
  }

  .playcount {
    display: flex;
    align-items: center;
    width: 20%;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}
</style>
