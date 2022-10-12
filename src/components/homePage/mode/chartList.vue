<template>
  <section>
    <div class="list__item" v-for="item in copyList" :key="item.id">
      <DefaultImage
        :picUrl="item.coverImgUrl"
        :param="150"
        :y="150"
        :lazy="false"
        loadingWidth="75px"
        loadingHeight="75px"
        style="width: 150px; height: 150px"
        @click="jumpSongMenuDetail(item.id)"
      />
      <div class="right">
        <div class="title">
          <span class="text">{{ item.name }}</span>
          <i
            class="iconfont icon-24gl-playCircle info"
            @click="playSong(computedPlaylist(chartList[item.id]))"
          ></i>
          <span v-if="isSubscribed(item.subscribed)" class="line info">|</span>
          <i
            v-if="isSubscribed(item.subscribed)"
            class="iconfont icon-shoucang1 info"
            @click="subscribedSongMenu(item)"
          ></i>
        </div>
        <CustomElementTable
          :list="computedPlaylist(chartList[item.id])"
          :isShowLabel="false"
          :index="true"
          :operate="true"
          :pageSize="computedPlaylist(chartList[item.id]).length"
          :total="computedPlaylist(chartList[item.id]).length"
          :name="true"
          :duration="true"
          :contextMenu="contextMenuSong"
        >
          <template #default>
            <div v-if="loading">加载中...</div>
            <div v-else>暂无音乐</div>
          </template>
        </CustomElementTable>
        <div
          class="gray"
          v-if="item.trackCount > 10"
          @click="jumpSongMenuDetail(item.id)"
        >
          查看全部{{ item.trackCount }}首
        </div>
      </div>
    </div>
    <el-pagination
      v-model:currentPage="currentPage"
      :page-size="5"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
      "
      background
      :pager-count="9"
      :hide-on-single-page="list.length <= 5"
      layout="prev, pager, next"
      :total="list.length"
    />
  </section>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { collectSongMenu, getPreviewPlaylist } from "@/api/api_playList";
import { getSongDetail } from "@/api/api_song";
import { playlist } from "i/api/api_playList";
import { SongDetailSongsItem } from "i/api/api_song";
import { contextMenuSong } from "@/contextMenu/song/normal";
import { play } from "@/utils/play";
import { useUserInformation } from "@/store/user";

let route = useRoute();
let router = useRouter();
let user = useUserInformation();
let elMessage = inject("message") as any;
//是否更多
let isMore = inject("isMore") as Ref<boolean>;
let list = inject("list") as Ref<playlist[]>;
let currentPage = ref<number>(1);
let start = ref<number>(0);
let end = ref<number>(5);
let chartList = reactive<{
  [propsname: string]: SongDetailSongsItem[];
}>({});
let search = ref<string>("");
provide("search", search);
let loading = ref<boolean>(true);

//拷贝列表
let copyList = computed(() => {
  return list.value.slice(start.value, end.value);
});

//加载列表
function loadList() {
  loading.value = true;
  copyList.value.forEach(async (copyItem, index2) => {
    let {
      playlist: { trackIds },
    } = await getPreviewPlaylist(copyItem.id);
    if (trackIds?.length) {
      trackIds = trackIds.slice(0, 10);
      let { songs, privileges } = await getSongDetail(
        trackIds.map((item) => item.id).join(",")
      );
      songs.forEach((song, index) => {
        song.from = {
          path: "songMenuDetail",
          name: copyItem.name,
          val: {
            id: copyItem.id,
          },
        };
        song.progress = 0;
        song.status = "play";
        //音质
        song.plLevel = privileges[index].plLevel;
      });
      chartList[copyItem.id] = songs.slice(0, 10);
    }
    if (index2 === copyList.value.length - 1) {
      loading.value = false;
    }
  });
}

//播放音乐
let playSong = (list: SongDetailSongsItem[]) => {
  if (!list.length) return;
  play(list, list[0].id);
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

//歌单列表
let computedPlaylist = computed(() => {
  return function (item: SongDetailSongsItem[]) {
    if (item?.length) {
      return item;
    } else {
      return [];
    }
  };
});

//收藏歌单
let subscribedSongMenu = async (item: playlist) => {
  let collect = item.subscribed ? 2 : 1;
  try {
    let res = await collectSongMenu(collect, item.id);
    item.subscribed = !item.subscribed;
    elMessage.success(`${collect === 2 ? "取消收藏" : "收藏"}成功`);
    user.updateSoneMenu();
  } catch (e: any) {
    elMessage.error(`${collect === 2 ? "取消收藏" : "收藏"}失败`);
  }
};

//是否可以收藏
let isSubscribed = computed(() => {
  return function (subscribed: boolean) {
    return !subscribed && Number(route.query?.id) !== user?.user_profile?.userId;
  };
});

watch(
  () => route.query?.id,
  (val) => {
    if (route.name !== "HomePage") return;
    list.value = [];
    loadList();
  }
);

watch(currentPage, function (page: number) {
  start.value = page * 5 - 5;
  end.value = start.value + 5;
  loadList();
});

watchEffect(() => {
  if (list.value.length) {
    loadList();
  }
});
</script>

<style scoped lang="scss">
.list__item {
  display: flex;
  margin-top: 20px;

  .right {
    margin-left: 60px;
    flex: 1;

    .title {
      font-size: 18px;
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      i {
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
}

.text {
  margin-right: 30px;
}

.line {
  margin-right: 13px;
  margin-left: 13px;
  font-size: 12px;
}
</style>
