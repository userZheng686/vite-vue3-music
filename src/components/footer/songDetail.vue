<template>
  <!--回到顶部-->
  <el-backtop target=".song--detail" :right="50" :bottom="140"> </el-backtop>
  <Program v-if="openType === 'radio'" />
  <Song v-else />
</template>

<script setup lang="ts">
//从store取数据
import { useSongStore } from "@/store/playList";

//store里面的歌曲list
let songList = useSongStore();

let openType = computed(() => {
  if (songList.list[songList.currentListIndex]?.radio?.id) {
    return "radio";
  } else {
    return "song";
  }
});
</script>

<style scoped lang="scss"></style>
