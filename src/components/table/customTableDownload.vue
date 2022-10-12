<template>
  <!--操作按钮 对应下载-->
  <i
    v-if="isDownload === 'beginning'"
    class="iconfont icon-xiazai gray"
    style="cursor: pointer; font-size: 12px"
    title="下载"
    @click="downloadMusic(props.item)"
  ></i>
  <i
    v-else-if="isDownload === 'complete'"
    class="iconfont icon-xiazaiwancheng1"
    style="cursor: pointer; font-size: 12px; color: rgb(80, 125, 75)"
    title="下载完成"
  ></i>
  <i
    v-else-if="isDownload === 'loading'"
    class="iconfont icon-loading is-loading"
    style="cursor: pointer; font-size: 12px"
    title="下载中"
  ></i>
</template>

<script setup lang="ts">
//下载音乐
import { downloadMusic } from "@/utils/download";

//歌曲列表声明
import { SongDetailSongsItem } from "i/api/api_song.d";

interface props {
  item: any;
  downloadIds: number[];
}

let props = defineProps<props>();

//通过全局的downloads  来判断文件是否已经下载过了?
let isDownload = computed(() => {
  if (props?.downloadIds?.includes(props.item.id)) {
    return "complete";
  } else {
    if (props.item.progress === 0) {
      return "beginning";
    } else if (props.item.progress > 0) {
      return "loading";
    }
  }
});

//监听进度 如果100就是下载完毕
watch(
  () => props.item.progress,
  (val) => {
    if (val === 100) {
      props.downloadIds.push(props.item.id);
    }
    // ("当前下载进度", val);
  }
);
</script>

<style scoped lang="scss"></style>
