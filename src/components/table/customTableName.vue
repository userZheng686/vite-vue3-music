<template>
  <!--音乐标题-->
  <div style="display: flex; align-items: center">
    <div v-title class="single-clamp">
      <span
        style="width: auto"
        class="single-clamp"
        :class="{ noCopyright: props.item.noCopyrightRcmd }"
        v-brightenKeyword:[search,props.item.name]
      >
      </span>
      <span
        class="el-table__column__info__auto single-clamp"
        v-brightenKeyword:[search,transNames]
        v-if="props.item.transNames?.length"
      ></span>
      <span
        class="el-table__column__info__auto single-clamp"
        v-brightenKeyword:[search,tns]
        v-else-if="props.item.tns?.length"
      ></span>
      <span
        class="el-table__column__info__auto single-clamp"
        v-brightenKeyword:[search,alia]
        v-else-if="props.item.alia?.length"
      ></span>
      <span
        class="el-table__column__info__auto single-clamp"
        v-brightenKeyword:[search,alias]
        v-else-if="props.item.alias?.length"
      ></span>
    </div>
    <div style="min-width: auto; margin-left: 5px" class="info--name">
      <div class="info--vip" v-if="props.item.fee === 1">
        <span>VIP</span>
      </div>
      <div class="info--flag" v-if="props.item.fee === 1">
        <span>试听</span>
      </div>
      <!--标记是HIRes还是SQ还是MV-->
      <div class="info--flag" v-if="props.item?.hrMusic || props.item?.hr">
        <span>Hi·Res</span>
      </div>
      <div
        class="info--flag"
        v-else-if="props.item?.sq || props.item?.sqMusic || props.item?.pc?.br >= 320"
      >
        <span>SQ</span>
      </div>
      <div
        class="info--flag"
        v-if="props.item.mv || props.item.mvid"
        @click="
          router.push({
            path: '/mvDetail',
            query: {
              mvid: props.item.mv || props.item.mvid,
            },
          })
        "
      >
        <div>MV</div>
        <el-icon>
          <CaretRight />
        </el-icon>
      </div>
      <div class="info--voice" v-if="props.item.radio">
        <span>声音</span>
      </div>
    </div>
    <i v-if="props.item.pc" class="iconfont icon-yunpan el-table__column__info"></i>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRouter } from "vue-router";

let router = useRouter();
interface props {
  item: any;
  nameMaxWidth: string;
}

let props = defineProps<props>();
let search = inject("search") as Ref<string>;

let tns = computed(() => {
  if (props.item.tns?.length) {
    return `(${props.item.tns.join("")})`;
  }
});

let alia = computed(() => {
  if (props.item.alia?.length) {
    return `(${props.item.alia.join("")})`;
  }
});

let alias = computed(() => {
  if (props.item.alias?.length) {
    return `(${props.item.alias.join("")})`;
  }
});

let transNames = computed(() => {
  if (props.item.transNames?.length) {
    return `(${props.item.transNames.join("")})`;
  }
});
</script>

<style scoped lang="scss"></style>
