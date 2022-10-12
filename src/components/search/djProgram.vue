<template>
  <section>
    <tableEmpty v-if="count === 0 && !loading">
      <template #empty
        >未能找到与<span class="like">"{{ keyword }}"</span>相关的任何声音</template
      >
    </tableEmpty>
    <template v-else>
      <div class="info ml_30">找到{{ count }}个声音</div>
      <div class="btn ml_30">
        <el-button type="danger" :icon="CaretRight" @click="playAll">播放全部</el-button>
        <el-button :icon="Download" @click="downloadAll">下载全部</el-button>
      </div>
      <div
        class="list__item"
        v-for="item in djProgramList"
        :key="item.id"
        @click="playOne(item.mainSong)"
        @contextmenu="
          contextMenuDjProgram($event, {
            creativeId: item.id,
            mainTitle: item.name,
            imageurl: item.coverUrl,
            radio: item.radio,
            mainSong: item.mainSong,
          })
        "
      >
        <DefaultImage
          :picUrl="item.coverUrl"
          loadingWidth="25px"
          loadingHeight="25px"
          :lazy="false"
          class="ml_30"
          style="width: 50px; height: 50px"
        />
        <div class="name gray" v-brightenKeyword:[keyword,item.name]>
          {{ item.name }}
        </div>
        <div class="count info">
          {{ transTime(Number(item.duration / 1000)) }}
        </div>
        <div class="creator info">
          by
          <span class="gray" @click="jumpUserHomePage(item.dj.userId)">{{
            item.dj.nickname
          }}</span>
        </div>
        <div class="playcount info">
          <el-icon><VideoPlay /></el-icon
          ><span class="ml_5">{{ filter(item.adjustedPlayCount) }}</span>
        </div>
      </div>
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="17"
        :pager-count="9"
        :hide-on-single-page="count <= 17"
        layout="prev, pager, next"
        :total="count"
        class="pagination"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { getSearch } from "@/api/api_search";
import { Program } from "i/api/api_radio";
import { filter, transTime } from "@/utils/filter";
import { useRoute, useRouter } from "vue-router";
import { play, playOne } from "@/utils/play";
import { downloadMusic } from "@/utils/download";
import { CaretRight, Download } from "@element-plus/icons-vue";
import { useDownload } from "@/store/download";
import { contextMenuDjProgram } from "@/contextMenu/dj/program";

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let download = useDownload();
let offset = 0;
let count = ref<number>(0);
let djProgramList = ref<Program[]>([]);
let currentPage = ref<number>(1);
let loading = ref<boolean>(true);

let keyword = computed(() => {
  return String(route.query.keyword) || "";
});

let getDjList = async () => {
  try {
    let { data } = await getSearch(String(route.query.keyword), 2000, 17, offset);
    if (data) {
      count.value = data.totalCount;
      djProgramList.value = data.resources.map((item) => item.baseInfo);

      djProgramList.value.forEach((item) => {
        //找到已经下载好的节目索引
        let voiceIndex = download.completeDownloadVoiceItem.findIndex(
          (items) => items.id === item.mainSong.id
        );
        if (voiceIndex !== -1) {
          item.mainSong.songUrl = download.completeDownloadVoiceItem[voiceIndex].songUrl;
          item.mainSong.downloadStatus =
            download.completeDownloadVoiceItem[voiceIndex].downloadStatus;
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
        item.mainSong.radio = item.radio;
        item.mainSong.from = {
          path: "search",
          name: "搜索页",
          val: {
            component: "djProgram",
            index: 7,
            keyword: keyword.value,
          },
        };
        item.mainSong.status = "play";
        item.mainSong.progress = 0;
      });
    }
  } catch (e: any) {
    elMessage.error("获取声音列表失败");
  } finally {
    loading.value = false;
  }
};

//播放全部
let playAll = () => {
  let songList = djProgramList.value.map((item) => item.mainSong);
  play(songList, songList[0].id);
};

//下载全部
let downloadAll = () => {
  let songList = djProgramList.value.map((item) => item.mainSong);
  //找出没有下载过的歌曲 并且歌曲不是vip
  let downloadList = songList.filter((item) => {
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

//跳转到用户空间页面
let jumpUserHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
};

watch(currentPage, (val) => {
  offset = val * 17 - 17;
  getDjList();
});

//监听当前的keyword
watch(
  () => route?.query?.keyword,
  () => {
    getDjList();
  }
);

onActivated(() => {
  getDjList();
});
</script>

<style scoped lang="scss">
.ml_30 {
  margin-left: 30px;
}

.ml_5 {
  margin-left: 5px;
}

.btn {
  margin-top: 10px;
  margin-bottom: 10px;
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
