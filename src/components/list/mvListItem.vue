<template>
  <!--mv列表子元素-->
  <div class="mv--list__item" @contextmenu="props.contextMenu && props.contextMenu($event,props.item,[],false)">
    <!--封面-->
    <el-card
      class="list--card"
      :body-style="{ padding: '0px', height: '100%', position: 'relative' }"
      shadow="hover"
      @click="openMv"
    >
      <!--图片-->
      <el-image
        :lazy="false"
        style="max-width: 335px; max-height: 188px; cursor: pointer; border-radius: 8px"
        :style="{ paddingBottom: props.paddingBottom }"
        :src="
          props.item.cover.replace(/http:\//, 'https:/') +
          '?imageView&enlarge=1&thumbnail=335y188&type=webp'
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
          <!-- <el-icon class="is-loading image-slot-loading"><Loading /></el-icon> -->
          <ImageLoading width="50px" height="50px" />
        </template>
      </el-image>
    </el-card>
    <!--播放数量-->
    <div class="mv--playCount">
      <i class="iconfont icon-play" style="margin-right: 5px"></i>
      <span >{{ filter(props.item.playCount) }}</span>
    </div>
    <!--作品名-->
    <div
      class="mv--list__item__nickname gray"
      :class="props.titleClass"
      v-title
      @click="openMv"
    >
      {{ props.item.name }}
    </div>
    <!--用户名-->
    <div class="mv--list__item__nickname gray single-clamp" v-if="props.isShowAuthor">
      <span v-for="(items, index) in props.item.artists" :key="items.id">
        <span>{{ index > 0 ? " / " : "" }}</span>
        <span class="gray" v-title @click="jumpArtists(items.id)">{{ items.name }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { NewMvItem } from "i/api/api_mv.d";
import { Picture } from "@element-plus/icons-vue";
import { filter } from "@/utils/filter";

let router = useRouter();

interface Props {
  item: NewMvItem;
  isShowAuthor?: boolean;
  titleClass: string;
  paddingBottom?: string;
  contextMenu ?: Function;
}

const props = withDefaults(defineProps<Props>(), {
  isShowAuthor: true,
  titleClass: "single-clamp",
  paddingBottom: "100%",
});

//打开mv详情
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
//列表子元素
.mv--list__item {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 10px;
  overflow: hidden;
  position: relative;
}

//封面
.list--card {
  width: 100%;
  border-radius: 8px;
}

//播放次数
.mv--playCount {
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

// 用户名
.mv--list__item__nickname {
  width: 15vw;
  margin-top: 10px;
}

:deep(.el-image) {
  position: initial;
}

:deep(.el-image__inner) {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8px;
}
</style>
