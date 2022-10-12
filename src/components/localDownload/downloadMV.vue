<template>
  <section>
    <LoadingComponent v-if="loading" />
    <div class="download--mv__list" v-else-if="download.completeDownloadMVItems.length">
      <DownloadMVListItem
        v-for="item in download.completeDownloadMVItems"
        :key="item.mvId"
        :item="item"
        :contextMenu="contextMenu"
      />
    </div>
    <LocalEmpty v-else-if="download.completeDownloadMVItems.length === 0">
      <template #empty> 还没有下载的MV噢 快去下载吧~ </template>
    </LocalEmpty>
  </section>
</template>

<script setup lang="ts">
import { contextMenuLocalMVList } from "@/contextMenu/mv/localMV";
import { useDownload } from "@/store/download";
import { isTemplateElement } from "@babel/types";
//mv声明
import { downloadItem } from "i/view/videoDetail.d";

let download = useDownload();
//加载
let loading = ref<boolean>(true);

//右键菜单
let contextMenu = (event: MouseEvent, item: downloadItem) => {
  contextMenuLocalMVList(event, item);
  console.log("item", item);
};

//设置loading
let setLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  });
};

onActivated(() => {
  setLoading();
  download.updateMV();
});
</script>

<style scoped lang="scss">
.download--mv__list {
  margin-left: 30px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 20px;
}
</style>
