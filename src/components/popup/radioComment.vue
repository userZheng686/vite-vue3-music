<template>
  <!--电台节目评论-->
  <el-dialog
    v-model="radioCommentShow.isShowRadioComment"
    :title="'声音：' + songList.list[songList.currentListIndex]?.name"
    width="30%"
    center
    @close="closeDialog"
    :modal="false"
    :lock-scroll="false"
  >
    <CommentControl
      :inputType="1"
      :resourceType="4"
      :id="songList.list[songList.currentListIndex]?.radio?.programId"
      v-model:total="props.total"
      v-model:list="props.comments"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import emitter from "@/utils/eventBus";
//从store取数据
import { useSongStore } from "@/store/playList";
//歌曲评论弹窗
import { useSongCommentStore } from "@/store/songPopup";
//接口声明
import { VideoCommentItem } from "i/api/api_comment.d";

//评论弹窗
let radioCommentShow = useSongCommentStore();

interface Props {
  total: number;
  comments: VideoCommentItem[];
}

let props = defineProps<Props>();

//store里面的歌曲list
let songList = useSongStore();

//关闭弹窗
let closeDialog = () => {
  emitter.emit("clearContent");
};
</script>

<style scoped lang="scss"></style>
