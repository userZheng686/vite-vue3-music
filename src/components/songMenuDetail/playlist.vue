<template>
  <div class="playlist">
    <loadingComponent v-if="loading" />
    <CustomElementTable
      v-else-if="playList.length"
      :list="playList"
      :index="true"
      :isShowLabel="true"
      :name="true"
      :operate="true"
      :operateLabel="true"
      :album="true"
      :duration="true"
      :artist="true"
      layout="fixed"
      :setOrigin="setOrigin"
      :pageSize="50"
      :total="total"
      :turnPage="turnPage"
      :contextMenu="contextMenuPlaylist"
      :isShowSerialNum="true"
    >
      <template #default>
        <div></div>
      </template>
    </CustomElementTable>
    <SongMenuEmpty
      v-else
      :userId="userInfo?.user_profile?.userId"
      :createUserId="props.detail?.creator.userId"
    >
    </SongMenuEmpty>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { getSongDetail } from "@/api/api_song";
import { playlist } from "i/api/api_playList";
import { SongDetailSongsItem } from "i/api/api_song.d";
import { contextMenuPlaylist, getSongsInfo } from "@/contextMenu/song/playlist";
import { useUserInformation } from "@/store/user";
import { useRouter } from "vue-router";

let router = useRouter();
interface Props {
  detail: playlist;
  getSongMenuDetailInfo: Function;
}

let props = defineProps<Props>();
//用户信息
let userInfo = useUserInformation();
let loading = shallowRef<boolean>(true);

let playList = inject("playList") as Ref<SongDetailSongsItem[]>;

let setOrigin = () => {};

let turnPage = async (page: number) => {
  let trackIds = props.detail.trackIds
    .slice(page * 50 - 50, page * 50)
    .map((item) => item.id);
  let { songs, privileges } = await getSongDetail(trackIds.join(","));
  songs.forEach((item, index) => {
    item.from = {
      name: props.detail.name,
      path: "songMenuDetail",
      val: {
        id: props.detail.id,
      },
    };
    //初始化进度
    item.progress = 0;
    //位置
    item.serialNum = page * 50 + index + 1 - 50;
    //音质
    item.plLevel = privileges[index].plLevel;
  });
  playList.value = songs;
};

let total = computed(() => {
  if (props.detail?.trackIds?.length) {
    return props.detail?.trackIds?.length;
  } else {
    return 0;
  }
});

//侦听用户歌单列表
watchEffect(async () => {
  if (playList.value.length) {
    let ids = playList.value.map((item) => item.id);
    loading.value = false;
    getSongsInfo({
      createUserId: props.detail?.creator.userId,
      playlistId: props.detail?.id,
      refresh: props.getSongMenuDetailInfo,
    });
  } else {
    if (props.detail?.trackIds?.length === 0) {
      loading.value = false;
    }
  }
});
</script>

<style scoped lang="scss">
.playlist {
  margin-left: 30px;
  margin-right: 25px;
}

.context--menu {
  z-index: 2001;
}
</style>
