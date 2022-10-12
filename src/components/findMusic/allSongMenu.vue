<template>
  <!--所有歌单-->
  <section class="all--songMenu">
    <!--头部 封面-->
    <el-skeleton :rows="3" animated :loading="topBanner.isLoading">
      <!--骨架屏-->
      <template #template>
        <el-skeleton-item class="el-skeleton--banner" variant="image" />
      </template>
      <!--内容区域-->
      <template #default>
        <!--头部 封面-->
        <div
          class="elite--banner"
          :style="hotMenuTag.currentTag === '综艺' ? 'display:none' : ''"
        >
          <!--图片-->
          <DefaultImage
            :picUrl="topBanner.coverImgUrl"
            :param="200"
            class="elite--banner__coverimg"
          />
          <!--精品歌单信息-->
          <div class="elite--banner__right">
            <!--精品歌单 跳转链接-->
            <div class="elite--banner__right__circle">
              <i class="iconfont icon-jingpin"></i>
              <span class="elite--banner__right__circle__title" @click="openEliteSongMenu"
                >精品歌单</span
              >
            </div>
            <!--精品歌单名字-->
            <div class="elite--banner__right__title">{{ topBanner.name }}</div>
            <!--精品歌单文案-->
            <div class="elite--bannedivright__subtitle">
              {{ topBanner.copywriter }}
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
    <!--音乐 所有类型-->
    <el-skeleton :rows="3" animated :loading="hotMenuTag.isLoading">
      <!--骨架屏-->
      <template #template>
        <!--歌单类型-->
        <div class="el-skeleton--tag">
          <el-skeleton-item variant="text" class="el-skeleton--tag__left" />
          <el-skeleton-item variant="text" class="el-skeleton--tag__right" />
        </div>
      </template>
      <!--内容区域-->
      <template #default>
        <!--歌单标签选择-->
        <div class="songMenu--tag">
          <div class="songMenu--chose" @click="openDialogCategory">
            <span style="margin-left: 5px">
              {{ hotMenuTag.currentTag ? hotMenuTag.currentTag : "全部歌单" }}</span
            >
            <el-icon>
              <ArrowRight />
            </el-icon>
          </div>
          <!--热门歌单标签-->
          <div class="songMenu--hotTag">
            <span
              class="gray"
              v-for="(item, index) in hotMenuTag.list"
              :key="index"
              @click="switchSongMenuTag(item.name)"
              >{{ item.name }}</span
            >
          </div>
        </div>
      </template>
    </el-skeleton>
    <!--歌单列表-->
    <el-skeleton :rows="3" animated :loading="songMenu.isLoading">
      <!--骨架屏-->
      <template #template>
        <div class="el-skeleton--menu__list">
          <div
            class="el-skeleton--menu__list__item"
            v-for="(item, index) in 10"
            :key="index"
          >
            <el-skeleton-item
              variant="image"
              class="el-skeleton--menu__list__item__img"
            />
            <el-skeleton-item
              variant="text"
              class="el-skeleton--menu__list__item__title"
            />
          </div>
        </div>
      </template>
      <!--内容区域-->
      <template #default>
        <!--歌单列表-->
        <InfiniteList :request="getHotSongMenuListItem" :hasMore="songMenu.hasMore">
          <div
            class="songMenu--list__item"
            v-for="(item, index) in songMenu.list"
            :key="item.id"
          >
            <SongMenuListItem
              :item="item"
              :index="index + 1"
              :param="194"
              :y="194"
              :lazy="false"
              :contextMenu="contextMenuPlaylist"
            >
              <template #user>
                <div class="songMenu--list__item__user">
                  <el-icon>
                    <User />
                  </el-icon>
                  <!--用户名字-->
                  <span class="single-clamp" style="margin-left: 5px">{{
                    item.creator.nickname
                  }}</span>
                </div>
              </template>
            </SongMenuListItem>
          </div>
        </InfiniteList>
      </template>
    </el-skeleton>
    <SongMenuCategory
      :songMenuCategoryList="songMenuCategoryList"
      :tag="hotMenuTag.currentTag"
    />
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ArrowRight, User } from "@element-plus/icons-vue";
import { contextMenuPlaylist } from "@/contextMenu/playlist/normal";
import {
  getEliteSongMenu,
  getHotSongMenu,
  getFriendEliteSongMenu,
  getSongMenuCategory,
} from "@/api/api_playList";
import {
  HotSongMenuItem,
  FriendEliteSongMenuItem,
  SongMenuCategoryItem,
} from "i/api/api_playList.d";
let elMessage = inject("message") as any;

//路由实例
let route = useRoute();
let router = useRouter();

//是否打开分类弹窗
//v-model会有警告 不要用v-model了
let dialogSongMenuCategoryVisible = ref<boolean>(false);
provide("dialogVisible", dialogSongMenuCategoryVisible);
//所有的歌单分类
let songMenuCategoryList = ref<
  Array<{
    title: string;
    list: SongMenuCategoryItem[];
  }>
>([]);

//头部栏
let topBanner = reactive<{
  isLoading: boolean;
  name: string;
  coverImgUrl: string;
  copywriter: string;
}>({
  isLoading: true,
  name: "",
  coverImgUrl: "",
  copywriter: "",
});

//热门歌单标签
let hotMenuTag = reactive<{
  isLoading: boolean;
  list: Array<HotSongMenuItem>;
  currentTag: string;
}>({
  isLoading: true,
  list: [],
  currentTag: "",
});

//歌单列表
let songMenu = reactive<{
  isLoading: boolean;
  offset: number;
  hasMore: boolean;
  type: string;
  list: Array<FriendEliteSongMenuItem>;
  total: number;
}>({
  isLoading: true,
  offset: 0,
  hasMore: true,
  type: "",
  list: [],
  total: 50,
});

//获取精品歌单
let getEliteSongMenuListItem = async () => {
  try {
    let res = await getEliteSongMenu(hotMenuTag.currentTag, 1);
    if (res.playlists.length) {
      topBanner.name = res.playlists[0].name;
      topBanner.coverImgUrl = res.playlists[0].coverImgUrl;
      topBanner.copywriter = res.playlists[0].copywriter;
    }
    setTimeout(() => {
      topBanner.isLoading = false;
    }, 10);
  } catch (e: any) {
    elMessage.error(e?.message || "请求精品歌单失败 请检查你的网络是否有问题?");
  }
};

//获取热门歌单标签类表
let getHotSongMenuTagList = async () => {
  try {
    let res = await getHotSongMenu();
    if (res.tags) {
      hotMenuTag.list = res.tags;
    }
    setTimeout(() => {
      hotMenuTag.isLoading = false;
    }, 50);
  } catch (e: any) {
    elMessage.error(e?.message || "请求热门歌单标签失败 请检查你的网络是否有问题?");
  }
};

//获取热门歌单列表
let getHotSongMenuListItem = async () => {
  try {
    let res = await getFriendEliteSongMenu(
      "",
      hotMenuTag.currentTag,
      25,
      songMenu.offset
    );

    if (res.playlists.length) {
      songMenu.list = songMenu.list.concat(res.playlists);
    }
    if (res.total) {
      songMenu.total = res.total;
      if (res.total - songMenu.list.length >= 25) {
        songMenu.offset += 25;
      } else {
        songMenu.offset += res.total - songMenu.list.length;
      }
    }
    songMenu.hasMore = res.more;
    setTimeout(() => {
      songMenu.isLoading = false;
    }, 300);
  } catch (e: any) {
    elMessage.error(e?.message || "请求热门歌单列表失败 请检查你的网络是否有问题?");
  }
};

//监听路由
watch(
  () => route.query,
  (query) => {
    if (query.tag && query.component === "allSongMenu") {
      handleCurrentUrl(String(query.tag));
    }
  }
);

let handleCurrentUrl = (tag: string) => {
  hotMenuTag.currentTag = tag;
  if (tag !== "综艺") {
    topBanner.isLoading = true;
    getEliteSongMenuListItem();
  }
  songMenu.isLoading = true;
  songMenu.list = [];
  songMenu.offset = 0;
  getHotSongMenuListItem();
};

//切换标签
let switchSongMenuTag = (tag: string) => {
  router.replace({
    path: "/findMusic",
    query: {
      component: "allSongMenu",
      index: 2,
      tag,
    },
  });
};

//获取所有的歌单分类
let getSongMenuCategoryList = async () => {
  try {
    let { sub, categories } = await getSongMenuCategory();
    for (let [k, v] of Object.entries(categories)) {
      songMenuCategoryList.value.push({
        title: v,
        list: sub.filter((item) => item.category === Number(k)),
      });
    }
  } catch (e: any) {
    elMessage.error(e?.message || "请求歌单分类列表失败 请检查你的网络是否有问题?");
  }
};

//打开歌单分类弹窗
let openDialogCategory = () => {
  dialogSongMenuCategoryVisible.value = !dialogSongMenuCategoryVisible.value;
};

onMounted(() => {
  getEliteSongMenuListItem();
  getHotSongMenuTagList();
  getHotSongMenuListItem();
  getSongMenuCategoryList();
});

let openEliteSongMenu = () => {
  router.push({
    path: "/findMusic",
    query: {
      component: "eliteSongMenu",
      index: 2,
      tag: hotMenuTag.currentTag || "全部歌单",
    },
  });
};
</script>

<style scoped lang="scss">
/**所有歌单 */
.all--songMenu {
  display: flex;
  align-items: center;
  flex-direction: column;
}

/**复用样式 */
//头部
@mixin banner {
  height: 250px;
  margin: auto;
}

//歌单 标签
@mixin tag {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  height: 30px;
  justify-content: space-between;
}

//歌单列表 子元素
@mixin list__item {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  width: 100%;
}

/**骨架屏 */

/**头部 */
.el-skeleton--banner {
  @include banner;
}

/**歌单标签 头部栏 */
.el-skeleton--tag {
  @include tag;
}

/**歌单标签 头部栏 左边 */
.el-skeleton--tag__left {
  width: 20%;
  height: 100%;
}

/**歌单标签 头部栏 右边 */
.el-skeleton--tag__right {
  width: 60%;
  height: 100%;
}

/**歌单列表 */
.el-skeleton--menu__list {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 15px;
}

/**歌单列表子元素 */
.el-skeleton--menu__list__item {
  @include list__item;
}

/**歌单列表子元素 图片*/
.el-skeleton--menu__list__item__img {
  width: 100%;
  height: 200px;
}

/**歌单列表子元素 标题 */
.el-skeleton--menu__list__item__title {
  width: 100%;
  height: 40px;
  display: flex;
  margin-top: 10px;
}

/**头部 内容区域 */
.elite--banner {
  @include banner;
  background-attachment: fixed;
  width: 100%;
  background-color: #464646;
  background-image: url(@/assets/image/3719ebdbfc5497a68688ec7604b6d440.jpg);
  background-size: cover;
  background-position: center center;
  display: flex;
  border-radius: 8px;
  align-items: center;
  background-repeat: no-repeat;
}

/**左边图片 歌单封面 */
.elite--banner__coverimg {
  width: 200px !important;
  height: 200px !important;
  margin-left: 40px;
}

/**右边 歌单信息 */
.elite--banner__right {
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 20px;
}

/**右边 歌单信息 精品歌单 */
.elite--banner__right__circle {
  border: 1px solid rgba(202, 157, 87, 1);
  border-radius: 8px;
  color: rgba(202, 157, 87, 1);
  width: 50%;
  padding: 5px;
  margin-bottom: 20px;
}

/**右边 歌单信息 精品歌单 标题 */
.elite--banner__right__circle__title {
  margin-left: 10px;
  cursor: pointer;
}

/**右边 歌单信息 精品歌单 副标题 */
.elite--banner__right__subtitle {
  font-size: 12px;
  margin-top: 10px;
  text-align: left;
  color: rgba(0, 0, 0, 0.6);
}

/**歌单标签 */
.songMenu--tag {
  @include tag;
}

/**歌单标签 左边 显示选择的歌单标签*/
.songMenu--chose {
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(224, 224, 224, 1);
  padding: 5px;
  cursor: pointer;
}

/**歌单标签 右边 显示所有的热门歌单标签*/
.songMenu--hotTag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;

  span {
    line-height: 20px;
  }
}

/**歌单列表 子元素*/
.songMenu--list__item {
  @include list__item;
}

/**歌单列表 用户名 */
.songMenu--list__item__user {
  position: absolute;
  color: white;
  bottom: 10px;
  display: flex;
  align-items: center;
  left: 5px;
}
</style>
