<template>
  <!--操作按钮 对应喜欢-->
  <i class="iconfont" style="font-size: 12px; cursor: pointer" :class="{
    'icon-xihuanfill like': computedLikeMusic,
    'icon-xihuan1': !computedLikeMusic,
  }" @click="operateMusic"></i>
</template>

<script setup lang="ts">
//收藏歌曲到歌单
import { addSongToSongMenu } from "@/api/api_playList";

//接口定义
import { playlist } from "i/api/api_playList.d";

interface props {
  item: any;
  songMenu: playlist[];
  likes: number[];
  updateLikes: Function;
}

let props = defineProps<props>();

let elMessage = inject("message") as any;

//是否是喜欢的音乐
let computedLikeMusic = computed(() => {
  if (props.item.id) {
    return props.likes.includes(props.item.id);
  }
});

//操作 取消还是喜欢音乐
let operateMusic = async () => {
  try {
    await addSongToSongMenu(
      `${computedLikeMusic.value ? "del" : "add"}`,
      Number(props.songMenu[0].id),
      Number(props.item.id)
    );
    elMessage.success(
      `${!computedLikeMusic.value ? "已成功添加到我喜欢的音乐" : "取消喜欢成功"}`
    );
    props.updateLikes(props.item.id);
  } catch (e: any) {
    elMessage.error(e?.message || "操作失败");
  }
};
</script>

<style scoped lang="scss">
</style>
