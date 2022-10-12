<template>
  <section>
    <tableEmpty v-if="count === 0 && !loading">
      <template #empty
        >未能找到与<span class="like">"{{ keyword }}"</span>相关的任何歌手</template
      >
    </tableEmpty>
    <template v-else>
      <div class="info ml_30">找到{{ count }}位歌手</div>
      <div
        class="list__item"
        @contextmenu="contextMenuArtist($event, item)"
        v-for="item in artistList"
        :key="item.id"
        @click="jumpArtists(item.id)"
      >
        <DefaultImage
          :picUrl="item.img1v1Url"
          loadingWidth="25px"
          loadingHeight="25px"
          :lazy="false"
          class="ml_30"
          style="width: 50px; height: 50px"
        />
        <div class="name">
          <span v-brightenKeyword:[keyword,item.name]>{{ item.name }}</span>
          <span class="info" v-if="item?.alias?.length"
            >({{ item.alias.join(",") }})</span
          >
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
import { contextMenuArtist } from "@/contextMenu/artist/normal";
import { ArtistItem } from "i/api/api_artist";
import { useRoute, useRouter } from "vue-router";

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let offset = 0;
let count = ref<number>(0);
let artistList = ref<ArtistItem[]>([]);
let currentPage = ref<number>(1);
let loading = ref<boolean>(true);

let keyword = computed(() => {
  return String(route.query.keyword) || "";
});

let getArtistList = async () => {
  try {
    let {
      result: { artistCount, artists },
    } = await getSearch(String(route.query.keyword), 100, 50, offset);
    if (artistCount && artists?.length) {
      count.value = artistCount;
      artistList.value = artists;
    }
  } catch (e: any) {
    elMessage.error("获取歌手列表失败");
  } finally {
    loading.value = false;
  }
};

//跳转到歌手页
let jumpArtists = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};

onActivated(() => {
  getArtistList();
});

//监听当前的keyword
watch(
  () => route?.query?.keyword,
  () => {
    getArtistList();
  }
);

watch(currentPage, (val) => {
  offset = val * 50 - 50;
  getArtistList();
});
</script>

<style scoped lang="scss">
.ml_30 {
  margin-left: 30px;
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
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}
</style>
