<template>
  <div class="mv--list">
    <InfiniteList
      :hasMore="hasmore"
      :request="getArtistMVList"
      columns="1fr 1fr 1fr 1fr 1fr"
      rows=""
    >
      <ArtistMVListItem
        v-for="item in list"
        :key="item.id"
        :item="item"
        titleClass="single-clamp"
        paddingBottom="70%"
        :contextMenu="contextMenuMVList"
      />
    </InfiniteList>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { getArtistMV } from "@/api/api_mv";
import { ArtistMVItem } from "i/api/api_mv";
import { contextMenuMVList } from "@/contextMenu/mv/normal";

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();

let list = ref<ArtistMVItem[]>([]);
let offset = 0;
let hasmore = ref<boolean>(true);
let search = ref<string>("");
provide("search", search);
let getTime = new Date().getTime();

let getArtistMVList = async () => {
  try {
    let { hasMore, mvs, time } = await getArtistMV(Number(route.query.id), offset, 20);
    getTime = time;
    hasmore.value = hasMore;
    list.value = list.value.concat(mvs);
    offset += mvs.length;
  } catch (e: any) {
    elMessage.error("获取视频列表失败");
  }
};

watch(
  () => route.query?.id,
  (newVal, oldVal) => {
    if (route.name !== "Artists") return;
    if (newVal) {
      offset = 0;
      hasmore.value = true;
      list.value = [];
    }
  }
);

onActivated(() => {
  getArtistMVList();
});
</script>

<style scoped lang="scss">
.mv--list {
  margin-right: 20px;
}
</style>
