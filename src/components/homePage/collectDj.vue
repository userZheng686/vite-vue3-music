<template>
  <section>
    <DjListItem
      v-for="item in list"
      :key="item.id"
      :item="item"
      :contextMenu="contextMenuDj"
    />
  </section>
</template>

<script setup lang="ts">
import { getRadioSublist } from "@/api/api_radio";
import { RadioSublistItem } from "i/api/api_radio";
import { contextMenuDj } from "@/contextMenu/dj/normal";
import { useRoute, useRouter } from "vue-router";

let route = useRoute();
let router = useRouter();
let offset = 0;
let nowTime = new Date().getTime();
let elMessage = inject("message") as any;
let list = ref<RadioSublistItem[]>([]);

let getUserDjList = async () => {
  try {
    let { djRadios, hasMore, time } = await getRadioSublist(
      Number(route.query.id),
      offset,
      1000,
      nowTime
    );
    nowTime = time;
    list.value = djRadios;
  } catch (e: any) {
    elMessage.error("获取收藏播客列表失败");
  }
};

watch(
  () => route.query?.id,
  (val) => {
    if (route.name !== "HomePage") return;
    getUserDjList();
  }
);

onActivated(() => {
  getUserDjList();
});
</script>

<style scoped lang="scss"></style>
