<template>
  <!--MV下载列表-->
  <div
    class="download--list__item"
    @contextmenu="props.contextMenu && props.contextMenu($event, props.item)"
  >
    <div style="position: relative" @click="openMv">
      <!--封面-->
      <el-image
        :lazy="false"
        style="width: 100%; height: 15vh; cursor: pointer; border-radius: 10px"
        :src="
          props.item.cover.replace(/http:\//, 'https:/') +
          '?imageView&enlarge=1&thumbnail=317y156&type=webp'
        "
        fit="fill"
      >
        <template #error>
          <div class="image-slot-error">
            <el-icon>
              <Picture />
            </el-icon>
          </div>
        </template>
        <template #placeholder>
          <ImageLoading />
        </template>
      </el-image>
      <!--播放画质-->
      <div class="download--list__item__quality">
        {{ props.item.videoParam[2] }}
      </div>
      <!--播放大小-->
      <div class="download--list__item__size">{{ props.item.fileSize }}</div>
    </div>
    <!--作品名字-->
    <div
      style="margin-top: 10px; cursor: pointer; width: 200px"
      class="single-clamp"
      @click="openMv"
    >
      {{ props.item.name }}
    </div>
    <!--作者-->
    <span
      style="margin-top: 10px"
      v-for="(item, index) in props.item.userInfo"
      :key="item.id"
    >
      <span class="gray" @click="jumpArtists(item.id)">
        {{ item.name }}
      </span>
      <span
        v-if="index !== props.item.userInfo.length - 1"
        style="margin-left: 10px; margin-right: 10px"
        >/</span
      >
    </span>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { downloadItem } from "i/view/videoDetail.d";

let router = useRouter();

interface downloadMVItem extends downloadItem {
  fileSize: string;
}

interface Props {
  item: downloadMVItem;
  contextMenu?: Function;
}

let props = defineProps<Props>();

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

//打开mv详情
let openMv = () => {
  router.push({
    path: "/mvDetail",
    query: {
      mvid: props.item.mvId,
    },
  });
};
</script>

<style scoped lang="scss">
//mv下载列表
.download--list__item {
  /* position: relative; */
  width: 100%;
  /* height: 200px; */
}

//播放次数
.download--list__item__quality {
  position: absolute;
  z-index: 2;
  font-size: 12px;
  color: white;
  font-weight: 700;
  position: absolute;
  right: 10px;
  top: 10px;
  text-shadow: 1px 1px 5px #0a0101;
}

//播放时长
.download--list__item__size {
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: white;
}
</style>
