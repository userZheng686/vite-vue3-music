<template>
  <section>
    <!--收藏专辑-->
    <div class="album--top">
      <div class="album--title">
        收藏的专辑
        <span class="album--subCount">({{ subCount }})</span>
      </div>
      <el-input
        v-model="search"
        style="width: 200px; float: right; margin-right: 25px"
        placeholder="搜索收藏专辑"
        :suffix-icon="Search"
      />
    </div>
    <!--收藏列表-->
    <div class="album--list">
      <div
        class="list__item"
        v-for="item in computedList"
        :key="item.id"
        @contextmenu="contextMenuCollectAlbum($event, item)"
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
          <div class="single-clamp" style="width: 80%" v-title>
            <span
              class="list__item__name gray single-clamp"
              v-brightenKeyword:[search,item.name]
              @click="jumpAlbum(item.id)"
            ></span>
            <span
              v-brightenKeyword:[search,computedAlias(item.alias)]
              v-if="item?.alias?.length"
              style="margin-left: 2px; color: #909399"
            ></span>
          </div>
        </div>
        <div class="list__item__username">
          <template v-for="(items, index) in item.artists" :key="items.id">
            <span>{{ index > 0 ? " / " : "" }}</span>
            <span
              class="gray"
              v-brightenKeyword:[search,items.name]
              v-title
              @click="jumpArtists(items.id)"
            ></span>
          </template>
        </div>
        <div class="list__item__count gray">{{ item.size }}首</div>
      </div>
    </div>
    <LoadingComponent v-if="isLoading" />
    <TableEmpty v-else-if="searchList.length === 0 && search">
      <template #empty>未能找到与"{{ search }}"相关的任何专辑</template>
    </TableEmpty>
    <TableEmpty v-else-if="albumList.length === 0 && !search && !isLoading">
      <template #empty>暂无收藏专辑</template>
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
import { getAlbumSubList } from "@/api/api_album";
import { CollectSubListItem } from "@/interface/api/api_album";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
//防抖
import { refDebounced } from "@vueuse/core";
import {
  contextMenuCollectAlbum,
  refreshCallback,
} from "@/contextMenu/album/collectAlbum";

let elMessage = inject("message") as any;
//loading
let isLoading = ref<boolean>(true);
//收藏专辑数量
let subCount = ref<number>(0);
//专辑列表
let albumList = ref<CollectSubListItem[]>([]);
//搜索过的列表
let searchList = ref<CollectSubListItem[]>([]);
//计算当前展示的列表
let computedList = computed(() => {
  if (search.value.length) {
    return searchList.value;
  } else {
    return albumList.value;
  }
});
//alias
let computedAlias = computed(() => {
  return function (alias: string[]) {
    if (alias.length) {
      return `(${alias.join("")})`;
    }
  };
});
//当前页数
let currentPage = ref<number>(1);
//搜索
let search = ref<string>("");
let debounced = refDebounced(search, 0);
let router = useRouter();

//获取用户收藏的专辑列表
let getUserCollectAlbumList = async () => {
  try {
    let { count, data, hasMore } = await getAlbumSubList(20, currentPage.value * 20 - 20);
    subCount.value = count;
    albumList.value = data;
    isLoading.value = false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取收藏专辑列表失败 请重新访问看看");
  }
};

//跳转
let jumpAlbum = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
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

refreshCallback((id: number) => {
  let index = albumList.value.findIndex((item) => item.id == id);
  if (index !== -1) {
    albumList.value.splice(index, 1);
  }
});

//监听翻页事件
watch(currentPage, async function (page: number) {
  try {
    getUserCollectAlbumList();
  } catch (e: any) {
    elMessage.error(e?.message || "请求失败 ");
  }
});

//监听搜索框
watch(debounced, () => {
  let val = debounced.value;
  //拷贝一份数据 做修改
  let copyList = albumList.value;
  copyList = copyList.filter((item) => {
    let result = false;
    //先遍历名称 看看是否包含
    if (item.name.toLowerCase().includes(val.toLowerCase())) {
      result = true;
    }
    //先遍历ar属性（歌手） 看看是否包含
    item.artists.forEach((items) => {
      if (items.name) {
        if (items.name.toLowerCase().includes(val.toLowerCase())) result = true;
      }
    });
    //在遍历专辑名称 看看是否包含
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
  getUserCollectAlbumList();
});
</script>

<style scoped lang="scss">
.album--top {
  display: flex;
  margin-left: 30px;
  justify-content: space-between;
  align-items: center;
}

.album--title {
  font-weight: bold;
}

.album--subCount {
  font-size: 12px;
  font-weight: normal;
  color: #909399;
}

.album--list {
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
  &::before {
    content: "";
  }
}

.list__item__username {
  width: 30%;
}
</style>
