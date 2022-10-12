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
            :checked="checkCategoryName.includes(items.name)"
            v-for="items in item.list"
            :key="items.category"
            @click="checkId(items.name)"
            >{{ items.name }}</el-check-tag
          >
        </div>
      </div>
    </el-scrollbar>
    <!--视频标签列表页脚-->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { EditSongMenuCategoryItem } from "i/api/api_playList.d";
// let elMessage = inject("message") as any;

let dialogVisible = inject("dialogVisible") as Ref<boolean>;
let checkCategoryName = inject("checkCategory") as Ref<string[]>;

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
    list: EditSongMenuCategoryItem[];
  }>;
  updateSongMenuDetail?: Function;
}
let props = defineProps<Props>();

//选中标签id
let checkId = (name: string) => {
  let index = checkCategoryName.value.indexOf(name);
  if (index !== -1) {
    checkCategoryName.value.splice(index, 1);
  } else {
    if (checkCategoryName.value.length >= 3) return;
    checkCategoryName.value.push(name);
  }
};

//确定
let sure = () => {
  props.updateSongMenuDetail &&
    props.updateSongMenuDetail(checkCategoryName.value.join(";"));
  dialogVisible.value = false;
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
