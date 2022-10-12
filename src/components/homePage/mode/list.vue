<template>
  <section>
    <section class="playlist">
      <div
        class="list__item"
        v-for="item in computedList"
        :key="item.id"
        @contextmenu="contextMenuPlaylist($event, item)"
      >
        <DefaultImage
          :picUrl="item.coverImgUrl"
          loadingWidth="30px"
          loadingHeight="30px"
          :param="60"
          :y="60"
          :lazy="false"
          style="width: 60px; height: 60px"
        />
        <div class="child" @click="jumpAlbumDetail(item.id)">
          <span>{{ item.name }}</span>
        </div>
        <div class="child info">歌曲：{{ item.trackCount }}首</div>
        <div class="child info">
          <span>by </span>
          <span class="gray">{{ item.creator?.nickname }}</span>
        </div>
        <div class="child gray">
          <i class="iconfont icon-shoucang1"></i>
          <span style="margin-left: 10px">{{ item.subscribedCount }}</span>
        </div>
        <div class="child gray">
          <i class="iconfont icon-24gl-playCircle"></i>
          <span style="margin-left: 10px">{{ filter(item.playCount) }}</span>
        </div>
      </div>
    </section>
    <el-pagination
      v-model:currentPage="currentPage"
      :page-size="20"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
      "
      background
      small
      :pager-count="9"
      :hide-on-single-page="list.length <= 20"
      layout="prev, pager, next"
      :total="list.length"
    />
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Ref } from "vue";
import { playlist } from "i/api/api_playList";
import { contextMenuPlaylist } from "@/contextMenu/playlist/normal";
import { filter } from "@/utils/filter";

let router = useRouter();
let list = inject("list") as Ref<playlist[]>;
let currentPage = ref<number>(1);
let offset = ref<number>(0);

let computedList = computed(() => {
  return list.value.slice(offset.value, offset.value + 20);
});

watch(currentPage, function (page: number) {
  offset.value = (page - 1) * 20;
});

//跳转到专辑详情
let jumpAlbumDetail = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};
</script>

<style scoped lang="scss">
.list__item {
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  &:nth-child(odd) {
    background-color: var(--dark-item-backgroundOdd, rgb(250, 250, 250));
  }
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.child {
  flex: 1;
  margin-left: 10px;
}
</style>
