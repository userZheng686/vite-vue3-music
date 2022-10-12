<template>
  <section>
    <ColumnListItem :contextMenu="contextMenuColumn" v-for="item in columnList" :key="item.id" :item="item" />
    <LoadingComponent v-if="loading" />
    <tableEmpty v-else-if="!columnList.length">
      <template #empty>暂无音乐专栏</template>
    </tableEmpty>
  </section>
</template>

<script setup lang="ts">
import { getColumnCreateList } from "@/api/api_column";
import { contextMenuColumn } from "@/contextMenu/column/normal";
import { ColumnCreateListItem } from "i/api/api_column";
import { useRoute, useRouter } from "vue-router";

let route = useRoute();
let router = useRouter();
let elMessage = inject("message") as any;
let offset = 0;
let columnList = ref<ColumnCreateListItem[]>([]);
let loading = ref<boolean>(true);

let getUserCreateColumnList = async () => {
  try {
    let { data } = await getColumnCreateList(Number(route.query.id), offset, 20);
    columnList.value = data;
    loading.value = false;
  } catch (e: any) {
    elMessage.error("获取创建的音乐专栏列表失败");
  }
};

watch(
  () => route.query?.id,
  () => {
    if (route.name !== "HomePage") return;
    columnList.value = [];
    getUserCreateColumnList();
  }
);

onActivated(() => {
  getUserCreateColumnList();
});
</script>

<style scoped lang="scss"></style>
