<template>
  <!--视频标签列表弹窗-->
  <el-dialog
    v-model="dialogVisible"
    title="选择视频标签"
    width="55%"
    @close="dialogVisible = false"
    center
  >
    <!--视频标签列表区域-->
    <el-scrollbar height="360px" view-class="video--tag--list">
      <el-check-tag
        :checked="checkVideoTag === item.id"
        v-for="item in props.videoTagList"
        :key="item.id"
        @click="checkVideoTag = item.id"
        >{{ item.name }}</el-check-tag
      >
    </el-scrollbar>
    <!--视频标签列表页脚-->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="choseVideoTag">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { VideoTagItem } from "i/api/api_video.d";

let router = useRouter();

let dialogVisible = inject("dialogVisible") as Ref<boolean>;

/**
弹窗是否显示
当前的分类id
当前的分类名字
loading加载条 用于控制骨架屏是否显示
list列表 主要清空之前的列表内容
加载列表的方法
 */
interface Props {
  videoTagList: VideoTagItem[];
}

let props = defineProps<Props>();

/**选择的标签id  */
let checkVideoTag = ref<number>(0);

/**弹窗关闭 */
let choseVideoTag = () => {
  /**
  更新
   */
  dialogVisible.value = false;
  router.push({
    path: "/video",
    query: {
      id: checkVideoTag.value,
    },
  });
};
</script>

<style scope lang="scss">
.video--tag--list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 15px;
  row-gap: 15px;
  margin-right: 15px;
}
</style>
