<template>
  <!--分享 或者 评论的时候 输入框下面的按钮 icon-->
  <div class="btn--icon">
    <!--表情 icon-->
    <i
      class="iconfont icon-biaoqing"
      @click="
        hiddenDialog('emoji');
        handleInputEmotion();
      "
    ></i>
    <!--at icon-->
    <i
      class="iconfont icon-aite"
      v-if="isPrivateLetterShow"
      @click="
        hiddenDialog('at');
        handleInputAt();
      "
    ></i>
    <!--话题 icon-->
    <i
      class="iconfont icon-huati"
      v-if="isPrivateLetterShow"
      @click="
        hiddenDialog('topic');
        handleInputTopic();
      "
    ></i>
    <!--表情包做成组件-->
    <Emoticon v-if="showEmotion" />
    <!--@做成组件-->
    <At v-if="showAt" />
    <!--话题-->
    <Topic v-if="showTopic" />
  </div>
</template>

<script setup lang="ts">
import { useSharePopupStore } from "@/store/sharePopup";
interface Props {
  type?: string;
}

let props = defineProps<Props>();

let sharePopup = useSharePopupStore();

//隐藏其他的弹窗
let hiddenDialog = (type: string) => {
  if (type === "emoji") {
    if (sharePopup.childSpaceWindowShow) {
      sharePopup.shareAt = false;
      sharePopup.shareTopic = false;
    } else {
      sharePopup.at = false;
      sharePopup.topic = false;
    }
  } else if (type === "at") {
    if (sharePopup.childSpaceWindowShow) {
      sharePopup.shareEmotion = false;
      sharePopup.shareTopic = false;
    } else {
      sharePopup.emotion = false;
      sharePopup.topic = false;
    }
  } else if (type === "topic") {
    if (sharePopup.childSpaceWindowShow) {
      sharePopup.shareEmotion = false;
      sharePopup.shareAt = false;
    } else {
      sharePopup.emotion = false;
      sharePopup.at = false;
    }
  }
};

//处理表情输入
let handleInputEmotion = () => {
  if (sharePopup.childSpaceWindowShow) {
    sharePopup.shareEmotion = true;
  } else if (sharePopup.childPrivateLetterShareShow) {
    sharePopup.privateLetterEmotion = true;
  } else {
    sharePopup.emotion = true;
  }
};

//处理aite输入
let handleInputAt = () => {
  if (!sharePopup.childSpaceWindowShow) {
    sharePopup.content += "@";
    sharePopup.at = true;
  } else {
    sharePopup.shareContent += "@";
    sharePopup.shareAt = true;
  }
};

//处理topic输入
let handleInputTopic = () => {
  if (!sharePopup.childSpaceWindowShow) {
    let copyContent = sharePopup.content;
    if (!copyContent.match(/#输入想说的话题#/)) {
      sharePopup.content += "#" + "输入想说的话题" + "#";
    }
    sharePopup.topic = true;
  } else {
    let copyContent = sharePopup.shareContent;
    if (!copyContent.match(/#输入想说的话题#/)) {
      sharePopup.shareContent += "#" + "输入想说的话题" + "#";
    }
    sharePopup.shareTopic = true;
  }
};

//判断是否是私信分享 如果是就不展示@和#
let isPrivateLetterShow = computed(() => {
  if (sharePopup.childPrivateLetterShareShow || props.type === "privateLetter") {
    return false;
  } else {
    return true;
  }
});

let showEmotion = computed(() => {
  if (props.type === "cloud" && sharePopup.childSpaceWindowShow) {
    return sharePopup.shareEmotion;
  } else if (props.type === "privateLetter" && sharePopup.childPrivateLetterShareShow) {
    return sharePopup.privateLetterEmotion;
  } else {
    return sharePopup.emotion;
  }
});

let showAt = computed(() => {
  if (props.type === "cloud" && sharePopup.childSpaceWindowShow) {
    return sharePopup.shareAt;
  } else if (props.type === "privateLetter") {
    return false;
  } else {
    return sharePopup.at;
  }
});

let showTopic = computed(() => {
  if (props.type === "cloud" && sharePopup.childSpaceWindowShow) {
    return sharePopup.shareTopic;
  } else if (props.type === "privateLetter") {
    return false;
  } else {
    return sharePopup.topic;
  }
});
</script>

<style scoped lang="scss">
.btn--icon {
  position: relative;
  width: 90px;

  i {
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
