<template>
  <section>
    <tableEmpty v-if="count === 0 && !loading">
      <template #empty
        >未能找到与<span class="like">"{{ keyword }}"</span>相关的任何视频</template
      >
    </tableEmpty>
    <template v-else>
      <div class="info ml_30">找到{{ count }}个视频</div>
      <div class="list ml_30">
        <VideoPreviewListItem
          v-for="item in videoList"
          :key="item.vid"
          :search="keyword"
          :item="item"
          :contextMenu="contextMenuVideoList"
        />
      </div>
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="48"
        :pager-count="9"
        :hide-on-single-page="count <= 48"
        layout="prev, pager, next"
        :total="count"
        class="pagination"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { getSearch } from "@/api/api_search";
import { contextMenuVideoList } from "@/contextMenu/video/normal";
import { videoRelatedRecommendItem } from "i/api/api_video";
import { useRoute } from "vue-router";

let elMessage = inject("message") as any;
let route = useRoute();
let offset = 0;
let count = ref<number>(0);
let videoList = ref<videoRelatedRecommendItem[]>([]);
let currentPage = ref<number>(1);
let loading = ref<boolean>(true);

let keyword = computed(() => {
  return String(route.query.keyword) || "";
});

let getVideoList = async () => {
  try {
    let {
      result: { videoCount, videos },
    } = await getSearch(String(route.query.keyword), 1014, 48, offset);
    if (videoCount && videos?.length) {
      count.value = videoCount;
      videoList.value = videos;
    }
  } catch (e: any) {
    elMessage.error("获取专辑列表失败");
  } finally {
    loading.value = false;
  }
};

watch(currentPage, (val) => {
  offset = val * 48 - 48;
  getVideoList();
});

//监听当前的keyword
watch(
  () => route?.query?.keyword,
  () => {
    getVideoList();
  }
);

onActivated(() => {
  getVideoList();
});
</script>

<style scoped lang="scss">
.ml_30 {
  margin-left: 30px;
}

.list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 10px;
  column-gap: 10px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}
</style>
