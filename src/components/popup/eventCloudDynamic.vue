<template>
  <!--转发的弹窗 因为接口不支持图片 所以不做-->
  <el-dialog
    v-model="sharePopup.childEventWindowShow"
    title="转发"
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
    <!--footer-->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="sharePopup.closeChildEvent">关闭</el-button>
        <el-button type="primary" @click="shareCloud">转发</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { eventShare } from "@/api/api_event";

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
      let { code } = await eventShare(
        sharePopup.shareContent,
        sharePopup.childEventWindowId,
        sharePopup.childEventWindowUserId
      );
      if (code === 200) {
        elMessage.success("转发成功");
        //执行回调事件
        sharePopup.childSpaceWindowCallback &&
          sharePopup.childSpaceWindowCallback({ status: "success" });
      }
    } catch (e: any) {
      elMessage.error(e?.message || "转发失败 请检查你的网络是否有问题?");
      sharePopup.childSpaceWindowCallback &&
        sharePopup.childSpaceWindowCallback({ status: "error" });
    } finally {
      sharePopup.closeChildEvent();
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
  height: 20px;
}

//评论转发别人
.share--reply {
  color: rgb(80, 125, 175, 1);
}
</style>
