<template>
  <!--播客列表 标题-->
  <div
    class="pod--list__item__title"
    :style="{ cursor: props.id ? 'pointer' : 'auto' }"
    @click="handleClick(props.id)"
  >
    <span>{{ props.title }}</span>
    <el-icon v-if="props.id">
      <ArrowRight />
    </el-icon>
  </div>
  <!--播客列表 封面 标题-->
  <el-skeleton :rows="3" animated :loading="loading">
    <!--骨架屏-->
    <template #template>
      <!--骨架屏列表-->
      <div class="el-skeleton--podList">
        <!--骨架屏列表元素-->
        <div class="el-skeleton--podList__item" v-for="(item, index) in 6" :key="index">
          <!--骨架屏列表元素 封面-->
          <el-skeleton-item variant="image" class="el-skeleton--podList__item__img" />
          <!--骨架屏列表元素 作品名字-->
          <el-skeleton-item variant="text" class="el-skeleton--podList__item__name" />
        </div>
      </div>
    </template>
    <!--内容区域-->
    <template #default>
      <!--内容渲染区域-->
      <div class="pod--list__item__info">
        <div
          class="pod--list__item__info__item"
          v-for="(item, index) in props.creatives"
          @click="jumpBroadCastDetail(item.creativeId)"
          @contextmenu="
            contextMenuDj($event, {
              id: item.creativeId,
              name: item.mainTitle,
              picUrl: item.imageurl,
            })
          "
          :key="index"
        >
          <!--卡片-->
          <el-card
            class="pod--list__item__info__item__card"
            :body-style="{ padding: '0px' }"
            shadow="hover"
          >
            <!--图片-->
            <DefaultImage
              class="pod--list__item__info__item__card__img"
              :picUrl="item.imageurl"
              :radius="false"
              :lazy="false"
              :param="140"
              :y="140"
            >
              <template #playCount>
                <div class="mv--playCount">
                  <i class="iconfont icon-play" style="margin-right: 5px"></i>
                  <span>{{ filter(item.playCount) }}</span>
                </div>
              </template>
            </DefaultImage>
          </el-card>
          <div class="pod--list__item__info__item__markname">
            <!--副类别-->
            <span
              :class="{ yellow: item.labelType === 'yellow' }"
              v-if="show(item)"
              style="display: inline-block; margin-bottom: 10px"
              class="pod--list__item__info__item__markname__category"
              >{{
                props.showType === "VOICE_HOMEPAGE_RCMDLIKE_VOICELIST"
                  ? item.labelText.join("")
                  : item.secondCategory
              }}</span
            >
            <!--作品名字-->
            <span class="gray more-clamp2" v-title>{{ item.mainTitle }}</span>
          </div>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { contextMenuDj } from "@/contextMenu/dj/normal";
import { filter } from "@/utils/filter";

//路由实例
let router = useRouter();

interface createive {
  creativeId: number;
  mainTitle: string;
  labelText: string[];
  labelType: string;
  imageurl: string;
  playCount: number;
  imageUrl: string;
  secondCategory: string;
}

interface Props {
  title?: string;
  id?: number | null;
  showType?: string;
  creatives?: Array<createive>;
}

let props = defineProps<Props>();

/**loading */
let loading = computed(() => {
  if (props?.creatives?.length) {
    return false;
  } else {
    return true;
  }
});

let show = computed(() => {
  return function (item: createive) {
    if (props.showType === "VOICE_HOMEPAGE_RCMDLIKE_VOICELIST") {
      if (item.labelText.join("").length) {
        return true;
      } else {
        return false;
      }
    } else {
      if (item.secondCategory) {
        return true;
      } else {
        return false;
      }
    }
  };
});

//处理跳转链接
let handleClick = (id: number | null | undefined) => {
  if (id) {
    router.push({ name: `Category`, params: { id, name: props.title } });
  }
};

//跳转到播客详情
let jumpBroadCastDetail = (creativeId: number) => {
  router.push({
    path: "/broadCastDetail",
    query: { id: creativeId },
  });
};
</script>

<style scoped lang="scss">
/**样式复用 */
@mixin podList {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 15px;
  text-align: left;
}

@mixin podList__item {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  overflow: hidden;
}

@mixin podList__item__img {
  height: 200px !important;
}

@mixin podList__item__name {
  height: 40px;
  margin-top: 10px;
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

/**骨架屏列表元素 名字 */
.el-skeleton--podList__item__name {
  @include podList__item__name;
}

/**内容区域 */

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
.pod--list__item__info {
  @include podList;
}

/**播客列表 封面 作品类别 名字 */
.pod--list__item__info__item {
  @include podList__item;
}

/**播客列表 卡片 */
.pod--list__item__info__item__card {
  border-radius: 8px;
}

/**播客列表 封面 */
.pod--list__item__info__item__card__img {
  /* @include podList__item__img; */
}

/**播客列表 作品类别 名字 */
.pod--list__item__info__item__markname {
  @include podList__item__name;
  height: auto;
}

/**播客列表 作品类别 */
.pod--list__item__info__item__markname__category {
  font-size: 12px;
  background-color: var(--dark-category-backgroundColor, rgb(241, 242, 243));
  margin-right: 5px;
  padding: 5px 10px 5px 10px;
  border-radius: 24px;
}

//猜你喜欢 颜色
.yellow {
  background-color: var(--dark-category-backgroundColor, rgb(254, 241, 234));
  color: rgb(254, 124, 38);
}

//播放次数
.mv--playCount {
  position: absolute;
  z-index: 2;
  font-size: 12px;
  color: white;
  font-weight: 700;
  position: absolute;
  right: 10px;
  top: 10px;
  text-shadow: 1px 1px 5px #0a0101;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
}
</style>
