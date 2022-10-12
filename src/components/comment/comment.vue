<template>
  <div class="comment">
    <CommentControl
      :inputType="props.inputType"
      :resourceType="props.resourceType"
      :id="computedPlayListId"
      v-model:total="commentList.total"
      v-model:list="commentList.comments"
    />
    <LoadingComponent v-if="loading" />
    <div style="margin-bottom: 40px; margin-top: 20px" v-else-if="commentList.total">
      <div class="comment--title" v-if="commentList.hotComments.length">
        精彩评论 ({{ commentList.hotComments.length }})
      </div>
      <HotCommentList
        :hotComments="commentList.hotComments"
        :hotMore="commentList.hotMore"
        :id="computedPlayListId"
        :stick="stick"
        :resourceType="props.resourceType"
      />
      <div class="comment--title" v-if="commentList.total">
        最新评论({{ commentList.total }})
      </div>
      <NewCommentList
        :total="commentList.total"
        :comments="commentList.comments"
        :id="computedPlayListId"
        :resourceType="props.resourceType"
      />
    </div>
    <CommentEmpty v-else />
  </div>
</template>

<script setup lang="ts">
import {
  getPlayListComment,
  getSongComment,
  getAlbumComment,
  getDjComment,
  getVideoComment,
  getMvComment,
  getEventComment
} from "@/api/api_comment";
import { playlist } from "i/api/api_playList.d";
//分享
import { comment as commentType } from "i/view/videoDetail.d";

//0 删除 1 发送 2回复
type InputType = 0 | 1 | 2;
//0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
type ResourceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  detail?: playlist;
  id: number | string;
  inputType: InputType;
  resourceType: ResourceType;
}

let props = defineProps<Props>();

let requestMap = new Map();
requestMap.set(0, getSongComment);
requestMap.set(1, getMvComment);
requestMap.set(2, getPlayListComment);
requestMap.set(3, getAlbumComment);
requestMap.set(4, getDjComment);
requestMap.set(5, getVideoComment);
requestMap.set(6, getEventComment);

let elMessage = inject("message") as any;

//当前歌单的id
let computedPlayListId = computed(() => {
  return props?.id || 0;
});

//loading
let loading = ref<boolean>(true);
//偏移量
let offset = 0;
//评论列表
let commentList = reactive<commentType>({
  total: 0,
  hotComments: [],
  hotMore: false,
  comments: [],
});

//获取歌单评论
let getComment = async () => {
  try {
    let { comments, hotComments, more, moreHot, total } = await requestMap.get(
      props.resourceType
    )(computedPlayListId.value, 20, offset);
    commentList.total = total;
    commentList.comments = comments;
    commentList.hotComments = hotComments;
    commentList.hotMore = moreHot;
    loading.value = false;
  } catch (e: any) {
    // elMessage.error(e?.message || "请求歌单评论失败");
  } finally {
    loading.value = false;
  }
};

//初始选项
let initOption = () => {
  commentList.total = 0;
  commentList.comments = [];
  commentList.hotComments = [];
  commentList.hotMore = false;
};

//获取歌单评论
watchEffect(() => {
  if (props?.id) {
    initOption();
    loading.value = true;
    getComment();
  }
});

//更新评论数量
watch(
  () => commentList.total,
  (val) => {
    if (props.detail) {
      props.detail.commentCount = val;
    }
  }
);

let stick = () => {
  let textarea = document.querySelector(".textarea--wrap");
  textarea?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "nearest",
  });
};
</script>

<style scoped lang="scss">
.comment {
  margin-left: 30px;
  margin-right: 25px;
}
</style>
