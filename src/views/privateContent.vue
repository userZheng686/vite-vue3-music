<template>
  <section class="private--wrap">
    <div style="font-weight: bold; font-size: 24px">独家放送</div>
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
          fit="cover"
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
    <el-button
      v-if="isMore"
      style="margin: 10px auto; display: flex; align-items: center"
      type="danger"
      @click="getPrivateContentList()"
      >加载更多</el-button
    >
  </section>
</template>

<script setup lang="ts">
import { getPrivateContent } from "@/api/api_playList";
import { PrivateContentItem } from "i/api/api_playList";
import { contextMenuPrivatecontent } from "@/contextMenu/mv/privateContent";
import { useRouter } from "vue-router";

let privateList = ref<Array<PrivateContentItem>>([]);
let offset = 0;
let router = useRouter();
let isMore = ref<boolean>(true);
let elMessage = inject("message") as any;

//跳转到MV详情
let jumpMVDetail = (id: number) => {
  router.push({
    path: "/mvDetail",
    query: {
      mvid: id,
    },
  });
};

let getPrivateContentList = async () => {
  try {
    let { hasTaste, result } = await getPrivateContent(60, offset);
    //过滤 只找mv
    result = result.filter((item) => item.type === 5);
    offset += result.length;
    privateList.value.push(...result);
    isMore.value = !hasTaste;
  } catch (e: any) {
    elMessage.error(e?.msg || "获取独家放送列表失败");
  }
};

getPrivateContentList();
</script>

<style scoped lang="scss">
.private--wrap {
  width: 80%;
  margin: 30px auto;
  max-width: 1200px;
}

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
  row-gap: 15px;
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
