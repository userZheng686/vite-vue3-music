<template>
  <!--新歌速递 新碟上架 列表封面-->
  <div class="play--image" :class="props.cursor ? 'play--image--cursor' : ''">
    <el-image
      :lazy="props.lazy"
      :style="{
        width: props.width,
        height: props.height,
        paddingBottom: props.paddingBottom,
      }"
      style="border-radius: 8px; cursor: pointer"
      :src="computedUrl"
      fit="fill"
    >
      <template #error>
        <div class="image-slot-error">
          <el-icon>
            <Picture />
          </el-icon>
        </div>
      </template>
      <template #placeholder>
        <ImageLoading width="50px" height="50px" />
      </template>
    </el-image>
    <!--播放按钮-->
    <div class="player--circle" :class="props.cursor ? 'player--circle--cursor' : ''">
      <i class="iconfont icon-bofang" style="margin-left: 2px'font-size:12px;"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Picture, Loading } from "@element-plus/icons-vue";
interface Props {
  picUrl: string;
  lazy?: boolean;
  param?: number;
  normalSize?: boolean;
  y?: number;
  width?: string;
  height?: string;
  cursor?: boolean;
  paddingBottom?: string;
}

let props = withDefaults(defineProps<Props>(), {
  picUrl: "",
  lazy: false,
  normalSize: false,
  param: 100,
  y: 100,
  width: "",
  height: "",
  cursor: false,
  paddingBottom: "100%",
});

let computedUrl = computed(() => {
  if (!props.picUrl) return "";
  if (props.picUrl.includes("base64")) {
    return props.picUrl;
  } else {
    let copyUrl = props.picUrl;
    if (!copyUrl.includes("https")) {
      copyUrl = copyUrl.replace("http", "https");
    }
    if (props.param && props.y && !props.normalSize) {
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
</script>

<style scoped lang="scss">
.play--image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play--image--cursor:hover .player--circle--cursor {
  opacity: 1;
}

.image-slot-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player--circle--cursor {
  opacity: 0;
}

:deep(.el-image) {
  position: initial;
}

:deep(.el-image__inner) {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px;
}
</style>
