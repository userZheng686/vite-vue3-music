<template>
  <div class="radio">
    <!--标题-->
    <div class="radio--title gray" @click="jumpRadio" style="margin-top: 30px">
      <span class="radio--text">播客</span>
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
    <!--列表-->
    <div class="radio--list">
      <div
        class="radio--list__item"
        v-for="item in radio"
        :key="item.id"
        @click="
          router.push({
            path: '/broadCastDetail',
            query: {
              id: item.id,
            },
          })
        "
        @contextmenu="contextMenuDj($event, item)"
      >
        <!--封面-->
        <DefaultImage :picUrl="item.picUrl" style="width: 100%" :param="190" :y="190">
          <template #author>
            <div class="radio--author single-clamp">
              {{ item.radio.name }}
            </div>
          </template>
        </DefaultImage>
        <!--文案-->
        <div class="gray radio--rcmdtext">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Radio } from "i/api/api_radio";
import { Ref } from "vue";
import { useRouter } from "vue-router";
import { contextMenuDj } from "@/contextMenu/dj/normal";

let router = useRouter();

let radio = inject("radio") as Ref<
  Array<{
    copywriter: string;
    id: number;
    name: string;
    picUrl: string;
    radio: Radio;
  }>
>;

//跳转到播客
let jumpRadio = () => {
  router.push({
    path: "/podCaster",
  });
};
</script>

<style scoped lang="scss">
.radio--title {
  display: flex;
  align-items: center;
}

.radio--text {
  font-weight: 700;
  font-size: 20px;
}

/**播客列表 */
.radio--list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  margin-top: 10px;
}

/**播客列表元素 */
.radio--list__item {
  position: relative;
}

/**播客作者 */
.radio--author {
  position: absolute;
  color: white;
  bottom: 10px;
  left: 10px;
  width: 10vw;
  font-size: 12px;
  text-align: left;
  text-shadow: 1px 1px 5px #0a0101;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
}

/**播客备注 */
.radio--rcmdtext {
  margin-top: 10px;
  text-align: left;
}
</style>
