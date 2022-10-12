<template>
  <!--精品歌单-->
  <div class="elite--songMenu">
    <!--标题 & 标签-->
    <div class="elite--songMenu--tag">
      <span class="elite--songMenu--tag--title">
        <el-icon style="cursor: pointer" @click="returnAllSongMenu">
          <ArrowLeft />
        </el-icon>
        精品歌单
      </span>
      <el-select
        v-model="eliteSongMenuTag.check"
        filterable
        @change="checkTag"
        placeholder="Select"
      >
        <el-option
          v-for="item in eliteSongMenuTag.tags"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </div>
    <!--列表-->
    <div class="elite--songMenu--list">
      <el-skeleton :rows="3" animated :loading="eliteSongMenu.isLoading">
        <!--骨架屏-->
        <template #template>
          <!--骨架屏 列表-->
          <div class="el-skeleton--list">
            <!--骨架屏 列表元素-->
            <div class="el-skeleton--list__item" v-for="(item, index) in 20" :key="index">
              <!--骨架屏 列表元素 封面-->
              <el-skeleton-item variant="image" class="el-skeleton--list__item__left" />
              <!--骨架屏 列表元素 右边-->
              <div class="el-skeleton--list__item__right">
                <el-skeleton-item
                  variant="text"
                  class="el-skeleton--list__item__right__name"
                />
                <el-skeleton-item
                  variant="text"
                  class="el-skeleton--list__item__right__name"
                />
                <el-skeleton-item
                  variant="text"
                  class="el-skeleton--list__item__right__name"
                />
              </div>
            </div>
          </div>
        </template>
        <template #default>
          <!--无限列表-->
          <InfiniteList
            :request="getEliteList"
            rows="1fr 1fr "
            columns="1fr 1fr 1fr"
            :hasMore="eliteSongMenu.hasMore"
          >
            <!--无限列表 元素-->
            <div
              class="elite--list__item"
              v-for="(item, index) in eliteSongMenu.list"
              :key="item.id"
            >
              <!--无限列表 元素 左边-->
              <div class="elite--list__item__left">
                <SongMenuListItem
                  :isShowName="false"
                  :item="item"
                  :index="index + 1"
                  :lazy="false"
                  :noMinHeight="true"
                  :noHeight="true"
                  :param="134"
                  :y="134"
                  :isElite="true"
                  :contextMenu="contextMenuPlaylist"
                />
              </div>
              <!--无限列表 元素 右边 名字 用户名 标签 文案-->
              <div class="elite--list__item__right single-clamp">
                <div class="elite--list__item__right__name single-clamp">
                  {{ item.name }}
                </div>
                <div class="elite--list__item__right__nickname">
                  <span>by </span>
                  <span class="gray" @click="jumpHomePage(item.creator.userId)">{{ item.creator.nickname }}</span>
                </div>
                <div class="elite--list__item__right__tag">
                  <span
                    class="elite--list__item__right__tag__wrap"
                    v-if="eliteSongMenuTag.check === '全部歌单'"
                    >{{ item.tag }}</span
                  >
                  <span
                    v-if="item.copywriter"
                    class="elite--list__item__right__tag__copywriter gray single-clamp"
                    >{{ item.copywriter }}</span
                  >
                </div>
              </div>
            </div>
          </InfiniteList>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { getEliteSongMenuTag, getEliteSongMenu } from "@/api/api_playList";
import { EliteSongMenuTagItem, EliteSongMenuItem } from "i/api/api_playList.d";
import { contextMenuPlaylist } from "@/contextMenu/playlist/normal";
import { ArrowLeft } from "@element-plus/icons-vue";
//路由实例
let route = useRoute();
let router = useRouter();

let elMessage: any = inject("message") as any;

//精品歌单分类标签
let eliteSongMenuTag = reactive<{
  check: string;
  tags: Array<EliteSongMenuTagItem>;
}>({
  check: "全部歌单",
  tags: [{ id: 1, name: "全部歌单" }],
});

//精品歌单列表
let eliteSongMenu = reactive<{
  isLoading: boolean;
  list: Array<EliteSongMenuItem>;
  hasMore: boolean;
  limit: number;
  before: number;
  total: number;
}>({
  isLoading: true,
  list: [],
  hasMore: true,
  limit: 10,
  before: 0,
  total: 20,
});

/**请求所有歌单分类 */
let getEliteSongMenuTagList = async () => {
  try {
    let res = await getEliteSongMenuTag();
    if (res.tags) {
      eliteSongMenuTag.tags.push(...res.tags);
    }
  } catch (e: any) {
    elMessage.error(e?.message || "请求所有歌单分类失败 请检查你的网络是否有问题?");
  }
};

/**请求精品歌单列表 */
let getEliteList = async () => {
  try {
    let res = await getEliteSongMenu(
      eliteSongMenuTag.check,
      eliteSongMenu.limit,
      eliteSongMenu.before
    );
    //精准控制每次请求的数量 每次都按20请求
    if (res.total && eliteSongMenu.total !== res.total) {
      eliteSongMenu.total = res.total;
      let limit = res.total - eliteSongMenu.list.length;
      if (limit > 10) {
        eliteSongMenu.limit += 10;
      } else {
        eliteSongMenu.limit = limit;
      }
    }
    if (res.playlists.length) {
      eliteSongMenu.list.push(...res.playlists);
      eliteSongMenu.before = res.playlists[res.playlists.length - 1].updateTime;
    }
    eliteSongMenu.hasMore = res.more;
    if (eliteSongMenu.isLoading) {
      setTimeout(() => {
        eliteSongMenu.isLoading = false;
      }, 100);
    }
  } catch (e: any) {
    elMessage.error(e?.message || "请求精品歌单列表失败 请检查你的网络是否有问题?");
  }
};

let setupCurrentUrl = () => {
  if (route.query.tag) {
    handleCurrentUrl(String(route.query.tag));
  }
};

//处理当前的路由参数
let handleCurrentUrl = (tag: string) => {
  //骨架屏不加载了 一加载element就有bug 只能等fix了
  eliteSongMenuTag.check = tag;
  eliteSongMenu.isLoading = true;
  eliteSongMenu.list = [];
  eliteSongMenu.limit = 20;
  eliteSongMenu.before = 0;
  eliteSongMenu.total = 20;
  getEliteList();
};

/**选择分类 */
let checkTag = () => {
  router.replace({
    path: "/findMusic",
    query: {
      component: "eliteSongMenu",
      index: 2,
      tag: eliteSongMenuTag.check,
    },
  });
};

//跳转到用户主页
let jumpHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
      id,
      component: "createPlaylist",
      index: 0,
    },
  });
};


watch(
  () => route.query,
  (query) => {
    if (query.tag && query.component === "eliteSongMenu") {
      handleCurrentUrl(String(query.tag));
    }
  }
);

//返回全部歌单
let returnAllSongMenu = () => {
  router.go(-1);
};

onMounted(() => {
  getEliteSongMenuTagList();
  setupCurrentUrl();
  getEliteList();
});
</script>

<style scoped lang="scss">
/**精品歌单 */
.elite--songMenu {
  display: flex;
  flex-direction: column;
  height: 600px;
}

/**精品歌单 标签 */
.elite--songMenu--tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/**精品歌单 标题*/
.elite--songMenu--tag--title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

/**封装一些样式 以便复用 */
@mixin list {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 15px;
}

@mixin list__item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  height: 134px;
  overflow: hidden;
}

@mixin list__item__left {
  width: 134px;
  height: 134px;
  margin: auto;
}

@mixin list__item__right {
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: 10px;
  padding-top: 10px;
  margin-left: 20px;
  justify-content: space-between;
}

@mixin list__item__right__name {
  width: 60%;
  height: 20px;
}

/**骨架屏 */
.el-skeleton--list {
  @include list;
}

.el-skeleton--list__item {
  @include list__item;
}

.el-skeleton--list__item__left {
  @include list__item__left;
}

.el-skeleton--list__item__right {
  @include list__item__right;
}

.el-skeleton--list__item__right__name {
  @include list__item__right__name;
}

/**内容区域 */
.elite--list__item {
  @include list__item;
}

.elite--list__item__left {
  @include list__item__left;
}

.elite--list__item__right {
  @include list__item__right;
}

.elite--list__item__right__name {
  @include list__item__right__name;
  width: 100%;
}

.elite--list__item__right__nickname {
  @include list__item__right__name;
}

.elite--list__item__right__tag {
  @include list__item__right__name;
  display: flex;
  width: 100%;
}

.elite--list__item__right__tag__wrap {
  color: red;
  border: 1px solid red;
  padding: 2px;
  font-size: 12px;
}

.elite--list__item__right__tag__copywriter {
  margin-left: 5px;
  width: 100px;
}
</style>
