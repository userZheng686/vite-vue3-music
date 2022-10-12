<template>
  <div class="video--list__item">
    <!--卡片 除了mv 其他的分类 鼠标移动上去都会播放动态图片-->
    <el-card
      class="video--card"
      :body-style="{ padding: '0px', height: '100%', borderRadius: '8px' }"
      @mousemove="perview"
      @mouseleave="leave"
      @contextmenu="
        props.contextMenu &&
          props.contextMenu($event, props.item, props.rubbish, props.removeCallback)
      "
      shadow="hover"
    >
      <DefaultImage
        :lazy="false"
        @click="openVideoDetail(props.item.vid)"
        :picUrl="videoImg"
        paddingBottom="60%"
        loadingWidth="50px"
        :param="1024"
        :onlyHttps="isPreview"
        :y="1024"
        fit="cover"
        loadingHeight="50px"
      />
      <!--播放数量-->
      <div class="video--card--playCount">
        <i class="iconfont icon-play" style="margin-right: 5px"></i>
        <span>{{ filter(props.item.playTime || props.item.playCount) }}</span>
      </div>
      <!--播放时长-->
      <div class="video--card--durationms">
        {{ playTime(props.item.durationms || props.item.duration) }}
      </div>
      <!--播放按钮-->
      <div class="player--circle" v-if="!props.item.creator">
        <i class="iconfont icon-bofang" style="margin-left: 2px; font-size: 20px"></i>
      </div>
    </el-card>
    <!--标题-->
    <div
      class="video--list__item__title gray"
      v-title
      @click="openVideoDetail(props.item.vid)"
    >
      <!--MV标志-->
      <div class="info--flag" v-if="!props.item.creator || props.item.type === 0">
        <span>MV</span>
      </div>
      <!--标题-->
      <span
        class="single-clamp"
        style="width: 100%"
        v-brightenKeyword:[props.search,props.item.title]
        >{{ props.item.title || props.item.name }}</span
      >
    </div>
    <!--用户名-->
    <div class="video--list__item__nickname gray">
      <span
        v-if="props.item.creator && !Array.isArray(props.item.creator)"
        style="margin-right: 5px; line-height: 21px"
      >
        by
      </span>
      <span
        v-if="props.item.creator && !Array.isArray(props.item.creator)"
        @click="jumpUserHomePage(props.item.creator.userId)"
        >{{ props.item.creator.nickname }}</span
      >
      <span v-else-if="props.item.creator && Array.isArray(props.item.creator)">
        <span v-for="(items, index) in props.item.creator" :key="items?.userId">
          <span>{{ index > 0 ? " / " : "" }}</span>
          <span class="gray" v-title @click="jumpArtists(items.userId)">{{
            items?.userName
          }}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { CreatorType } from "i/api/api_playList.d";
import { Picture } from "@element-plus/icons-vue";
import { filter, playTime } from "@/utils/filter";

//路由实例
let router = useRouter();

/**
播放时间
播放次属
封面
视频链接
 */

interface item {
  durationms: number;
  playTime: number;
  coverUrl: string;
  previewUrl?: string;
  title: string;
  creator:
    | CreatorType
    | Array<{
        userId: number;
        userName: string;
      }>;
  vid: string;
  //mvid
  id?: number;
  duration: number;
  playCount: number;
  name: string;
  artists: Array<{
    id: number;
    name: string;
  }>;
  type?: number;
}

interface Props {
  item: item;
  search?: string;
  contextMenu: Function;
  rubbish?: boolean;
  removeCallback?: Function;
}

const props = defineProps<Props>();

let isPreview = ref<boolean>(false);

let videoImg = computed(() => {
  if (isPreview.value) {
    return props.item.previewUrl;
  } else {
    return props.item.coverUrl;
  }
});

//预览
let perview = () => {
  if (props.item?.artists?.length) return;
  if (props.item.previewUrl) {
    isPreview.value = true;
  }
};

//离开
let leave = (coverUrl: string) => {
  if (props.item?.artists?.length) return;
  isPreview.value = false;
};

//打开视频链接
let openVideoDetail = (vid: string) => {
  if (vid && props.item?.type !== 0) {
    router.push({ path: "/videoDetail", query: { vid } });
  } else if (props.item.id || props.item.vid) {
    router.push({
      path: "/mvDetail",
      query: {
        mvid: props.item.id || props.item.vid,
      },
    });
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
</script>

<style lang="scss" scoped>
//loading
.image-slot-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-image) {
  position: initial;
}

:deep(.el-image__inner) {
  position: absolute;
  border-radius: 8px;
}

//列表元素
.video--list__item {
  display: flex;
  flex-direction: column;
  text-align: left;
  overflow: hidden;
}

//卡片
.video--card {
  width: 100%;
  margin-top: 10px;
  /* height: 200px; */
  border-radius: 8px;
  position: relative;
}

.video--card:hover .player--circle {
  opacity: 1;
}

//播放次数
.video--card--playCount {
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

//播放时长
.video--card--durationms {
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: white;
  text-shadow: 1px 1px 5px #0a0101;
}

//标题 用户名
.video--list__item__title,
.video--list__item__nickname {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

//播放按钮
.player--circle {
  position: absolute;
  top: 50%;
  left: 50%;
  right: 0;
  bottom: 0;
  transform: translate(-50%, -50%);
  background-color: #fbf7f6;
  color: #ec4141;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s;
}
</style>
