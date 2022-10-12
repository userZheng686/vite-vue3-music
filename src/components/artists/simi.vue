<template>
  <section>
    <div class="simi--list">
      <div
        class="list__item"
        v-for="item in list"
        :key="item.id"
        @click="jumpArtists(item.id)"
      >
        <DefaultImage
          :picUrl="item.picUrl"
          :param="320"
          :y="320"
          style="width: 220px; height: 220px"
          loadingWidth="110px"
          loadingHeight="110px"
          :lazy="false"
        />
        <div class="name gray">{{ item.name }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getSimiArtist } from "@/api/api_simi";
import { SimiArtistItem } from "i/api/api_simi";
import { useRoute, useRouter } from "vue-router";

let route = useRoute(),
  router = useRouter();
let elMessage = inject("message") as any;

let offset = 0;
let list = ref<SimiArtistItem[]>([]);
let getSimiArtistList = async () => {
  try {
    let { artists } = await getSimiArtist(Number(route.query.id), offset);
    list.value = artists;
    console.log("artists", artists);
  } catch (e: any) {
    elMessage.error("获取相似歌手列表失败");
  }
};

//跳转到歌手页
let jumpArtists = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};

onActivated(() => {
  getSimiArtistList();
});
</script>

<style scoped lang="scss">
.simi--list {
  margin-right: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  row-gap: 20px;
}

.list__item {
  overflow: hidden;
}

.name {
  margin-top: 10px;
}
</style>
