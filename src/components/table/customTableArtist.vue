<template>
  <!--歌手-->
  <div class="single-clamp" v-title>
    <span
      class="el-table__column__info__auto"
      v-if="item.pc?.ar"
      @click="jumpArtists(item?.pc?.id)"
      v-brightenKeyword:[search,item.pc?.ar]
    ></span>
    <span
      class="el-table__column__info__auto"
      v-else-if="item.ar?.length && !item?.ar[0]?.name"
      >未知歌手</span
    >
    <span class="ml2" v-else-if="item?.ar?.length" v-for="(items, index) in item.ar" :key="items.id">
      <span>{{ index > 0 ? " / " : "" }}</span>
      <span
        :class="{
          gray: computedClass(items.id),
          'el-table__column__info__auto': !computedClass(items.id),
        }"
        @click="jumpArtists(items.id)"
        v-brightenKeyword:[search,items.name]
      ></span>
    </span>
    <span class="ml2" v-else-if="item?.artists?.length" v-for="(artist, index) in item.artists" :key="artist.id">
      <span>{{ index > 0 ? " / " : "" }}</span>
      <span
        :class="{
          gray: computedClass(artist.id),
          'el-table__column__info__auto': !computedClass(artist.id),
        }"
        @click="jumpArtists(artist.id)"
        >{{ artist.name }}</span
      >
    </span>
    <!-- <span>{{ item?.alias?.join("") }}</span> -->
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRouter } from "vue-router";

interface props {
  item: any;
}
let props = defineProps<props>();
let router = useRouter();
let search = inject("search") as Ref<string>;

let computedClass = computed(() => {
  return function (id: number) {
    if (id || props.item?.radio?.id) return true;
    else return false;
  };
});

let jumpArtists = (id: number) => {
  if (props.item?.radio?.id) {
    router.push({
      path : '/broadCastDetail',
      query : {
        id : props.item?.radio?.id
      }
    })
  } else {
    if (!id) return;
    router.push({
      path: "/artists",
      query: {
        type: 1,
        id,
      },
    });
  }
};
</script>

<style scoped lang="scss">
.ml2 {
  margin-left: 2px;
}
</style>
