<template>
  <!--歌单收藏 弹窗-->
  <el-dialog
    v-model="songMenu.collectSongMenuShow"
    title="收藏到歌单"
    @close="songMenu.collectSongMenuShow = false"
    width="30%"
    :modal="false"
    center
  >
    <!--新建歌单-->
    <div
      class="create--songMenu"
      @click="
        songMenu.collectSongMenuShow = false;
        songMenu.createSongMenuShow = true;
      "
    >
      <!--歌单封面-->
      <div class="create--img common--img">
        <el-icon class="like">
          <Plus />
        </el-icon>
      </div>
      <!--歌单标题-->
      <div class="create--title">新建歌单</div>
    </div>
    <!--用户创建的歌单-->
    <div style="height: 400px; overflow-y: scroll">
      <div
        class="songMenu--list"
        v-for="item in createSongList"
        :key="item.id"
        @click="collectSongToSongMenu(item.id)"
      >
        <!--歌单封面-->
        <DefaultImage
          :picUrl="item.coverImgUrl"
          :param="500"
          :lazy="false"
          :y="500"
          loadingWidth="50px"
          loadingHeight="50px"
          style="width: 100px; height: 100px"
        />
        <!--歌单标题-->
        <div class="create--title">
          <div>{{ item.name }}</div>
          <div style="margin-top: 10px">
            {{ item.trackCount + item.cloudTrackCount }}首音乐
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useUserInformation } from "@/store/user";
//从store取数据
import { useSongStore } from "@/store/playList";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";

//收藏歌曲到歌单
import { addSongToSongMenu } from "@/api/api_playList";

//接口声明
import { playlist } from "i/api/api_playList.d";
import { loginCallback } from "@/utils/login";

let elMessage = inject("message") as any;
//用户信息
let userInfo = useUserInformation();
//歌曲列表
let songList = useSongStore();
//弹窗显示
let songMenu = useSongMenuPopupStore();

//歌单列表
let createSongList = ref<Array<playlist>>([]);

//获取用户的歌单（创建）
let getUserCreateSongMenuList = () => {
  createSongList.value = userInfo.songMenu.filter((item) => {
    return item.userId === userInfo.user_profile.userId;
  });
};

//收藏歌曲到歌单
let collectSongToSongMenu = (id: number) => {
  loginCallback(async () => {
    try {
      let ids = songMenu.collectSongIds.join(",");
      await addSongToSongMenu("add", Number(id), ids);
      elMessage.success("收藏成功");
      //关闭弹窗
      songMenu.collectSongMenuShow = false;
      //更新歌单信息
      userInfo.updateSoneMenu();
      songMenu.collectSongIds = [];
    } catch (e: any) {
      elMessage.error(e?.body?.message || "收藏失败");
    }
  });
};

//侦听用户歌单列表
watchEffect(() => {
  if (userInfo.songMenu?.length) {
    getUserCreateSongMenuList();
  }
});
</script>

<style lang="scss" scoped>
//新建歌单
.create--songMenu,
.songMenu--list {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
}

.songMenu--list:hover {
  background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
}

//新建歌单 封面
.create--img {
  background-color: rgba(239, 241, 241, 1);

  i {
    font-size: 28px;
  }
}

//歌单 封面
.common--img {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

//新建歌单 标题
.create--title {
  font-size: 16px;
  margin-left: 2vw;
}
</style>
