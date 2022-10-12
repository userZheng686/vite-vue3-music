<template>
  <section>
    <!--组件-->
    <transition name="el-fade-in">
      <keep-alive>
        <component :is="componentMap.list.get(albumKey)"> </component>
      </keep-alive>
    </transition>
    <el-button
      v-if="isMore && albumKey !== 'chartList'"
      style="margin: 10px auto; display: flex; align-items: center"
      type="danger"
      @click="getArtistAlbumList()"
      >加载更多</el-button
    >
  </section>
</template>

<script setup lang="ts">
import { Ref } from "vue";

import { useRoute } from "vue-router";

let route = useRoute();
const loadingComponent = ref<null | HTMLElement>(null);
let getArtistAlbumList = inject("getArtistAlbumList") as Function;
let albumKey = inject("albumKey") as Ref<string>;
let isMore = inject("isMore") as Ref<boolean>;

//引入组件
let shallowChartList = markRaw(
  defineAsyncComponent(() => import("c/artists/albumType/chartList.vue"))
);
let shallowList = markRaw(
  defineAsyncComponent(() => import("c/artists/albumType/list.vue"))
);
let shallowPicturePreview = markRaw(
  defineAsyncComponent(() => import("c/artists/albumType/picturePreview.vue"))
);

//map component
let componentMap = reactive<{
  list: Map<string, any>;
}>({
  list: new Map(),
});

//设置路由map
let setMap = () => {
  componentMap.list.set("chartList", shallowChartList);
  componentMap.list.set("list", shallowList);
  componentMap.list.set("picturePreview", shallowPicturePreview);
};

onMounted(() => {
  setMap();
});

onActivated(() => {
  getArtistAlbumList();
});
</script>

<style scoped lang="scss"></style>
