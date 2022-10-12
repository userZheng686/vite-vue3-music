<template>
  <div class="rubbish">
    <div class="rubbish--title">
      <i class="iconfont icon-shanchu"></i>
      <span class="title__text">垃圾桶</span>
      <span class="info">这里的歌曲将不在"私人FM"和"个性化推荐"中出现</span>
    </div>
    <div class="rubbish--label">
      <span></span>
      <span>音乐标题</span>
      <span>歌手</span>
      <span>专辑</span>
      <span>时长</span>
    </div>
    <div style="text-align: center; margin-top: 20px" v-if="list.length === 0">
      暂无音乐
    </div>
    <div
      v-else
      class="rubbish--list"
      v-for="(item, index) in list"
      :key="item.id"
      @contextmenu.prevent="contextMenuRubbish($event, item)"
    >
      <span style="text-align: center">{{ index + 1 }}</span>
      <span class="single-clamp">{{ item.name }}</span>
      <span class="single-clamp"
        ><span class="ml2" v-for="(items, index) in item.artists" :key="items.id">
          <span>{{ index > 0 ? " / " : "" }}</span>
          <span>{{ items.name }}</span>
        </span></span
      >
      <span class="single-clamp">{{ item.album.name }}</span>
      <span>{{ transTime(Number(item.duration) / 1000) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTrash } from "@/api/api_private";
import { SongDetailSongsItem } from "i/api/api_song";
import { removeTrashCallback, contextMenuRubbish } from "@/contextMenu/rubbish";
import {transTime} from '@/utils/filter'

let elMessage = inject("message") as any;
let offset = 0;
let addTimes = new Date().getTime();
let list = shallowRef<SongDetailSongsItem[]>([]);

let getTrashList = async () => {
  try {
    let { addTime, data, count } = await getTrash(offset, new Date().getTime());
    addTimes = addTime;
    list.value = data;
    console.log("data", data);
  } catch (e: any) {}
};

onActivated(() => {
  getTrashList();
  removeTrashCallback(getTrashList);
});
</script>

<style scoped lang="scss">
.rubbish {
  margin-left: 30px;
  margin-top: 20px;
  margin-right: 25px;
}

.title__text {
  font-size: 20px;
  margin-left: 10px;
  margin-right: 10px;
}

.rubbish--label{
  margin-top:10px;
}

//标题 列表
.rubbish--label,
.rubbish--list {
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr 1fr;
  line-height: 16px;
  width: 100%;
}

.rubbish--list:nth-child(odd) {
  background-color: rgb(249, 249, 249);
}

.rubbish--list:hover{
  background-color: rgb(250, 250, 250);
}

.rubbish--list {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
