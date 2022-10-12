<template>
  <!--播客列表 列表-->
  <div class="pod--list">
    <!--播客列表 列表元素-->
    <div class="pod--list__item">
      <!--播客列表 标题-->
      <div
        class="pod--list__item__title"
        :style="{ cursor: props.id ? 'pointer' : 'auto' }"
        @click="handleClick(props.id)"
      >
        <span>{{ props.title }}</span>
        <el-icon v-if="props.id"><ArrowRight /></el-icon>
      </div>
      <!--播客列表 封面 标题-->
      <el-skeleton :rows="3" animated :loading="loading">
        <!--骨架屏-->
        <template #template>
          <!--骨架屏列表-->
          <div class="el-skeleton--podList">
            <!--骨架屏列表元素-->
            <div
              class="el-skeleton--podList__item"
              v-for="(item, index) in 9"
              :key="index"
            >
              <!--骨架屏列表元素 封面-->
              <el-skeleton-item variant="image" class="el-skeleton--podList__item__img" />
              <!--骨架屏列表元素 信息-->
              <div class="el-skeleton--podList__item__info">
                <el-skeleton-item
                  variant="text"
                  class="el-skeleton--podList__item__info__name"
                />
                <div class="el-skeleton--podList__item__info__subTitle">
                  <el-skeleton-item
                    variant="text"
                    class="el-skeleton--podList__item__info__subTitleType"
                  />
                  <el-skeleton-item
                    variant="text"
                    class="el-skeleton--podList__item__info__subTitleText"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        <!--内容区域-->
        <template #default>
          <div class="pod--list__item__content">
            <div
              class="pod--list__item__content__item"
              v-for="item in props?.creatives"
              :key="item.creativeId"
              @contextmenu="contextMenuDjProgram($event, item)"
            >
              <DefaultImage
                :picUrl="item.imageurl"
                :params="78"
                class="pod--list__item__content__item__img"
                :y="78"
                :lazy="false"
                loadingWidth="39px"
                loadingHeight="39px"
              >
                <template #play>
                  <!--播放按钮-->
                  <div class="player--circle">
                    <i class="iconfont icon-bofang" style="margin-left: 2px"></i>
                  </div>
                </template>
              </DefaultImage>
              <div class="pod--list__item__content__item__info">
                <div class="pod--list__item__content__item__info__name more-clamp2">
                  {{ item.mainTitle }}
                </div>
                <div class="pod--list__item__content__item__info__subTitle single-clamp">
                  <div class="pod--list__item__content__item__info__subTitleType">
                    {{ item?.labelText.join("") }}
                  </div>
                  <div
                    v-title
                    @click="jumpBroadCastDetail(item?.radio?.id)"
                    class="pod--list__item__content__item__info__subTitleText gray single-clamp"
                  >
                    {{ item.subtitle?.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Radio } from "i/api/api_radio.d";
import { SongDetailSongsItem } from "i/api/api_song.d";
import { contextMenuDjProgram } from "@/contextMenu/dj/program";

let router = useRouter();

interface Props {
  title?: string;
  id?: number | null;
  showType?: string;
  creatives?: Array<{
    creativeId: number;
    mainTitle: string;
    labelText: string[];
    labelType: string;
    imageurl: string;
    playCount: number;
    secondCategory: string;
    subtitle?: {
      title: string;
      titleType: string;
    };
    radio?: Radio;
    mainSong?: SongDetailSongsItem;
  }>;
}

let props = defineProps<Props>();

let loading = computed(() => {
  if (props?.creatives?.length) {
    return false;
  } else {
    return true;
  }
});

//处理跳转链接
let handleClick = (id: number | null | undefined) => {
  if (id) {
    router.push({ name: `Category`, params: { id, name: props.title } });
  }
};

//跳转到播客详情
let jumpBroadCastDetail = (id: number | undefined | null) => {
  if (id) {
    router.push({
      path: "/broadCastDetail",
      query: { id },
    });
  }
};
</script>

<style scoped lang="scss">
/**样式复用 */
@mixin podList {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 15px;
}

@mixin podList__item {
  display: flex;
  margin-top: 10px;
  height: 78px;
  overflow: hidden;
}

@mixin podList__item__img {
  height: 78px !important;
  width: 78px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin podList__item__info {
  width: 60%;
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

@mixin podList__item__info__name {
  margin-left: 10px;
  width: 90%;
}

@mixin podList__item__info__subTitle {
  flex: 1;
  margin-top: 10px;
  margin-left: 10px;
  width: 90%;
  display: flex;
}

@mixin podList__item__info__subTitleType {
  height: 20px;
  margin-right: 2px;
  align-items: center;
}

@mixin podList__item__info__subTitleText {
  height: 20px;
}

/**骨架屏 */
/**骨架屏列表 */
.el-skeleton--podList {
  @include podList;
}

/**骨架屏列表元素 */
.el-skeleton--podList__item {
  @include podList__item;
}

/**骨架屏列表元素 封面 */
.el-skeleton--podList__item__img {
  @include podList__item__img;
}

/**骨架屏列表元素 信息 */
.el-skeleton--podList__item__info {
  @include podList__item__info;
}

/**骨架屏列表元素 名字 */
.el-skeleton--podList__item__info__name {
  @include podList__item__info__name;
}

/**骨架屏列表元素 信息 副标题 */
.el-skeleton--podList__item__info__subTitle {
  @include podList__item__info__subTitle;
}

/**骨架屏列表元素  信息 副标题 文本颜色 */
.el-skeleton--podList__item__info__subTitleType {
  @include podList__item__info__subTitleType;
}

/**骨架屏列表元素  信息 副标题 文本 */
.el-skeleton--podList__item__info__subTitleText {
  @include podList__item__info__subTitleText;
}

/**内容区域 */
/**播客列表 列表 */
.pod--list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/**播客列表 列表*/
.pod--list__item {
  display: flex;
  flex-direction: column;
  text-align: left;
}

/**播客列表 标题 */
.pod--list__item__title {
  font-size: 24px;
  font-weight: 700;
  display: flex;
  width: 130px;
  cursor: pointer;
  align-items: center;
}

/** */
/**播客列表 */
.pod--list__item__content {
  @include podList;
}

/**播客列表 元素 */
.pod--list__item__content__item {
  @include podList__item;
}

/**播客列表 封面 */
.pod--list__item__content__item__img {
  @include podList__item__img;
}

/**播客列表 元素 信息 */
.pod--list__item__content__item__info {
  @include podList__item__info;
  cursor: pointer;
}

.pod--list__item__content__item__info:hover {
  background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  border-radius: 8px;
}

/**播客列表 元素 信息 名字*/
.pod--list__item__content__item__info__name {
  @include podList__item__info__name;
}

/**播客列表 元素 信息 副标题 */
.pod--list__item__content__item__info__subTitle {
  @include podList__item__info__subTitle;
}

/**播客列表 元素 信息 副标题 文本颜色 */
.pod--list__item__content__item__info__subTitleType {
  @include podList__item__info__subTitleType;
  font-size: 12px;
  background-color: var(--dark-category-backgroundColor, rgb(241, 242, 243));
  margin-right: 5px;
  padding: 5px 10px 5px 10px;
  border-radius: 24px;
}

/**播客列表 元素 信息 副标题 文本 */
.pod--list__item__content__item__info__subTitleText {
  @include podList__item__info__subTitleText;
  font-size: 12px;
  padding: 5px 0px;
}
</style>
