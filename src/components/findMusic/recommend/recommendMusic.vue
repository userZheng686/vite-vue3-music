<template>
  <div class="new--music">
    <!--标题-->
    <div class="music--title gray" @click="jumpMusic">
      <span class="music--text">最新音乐</span>
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
    <!--列表-->
    <div class="music--list">
      <div
        class="music--list--item"
        v-for="item in newTopMusic"
        :key="item.id"
        @contextmenu="contextMenuSong($event, item, newTopMusic, false)"
      >
        <!--左侧图片-->
        <div class="music--list--play">
          <!--图片-->
          <DefaultImage
            :picUrl="item.album.picUrl"
            style="width: 50px; height: 50px"
            :param="50"
            :y="50"
            loadingWidth="25"
            loadingHeight="25"
          />
          <!--最新音乐播放按钮-->
          <el-icon class="newMusic--icon">
            <VideoPlay />
          </el-icon>
        </div>
        <!--右侧信息-->
        <div class="music--list--info single-clamp">
          <!--作品名称-->
          <div class="info--name" v-title>
            {{ item.name }}
            <span
              v-if="item.transName || item?.alias?.length"
              style="margin-left: 3px; color: #909399"
              class="single-clamp"
              >({{ item.transName }} {{ item?.alias?.join("") }})</span
            >
          </div>
          <!--标记作者和SQ MV-->
          <div class="info--name">
            <!--标记是HIRes还是SQ还是MV-->
            <div class="info--flag" v-if="item?.hrMusic">
              <span>Hi·Res</span>
            </div>
            <div class="info--flag" v-else-if="item.sq">
              <span>SQ</span>
            </div>
            <div class="info--flag" v-if="item.mvid">
              <span>MV</span>
              <el-icon>
                <CaretRight />
              </el-icon>
            </div>
            <!--作者-->
            <div class="single-clamp">
              <span v-for="(items, index) in item.artists" :key="items.id">
                <span>{{ index > 0 ? " / " : "" }}</span>
                <span class="gray" v-title @click="jumpArtists(items.id)">{{
                  items.name
                }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { contextMenuSong } from "@/contextMenu/song/normal";
import { SongDetailSongsItem } from "i/api/api_song";
import { Ref } from "vue";
import { useRouter } from "vue-router";

let router = useRouter();
let newTopMusic = inject("newTopMusic") as Ref<SongDetailSongsItem[]>;

//跳转到歌手页
let jumpArtists = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};

//跳转到最新音乐
let jumpMusic = () => {
  router.push({
    path: "/findMusic",
    query: {
      component: "newMusic",
      index: 5,
    },
  });
};
</script>

<style scoped lang="scss">
.new--music {
  display: flex;
  margin-top: 20px;
  flex-direction: column;
}

.music--title {
  display: flex;
  align-items: center;
}

.music--text {
  font-weight: 700;
  font-size: 20px;
}

/**最新音乐列表 */
.music--list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

/**最新音乐列表元素 */
.music--list--item {
  display: flex;
  width: 30%;
  height: auto;
  margin-top: 10px;
}

/**最新音乐列表元素 左侧的封面 */
.music--list--play {
  position: relative;
}

/**最新音乐列表元素 右侧的信息 */
.music--list--info {
  display: flex;
  flex: 1;
  padding-left: 10px;
  transition: all 0.2s;
  height: auto;
  flex-direction: column;
  text-align: left;
  cursor: pointer;
}

/**最新音乐列表元素 右侧的信息 激活状态*/
.music--list--info:hover {
  background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  border-radius: 8px;
}

/**最新音乐播放按钮 */
.newMusic--icon {
  position: absolute;
  top: 0;
  color: white;
  right: 0;
  left: 0;
  font-size: 20px;
  bottom: 0;
  margin: auto;
}
</style>
