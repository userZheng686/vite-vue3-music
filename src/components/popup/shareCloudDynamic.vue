<template>
  <!--分享的弹窗 因为接口不支持图片 所以不做-->
  <el-dialog
    v-model="sharePopup.childSpaceWindowShow"
    title="分享到云音乐动态"
    width="30%"
    center
    destroy-on-close
    :modal="false"
    :lock-scroll="false"
  >
    <!--输入框 主要是用户输入的文字-->
    <el-input
      v-model="sharePopup.shareContent"
      :rows="2"
      class="textarea"
      type="textarea"
      :autosize="true"
      resize="none"
      :maxlength="140"
      show-word-limit
      @keyup="enterEvUp($event)"
      @keydown="enterEv($event as KeyboardEvent)"
      placeholder="想说点什么"
      :input-style="{
        borderRadius: '4px 4px 0px 0px',
      }"
    />
    <!--表情 at 话题-->
    <div class="share--btn">
      <BtnIcon type="cloud" />
    </div>
    <!--分享的来源 有MV 歌曲 视频 评论等等 这里只展示一行 多了的话就...-->
    <div class="share--source">
      <!--这里用inject注入依赖 内容由外部的组件决定 然后接受就祖组件的注入-->
      <!--左中右结构 左边是图片 中间来源名 右边是文案-->
      <div class="source--img" v-if="sharePopup.childSpaceWindowImg">
        <DefaultImage
          :picUrl="sharePopup.childSpaceWindowImg"
          :param="28"
          loadingWidth="14"
          loadingHeight="14"
          :y="28"
          style="width: 28px; height: 28px"
        />
      </div>
      <div class="source--name" :class="computedSourceType">
        {{ sharePopup.childSpaceWindowType + ":" }}
      </div>
      <div
        class="source--content single-clamp"
        v-html="sharePopup.childSpaceWindowContent"
      ></div>
    </div>
    <!--footer-->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="sharePopup.closeChildSpace">关闭</el-button>
        <el-button type="primary" @click="shareCloud">分享</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getShareResource } from "@/api/api_share";

import { useSharePopupStore } from "@/store/sharePopup";
import { loginCallback } from "@/utils/login";

let sharePopup = useSharePopupStore();

let elMessage: any = inject("message") as any;

//计算样式
let computedSourceType = computed(() => {
  if (sharePopup.childSpaceWindowSource === "noresource") return "share--reply";
});

//监听键盘
let enterEvUp = (e: KeyboardEvent) => {
  if (sharePopup.shareContent[sharePopup.shareContent.length - 1] === "@") {
    sharePopup.shareAt = true;
  } else {
    sharePopup.shareAt = false;
  }
  if (sharePopup.shareContent[sharePopup.shareContent.length - 1] === "#") {
    sharePopup.shareTopic = true;
  } else {
    sharePopup.shareTopic = false;
  }
};

//监听键盘输入事件
let enterEv = (e: KeyboardEvent) => {
  const { keyCode, code } = e;
  const isAtCode =
    ((keyCode === 229 && e.key === "@") ||
      (keyCode === 229 && e.code === "Digit2") ||
      keyCode === 50) &&
    e.shiftKey;
  const isTopicCode =
    ((keyCode === 229 && e.key === "#") ||
      (keyCode === 229 && e.code === "Digit3") ||
      keyCode === 50) &&
    e.shiftKey;
  if (isAtCode) sharePopup.shareAt = true;
  else {
    if (sharePopup.shareContent[sharePopup.shareContent.length - 1] === "@") {
      sharePopup.shareAt = true;
    } else {
      sharePopup.shareAt = false;
    }
  }
  if (isTopicCode) sharePopup.shareTopic = true;
  else {
    if (sharePopup.shareContent[sharePopup.shareContent.length - 1] === "#") {
      sharePopup.shareTopic = true;
    } else {
      sharePopup.shareTopic = false;
    }
  }
};

//分享到动态
let shareCloud = () => {
  loginCallback(async () => {
    try {
      let { code } = await getShareResource(
        sharePopup.childSpaceWindowId,
        sharePopup.childSpaceWindowSource,
        sharePopup.shareContent
      );
      if (code === 200) {
        if (sharePopup.childSpaceWindowCount) {
          sharePopup.childSpaceWindowCount++;
        }
        elMessage.success("分享成功");
        //执行回调事件
        sharePopup.childSpaceWindowCallback &&
          sharePopup.childSpaceWindowCallback({ status: "success" });
      }
    } catch (e: any) {
      elMessage.error(e?.message || "分享失败 请检查你的网络是否有问题?");
      sharePopup.childSpaceWindowCallback &&
        sharePopup.childSpaceWindowCallback({ status: "error" });
    } finally {
      sharePopup.closeChildSpace();
    }
  });
};
</script>

<style scoped lang="scss">
@mixin container {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  padding: 5px 11px;
}

//文本
.textarea {
  :deep(.el-textarea__inner) {
    border-right: 1px solid var(--el-input-border-color, var(--el-border-color));
    box-shadow: 1px 1px 1px 0 var(--el-input-border-color, var(--el-border-color)) inset;
  }

  :deep(.el-input__count) {
    bottom: -22px;
  }
}

//分享 表情 at 话题
.share--btn {
  /* @include container; */
  padding: 5px 11px;
  border: 1px solid var(--el-input-border-color, var(--el-border-color));
  border-top: 0;
  border-bottom: 0;
  height: 20px;
}

//分享的来源 有歌曲 MV 评论 等
.share--source {
  @include container;
  display: flex;
  align-items: center;
}

//封面
.source--img {
  margin-right: 5px;
}

//内容
.source--content {
  flex: 1;
}

//评论转发别人
.share--reply {
  color: rgb(80, 125, 175, 1);
}
</style>
