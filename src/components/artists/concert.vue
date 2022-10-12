<template>
  <section>
    <div class="concert__item" v-for="item in list" :key="item.address">
      <DefaultImage
        :picUrl="item.cover"
        loadingWidth="45px"
        loadingHeight="45px"
        :param="90"
        :lazy="false"
        :y="120"
        @click="jumpBryUrl(item.url)"
        style="width: 90px; height: 120px"
      />
      <div class="right">
        <div class="title" @click="jumpBryUrl(item.url)">{{ item.title }}</div>
        <div class="address info">{{ item.address }}</div>
        <div class="price">¥{{ item.price }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getArtistByArtists } from "@/api/api_artist";
import { formDate } from "@/utils/filter";
import { useRoute, useRouter } from "vue-router";

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let offset = 0;
let list = ref<
  Array<{
    cover: string;
    title: string;
    url: string;
    address: string;
    price: number;
  }>
>([]);

let getArtistByArtistsList = async () => {
  try {
    let { simpleConcerts } = await getArtistByArtists(Number(route.query.id), offset, 20);
    simpleConcerts.forEach((item) => {
      let start = `${formDate(item.time[0]).y}年${formDate(item.time[0]).month}月${
        formDate(item.time[0]).d
      }日`;
      let end = `${formDate(item.time[1]).y}年${formDate(item.time[1]).month}月${
        formDate(item.time[1]).d
      }日`;
      list.value.push({
        cover: item.cover,
        url: item.url,
        address: `${start} 至 ${end} ${item.simpleAddress.address}`,
        price: item.price,
        title: item.title,
      });
    });
  } catch (e: any) {
    elMessage.error("获取列表失败");
  }
};

//跳转到买票网址
let jumpBryUrl = (url: string) => {
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(url);
  } else {
    window.open(url);
  }
};

onActivated(() => {
  list.value = [];
  getArtistByArtistsList();
});
</script>

<style scoped lang="scss">
.concert__item {
  display: flex;
  align-items: center;

  .right {
    margin-left: 10px;
  }

  .title {
    margin-bottom: 10px;
    cursor: pointer;
  }

  .price {
    margin-top: 10px;
    font-size: 16px;
    color: red;
  }

  &:nth-child(even) {
    background-color: var(--dark-item-backgroundOdd, rgb(250, 250, 250));
  }
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}
</style>
