<template>
  <el-skeleton :rows="3" animated :loading="loading">
    <!--骨架屏-->
    <template #template>
      <div class="el-skeleton--banner">
        <el-skeleton-item
          v-for="(item, index) in 3"
          :key="index"
          variant="image"
          class="el-skeleton--banner__img"
        />
      </div>
    </template>
    <template #default>
      <!--电台banner-->
      <div class="banner--list">
        <div
          class="banner--list__item"
          v-for="(item, index) in props?.banner"
          :key="index"
        >
          <!--电台banner 封面-->
          <DefaultImage :picUrl="item.pic" :param="600" paddingBottom="30%">
            <template #banner>
              <!--分区标题-->
              <div class="banner--list__item__typeTitle">
                {{ item.typeTitle }}
              </div>
            </template>
          </DefaultImage>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { RadioBannerItem } from "i/api/api_radio.d";
interface Props {
  banner?: RadioBannerItem[];
}

let props = defineProps<Props>();

let loading = computed(() => {
  if (props?.banner?.length) {
    return false;
  } else {
    return true;
  }
});
</script>

<style scoped lang="scss">
/**样式复用 */
@mixin banner {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
}

@mixin banner__img {
  height: 150px;
}

//电台banner
.el-skeleton--banner {
  @include banner;
}
//电台banner img
.el-skeleton--banner__img {
  @include banner__img;
}

/**电台banner */
.banner--list {
  @include banner;
}

/**电台banner 元素 */
.banner--list__item {
  @include banner__img;
  height: auto;
}

/**专区 */
.banner--list__item__typeTitle {
  position: absolute;
  bottom: 0;
  color: white;
  right: 0;
  background-color: rgb(204, 74, 74);
  border-radius: 5px;
  width: 90px;
  height: 25px;
}
</style>
