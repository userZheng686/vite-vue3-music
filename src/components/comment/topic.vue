<template>
  <!--话题-->
  <div class="topic">
    <el-select v-model="topic" filterable placeholder="为你推荐" @change="change">
      <el-option
        v-for="item in topicList"
        :key="item.title"
        :label="item.title"
        :value="item.title"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { getHotTopic } from "@/api/api_topic";
import { getRandomArrayElements } from "@/utils/random";
import { useSharePopupStore } from "@/store/sharePopup";
let sharePopup = useSharePopupStore();

let elMessage = inject("message") as any;

let topicList = ref<
  Array<{
    actId: number;
    title: string;
  }>
>([]);

//关闭话题组件
let closeTopic = () => {
  if (sharePopup.childSpaceWindowShow) {
    sharePopup.shareTopic = false;
  } else {
    sharePopup.topic = false;
  }
};

let topic = ref<string>("");

//请求热门话题
let getHotTopicList = async () => {
  try {
    let { hot } = await getHotTopic();
    hot = getRandomArrayElements(hot, 15);
    hot.forEach((item) => {
      item.title = "#" + item.title + "#";
    });
    topicList.value = hot;
  } catch (e: any) {
    elMessage.error(e?.message || "请求热门话题失败 请检查你的网络是否有问题?");
  }
};

/**
 ** [@sasdsa#anything]#@###
 */

//处理内容 这里用栈来实现替换
let updateContent = (): string => {
  let copyContent = "";
  if (sharePopup.childSpaceWindowShow) {
    copyContent = sharePopup.shareContent;
  } else {
    copyContent = sharePopup.content;
  }
  //栈
  let stack = [];
  //字符串
  let str = "";
  //字符串数组 anything
  let strArr = [];
  for (let i = 0; i < copyContent.length; i++) {
    if (copyContent[i] === "#") {
      if (stack[0] === "#") {
        stack.pop();
        strArr.push("#" + str + "#");
      } else {
        strArr.push(str);
        stack.push("#");
      }
      str = "";
      continue;
    } else {
      str += copyContent[i];
    }
  }
  //遍历 从strArr开始
  for (let i = 0; i < strArr.length; i++) {
    if (strArr[i] === "#输入想说的话题#") {
      //标记 对strArr元素修改
      strArr[i] = topic.value;
      break;
    }
  }

  //如果什么都没找到 那就直接赋值上去吧
  if (strArr[strArr.length - 1].indexOf("#")) {
    strArr.push(topic.value);
  }

  //返回修改后的字符串
  return strArr.join("") + str;
};

//值改变
let change = () => {
  let newContent = updateContent();
  if (sharePopup.childSpaceWindowShow) {
    sharePopup.shareContent = newContent + " ";
  } else {
    sharePopup.content = newContent + " ";
  }
  closeTopic();
};

getHotTopicList();
</script>

<style scoped lang="scss">
.topic {
  width: 500px;
  font-size: 14px;
  position: absolute;
  left: 58px;
  top: 35px;
}
</style>
