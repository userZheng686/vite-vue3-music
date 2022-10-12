<template>
  <CommentControl
    :inputType="1"
    :resourceType="props.resourceType"
    :id="props.id"
    v-model:total="hotCommentTotal"
    v-model:list="hotCommentList"
  />
  <div class="new-comment" v-for="item in hotCommentList" :key="item.commentId">
    <CommentListItem :item="item" :resourceType="props.resourceType" :id="props.id" />
    <el-divider />
  </div>
  <el-pagination
    style="margin-top: 10px; display: flex; align-items: center; justify-content: center"
    v-model:currentPage="currentPage"
    :page-size="20"
    :pager-count="9"
    :hide-on-single-page="hotCommentTotal <= 20"
    layout="prev, pager, next"
    background
    :total="hotCommentTotal"
  />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { getCommentHot } from "@/api/api_comment";
import { VideoCommentItem } from "i/api/api_comment.d";

let elMessage = inject("message") as any;
let route = useRoute();

//0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
type ResourceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
弹窗是否显示
 */
interface Props {
  id: number | string;
  resourceType: ResourceType;
}

let props = defineProps<Props>();
let currentPage = ref<number>(1);
let offset = ref<number>(0);
let hotCommentList = ref<VideoCommentItem[]>([]);
let hotCommentTotal = ref<number>(0);

//请求热评列表接口
let getCommentHotList = async () => {
  let id: string | number = "";
  if (route?.query?.vid) {
    id = String(route.query.vid);
  } else if (route?.query?.mvid) {
    id = Number(route.query.mvid);
  }
  if (props.id && id) {
    if (props.id !== id && props.resourceType === 0) return;
  }
  try {
    let { total, hotComments } = await getCommentHot(
      id || props.id,
      props.resourceType,
      20,
      offset.value
    );
    hotCommentList.value = hotComments;
    hotCommentTotal.value = total;
  } catch (e: any) {
    // elMessage.error(e?.message || "请求热评接口列表失败 请检查网络是否有问题？");
  }
};

watch(currentPage, function (page: number) {
  offset.value = (page - 1) * 20;
  getCommentHotList();
});

onActivated(() => {
  currentPage.value = 1;
  getCommentHotList();
});
</script>

<style scoped lang="scss"></style>
