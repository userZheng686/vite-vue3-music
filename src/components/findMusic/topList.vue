<template>
  <!--排行榜-->
  <div class="toplist">
    <!--排行榜 官方-->
    <div class="toplist--offical">
      <!--标题-->
      <div class="toplist--offical__title">官方榜</div>
      <!--列表-->
      <el-skeleton
        :rows="5"
        animated
        v-for="i in mapHotList.componentList"
        :key="i.key"
        :loading="mapHotList.isLoading"
      >
        <!--骨架屏-->
        <template #template>
          <!--数据列表-->
          <div class="el-skeleton--toplist">
            <!--上半部分 包括封面 数据列表-->
            <div class="el-skeleton--toplist__top">
              <el-skeleton-item variant="image" class="el-skeleton--toplist__top__img" />
              <el-skeleton-item variant="text" class="el-skeleton--toplist__top__list" />
            </div>
            <!--下半部分 查看更多-->
            <div class="el-skeleton--toplist__bottom">
              <el-skeleton-item
                variant="text"
                class="el-skeleton--toplist__bottom__empty"
              />
              <el-skeleton-item
                variant="text"
                class="el-skeleton--toplist__bottom__more"
              />
            </div>
          </div>
        </template>
        <!--内容列表-->
        <template #default>
          <div class="toplist--offical__list">
            <!--上半部分 包括封面 数据列表-->
            <div class="toplist--offical__list__top">
              <!--封面-->
              <DefaultImage
                class="toplist--offical__list__top__img"
                :picUrl="i.component.coverImgUrl"
              >
                <template #dateUpdate>
                  <div class="toplist--offical__list__top__img__title">每日更新</div>
                </template>
              </DefaultImage>
              <!--列表-->
              <div class="toplist--offical__list__top__toplist single-clamp">
                <!--列表元素-->
                <div
                  class="toplist--offical__list__top__toplist__item single-clamp"
                  :class="
                    index % 2 === 0
                      ? 'toplist--offical__list__top__toplist__item--odd'
                      : ''
                  "
                  v-for="(item, index) in i.component.list"
                  :key="item.id"
                  @contextmenu="contextMenuSong($event, item, [], false)"
                  @dblclick="playOne(item)"
                >
                  <span
                    class="toplist--offical__list__top__toplist__item__index"
                    :style="index < 3 ? 'color:rgba(254,152,188)' : ''"
                    >{{ index + 1 }}
                    <span
                      style="margin-left: 5px; margin-right: 5px; color: gray"
                      v-if="item?.trackIds?.ratio"
                    >
                      {{ item?.trackIds?.ratio ? item.trackIds.ratio + "%" : "" }}
                    </span>
                    <span
                      v-if="item?.trackIds?.lr >= 0 && !item?.trackIds?.ratio"
                      style="margin-left: 5px; margin-right: 5px; color: #f56c6c"
                    >
                      <i
                        class="iconfont icon-shangsheng"
                        v-if="item?.trackIds?.lr > index"
                      ></i>
                      <i
                        class="iconfont icon-xiajiang"
                        v-else-if="item?.trackIds?.lr < index"
                      ></i>
                      <i
                        class="iconfont icon-line"
                        v-else-if="item?.trackIds?.lr === index"
                      ></i>
                    </span>
                    <span
                      style="margin-left: 5px; margin-right: 5px; color: green"
                      v-if="
                        (item?.trackIds?.lr === undefined ||
                          item?.trackIds?.lr === null) &&
                        !item?.trackIds?.ratio
                      "
                      >new</span
                    >
                  </span>
                  <span v-title class="toplist--offical__list__top__toplist__item__name"
                    >{{ item.name }}
                    <span class="gray" v-if="item.tns">({{ item.tns.join("") }})</span>
                  </span>
                  <div class="single-clamp" style="margin-right: 20px">
                    <span
                      v-for="(items, index) in item.ar"
                      :key="items.id"
                      @click="jumpArtists(items.id)"
                      class="toplist--offical__list__top__toplist__item__author single-clamp"
                      ><span>{{ index > 0 ? " / " : "" }}</span>
                      <span class="gray" v-title>{{ items.name }}</span></span
                    >
                  </div>
                </div>
              </div>
            </div>
            <!--下半部分 查看更多-->
            <div class="toplist--offical__list__bottom">
              <div class="toplist--offical__list__bottom__empty"></div>
              <div
                class="toplist--offical__list__bottom__more gray"
                @click="jumpSongMenuDetail(i.component.id)"
              >
                查看全部
                <el-icon>
                  <ArrowRight />
                </el-icon>
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
    <!--排行榜 全球-->
    <div class="toplist--world">
      <!--标题-->
      <div class="toplist--offical__title">全球榜</div>
      <!--列表-->
      <el-skeleton :rows="5" animated :loading="false">
        <!--骨架屏-->
        <template #template>
          <div class="el-skeleton--worldlist">
            <div
              class="el-skeleton--worldlist__item"
              v-for="(item, index) in 32"
              :key="index"
            >
              <el-skeleton-item
                variant="image"
                class="el-skeleton--worldlist__item__img"
              />
              <el-skeleton-item
                variant="text"
                class="el-skeleton--worldlist__item__title"
              />
            </div>
          </div>
        </template>
        <!--内容区域-->
        <template #default>
          <div class="toplist--worldlist">
            <div
              class="toplist--worldlist__item"
              v-for="(item, index) in worldList"
              :key="item.id"
            >
              <SongMenuListItem
                :index="index + 1"
                :item="item"
                :lazy="false"
                :contextMenu="contextMenuPlaylist"
              />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTopList, getSongMenuDetail } from "@/api/api_playList";
import { useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import { playOne } from "@/utils/play";
import { contextMenuSong } from "@/contextMenu/song/normal";
import { contextMenuPlaylist } from "@/contextMenu/playlist/normal";
import { SongDetailSongsItem } from "i/api/api_song";

let elMessage: any = inject("message") as any;

//热门榜单
interface toplist {
  coverImgUrl: string;
  name: string;
  id: number;
  isLoading: boolean;
}

//拓展 热门歌单详情
interface hotTopList extends toplist {
  list: Array<SongDetailSongsItem>;
}

let router = useRouter();
//官方榜

//飙升榜
let surgeTopList = reactive<hotTopList>({
  isLoading: true,
  name: "",
  coverImgUrl: "",
  id: 0,
  list: [],
});

//新歌榜
let newTopList = reactive<hotTopList>({
  isLoading: true,
  name: "",
  coverImgUrl: "",
  id: 0,
  list: [],
});

//原创榜
let originalTopList = reactive<hotTopList>({
  isLoading: true,
  name: "",
  coverImgUrl: "",
  id: 0,
  list: [],
});

//热歌榜
let hitTopList = reactive<hotTopList>({
  isLoading: true,
  name: "",
  coverImgUrl: "",
  id: 0,
  list: [],
});

//官方榜集合
let mapHotList = reactive<{
  isLoading: boolean;
  componentList: Array<{ key: string; component: hotTopList }>;
}>({
  isLoading: true,
  componentList: [
    {
      key: "surge",
      component: surgeTopList,
    },
    {
      key: "new",
      component: newTopList,
    },
    {
      key: "original",
      component: originalTopList,
    },
    {
      key: "hit",
      component: hitTopList,
    },
  ],
});

//全球榜
let worldList = ref<Array<hotTopList>>([]);

//请求所有榜单
let getAllTopList = async () => {
  try {
    let res = await getTopList();

    setHotTopList(res.list[0], surgeTopList);
    setHotTopList(res.list[1], newTopList);
    setHotTopList(res.list[2], originalTopList);
    setHotTopList(res.list[3], hitTopList);
    worldList.value = res.list.slice(4, res.list.length);
  } catch (e: any) {
    elMessage.error(e?.message || "请求榜单列表失败 请检查你的网络是否有问题?");
  }
};

//设置热榜
let setHotTopList = async (item: toplist, obj: hotTopList) => {
  try {
    let { coverImgUrl, id, name } = item;
    obj.coverImgUrl = coverImgUrl;
    obj.id = id;
    obj.name = name;
    let res = await getSongMenuDetail(id);
    let list = res.playlist.tracks.slice(0, 5);
    let trackIds = res.playlist.trackIds.slice(0, 5);
    list.forEach((item, index) => {
      item.trackIds = trackIds[index];
      item.from = {
        path: "findMusic",
        name,
        val: {
          component: "topList",
          index: 3,
        },
      };
      item.progress = 0;
    });
    obj.list.push(...list);
    mapHotList.isLoading = false;
  } catch (e: any) {
    elMessage.error(e?.message || "请求热榜列表失败 请检查你的网络是否有问题?");
  }
};

//跳转到歌单详情
let jumpSongMenuDetail = (id: number) => {
  router.push({
    path: "/songMenuDetail",
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

onMounted(() => {
  getAllTopList();
});
</script>

<style scoped lang="scss">
/**复用样式 */

//热门榜单列表
@mixin toplist {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 20px;
}

//热门榜单列表头部部分
@mixin toplist__top {
  display: flex;
  justify-content: space-between;
}

//热门榜单列表头部部分 封面
@mixin toplist__top__img {
  width: 200px !important;
  height: 240px !important;
}

//热门榜单 列表
@mixin toplist__top__list {
  flex: 1;
  height: 240px;
  margin-left: 30px;
}

//热门榜单 下半部分
@mixin toplist__bottom {
  display: flex;
  align-items: center;
}

//热门榜单 下半空体部分 用作占位符
@mixin toplist__bottom__empty {
  width: 230px;
  opacity: 0;
}

//热门榜单 下半部分 查看更多 当作跳转链接
@mixin toplist__bottom__more {
  margin-top: 10px;
  width: 10%;
  height: 20px;
  text-align: left;
  display: flex;
  align-items: center;
}

//全球榜单 列表
@mixin worldlist {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 15px;
}

//全球榜单 列表元素
@mixin worldlist__item {
  display: flex;
  width: 100%;
  height: 250px;
  margin-top: 10px;
  flex-direction: column;
}

//全球榜单 列表元素 封面
@mixin worldlist__item__img {
  width: 100%;
  height: 200px;
}

//全球榜单 列表元素 标题
@mixin worldlist__item__title {
  width: 100%;
  height: 40px;
  margin-top: 10px;
}

/**排行榜 */
.toplist {
  text-align: center;
}

/**排行榜 官方榜 */
.toplist--offical {
  display: flex;
  flex-direction: column;
}

/**官方榜 标题 */
.toplist--offical__title {
  font-size: 24px;
  font-weight: bold;
  text-align: left;
}

/** 骨架屏 */

//热门榜单 数据列表
.el-skeleton--toplist {
  @include toplist;
}

//热门榜单 头部部分
.el-skeleton--toplist__top {
  @include toplist__top;
}

//热门榜单 封面
.el-skeleton--toplist__top__img {
  @include toplist__top__img;
}

//热门榜单 列表
.el-skeleton--toplist__top__list {
  @include toplist__top__list;
}

//热门榜单 下半部分
.el-skeleton--toplist__bottom {
  @include toplist__bottom;
}

//热门榜单 下半空体部分
.el-skeleton--toplist__bottom__empty {
  @include toplist__bottom__empty;
}

//热门榜单 查看更多
.el-skeleton--toplist__bottom__more {
  @include toplist__bottom__more;
}

//全球榜单 列表
.el-skeleton--worldlist {
  @include worldlist;
}

//全球榜单 列表元素
.el-skeleton--worldlist__item {
  @include worldlist__item;
}

//全球榜单 列表元素 封面
.el-skeleton--worldlist__item__img {
  @include worldlist__item__img;
}

//全球榜单 列表元素 标题
.el-skeleton--worldlist__item__title {
  @include worldlist__item__title;
}

//数据列表
//热门榜单 数据列表
.toplist--offical__list {
  @include toplist;
}

//热门榜单 头部部分
.toplist--offical__list__top {
  @include toplist__top;
}

//热门榜单 封面
.toplist--offical__list__top__img {
  /* @include toplist__top__img; */
  width: 200px;
  flex-shrink: 0;
}

//热门榜单 封面 中间标题
.toplist--offical__list__top__img__title {
  position: absolute;
  margin: auto;
  top: 60%;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 19px;
  color: white;
}

//热门榜单 列表
.toplist--offical__list__top__toplist {
  @include toplist__top__list;
}

//热门榜单 列表元素
.toplist--offical__list__top__toplist__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20%;
  line-height: 21px;
}

//热门榜单 列表元素 hover
.toplist--offical__list__top__toplist__item:hover {
  /* background-color: rgba(244, 244, 244); */
  background-color: var(--dark-item-backgroundOdd, #f6f6f7);
}

//热门榜单 列表元素 奇数
.toplist--offical__list__top__toplist__item--odd {
  background-color: var(--dark-item-backgroundOdd, #f6f6f7);
}

//热门榜单 列表元素 索引项
.toplist--offical__list__top__toplist__item__index {
  margin-left: 10px;
  text-align: left;
}

//热门榜单 列表元素 作品名称
.toplist--offical__list__top__toplist__item__name {
  text-align: left;
  flex: 1;
  margin-right: 10px;
}

//热门榜单 列表元素 作者
.toplist--offical__list__top__toplist__item__author {
  text-align: right;
}

//热门榜单 下半部分
.toplist--offical__list__bottom {
  @include toplist__bottom;
}

//热门榜单 下半空体部分
.toplist--offical__list__bottom__empty {
  @include toplist__bottom__empty;
}

//热门榜单 查看更多
.toplist--offical__list__bottom__more {
  @include toplist__bottom__more;
  width: auto;
}

//全球排行榜 列表
.toplist--worldlist {
  @include worldlist;
}

//全球排行榜 列表元素
.toplist--worldlist__item {
  @include worldlist__item;
  height: auto;
}
</style>
