<template>
  <!--分享的弹窗 因为接口不支持图片 所以不做-->
  <el-dialog
    v-model="sharePopup.childPrivateLetterShareShow"
    title="私信分享"
    width="30%"
    center
    destroy-on-close
    :modal="false"
    :before-close="closeDialog"
    :lock-scroll="false"
  >
    <div class="share">
      <span>分享给：</span>
      <span
        style="margin-left: 5px"
        v-for="item in sharePopup.checkUserNames"
        :key="item"
        >{{ item }}</span
      >
    </div>
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
      placeholder="想说点什么"
      :input-style="{
        borderRadius: '4px 4px 0px 0px',
      }"
    />
    <!--表情 at 话题-->
    <div class="share--btn">
      <BtnIcon type="privateLetter" />
    </div>
    <!--分享的来源 有MV 歌曲 视频 评论等等 这里只展示一行 多了的话就...-->
    <div class="share--source">
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
        <el-button @click="sharePopup.closeChildPrivateLetterShare">关闭</el-button>
        <el-button type="primary" @click="sharePrivateLetter">分享</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { setPrivateLetter } from "@/api/api_message";
import { useSharePopupStore } from "@/store/sharePopup";
import { loginCallback } from "@/utils/login";

let sharePopup = useSharePopupStore();

let elMessage: any = inject("message") as any;

//计算样式
let computedSourceType = computed(() => {
  if (sharePopup.childSpaceWindowSource === "noresource") return "share--reply";
});

//分享到私信
let sharePrivateLetter = () => {
  loginCallback(async () => {
    try {
      let res = await setPrivateLetter(
        sharePopup.childSpaceWindowId,
        sharePopup.privateLetterType,
        Array.from(sharePopup.checkUserIds),
        sharePopup.shareContent
      );

      console.log("res", res);
      if (res.code === 200) {
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
      sharePopup.closeChildPrivateLetterShare();
    }
  });
};

//关闭弹窗
let closeDialog = (done: () => void) => {
  sharePopup.closeChildPrivateLetterShare();
  done();
};
</script>

<style scoped lang="scss">
@mixin container {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  padding: 5px 11px;
}

.share {
  margin-bottom: 10px;
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
