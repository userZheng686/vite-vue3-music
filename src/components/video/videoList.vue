<template>
  <!--视频列表-->
  <div class="video--list--wrap">
    <!--头部 标签选择-->
    <div class="video--tag">
      <div class="tag--chose">
        <span style="margin-left: 5px; cursor: pointer" @click="openDialogVideoTag">
          {{ currentVideoCategoryName ? currentVideoCategoryName : "全部视频" }}
        </span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="tag--hotTag">
        <span
          class="gray"
          v-for="(item, index) in videoCategory"
          @click="switchVideoCategory(item.id, item.name)"
          :key="index"
          >{{ item.name }}</span
        >
      </div>
    </div>
    <!--视频列表-->
    <el-skeleton :rows="3" animated :loading="videoList.isLoading">
      <!--骨架屏-->
      <template #template>
        <!--视频列表-->
        <div class="el-skeleton--video--list">
          <!--视频列表 元素-->
          <div
            class="el-skeleton--video--list__item"
            v-for="(item, index) in 12"
            :key="index"
          >
            <!--视频列表 元素 封面 标题 作者-->
            <el-skeleton-item
              variant="image"
              class="el-skeleton--video--list__item__img"
            />
            <el-skeleton-item
              class="el-skeleton--video--list__item__name"
              variant="text"
            />
            <el-skeleton-item
              class="el-skeleton--video--list__item__name"
              variant="text"
            />
          </div>
        </div>
      </template>
      <!--内容区域-->
      <template #default>
        <InfiniteList
          :request="getAllVideoGroupList"
          columns="1fr 1fr 1fr 1fr"
          :hasMore="videoList.hasMore"
          rows=""
        >
          <videoPreviewListItem
            v-for="(item, index) in videoList.list"
            :key="index"
            :item="item.data"
            :contextMenu="contextMenuVideoList"
            :removeCallback="removeCallback"
            :rubbish="true"
          />
        </InfiniteList>
      </template>
    </el-skeleton>
    <!--弹窗-->
    <VideoTag :videoTagList="videoTagList" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  CategoryVideoListItem,
  VideoTagItem,
  VideoCategoryItem,
} from "i/api/api_video.d";
import {
  getVideoCategory,
  getVideoTag,
  getVideoAll,
  getVideoGroup,
} from "@/api/api_video";
import { contextMenuVideoList } from "@/contextMenu/video/normal";

//路由实例
let route = useRoute();
let router = useRouter();

let elMessage = inject("message") as any;

//当前的视频分类名字
let currentVideoCategoryName = ref<string>("");
//当前的视频分类id
let currentVideoId = ref<number>(0);
//视频标签列表弹窗
let dialogVideoTagVisible = ref<boolean>(false);
provide("dialogVisible", dialogVideoTagVisible);
//视频类别
let videoCategory = ref<VideoCategoryItem[]>([]);
//视频标签列表
let videoTagList = ref<VideoTagItem[]>([]);
//视频列表
let videoList = reactive<{
  isLoading: boolean;
  list: CategoryVideoListItem[];
  hasMore: boolean;
  offset: number;
}>({
  isLoading: true,
  list: [],
  hasMore: true,
  offset: 0,
});

//计算当前视频列表一共有多少
let computedListLength = computed(() => videoList.list.length);

//监听id改变
watch(
  () => route.query,
  (toQuery) => {
    if (toQuery.id) {
      videoList.isLoading = true;
      videoList.offset = 0;
      videoList.list = [];
      videoTagList.value.forEach((item) => {
        if (item.id === Number(toQuery.id)) {
          currentVideoCategoryName.value = item.name;
          currentVideoId.value = item.id;
        }
      });
      getAllVideoGroupList();
    }
    if (toQuery.category) {
      currentVideoCategoryName.value = String(toQuery.category);
    }
  }
);

//请求视频标签列表
let getVideoTagList = async () => {
  //根据路由参数进行初始化
  let id = route.query.id;
  let category = route.query.category;
  if (id) {
    currentVideoId.value = Number(id);
  }
  if (category) {
    currentVideoCategoryName.value = String(category);
  }
  try {
    let { data } = await getVideoTag();
    data.forEach((item) => {
      if (item.id === currentVideoId.value) {
        currentVideoCategoryName.value = item.name;
      }
    });
    data.unshift({
      id: 0,
      name: "全部",
    });
    videoTagList.value = data;
  } catch (e: any) {
    elMessage.error(e?.message || "请求视频标签列表失败 请检查你的网络是否有问题?");
  }
};

//请求视频分类类别
let getVideoCategoryList = async () => {
  try {
    let res = await getVideoCategory();
    videoCategory.value = res.data;
  } catch (e: any) {
    elMessage.error(e?.message || "请求视频分类类别失败 请检查你的网络是否有问题?");
  }
};

//打开弹窗
let openDialogVideoTag = () => {
  dialogVideoTagVisible.value = !dialogVideoTagVisible.value;
};

//请求所有视频
let getAllVideoGroupList = async () => {
  try {
    let res;
    if (currentVideoId.value === 0) {
      res = await getVideoAll(videoList.offset, currentVideoId.value);
    } else {
      res = await getVideoGroup(videoList.offset, currentVideoId.value);
    }
    videoList.hasMore = res.hasmore;
    if (res.datas.length) {
      videoList.offset += res.datas.length;
      //返回回来的数据好像有live（直播），先去除掉吧 因为好像都是视频
      res.datas = res.datas.filter((item) => {
        return !item.data.liveData;
      });
      videoList.list.push(...res.datas);
    }

    setTimeout(() => {
      videoList.isLoading = false;
    }, 100);
  } catch (e: any) {
    elMessage.error(e?.message || "请求视频列表失败 请检查你的网络是否有问题?");
  }
};

//切换标签 这里跳转链接 需要重置请求
let switchVideoCategory = (id: number, category: string) => {
  router.replace({
    path: "/video",
    query: {
      id,
      category,
    },
  });
};

//不感兴趣的回调事件
let removeCallback = (vid: string) => {
  let index = videoList.list.findIndex((video) => video.data.vid === vid);
  if (index !== -1) {
    videoList.list.splice(index, 1);
  }
};

onMounted(() => {
  getVideoTagList();
  getVideoCategoryList();
  getAllVideoGroupList();
});
</script>

<style scoped lang="scss">
/**样式复用 */
@mixin list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 20px;
}

@mixin list__item {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

@mixin list__item__img {
  width: 100%;
  height: 200px;
}

@mixin list__item__name {
  height: 20px;
  margin-top: 10px;
}

/**头部 标签 */
.video--tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/**标签选择 */
.tag--chose {
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(224, 224, 224, 1);
  padding: 5px;
}

/**所有的热门视频标签*/
.tag--hotTag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;

  span {
    line-height: 20px;
  }
}

/**骨架屏 */
/**视频列表 */
.el-skeleton--video--list {
  @include list;
}

/**视频列表元素 */
.el-skeleton--video--list__item {
  @include list__item;
}

/**视频列表封面 */
.el-skeleton--video--list__item__img {
  @include list__item__img;
}
/**视频列表元素 标题 作者  */
.el-skeleton--video--list__item__name {
  @include list__item__name;
}

/**列表区域 */
.video--list {
  @include list;
}
</style>
