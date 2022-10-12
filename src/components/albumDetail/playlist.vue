<template>
  <div class="playlist">
    <CustomElementTable
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
      :pageSize="playList.length"
      :total="playList.length"
      :contextMenu="contextMenuAlbum"
      :isShowSerialNum="true"
      :heat="true"
    >
      <template #default>
        <LoadingComponent v-if="loading" />
      </template>
    </CustomElementTable>
    <AlbumEmpty v-if="!loading && !playList.length" />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { SongDetailSongsItem } from "i/api/api_song.d";
import { contextMenuAlbum } from "@/contextMenu/song/album";
import { useRouter } from "vue-router";

let router = useRouter();

let playList = inject("playList") as Ref<SongDetailSongsItem[]>;
let loading = ref<boolean>(true);

watchEffect(() => {
  if (playList.value.length) {
    loading.value = false;
  }
});

let setOrigin = () => {};
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
