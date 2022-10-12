<template>
  <!--新建歌单弹窗-->
  <el-dialog
    v-model="songMenu.createSongMenuShow"
    title="新建歌单"
    @close="songMenu.createSongMenuShow = false"
    width="40%"
    :modal="false"
    :lock-scroll="false"
    center
  >
    <el-input v-model="title" placeholder="请输入新歌单标题" />
    <el-checkbox v-model="isPrivate" label="设置为隐私歌单" size="large" />
    <div
      style="
        margin: auto;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <el-button
        size="large"
        @click="createUserSongMenu"
        :disabled="title.length === 0"
        type="danger"
        round
        >创建
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
//收藏歌曲到歌单
import { addSongToSongMenu } from "@/api/api_playList";
import { createSongMenu } from "@/api/api_playList";
//用户信息
import { useUserInformation } from "@/store/user";
//从store取数据
import { useSongStore } from "@/store/playList";
//弹窗显示
import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { loginCallback } from "@/utils/login";

interface Props {
  isCollect?: boolean;
}

let props = withDefaults(defineProps<Props>(), {
  isCollect: false,
});

let elMessage = inject("message") as any;

//新歌单标题
let title = ref<string>("");
//是否为隐私
let isPrivate = ref<boolean>(false);

//用户信息
let userInfo = useUserInformation();
//歌曲列表
let songList = useSongStore();
//弹窗显示
let songMenu = useSongMenuPopupStore();

//创建歌单
let createUserSongMenu = () => {
  loginCallback(async () => {
    try {
      let { id, playlist } = await createSongMenu(
        title.value,
        isPrivate.value ? "10" : ""
      );
      userInfo.songMenu.splice(1, 0, playlist);
      elMessage.success("创建成功");
      //如果是从收藏歌单进来 那就需要把歌曲收入到歌单里面
      if (props.isCollect) {
        await addSongToSongMenu(
          "add",
          Number(id),
          Number(songList.list[songList.currentListIndex].id)
        );
        //更新歌单信息
        userInfo.updateSoneMenu();
        elMessage.success("收藏成功");
      }
      songMenu.createSongMenuShow = false;
    } catch (e: any) {
      elMessage.error(e?.message || "创建歌单失败 请检查你的网络是否有问题?");
    }
  });
};
</script>

<style></style>
