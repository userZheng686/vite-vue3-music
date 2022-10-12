<template>
  <section>
    <tableEmpty v-if="count === 0 && !loading">
      <template #empty
        >未能找到与<span class="like">"{{ keyword }}"</span>相关的任何专辑</template
      >
    </tableEmpty>
    <template v-else>
      <div class="info ml_30">找到{{ count }}张专辑</div>
      <div
        class="list__item"
        v-for="item in albumList"
        :key="item.id"
        @click="jumpAlbumDetail(item.id)"
        @contextmenu="contextMenuAlbum($event, item)"
      >
        <DefaultImage
          :picUrl="item.blurPicUrl"
          loadingWidth="25px"
          loadingHeight="25px"
          :lazy="false"
          class="ml_30"
          style="width: 50px; height: 50px"
        />
        <div class="name">
          <span class="gray" v-brightenKeyword:[keyword,item.name]>{{ item.name }}</span>
          <span v-if="item?.alias?.length" class="info">({{ item.alias.join("") }})</span>
        </div>
        <div class="artist">
          <span
            class="gray"
            v-brightenKeyword:[keyword,item.artist.name]
            @click.stop.prevent="jumpArtists(item.artist.id)"
            >{{ item.artist.name }}</span
          >
          <span class="info" v-if="item.artist?.alias?.length"
            >({{ item.artist.alias.join(",") }})</span
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
import { contextMenuAlbum } from "@/contextMenu/album/normal";
import { Album } from "i/api/api_album";
import { useRoute, useRouter } from "vue-router";

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let offset = 0;
let count = ref<number>(0);
let albumList = ref<Album[]>([]);
let currentPage = ref<number>(1);
let loading = ref<boolean>(true);

let keyword = computed(() => {
  return String(route.query.keyword) || "";
});

let getAlbumList = async () => {
  try {
    let {
      result: { albumCount, albums },
    } = await getSearch(String(route.query.keyword), 10, 50, offset);
    if (albumCount && albums?.length) {
      count.value = albumCount;
      albumList.value = albums;
    }
  } catch (e: any) {
    elMessage.error("获取专辑列表失败");
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

//跳转到专辑详情
let jumpAlbumDetail = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};

watch(currentPage, (val) => {
  offset = val * 50 - 50;
  getAlbumList();
});

//监听当前的keyword
watch(
  () => route?.query?.keyword,
  () => {
    getAlbumList();
  }
);

onActivated(() => {
  getAlbumList();
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
    width: 50%;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}
</style>
