<template>
  <!--当前播放歌曲列表 根节点-->
  <el-drawer title="当前播放" size="600px" v-model="isSongListVisible" direction="rtl">
    <template #default>
      <div class="current--play">
        <!--当前播放头部 包含多少首歌曲 收藏全部和清空列表（按钮）-->
        <div class="play__top">
          <div class="total">总{{ songList.list.length }}首</div>
          <div class="btn">
            <div class="collect--all">
              <i class="iconfont icon-shoucang"></i>
              <span @click="subAll">收藏全部</span>
            </div>
            <div
              class="clear--all blue"
              @click="
                songList.list = [];
                songList.currentListIndex = 9999;
              "
            >
              清空列表
            </div>
          </div>
        </div>
        <!--列表页面-->
        <div class="play__list">
          <CustomElementTable
            layout="fixed"
            :index="true"
            :list="songList.list"
            :isShowLabel="false"
            nameMaxWidth="5vw"
            :name="true"
            :artist="true"
            :origin="true"
            row="even"
            :duration="true"
            :total="songList.list.length"
            :pageSize="songList.list.length"
          >
            <template #default>
              <div>你还没有添加任何歌曲</div>
              <div>去首页<span class="blue" @click="findMusic">发现音乐</span></div>
            </template>
          </CustomElementTable>
        </div>
      </div>
    </template>
    <template #footer> </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
//从store取数据
import { useSongStore } from "@/store/playList";
import { useRouter } from "vue-router";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";

//抽屉是否展示
let isSongListVisible = inject("songListVisible") as Ref<boolean>;
//歌曲列表
let songList = useSongStore();
//路由实例
let router = useRouter();
//收藏弹窗
let songMenu = useSongMenuPopupStore();
//search
let search = ref<string>("");
provide("search", search);

//跳转首页
let findMusic = () => {
  isSongListVisible.value = false;
  router.push({ path: "/findMusic" });
};

//收藏全部
let subAll = () => {
  songMenu.collectSongIds = songList.list.map((item) => Number(item.id));
  songMenu.collectSongMenuShow = true;
};
</script>

<style lang="scss" scoped>
//当前播放列表
.current--play {
  display: flex;
  flex-direction: column;
}
//当前播放列表 头部
.play__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn {
    display: flex;
    align-items: center;
    div {
      margin-left: 20px;
    }
    i {
      color: #909399;
      cursor: pointer;
      margin-right: 5px;
    }
    i:hover {
      color: #f56c6c;
    }
  }
}
//播放列表
.play__list {
  width: 100%;
  margin-top: 20px;
}
</style>
