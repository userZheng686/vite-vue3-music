<template>
  <section class="introduction">
    <div v-for="item in artistIntroduction" :key="item.ti">
      <div>{{ item.ti }}</div>
      <div class="info txt">
        <div class="mb10" v-for="items in item.txt.split('\n')" :key="items">
          {{ items }}
        </div>
      </div>
    </div>
    <div class="info" v-if="!artistIntroduction.length">暂无介绍</div>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { getArtistIntroduction } from "@/api/api_artist";
import { ArtistIntroductionItem } from "@/interface/api/api_artist";

let route = useRoute();
let router = useRouter();

let elMessage = inject("message") as any;
let offset = 0;
let artistIntroduction = ref<ArtistIntroductionItem[]>([]);
let getArtistIntroductionInfo = async () => {
  try {
    let { introduction } = await getArtistIntroduction(
      Number(route.query.id),
      offset,
      10
    );
    artistIntroduction.value = introduction;
    console.log("introduction", introduction);
  } catch (e: any) {
    elMessage.error("获取歌手简介错误");
  }
};

onActivated(() => {
  getArtistIntroductionInfo();
});
</script>

<style scoped lang="scss">
.introduction {
  margin-right: 20px;
}

.txt {
  margin-top: 22px;
  margin-left: 34px;
  margin-bottom: 50px;
  word-break: break-word;
}

.mb10 {
  margin-bottom: 10px;
}
</style>
