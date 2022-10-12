<template>
  <!--分享的弹窗 因为接口不支持图片 所以不做-->
  <el-dialog
    v-model="sharePopup.mainShareWindowShow"
    title="分享到"
    width="17%"
    center
    destroy-on-close
    :modal="false"
    :lock-scroll="false"
  >
    <div
      class="share--item"
      @click="sharePopup.openChildSpace"
      v-show="sharePopup.menuList.space"
    >
      <img
        src="@/assets/image/wyy.jpg"
        width="25"
        height="25"
        alt="wyy"
        style="border-radius: 8px"
      />
      <span class="item__right">云音乐动态</span>
    </div>
    <div
      class="share--item"
      @click="sharePopup.openChildPrivateLetter"
      v-show="sharePopup.menuList.privateLetter"
    >
      <i class="iconfont icon-sixin icon-circle"></i>
      <span class="item__right">私信分享</span>
    </div>
    <div class="share--item" @click="qqShare()" v-show="sharePopup.menuList.qq">
      <i class="iconfont icon-QQ icon-circle"></i>
      <span class="item__right">QQ好友分享</span>
    </div>
    <div class="share--item" @click="qqSpaceShare()" v-show="sharePopup.menuList.qqSpace">
      <i class="iconfont icon-qqkongjian icon-circle"></i>
      <span class="item__right">QQ空间分享</span>
    </div>
    <div
      class="share--item"
      @click="sharePopup.openChildWX"
      v-show="sharePopup.menuList.WX"
    >
      <i class="iconfont icon-weixin icon-circle"></i>
      <span class="item__right">微信好友分享</span>
    </div>
    <div class="share--item" @click="copyLink()" v-show="sharePopup.menuList.link">
      <i class="iconfont icon-lianjie icon-circle"></i>
      <span class="item__right">复制链接</span>
    </div>
  </el-dialog>
  <ShareCloudDynamic />
  <PrivateLetter />
  <PrivateLetterShare />
  <WxCode />
</template>

<script lang="ts" setup>
import { useSharePopupStore } from "@/store/sharePopup";
import { useClipboard } from "@vueuse/core";

let sharePopup = useSharePopupStore();
let source = computed(() => sharePopup.source);
let elMessage = inject("message") as any;

const { text, copy, copied, isSupported } = useClipboard({ source });

let copyLink = () => {
  elMessage.success("复制成功");
  copy();
  sharePopup.closeChildSpace();
};

let qqShare = () => {
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(sharePopup.qqShareLink);
  } else {
    window.open(sharePopup.qqShareLink);
  }
  sharePopup.closeChildSpace();
};

let qqSpaceShare = () => {
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(sharePopup.qqSpaceShareLink);
  } else {
    window.open(sharePopup.qqSpaceShareLink);
  }
  sharePopup.closeChildSpace();
};
</script>

<style scoped lang="scss">
.share--item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  cursor: pointer;

  i {
    font-size: 16px;
  }

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.icon-circle {
  background-color: var(--dark-circle, rgb(242, 242, 242));
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item__right {
  margin-left: 10px;
}
</style>
