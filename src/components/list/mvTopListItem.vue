<template>
  <!--排行榜列表-->
  <div class="toplist__item" @contextmenu="props.contextMenu && props.contextMenu($event, props.item,[],false)">
    <!--排行位置-->
    <div class="item__index">
      <div>{{ props.index < 10 ? "0" + props.index : props.index }}</div>
      <div style="width: 40px; margin-left: 9px">
        <i class="iconfont" style="color: #f56c6c" :class="computedRank"></i>
      </div>
    </div>
    <!--图片 热度-->
    <div class="item__cover" @click="openMv">
      <!--图片-->
      <el-image
        :lazy="true"
        style="width: 15vw; height: 17vh; cursor: pointer; border-radius: 8px"
        :src="
          props.item.cover.replace(/http:\//, 'https:/') +
          '?imageView&enlarge=1&thumbnail=1024y1024&type=webp'
        "
        fit="cover"
      >
        <template #error>
          <div class="image-slot-error">
            <el-icon>
              <Picture />
            </el-icon>
          </div>
        </template>
        <template #placeholder>
          <!-- <el-icon class="is-loading image-slot-loading"><Loading /></el-icon> -->
          <ImageLoading />
        </template>
      </el-image>
      <!--热度-->
      <div class="item__cover__hot">
        <i class="iconfont icon-redu"></i>
        <span style="margin-left: 2px">{{ props.item.score }}</span>
      </div>
    </div>
    <div class="item__name single-clamp">
      <!--作品名字-->
      <div class="item__title gray single-clamp" v-title @click="openMv">
        {{ props.item.name }}
      </div>
      <!--作品名字 作者-->
      <div class="item__author single-clamp">
        <span v-for="(items, index) in props.item.artists" :key="items.id">
          <span>{{ index > 0 ? " / " : "" }}</span>
          <span class="gray" v-title @click="jumpArtists(items.id)">{{ items.name }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { TopMvItem } from "i/api/api_mv.d";
import { Picture } from "@element-plus/icons-vue";

interface Props {
  item: TopMvItem;
  index: number;
  contextMenu ?: Function;
}

let router = useRouter();

const props = withDefaults(defineProps<Props>(), {});

//动态计算排名
let computedRank = computed(() => {
  if (props.item.lastRank < props.index) {
    return "icon-xiajiang";
  } else if (props.item.lastRank > props.index) {
    return "icon-shangsheng";
  } else {
    return "icon-line";
  }
});

//跳转到mv详情页面
let openMv = () => {
  router.push({
    path: "/mvDetail",
    query: {
      mvid: props.item.id,
    },
  });
};

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
</script>

<style scoped lang="scss">
//排行榜列表
.toplist__item {
  display: flex;
  overflow: hidden;
  align-items: center;
}

//排行位置
.item__index {
  color: rgb(159, 159, 159);
  font-size: 29px;
  width: 40px;
  margin-right: 10px;
  text-align: left;
}

//封面
.item__cover {
  position: relative;
}

//热度
.item__cover__hot {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #fff;
  text-shadow: 1px 1px 5px #0a0101;
}

//作品名 作者名
.item__name {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-self: self-start;

  div {
    margin-top: 10px;
    margin-left: 20px;
  }
}
</style>
