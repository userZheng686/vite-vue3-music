<template>
  <!--默认图片-->
  <div class="default--img" :style="{ height: props.height ? '100%' : '' }">
    <el-image
      :lazy="props.lazy"
      :style="{
        borderRadius: computedRadius,
        paddingBottom: props.paddingBottom,
      }"
      style="width: 100%; height: 100%; cursor: pointer; borderradius: 8px"
      :src="computedUrl"
      :preview-src-list="previewList"
      :fit="props.fit"
      @error="error"
    >
      <template #error>
        <div class="image-slot-error">
          <!-- <el-image
            style="width: 100%; height: 100%"
            src="http://p3.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg?imageView&enlarge=1&type=webp"
          ></el-image> -->
          <el-icon>
            <Picture />
          </el-icon>
        </div>
      </template>
      <template #placeholder>
        <ImageLoading :width="props.loadingWidth" :height="props.loadingHeight" />
      </template>
    </el-image>
    <!--插槽-->
    <slot name="author"></slot>
    <!--中间部分 显示每日更新-->
    <slot name="dateUpdate"></slot>
    <!--轮播图-->
    <slot name="banner"></slot>
    <!--播放器组件-->
    <slot name="player"></slot>
    <!--播放数量-->
    <slot name="playCount"></slot>
    <!--立即播放-->
    <slot name="play"></slot>
    <!--热度-->
    <slot name="hot"></slot>
    <!--用户-->
    <slot name="user"></slot>
    <!--分类-->
    <slot name="tag"></slot>
    <!--数字-->
    <slot name="count"></slot>
    <!--mv-->
    <slot name="mv"></slot>
    <!--duration-->
    <slot name="duration"></slot>
  </div>
</template>

<script setup lang="ts">
import { Picture } from "@element-plus/icons-vue";
interface Props {
  picUrl: string;
  lazy?: boolean;
  height?: boolean;
  param?: number;
  y?: number;
  radius?: boolean;
  normalSize?: boolean;
  onlyHttps?: boolean;
  fit?: any;
  loadingWidth?: string;
  loadingHeight?: string;
  paddingBottom?: string;
  needPreview?: boolean;
  originUrl?: string;
}

let props = withDefaults(defineProps<Props>(), {
  picUrl: "",
  lazy: true,
  param: 194,
  height: false,
  y: 194,
  normalSize: false,
  onlyHttps: false,
  radius: true,
  fit: "fill",
  loadingWidth: "97px",
  loadingHeight: "97px",
  paddingBottom: "100%",
  needPreview: false,
});

let isNoParam = ref<boolean>(false);

let computedUrl = computed(() => {
  if (!props.picUrl) return "";
  if (props.picUrl.includes("base64")) {
    return props.picUrl;
  } else {
    let copyUrl = props.picUrl;
    if (!copyUrl.includes("https")) {
      copyUrl = copyUrl.replace("http", "https");
    }
    if (isNoParam.value) {
      return copyUrl;
    } else if (props.onlyHttps) {
      return copyUrl;
    } else if (props.param && props.y && !props.normalSize) {
      return (
        copyUrl +
        "?imageView&enlarge=1&thumbnail=" +
        props.param +
        "y" +
        props.y +
        "&type=webp"
      );
    } else {
      return copyUrl + "?imageView&enlarge=1&type=webp";
    }
  }
});

let previewList = computed(() => {
  if (props.needPreview) {
    return [props.originUrl];
  } else {
    return [];
  }
});

let error = () => {
  isNoParam.value = true;
};

let computedRadius = computed(() => {
  if (props.radius) {
    return "8px";
  } else {
    return "";
  }
});
</script>

<style scoped lang="scss">
.default--img {
  position: relative;
  overflow: hidden;

  :deep(.el-image) {
    display: block;
  }
}

:deep(.el-image-viewer__wrapper) {
  bottom: 120px;
  top: 50px;
}

.image-slot-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-image) {
  position: initial;
}

:deep(.el-image__inner) {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: v-bind(computedRadius);
  transform: scale(1);
  transition: all 0.2s;
}
</style>
