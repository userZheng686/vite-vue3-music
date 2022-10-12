<template>
  <!--热评列表-->
  <div class="hot-comment" v-for="item in props.hotComments" :key="item.commentId">
    <CommentListItem :item="item" :id="props.id" :resourceType="props.resourceType" :isShowDelBtn="isShowDelBtn(item)" />
    <el-divider />
  </div>
  <!--是否更多评论-->
  <el-button
    v-if="props.hotMore"
    style="margin: 10px auto; display: flex"
    :icon="ArrowRight"
    round
    @click="jumpHotComment"
    >更多精彩评论</el-button
  >
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { VideoCommentItem } from "i/api/api_comment.d";
import { useRouter } from "vue-router";
//控制header是否显示
import { useHeader } from "@/store/header";
import { useUserInformation } from "@/store/user";

//0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
type ResourceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  hotComments: VideoCommentItem[];
  hotMore: boolean;
  id: string | number;
  resourceType: ResourceType;
  stick?: Function;
}

let props = defineProps<Props>();
let user = useUserInformation()
//是否展开歌曲详情
let isSongDetailVisible = inject("songDetailVisible") as Ref<boolean>;
let router = useRouter();
//header
let header = useHeader();

//跳转到热评页面
let jumpHotComment = () => {
  isSongDetailVisible.value = false;
  header.setHeaderVisible(false);
  router.push({
    path: "/resourceHotComment",
    query: {
      id: props.id,
      resourceType: props.resourceType,
    },
  });
};

//是否展示删除按钮
let isShowDelBtn = computed(() => {
  return function(item : VideoCommentItem) {
    return item?.user?.userId === user?.user_profile?.userId
  }
})
</script>

<style scoped lang="scss"></style>
