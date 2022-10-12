<template>
  <section>
    <section class="picture--preview">
      <SongMenuListItem
        v-for="(item, index) in computedList"
        :key="item.id"
        :lazy="false"
        :index="index + 1"
        :trackCount="true"
        :contextMenu="contextMenuPlaylist"
        :item="item"
        :param="1024"
        :y="1024"
      />
    </section>
    <el-pagination
      class="page"
      v-model:currentPage="currentPage"
      :page-size="20"
      background
      :pager-count="9"
      :hide-on-single-page="list.length <= 20"
      layout="prev, pager, next"
      :total="list.length"
    />
  </section>
</template>

<script setup lang="ts">
import { playlist } from "i/api/api_playList";
import { Ref } from "vue";
import { contextMenuPlaylist } from "@/contextMenu/playlist/normal";

let list = inject("list") as Ref<playlist[]>;
let currentPage = ref<number>(1);
let offset = ref<number>(0);

let computedList = computed(() => {
  return list.value.slice(offset.value, offset.value + 20);
});




watch(currentPage, function (page: number) {
  offset.value = (page - 1) * 20;
});
</script>

<style scoped lang="scss">
.picture--preview {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  row-gap: 20px;
}

.page {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
