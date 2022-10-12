<template>
  <section>
    <!--组件-->
    <transition name="el-fade-in">
      <keep-alive>
        <component :is="componentMap.list.get(mode)"> </component>
      </keep-alive>
    </transition>
    <LoadingComponent v-if="loading" />
    <tableEmpty v-if="!loading && !list.length">
      <template #empty>暂无创建歌单</template>
    </tableEmpty>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { getUserRecord, getUserSongMenu } from "@/api/api_playList";
import { playlist } from "i/api/api_playList";
import { provide, Ref } from "vue";

let route = useRoute();
let router = useRouter();
let elMessage = inject("message") as any;
let offset = 0;
let mode = inject("mode") as Ref<string>;
let list = ref<playlist[]>([]);
provide("list", list);
let isMore = ref<boolean>(true);
provide("isMore", isMore);
let loading = ref<boolean>(true);

//map component
let componentMap = reactive<{
  list: Map<string, any>;
}>({
  list: new Map(),
});

//设置路由map
let setMap = () => {
  //引入组件
  let shallowChartList = markRaw(
    defineAsyncComponent(() => import("c/homePage/mode/chartList.vue"))
  );
  let shallowList = markRaw(
    defineAsyncComponent(() => import("c/homePage/mode/list.vue"))
  );
  let shallowPicturePreview = markRaw(
    defineAsyncComponent(() => import("c/homePage/mode/picturePreview.vue"))
  );
  componentMap.list.set("chartList", shallowChartList);
  componentMap.list.set("list", shallowList);
  componentMap.list.set("picturePreview", shallowPicturePreview);
};

let getUserCreatePlaylist = async () => {
  try {
    
    let { playlist, more } = await getUserSongMenu(Number(route.query.id), 1000, offset); 
    playlist = playlist.filter((item) => item.userId === Number(route.query.id));
    list.value = playlist;
    isMore.value = more;
    loading.value = false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取用户创建的歌单列表失败 请检查你的网络是否有问题?");
  }
};

onMounted(() => {
  setMap();
});

watch(
  () => route.query?.id,
  () => {
    if (route.name !== "HomePage") return;
    list.value = [];
    getUserCreatePlaylist();
  }
);

onActivated(() => {
  getUserCreatePlaylist();
});
</script>

<style scoped lang="scss"></style>
