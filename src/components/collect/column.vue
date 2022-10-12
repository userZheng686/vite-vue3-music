<template>
  <section>
    <!--收藏列表-->
    <div class="column--top">
      <div class="column--title">
        收藏的专栏
        <span class="column--subCount">({{ subCount }})</span>
      </div>
      <el-input
        v-model="search"
        style="width: 200px; float: right; margin-right: 25px"
        placeholder="搜索收藏专栏"
        :suffix-icon="Search"
      />
    </div>
    <!--收藏列表-->
    <div class="column--list">
      <div
        class="list__item"
        @click="jumpTopic(item.id)"
        v-for="item in computedList"
        :key="item.id"
        @contextmenu="contextMenuColumn($event, item)"
      >
        <div style="display: flex; align-items: center; margin-left: 30px; width: 50%">
          <DefaultImage
            style="width: 80px; height: 80px"
            :picUrl="item.rectanglePicUrl"
            loadingWidth="40px"
            loadingHeight="40px"
            :param="80"
            :y="80"
          />
          <div class="single-clamp" style="width: 80%">
            <span
              class="list__item__name gray single-clamp"
              v-brightenKeyword:[search,item.title]
            ></span>
          </div>
        </div>
        <div
          class="list__item__username gray"
          v-brightenKeyword:[search,computedAuthor(item.author)]
          @click.stop.prevent="jumpUserHomePage(item.userId)"
        ></div>
        <div class="list__item__count">阅读 {{ item.readCount }}</div>
      </div>
    </div>
    <LoadingComponent v-if="isLoading" />
    <TableEmpty v-else-if="searchList.length === 0 && search">
      <template #empty>未能找到与"{{ search }}"相关的任何专辑</template>
    </TableEmpty>
    <TableEmpty v-else-if="columnList.length === 0 && !search && !isLoading">
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
import { getColumnSubList } from "@/api/api_column";
import { ColumnSubListItem } from "i/api/api_column.d";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
//防抖
import { refDebounced } from "@vueuse/core";
import { contextMenuColumn } from "@/contextMenu/column/normal";

let elMessage = inject("message") as any;

//loading
let isLoading = ref<boolean>(true);
//收藏专辑数量
let subCount = ref<number>(0);
//专辑列表
let columnList = ref<ColumnSubListItem[]>([]);
//搜索过的列表
let searchList = ref<ColumnSubListItem[]>([]);
//路由
let router = useRouter();
//计算当前展示的列表
let computedList = computed(() => {
  if (search.value.length) {
    return searchList.value;
  } else {
    return columnList.value;
  }
});
//author
let computedAuthor = computed(() => {
  return function (author: string) {
    return `by ${author}`;
  };
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

//获取用户收藏的专辑列表
let getUserCollectAlbumList = async () => {
  try {
    let { count, data, hasMore } = await getColumnSubList(
      20,
      currentPage.value * 20 - 20
    );
    subCount.value = count;
    columnList.value = data;
    isLoading.value = false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取收藏专辑列表失败 请重新访问看看");
  }
};

//跳转
let jumpTopic = (id: number) => {
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(`https://music.163.com/#/topic?id=${id}`);
  } else {
    window.open(`https://music.163.com/#/topic?id=${id}`);
  }
};

//跳转到用户空间页面
let jumpUserHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
};

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
  let copyList = columnList.value;
  copyList = copyList.filter((item) => {
    let result = false;
    //先遍历名称 看看是否包含
    if (item.title.toLowerCase().includes(val.toLowerCase())) {
      result = true;
    }
    if (item.author.toLowerCase().includes(val.toLowerCase())) {
      result = true;
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
.column--top {
  display: flex;
  margin-left: 30px;
  justify-content: space-between;
  align-items: center;
}

.column--title {
  font-weight: bold;
}

.column--subCount {
  font-size: 12px;
  font-weight: normal;
  color: #909399;
}

.column--list {
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
  color: #909399;
}

.list__item__count {
  color: #909399;
}
</style>
