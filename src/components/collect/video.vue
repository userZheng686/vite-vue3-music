<template>
  <section>
    <!--收藏视频-->
    <div class="video--top">
      <div class="video--title">
        收藏的视频
        <span class="video--subCount">({{ list.length }})</span>
      </div>
      <el-input
        v-model="search"
        style="width: 200px; float: right; margin-right: 25px"
        placeholder="搜索我收藏的视频"
        :suffix-icon="Search"
      />
    </div>
    <!--视频列表-->
    <div v-if="!loading" class="video--list">
      <InfiniteList
        :hasMore="hasmore"
        :request="getUserCollectVideoList"
        columns="1fr 1fr 1fr 1fr"
        rows=""
      >
        <videoPreviewListItem
          v-for="(item, index) in computedList"
          :key="index"
          :contextMenu="contextMenu"
          :item="item"
          :search="search"
        />
      </InfiniteList>
    </div>
    <LoadingComponent v-if="loading" />
    <TableEmpty v-else-if="searchList.length === 0 && search">
      <template #empty>未能找到与"{{ search }}"相关的任何视频</template>
    </TableEmpty>
    <TableEmpty v-else-if="list.length === 0 && !search && !loading">
      <template #empty>暂无收藏视频</template>
    </TableEmpty>
  </section>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { getVideoSubList } from "@/api/api_video";
import { VideoSubListItem } from "i/api/api_video.d";
//防抖
import { refDebounced } from "@vueuse/core";
import { contextMenuCollectMVList, refreshCallback as refreshCallbackMV } from "@/contextMenu/mv/collectMV";
import { contextMenuCollectVideoList, refreshCallback as refreshCallbackVideo } from "@/contextMenu/video/collectVideo";

//当前页数
let currentPage = ref<number>(1);
//搜索
let search = ref<string>("");
let debounced = refDebounced(search, 0);
//loading
let loading = ref<boolean>(true);
//是否更多
let hasmore = ref<boolean>(false);
//list
let list = ref<VideoSubListItem[]>([]);
let searchList = ref<VideoSubListItem[]>([]);

let elMessage = inject("message") as any;

//获取用户收藏的歌手列表
let getUserCollectVideoList = async () => {
  try {
    let { data, hasMore } = await getVideoSubList(
      20,
      currentPage.value * 20 - 20
    );
    if (data.length) {
      hasmore.value = hasMore;
      list.value.push(...data);
      currentPage.value += 1;
    }
    loading.value = false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取收藏歌手列表失败 请重新访问看看");
  }
};
//计算当前展示的列表
let computedList = computed(() => {
  if (search.value.length) {
    return searchList.value;
  } else {
    return list.value;
  }
});

//右键菜单
let contextMenu = async (
  event: MouseEvent,
  item: VideoSubListItem,
  rubbish: boolean,
  removeCallback: Function
) => {
  event.preventDefault();
  if (item.type === 1) {
    contextMenuCollectVideoList(event, item);
  } else {
    contextMenuCollectMVList(event, item);
  }
};

refreshCallbackMV((vid : string) => {
  let index = list.value.findIndex(item => item.vid === vid)
  if(index !== -1) {
    list.value.splice(index,1)
  }
})

refreshCallbackVideo((vid : string) => {
  let index = list.value.findIndex(item => item.vid === vid)
  if(index !== -1) {
    list.value.splice(index,1)
  }
})

//监听搜索框
watch(debounced, () => {
  let val = debounced.value;
  if (val) {
    //拷贝一份数据 做修改
    let copyList = list.value;
    copyList = copyList.filter((item) => {
      let result = false;
      //先遍历名称 看看是否包含
      if (item.title.toLowerCase().includes(val.toLowerCase())) {
        result = true;
      }
      //先遍历ar属性（歌手） 看看是否包含
      item.creator.forEach((items) => {
        if (items.userName) {
          if (items.userName.toLowerCase().includes(val.toLowerCase()))
            result = true;
        }
      });
      return result;
    });
    searchList.value = copyList;
  } else {
    searchList.value = [];
  }
});

onActivated(() => {
  getUserCollectVideoList();
});
</script>

<style scoped lang="scss">
.video--top {
  display: flex;
  margin-left: 30px;
  justify-content: space-between;
  align-items: center;
}

.video--title {
  font-weight: bold;
}

.video--subCount {
  font-size: 12px;
  font-weight: normal;
  color: #909399;
}

.video--list {
  margin-left: 30px;
  margin-right: 25px;
}
</style>
