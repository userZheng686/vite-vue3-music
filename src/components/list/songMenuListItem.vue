<template>
  <div
    style="display: flex; flex-direction: column; overflow: hidden"
    @contextmenu.prevent="props.contextMenu && props.contextMenu($event, props.item)"
  >
    <!--歌单详情列表元素-->
    <el-card
      class="list--card"
      :body-style="{ padding: '0px' }"
      :class="{
        radar: props.radar,
        no__minheight: props.noMinHeight,
        no__height: props.noHeight,
      }"
      shadow="hover"
      @click="jumpSongMenuDetail"
    >
      <!--精品歌单标签-->
      <div class="list--elite" v-if="props.isElite">
        <div class="list--elite background"></div>
        <i class="iconfont icon-jingpin"></i>
      </div>
      <!--标题-->
      <div class="list--title" v-if="props?.index === 0">
        根据您的音乐口味生成每日更新
      </div>
      <!--播放量-->
      <div v-else class="list--number">
        <i class="iconfont icon-play" style="margin-right: 5px; font-size: 12px"></i>
        <span>{{ filter(props.item.playcount || props.item.playCount) }}</span>
      </div>
      <!--图片-->
      <defaultImage
        :picUrl="item.picUrl || item.coverImgUrl"
        :lazy="props.lazy"
        :param="props.param"
        :height="false"
        fit="fill"
        :y="props.y"
      ></defaultImage>
      <!--日期-->
      <div v-if="index === 0" class="day--icon">
        <i class="iconfont" :class="'icon-rili' + day"></i>
      </div>
      <!--播放按钮-->
      <div class="player--circle">
        <i class="iconfont icon-bofang" style="margin-left: 2px"></i>
      </div>
      <slot name="user"></slot>
    </el-card>
    <!--副标题-->
    <span
      v-title
      class="list--subTitle gray more-clamp2"
      v-if="props.isShowName"
      @click="
        router.push({
          path: '/songMenuDetail',
          query: {
            id: props.item.id,
          },
        })
      "
      >{{ props.item.name }}</span
    >
    <!--数量-->
    <span class="info" v-if="props.trackCount">{{ props.item.trackCount }}首</span>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { filter } from "@/utils/filter";

let router = useRouter();

interface Props {
  index?: number;
  item: any;
  day?: number;
  lazy?: boolean;
  isShowName?: boolean;
  radar?: boolean;
  noMinHeight?: boolean;
  noHeight?: boolean;
  param?: number;
  y?: number;
  isElite?: boolean;
  contextMenu: Function;
  trackCount?: boolean;
}

let props = withDefaults(defineProps<Props>(), {
  index: 1,
  day: new Date().getDate(),
  lazy: true,
  isShowName: true,
  radar: false,
  noMinHeight: false,
  noHeight: false,
  param: 1024,
  y: 1024,
  isElite: false,
  trackCount: false,
  contextMenu: () => {},
});

let jumpSongMenuDetail = () => {
  if (props.index === 0) {
    router.push({
      path: "/recommendPlaylist",
    });
  } else {
    router.push({
      path: "/songMenuDetail",
      query: {
        id: props.item.id,
      },
    });
  }
};
</script>

<style scoped lang="scss">
.list--card {
  border-radius: 8px;
  cursor: pointer;
  :deep(.el-card__body) {
    height: 100%;
    position: relative;
  }
}

//不要最小高度了
.no__minheight {
  min-height: 0;
}

//不要高度
.no__height {
  height: auto;
}

.list--card:hover .player--circle {
  opacity: 1;
}

.list--card:hover .list--title {
  opacity: 1;
}

.list--elite {
  position: absolute;
  z-index: 2;

  i {
    z-index: 2;
    color: white;
    position: absolute;
    transform: rotate(320deg);
  }

  &.background {
    position: absolute;
    z-index: 2;
    width: 0;
    color: white;
    border-top: 30px solid rgb(243, 176, 104);
    border-right: 30px solid transparent;
  }
}

.list--title {
  position: absolute;
  font-size: 10px;
  text-align: center;
  width: 100%;
  color: white;
  padding-top: 5px;
  padding-bottom: 5px;
  z-index: 2;
  background-color: rgba(24, 54, 44, 0.5);
  opacity: 0;
  transition: all 0.8s linear;
}

.list--number {
  position: absolute;

  z-index: 2;
  font-size: 12px;
  color: white;

  font-weight: 700;

  position: absolute;
  cursor: pointer;
  right: 10px;
  top: 10px;
  text-shadow: 1px 1px 5px #0a0101;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
}

.list--image {
  width: 100%;
  object-fit: cover;
  height: 100%;
}

.day--icon {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  bottom: 0;
  top: 0;
  justify-content: center;

  i {
    font-size: 70px;
    color: white;
  }
}

.player--circle {
  position: absolute;
  right: 15px;
  bottom: 15px;
  background-color: #fbf7f6;
  color: #ec4141;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s;
}

.list--subTitle {
  margin-top: 10px;
  text-align: left;
  height: 40px;
}
</style>
