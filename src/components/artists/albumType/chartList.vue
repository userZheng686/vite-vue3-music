<template>
  <section class="chart--list">
    <div class="list__item">
      <img src="@/assets/image/top50.jpg" width="150" height="150" alt="top50" />
      <div class="right">
        <div class="title">
          <span class="text">热门50首</span>
          <i
            class="iconfont icon-24gl-playCircle info"
            @click="playSong(hotSongList)"
          ></i>
          <span class="line info">|</span>
          <i class="iconfont icon-shoucang1 info" @click="subHotList"></i>
        </div>
        <CustomElementTable
          :list="computedHotList"
          :isShowLabel="false"
          :index="true"
          :operate="true"
          :pageSize="computedAlbumSongList(hotSongList).length"
          :total="computedAlbumSongList(hotSongList).length"
          :name="true"
          :contextMenu="contextMenuSong"
          :duration="true"
        />
        <div class="gray" @click="isShowAllList = !isShowAllList">
          {{ isShowAllList ? "只查看10首" : "查看全部50首" }}
        </div>
      </div>
    </div>
    <div class="list__item" v-for="item in copyHotAlbumsList" :key="item.id">
      <DefaultImage
        :picUrl="item.picUrl"
        :param="150"
        :y="150"
        loadingWidth="75px"
        loadingHeight="75px"
        style="width: 150px; height: 150px"
        @click="jumpAlbumDetail(item.id)"
      />
      <div class="right">
        <div class="title">
          <span class="text">{{ item.name }}</span>
          <i
            class="iconfont icon-24gl-playCircle info"
            @click="playSong(computedAlbumSongList(hotAlbumsSongList[item.id]))"
          ></i>
          <span v-if="!item.isSub" class="line info">|</span>
          <i
            v-if="!item.isSub"
            class="iconfont icon-shoucang1 info"
            @click="collectAlbum(item)"
          ></i>
        </div>
        <CustomElementTable
          :list="computedAlbumSongList(hotAlbumsSongList[item.id])"
          :isShowLabel="false"
          :index="true"
          :operate="true"
          :pageSize="computedAlbumSongList(hotAlbumsSongList[item.id]).length"
          :total="computedAlbumSongList(hotAlbumsSongList[item.id]).length"
          :name="true"
          :duration="true"
          :contextMenu="contextMenuSong"
        >
          <template #default>
            <div>加载中...</div>
          </template>
        </CustomElementTable>
        <div class="gray" v-if="item.size > 10" @click="jumpAlbumDetail(item.id)">
          查看全部{{ item.size }}首
        </div>
      </div>
    </div>
    <el-button
      v-if="isMore || copyHotAlbumsList.length < hotAlbumsList.length"
      style="margin: 10px auto; display: flex; align-items: center"
      type="danger"
      @click="loadList()"
      >加载更多
    </el-button>
  </section>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { collectAlbumSub, getArtistAlbumSongs } from "@/api/api_album";
import { ArtistAlbumItem } from "i/api/api_album";
import { SongDetailSongsItem } from "i/api/api_song";
import { contextMenuSong } from "@/contextMenu/song/normal";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { play } from "@/utils/play";

let route = useRoute();
let router = useRouter();
let elMessage = inject("message") as any;
let search = ref<string>("");
provide("search", search);

//是否展示全部50首歌曲
let isShowAllList = ref<boolean>(false);
//是否更多
let isMore = inject("isMore") as Ref<boolean>;
//热门歌曲50首
let hotSongList = inject("hotSongList") as Ref<SongDetailSongsItem[]>;
//热门专辑列表
let hotAlbumsList = inject("hotAlbumsList") as Ref<ArtistAlbumItem[]>;
//复制一份热门专辑列表 全部加载太卡了所以用这个方案
let copyHotAlbumsList = ref<ArtistAlbumItem[]>([]);
//热门专辑列表的歌单列表
let hotAlbumsSongList = reactive<{
  [propsname: string]: SongDetailSongsItem[];
}>({});
//收藏弹窗
let songMenu = useSongMenuPopupStore();
//父组件的请求热门专辑列表的方法 因为要从身上进行拷贝
let getArtistAlbumList = inject("getArtistAlbumList") as Function;

//截取热门列表10首
let computedHotList = computed(() => {
  if (isShowAllList.value) {
    return hotSongList.value;
  } else {
    return hotSongList.value.slice(0, 10);
  }
});

//加载列表
let loadList = () => {
  if (hotAlbumsList.value.length <= copyHotAlbumsList.value.length) {
    getArtistAlbumList().then(() => {
      setCopyList();
    });
  } else {
    setCopyList();
  }
};

//设置拷贝列表
let setCopyList = () => {
  let start = copyHotAlbumsList.value.length;
  let end = start + 5;
  copyHotAlbumsList.value = copyHotAlbumsList.value.concat(
    hotAlbumsList.value.slice(start, end)
  );
};

//热门专辑歌单列表
let computedAlbumSongList = computed(() => {
  return function (item: SongDetailSongsItem[]) {
    if (item?.length) {
      return item;
    } else {
      return [];
    }
  };
});

//请求热门专辑歌单列表
let getAlbumSongList = async (id: number) => {
  let { songs, album } = await getArtistAlbumSongs(id);
  songs.forEach((item, index) => {
    item.from = {
      path: "artists",
      name: album.name,
      val: {
        id: album.id,
      },
    };
    item.progress = 0;
  });
  hotAlbumsSongList[id] = songs.slice(0, 10);
};

//收藏专辑
let collectAlbum = async (item: ArtistAlbumItem) => {
  try {
    let res = await collectAlbumSub(item.id, 1);
    item.isSub = !item.isSub;
    elMessage.success("收藏成功");
  } catch (e: any) {
    elMessage.error("收藏专辑失败");
  }
};

//跳转到专辑详情
let jumpAlbumDetail = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};

//播放音乐
let playSong = (list: SongDetailSongsItem[]) => {
  play(list, list[0].id);
};

//收藏热门歌曲
let subHotList = () => {
  songMenu.collectSongIds = hotSongList.value.map((item) => Number(item.id));
  songMenu.collectSongMenuShow = true;
};

watch(
  () => route.query?.id,
  (val) => {
    if (route.name !== "Artists") return;
    copyHotAlbumsList.value = [];
  }
);

watch(
  () => copyHotAlbumsList?.value?.length,
  (val) => {
    let ids = copyHotAlbumsList.value.map((item) => item.id);
    ids = ids.filter((item) => !hotAlbumsSongList[item]);
    ids.forEach(async (item) => {
      getAlbumSongList(item);
    });
  }
);
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
