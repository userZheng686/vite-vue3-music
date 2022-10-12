<template>
  <!--歌单标签列表弹窗-->
  <el-dialog
    v-model="updatePopupShow"
    title="调整栏目顺序"
    width="30%"
    @close="updatePopupShow = false"
    center
  >
    <div class="title info">
      <el-icon><ReadingLamp /></el-icon>
      <span>想调整首页栏目的顺序？按住右边的按钮拖动即可</span>
    </div>
    <draggable
      class="list-group"
      :component-data="{
        tag: 'ul',
        type: 'transitions-group',
        name: !drag ? 'flip-list' : null,
      }"
      v-model="recommendMenuList"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
      item-key="order"
    >
      <template #item="{ element }">
        <div class="list-group-item">
          <i
            :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
            @click="element.fixed = !element.fixed"
            aria-hidden="true"
          ></i>
          {{ element.name }}
        </div>
      </template>
    </draggable>
    <div class="resume info" @click="resume">恢复默认排序</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updatePopupShow = false">关闭</el-button>
        <el-button type="primary" @click="updatePopupShow = false">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { recommendMenuList } from "@/localStorage/init";
import { Ref } from "vue";

let drag = ref<boolean>(false);

let dragOptions = computed(() => {
  return {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };
});

let updatePopupShow = inject("updatePopupShow") as Ref<boolean>;

let sure = () => {};

//恢复原来排序
let resume = () => {
  recommendMenuList.value.sort((a, b) => {
    return a.order - b.order;
  });
};
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
}

ul li {
  list-style: none;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  margin-top: 20px;
}

.list-group-item {
  list-style: none;
  cursor: move;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(250, 250, 250));
  }
}
.list-group-item i {
  cursor: pointer;
}

.resume {
  text-align: center;
  margin-top: 20px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
