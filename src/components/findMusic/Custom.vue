<template>
  <!--专属定制-->
  <LoadingComponent v-if="!officalSongMenu.list.length"></LoadingComponent>
  <div v-else class="personal--custom">
    <!--雷达歌单-->
    <div class="personal--custom--Radar">
      <el-skeleton :rows="3" animated :loading="radarSongMenu.isLoading">
        <!--骨架屏-->
        <template #template>
          <!--雷达歌单 顶部标题-->
          <el-skeleton-item class="el-skeleton--custom__top__title" variant="text" />
          <!--雷达歌单 顶部备注-->
          <el-skeleton-item class="el-skeleton--custom__top__mark" variant="text" />
          <!--雷达歌单 列表-->
          <div class="el-skeleton-custom--list">
            <!--雷达歌单 列表元素-->
            <div
              class="el-skeleton-custom--list__item"
              v-for="(item, index) in 5"
              :key="index"
            >
              <!--雷达歌单 列表元素 封面-->
              <el-skeleton-item
                variant="image"
                class="el-skeleton-custom--list__item__img"
              />
              <!--雷达歌单 列表元素 名字-->
              <el-skeleton-item
                variant="text"
                class="el-skeleton-custom--list__item__name"
              />
            </div>
          </div>
        </template>
        <!--内容区域-->
        <template #default>
          <!--雷达歌单 顶部标题-->
          <div class="personal--custom--Radar__top__title">
            {{ radarSongMenu.titles.title }}
          </div>
          <!--雷达歌单 顶部副标题-->
          <div class="personal--custom--Radar__top__subtitle">
            {{ radarSongMenu.titles.subTitle }}
            <!--雷达歌单 顶部 左右按钮-->
            <div style="display: flex; align-items: center">
              <el-icon
                class="personal--custom--Radar__top__icon__wrap"
                @click="scrollDirection('up')"
              >
                <ArrowUp />
              </el-icon>
              <el-icon
                class="personal--custom--Radar__top__icon__wrap"
                @click="scrollDirection('down')"
              >
                <ArrowDown />
              </el-icon>
            </div>
          </div>
          <div style="display: flex; overflow: hidden">
            <!--雷达歌单 列表-->
            <div class="personal--custom--Radar__top__list" ref="radarList1">
              <div
                class="personal--custom--Radar__top__list__item"
                v-for="(item, index) in radarSongMenu.list1"
                :key="item.id"
              >
                <SongMenuListItem
                  :item="item"
                  :index="index + 1"
                  :lazy="false"
                  :radar="true"
                  :contextMenu="contextMenuPlaylist"
                />
              </div>
            </div>
            <div class="personal--custom--Radar__top__list hidden" ref="radarList2">
              <div
                class="personal--custom--Radar__top__list__item"
                v-for="(item, index) in radarSongMenu.list2"
                :key="item.id"
              >
                <SongMenuListItem
                  :item="item"
                  :index="index + 1"
                  :lazy="false"
                  :radar="true"
                  :contextMenu="contextMenuPlaylist"
                />
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
    <!--歌单推荐-->
    <div class="songMenu--recommend">
      <el-skeleton :rows="3" animated :loading="officalSongMenu.isLoading">
        <!--骨架屏-->
        <template #template>
          <!--歌单推荐 标题-->
          <el-skeleton-item class="el-skeleton--custom__top__title" variant="text" />
          <!--歌单推荐 列表-->
          <div class="el-skeleton-custom--list">
            <div
              class="el-skeleton-custom--list__item"
              v-for="(item, index) in 5"
              :key="index"
            >
              <el-skeleton-item
                variant="image"
                class="el-skeleton-custom--list__item__img"
              />
              <el-skeleton-item
                variant="text"
                class="el-skeleton-custom--list__item__name"
              />
            </div>
          </div>
          <!--歌单推荐 列表-->
          <div class="el-skeleton-custom--list">
            <div
              class="el-skeleton-custom--list__item"
              v-for="(item, index) in 5"
              :key="index"
            >
              <el-skeleton-item
                variant="image"
                class="el-skeleton-custom--list__item__img"
              />
              <el-skeleton-item
                variant="text"
                class="el-skeleton-custom--list__item__name"
              />
            </div>
          </div>
        </template>
        <!--内容区域-->
        <template #default>
          <!--标题-->
          <div class="personal--songMenu--Recommend--title">
            {{ officalSongMenu.title }}
          </div>
          <!--无限滚动列表-->
          <InfiniteList
            :request="getOfficalRecommendSongMenuListItem"
            :hasMore="officalSongMenu.hasMore"
          >
            <div
              class="personal--songMenu--Recommend--list__item"
              v-for="(item, index) in officalSongMenu.list"
              :key="item.id"
            >
              <SongMenuListItem
                :item="item"
                :index="index + 1"
                :lazy="false"
                :contextMenu="contextMenuPlaylist"
              />
            </div>
          </InfiniteList>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { contextMenuPlaylist } from "@/contextMenu/playlist/normal";
import { getRadarList, getUserSongMenu, getSongList } from "@/api/api_playList";
import { SearchResultItem, SongListItem } from "i/api/api_playList.d";

let elMessage: any = inject("message") as any;
let radarList1 = ref<null | HTMLElement>(null);
let radarList2 = ref<null | HTMLElement>(null);

//雷达歌单
let radarSongMenu = reactive<{
  isLoading: boolean;
  list1: Array<SearchResultItem>;
  list2: Array<SearchResultItem>;
  titles: {
    title: string;
    subTitle: string;
  };
}>({
  isLoading: true,
  list1: [],
  list2: [],
  titles: {
    title: "",
    subTitle: "",
  },
});

//总歌单（200）
let allList: SongListItem[] = [];

//官方推荐歌单
let officalSongMenu = reactive<{
  isLoading: boolean;
  hasMore: boolean;
  list: Array<SongListItem>;
  offset: number;
  title: string;
}>({
  isLoading: true,
  hasMore: true,
  list: [],
  offset: 0,
  title: "",
});
//记录滚动的方向
const direction = ref<string>("");

//计算列表长度
let computedOfficalSongMenuListItemLength = computed<number>(
  () => officalSongMenu.list.length
);

//获取雷达歌单
let getRadarSongMenuListItem = async () => {
  try {
    // radarSongMenu.list = allRes;
    let {
      data: { blocks },
    } = await getRadarList();
    let { creatives, uiElement } = blocks[0];
    let { creatives: creatives1, uiElement: uiElement1, extInfo } = blocks[1];
    radarSongMenu.titles.title = uiElement.mainTitle.title;
    radarSongMenu.titles.subTitle = uiElement.subTitles[0].title;
    let list = creatives.map((item) => {
      let obj = {
        name: item.uiElement.mainTitle.title,
        playCount: item.resources[0].resourceExtInfo.playCount,
        coverImgUrl: item.uiElement.images[0].imageUrl,
        id: item.creativeId,
        creator: {
          nickname: item.resources[0].resourceExtInfo.users[0].nickname,
          followed: item.resources[0].resourceExtInfo.users[0].followed,
          userId: item.resources[0].resourceExtInfo.users[0].userId,
          avatarUrl: item.resources[0].resourceExtInfo.users[0].avatarUrl,
        },
      };
      return obj;
    });
    radarSongMenu.list1 = list.slice(0, 5);
    radarSongMenu.list2 = list.slice(5, 10);

    officalSongMenu.title = uiElement1.mainTitle.title;
    //搜索歌单
    if (extInfo) {
      let ids = JSON.parse(extInfo).playlistIds;
      let res = await getSongList(ids.join(","));
      allList = res.playlists;
      getOfficalRecommendSongMenuListItem();
    }
    setTimeout(() => {
      radarSongMenu.isLoading = false;
    }, 100);
  } catch (e: any) {
    elMessage.error(e?.message || "请求雷达歌单失败 请检查你的网络是否有问题?");
  }
};

//获取推荐的歌单 网易云官方歌单
let getOfficalRecommendSongMenuListItem = async () => {
  if (officalSongMenu.list.length === allList.length) {
    return;
  }
  let maxLength = 30;
  if (officalSongMenu.offset + 30 > allList.length) {
    maxLength = allList.length - officalSongMenu.offset;
  }
  officalSongMenu.list.push(
    ...allList.slice(officalSongMenu.offset, officalSongMenu.offset + maxLength)
  );
  officalSongMenu.offset += maxLength;
  if (officalSongMenu.isLoading) {
    officalSongMenu.isLoading = false;
  }
  if (officalSongMenu.list.length === allList.length) {
    officalSongMenu.hasMore = false;
  }
};

//滑动
let scrollDirection = (type: string) => {
  direction.value = type;
  if (radarList1.value && radarList2.value) {
    if (type === "up") {
      radarList1.value.className = "personal--custom--Radar__top__list hidden";
      radarList2.value.className = "personal--custom--Radar__top__list";
    } else {
      radarList2.value.className = "personal--custom--Radar__top__list hidden";
      radarList1.value.className = "personal--custom--Radar__top__list";
    }
  }
};

onMounted(() => {
  getRadarSongMenuListItem();
});
</script>

<style scoped lang="scss">
/**骨架屏样式 */
/**雷达歌单 歌单推荐 顶部标题 */
.el-skeleton--custom__top__title {
  width: 20%;
  height: 20px;
  display: flex;
  margin-top: 10px;
}

/**雷达歌单 歌单推荐 备注 */
.el-skeleton--custom__top__mark {
  width: 30%;
  height: 20px;
  display: flex;
  margin-top: 10px;
}

/**雷达歌单 歌单推荐 列表 */
.el-skeleton-custom--list {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
}

/**雷达歌单 歌单推荐 列表元素 */
.el-skeleton-custom--list__item {
  margin-top: 10px;
}

/**雷达歌单 歌单推荐 列表元素 封面 */
.el-skeleton-custom--list__item__img {
  height: 120px;
}

/**雷达歌单 歌单推荐 列表元素 名字 */
.el-skeleton-custom--list__item__name {
  height: 40px;
  display: flex;
  margin-top: 10px;
}

/**歌单推荐 歌单推荐 标题 */
.el-skeleton--songMenu--recommend--title {
  width: 20%;
  height: 20px;
  display: flex;
  margin-top: 10px;
}

/**内容区域 */
/**专属定制 */
.personal--custom {
}

/**雷达歌单 */
.personal--custom--Radar {
  display: flex;
  flex-direction: column;

  margin-bottom: 20px;
}

/**雷达歌单 歌单推荐 顶部标题 */
.personal--custom--Radar__top__title,
.personal--songMenu--Recommend--title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}

/**雷达歌单 顶部副标题 */
.personal--custom--Radar__top__subtitle {
  font-size: 16px;
  margin-top: 10px;
  color: rgba(159, 159, 159, 1);
  text-align: left;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/**雷达歌单 左右button */
.personal--custom--Radar__top__icon__wrap {
  border-radius: 50%;
  width: 28px;
  height: 28px;
  margin-left: 15px;
  cursor: pointer;
  background-color: rgba(235, 235, 235);
}

/**雷达歌单 左右button 激活*/
.personal--custom--Radar__top__icon__wrap:hover {
  color: white;
  background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
}

.animation--transition {
  transform: translateX(-1200px);
}

.hidden {
  display: none !important;
  transform: translateX(0px);
  /* opacity: 0; */
}

/**雷达歌单 列表 */
.personal--custom--Radar__top__list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  row-gap: 13px;
  user-select: none;
  column-gap: 10px;
  /* height: 330px; */
  overflow: hidden;
  transition: all 0.4s;
  /* min-width: 1200px; */
  margin-top: 15px;
}

/**雷达歌单 列表元素 */
.personal--custom--Radar__top__list__item {
  /* width: 200px;
  height: 200px; */
  transition: all 0.4s;
}

/**歌单推荐 列表元素 */
.personal--songMenu--Recommend--list__item {
  width: 100%;
  margin-top: 10px;
  margin-right: 2px;
}

/**滑动 */
.el-scrollbar {
  :deep(.el-scrollbar__thumb) {
    display: none;
  }
}
</style>
