<template>
  <!--专辑-->
  <div
    :class="{ gray: computedAlbumId, 'el-table__column__info__auto': !computedAlbumId }"
    class="single-clamp"
    v-if="props.item?.al?.name"
    v-brightenKeyword:[search,props.item.al?.name]
    v-title
    @click="props.jumpAlbumDetail(props.item?.al?.id)"
  ></div>
  <div
    :class="{ gray: computedAlbumId, 'el-table__column__info__auto': !computedAlbumId }"
    class="single-clamp"
    v-else-if="props.item?.album?.name"
    v-brightenKeyword:[search,props.item.album?.name]
    v-title
    @click="props.jumpAlbumDetail(props.item?.album?.id)"
  ></div>
  <div
    :class="{ gray: computedAlbumId, 'el-table__column__info__auto': !computedAlbumId }"
    class="single-clamp"
    v-else-if="props.item?.pc?.alb"
    v-brightenKeyword:[search,props.item.pc?.alb]
    @click="props.jumpAlbumDetail(props.item?.pc?.id)"
    v-title
  ></div>
  <div class="el-table__column__info__auto single-clamp" v-else v-title>
    {{ "未知专辑" }}
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";
interface props {
  item: any;
  jumpAlbumDetail: Function;
}

let props = defineProps<props>();
let search = inject("search") as Ref<string>;

let computedAlbumId = computed(() => {
  if (props.item?.al?.id) {
    return true;
  } else if (props.item?.album?.id) {
    return true;
  } else if (props.item?.pc?.id) {
    return true;
  } else {
    return false;
  }
});
</script>

<style scoped lang="scss"></style>
