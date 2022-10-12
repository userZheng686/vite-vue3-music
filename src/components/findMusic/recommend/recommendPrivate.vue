<template>
  <!--独家放送-->
  <div class="private--content">
    <!--标题-->
    <div class="private--title gray" @click="jumpPrivateContent">
      <span class="private--text">独家放送</span>
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
    <!--列表-->
    <div class="private--list">
      <div
        class="private--list__item"
        v-for="item in privateList"
        @contextmenu="contextMenuPrivatecontent($event, item.id)"
        :key="item.id"
        @click="jumpMVDetail(item.id)"
      >
        <!--mv封面-->
        <DefaultImage
          style="width: 100%"
          :picUrl="item.picUrl"
          :param="320"
          :y="179"
          paddingBottom="50%"
        />
        <!--mv播放按钮-->
        <el-icon class="private--icon">
          <VideoPlay />
        </el-icon>
        <!--mv标题-->
        <span class="gray" style="text-align: left; margin-top: 5px">{{
          item.name
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PrivateContentItem } from "i/api/api_playList";
import { Ref } from "vue";
import { useRouter } from "vue-router";
import { contextMenuPrivatecontent } from "@/contextMenu/mv/privateContent";

let router = useRouter();
let privateList = inject("privateList") as Ref<PrivateContentItem[]>;

//跳转到MV详情
let jumpMVDetail = (id: number) => {
  router.push({
    path: "/mvDetail",
    query: {
      mvid: id,
    },
  });
};

//跳转到MV详情
let jumpPrivateContent = () => {
  router.push({
    path: "/privateContent",
  });
};
</script>

<style scoped lang="scss">
.private--content {
  display: flex;
  margin-top: 20px;
  flex-direction: column;
}

.private--title {
  display: flex;
  align-items: center;
}

.private--text {
  font-weight: 700;
  font-size: 20px;
}

/**
独家放送 列表
最新音乐 列表
 */
.private--list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 40px;
  margin-top: 10px;
}

/**
独家放送 列表元素
 */
.private--list__item {
  position: relative;
  text-align: left;
}

/**独家放送播放按钮 */
.private--icon {
  position: absolute;
  top: 4px;
  color: white;
  left: 5px;
  font-size: 27px;
}
</style>
