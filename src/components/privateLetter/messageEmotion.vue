<template>
  <!--表情包-->
  <div class="emotion">
    <div class="emotion--close">
      <el-icon style="cursor: pointer" @click="closeEmotion">
        <Close />
      </el-icon>
    </div>
    <div class="emotion--list">
      <div
        class="emotion--list__item"
        v-for="(item, index) in emotion"
        :key="index"
        :title="item.meaning"
        @click="updateTextarea(item.meaning)"
      >
        {{ item.show }}
      </div>
    </div>
    <div class="emotion--left" v-show="emotionDirection === 'right'">
      <el-icon @click="switchEmotion('left')">
        <ArrowLeft />
      </el-icon>
    </div>
    <div class="emotion--right" v-show="emotionDirection === 'left'">
      <el-icon @click="switchEmotion('right')">
        <ArrowRight />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emotionLeft, emotionRight } from "@/utils/filter";
import { Close, ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import { Ref } from "vue";

//当前emotion
let emotion = ref<
  Array<{
    show: string;
    meaning: string;
  }>
>(emotionLeft);
//emotion方向
let emotionDirection = ref<string>("left");
//表情组件显示
let emotionShow = inject("emotionShow") as Ref<boolean>;
//内容
let content = inject("content") as Ref<string>;

//关闭表情组件
let closeEmotion = () => {
  emotionShow.value = false;
};

//思路是将emotion分成两块 一个左一个右 然后点击的时候动态切换就可以了
let switchEmotion = (direction: string) => {
  emotionDirection.value = direction;
  if (direction === "left") emotion.value = emotionLeft;
  else emotion.value = emotionRight;
};

//更新textarea
let updateTextarea = (meaning: string) => {
  if (content.value.length + meaning.length >= 140) return;
  content.value += `[${meaning}]`;
};
</script>

<style lang="scss" scoped>
//表情
.emotion {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  background-color: white;
  width: 35vw;
  height: 280px;
  z-index: 1;
  top: -244px;
  left: -36vw;
  box-shadow: rgb(73 65 65 / 20%) 0px 4px 12px;
  border-radius: 5px;
  transition: all 0.2s;
}

//关闭
.emotion--close {
  display: flex;
  width: 100%;
  margin-top: 9px;
  font-size: 22px;
  align-items: center;
  justify-content: flex-end;
  margin-right: 14px;
}

//表情列表
.emotion--list {
  display: flex;
  flex-wrap: wrap;
  width: 85%;
  margin: auto;
  transition: all 0.2s;
}

//表情列表元素
.emotion--list__item {
  width: 20%;
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  cursor: pointer;
}

//表情列表元素 激活
.emotion--list__item:hover {
  border-radius: 5px;
  background-color: rgba(255, 237, 237, 0.965);
}

//表情列表元素 往右边
.emotion--right {
  position: absolute;
  right: 1vw;
  top: 50%;
  font-size: 18px;
  cursor: pointer;
}

.emotion--left {
  position: absolute;
  left: 1vw;
  top: 50%;
  font-size: 18px;
  cursor: pointer;
}
</style>
