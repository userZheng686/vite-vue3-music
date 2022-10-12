<template>
  <section>
    <!--收藏歌手-->
    <div class="artist--top">
      <div class="artist--title">
        收藏的歌手
        <span class="artist--subCount">({{ subCount }})</span>
      </div>
      <el-input
        v-model="search"
        style="width: 200px; float: right; margin-right: 25px"
        placeholder="搜索我收藏的歌手"
        :suffix-icon="Search"
      />
    </div>
    <!--收藏列表-->
    <div class="artist--list">
      <div
        class="list__item"
        @click="jumpArtist(item.id)"
        v-for="item in computedList"
        @contextmenu="contextMenuCollectArtist($event, item)"
        :key="item.id"
      >
        <div style="display: flex; align-items: center; margin-left: 30px; width: 50%">
          <DefaultImage
            style="width: 80px; height: 80px"
            :picUrl="item.picUrl"
            loadingWidth="40px"
            loadingHeight="40px"
            :param="80"
            :y="80"
          />
          <div class="single-clamp" style="flex: 1">
            <span
              class="list__item__name gray single-clamp"
              v-brightenKeyword:[search,item.name]
              v-title
            ></span>
            <span
              v-brightenKeyword:[search,computedAlias(item.alias)]
              v-if="item?.alias?.length"
              style="margin-left: 2px; color: #909399"
            ></span>
          </div>
        </div>
        <div class="list__item__album">专辑：{{ item.albumSize }}</div>
        <div class="list__item__mv">MV：{{ item.mvSize }}</div>
      </div>
    </div>
    <LoadingComponent v-if="isLoading" />
    <TableEmpty v-else-if="searchList.length === 0 && search">
      <template #empty>未能找到与"{{ search }}"相关的任何歌手</template>
    </TableEmpty>
    <TableEmpty v-else-if="artistList.length === 0 && !search && !isLoading">
      <template #empty>暂无收藏歌手</template>
    </TableEmpty>
    <!--分页-->
    <div class="page">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="20"
        :pager-count="9"
        :hide-on-single-page="subCount <= 20"
        layout="prev, pager, next"
        :total="subCount"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { getArtistSubList } from "@/api/api_artist";
import { ArtistSubListItem } from "@/interface/api/api_artist";
import { Search } from "@element-plus/icons-vue";
//防抖
import { refDebounced } from "@vueuse/core";
import {
  contextMenuCollectArtist,
  refreshCallback,
} from "@/contextMenu/artist/collectArtist";
let router = useRouter();
let elMessage = inject("message") as any;

//loading
let isLoading = ref<boolean>(true);
//收藏专辑数量
let subCount = ref<number>(0);
//专辑列表
let artistList = ref<ArtistSubListItem[]>([]);
//搜索过的列表
let searchList = ref<ArtistSubListItem[]>([]);
//计算当前展示的列表
let computedList = computed(() => {
  if (search.value.length) {
    return searchList.value;
  } else {
    return artistList.value;
  }
});

//alias
let computedAlias = computed(() => {
  return function (alias: string[]) {
    if (alias.length) {
      return `(${alias[0]})`;
    }
  };
});

//当前页数
let currentPage = ref<number>(1);
//搜索
let search = ref<string>("");
let debounced = refDebounced(search, 0);

//获取用户收藏的歌手列表
let getUserCollectArtistList = async () => {
  try {
    let { count, data, hasMore } = await getArtistSubList(
      20,
      currentPage.value * 20 - 20
    );
    subCount.value = count;
    artistList.value = data;
    isLoading.value = false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取收藏歌手列表失败 请重新访问看看");
  }
};

//跳转
let jumpArtist = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      id,
    },
  });
};

//取消收藏歌手
refreshCallback((id: number) => {
  let index = artistList.value.findIndex((item) => item.id == id);
  if (index != -1) {
    artistList.value.splice(index, 1);
  }
});

//监听翻页事件
watch(currentPage, async function (page: number) {
  try {
    getUserCollectArtistList();
  } catch (e: any) {
    elMessage.error(e?.message || "请求失败 ");
  }
});

//监听搜索框
watch(debounced, () => {
  let val = debounced.value;
  //拷贝一份数据 做修改
  let copyList = artistList.value;
  copyList = copyList.filter((item) => {
    let result = false;
    //先遍历名称 看看是否包含
    if (item.name.toLowerCase().includes(val.toLowerCase())) {
      result = true;
    }
    //遍历alias
    if (item.alias.length) {
      item.alias.forEach((alias) => {
        if (alias.toLowerCase().includes(val.toLowerCase())) result = true;
      });
    }
    return result;
  });
  searchList.value = copyList;
});

onActivated(() => {
  getUserCollectArtistList();
});
</script>

<style scoped lang="scss">
.artist--top {
  display: flex;
  margin-left: 30px;
  justify-content: space-between;
  align-items: center;
}

.artist--title {
  font-weight: bold;
}

.artist--subCount {
  font-size: 12px;
  font-weight: normal;
  color: #909399;
}

.artist--list {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.list__item {
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;

  &:nth-child(odd) {
    background-color: var(--dark-item-backgroundOdd, rgb(250, 250, 250));
  }
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.list__item__name {
  margin-left: 10px;
  color: #909399;
}

.list__item__album,
.list__item__mv {
  width: 30%;
  color: #909399;
}
</style>
