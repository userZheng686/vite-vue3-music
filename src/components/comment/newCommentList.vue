<template>
  <!--最新评论列表-->
  <div class="new-comment" v-for="item in computedList" :key="item.commentId">
    <CommentListItem
      :item="item"
      :id="props.id"
      :resourceType="props.resourceType"
      :delComment="delComment"
      :isShowDelBtn="isShowDelBtn(item)"
    />
    <el-divider />
  </div>
  <!--分页-->
  <div class="page">
    <el-pagination
      v-model:currentPage="currentPage"
      :page-size="20"
      background
      :pager-count="9"
      :hide-on-single-page="props.total <= 20"
      layout="prev, pager, next"
      :total="props.total"
    />
  </div>
</template>

<script setup lang="ts">
import {
  getVideoComment,
  getMvComment,
  getSongComment,
  getPlayListComment,
  getAlbumComment,
  getEventComment,
  getDjComment,
} from "@/api/api_comment";
import { useUserInformation } from "@/store/user";
import { VideoCommentItem } from "i/api/api_comment.d";


let elMessage: any = inject("message") as any;
let user = useUserInformation()

//0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
type ResourceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

//这里根据资源类型和资源id来取获取评论 主要是mv 视频 歌曲等之类的资源 api参数不同 所以这些都是从父组件传过来在取值
interface Props {
  comments: VideoCommentItem[];
  total: number;
  id: string | number;
  resourceType: ResourceType;
}

let props = defineProps<Props>();

//当前页数
let currentPage = ref<number>(1);
//当前列表
let currentList = ref<VideoCommentItem[]>([]);

//对于请求的函数做一个map 根据type来选择
let requestMap = new Map();
requestMap.set(0, getSongComment);
requestMap.set(1, getMvComment);
requestMap.set(2, getPlayListComment);
requestMap.set(3, getAlbumComment);
requestMap.set(4, getDjComment);
requestMap.set(5, getVideoComment);
requestMap.set(6, getEventComment);

//计算列表 如果当前没翻页就取props
let computedList = computed(() => {
  if (currentList.value.length) {
    return currentList.value;
  } else {
    return props.comments;
  }
});

//删除评论
let delComment = (commentId : string | number) => {
  let index = computedList.value.findIndex(item => item.commentId == commentId)
  if(index !== -1) {
    computedList.value.splice(index, 1);
  }
}

//是否展示删除按钮
let isShowDelBtn = computed(() => {
  return function(item : VideoCommentItem) {
    return item?.user?.userId === user?.user_profile?.userId
  }
})

//监听翻页事件
watch(currentPage, async function (page: number) {
  try {
    //根据type来请求
    let { comments } = await requestMap.get(props.resourceType)(
      props.id,
      20,
      (page - 1) * 20
    );
    currentList.value = comments;
  } catch (e: any) {
    elMessage.error(e?.message || "请求评论列表失败 请检查你的网络是否有问题?");
  }
});
</script>

<style scoped lang="scss">
.page {
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.new-comment {
  content-visibility: auto;
}
</style>
