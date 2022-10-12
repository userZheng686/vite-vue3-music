<template>
  <!--歌单标签列表弹窗-->
  <el-dialog
    v-model="dialogVisible"
    title="选择歌单标签"
    width="55%"
    @close="dialogVisible = false"
    center
  >
    <!--视频标签列表区域-->
    <el-scrollbar height="360px" view-class="video--tag--list">
      <div
        class="video--tag--list__item"
        v-for="(item, index) in props.songMenuCategoryList"
        :key="index"
      >
        <div>{{ item.title }}</div>
        <div class="video--tag--list__item__category">
          <el-check-tag
            :checked="checkSongMenuCategory === items.name"
            v-for="items in item.list"
            :key="items.category"
            @click="checkSongMenuCategory = items.name"
            >{{ items.name }}</el-check-tag
          >
        </div>
      </div>
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
import { SongMenuCategoryItem } from "i/api/api_playList.d";
// let elMessage = inject("message") as any;

let dialogVisible = inject("dialogVisible") as Ref<boolean>;

let router = useRouter();

/**
弹窗是否显示
当前的分类id
当前的分类名字
loading加载条 用于控制骨架屏是否显示
list列表 主要清空之前的列表内容
加载列表的方法
 */
interface Props {
  songMenuCategoryList: Array<{
    title: string;
    list: SongMenuCategoryItem[];
  }>;
  tag: string;
}

const props = defineProps<Props>();

/**选择的标签id  */
let checkSongMenuCategory = ref<string>(props.tag);

/**弹窗关闭 */
let choseVideoTag = () => {
  /**
  更新
   */
  dialogVisible.value = false;
  router.replace({
    path: "/findMusic",
    query: {
      component: "allSongMenu",
      index: 2,
      tag: checkSongMenuCategory.value,
    },
  });
};
</script>

<style scope lang="scss">
.video--tag--list {
  margin-right: 15px;
}

.video--tag--list__item {
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 10px;
}

.video--tag--list__item__category {
  margin-left: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  flex: 1;
  row-gap: 10px;
}
</style>
