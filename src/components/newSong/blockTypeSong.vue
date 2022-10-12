<template>
  <div class="song single-clamp" @dblclick="playOne(props.item)">
    <DefaultImage
      :picUrl="props.item.al.picUrl"
      loadingWidth="25px"
      loadingHeight="25px"
      style="
        width: 50px;
        height: 50px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      "
      :params="50"
      :y="50"
    >
      <template #play>
        <!--播放按钮-->
        <div class="player--circle">
          <i class="iconfont icon-bofang" style="margin-left: 2px'font-size:12px;"></i>
        </div>
      </template>
    </DefaultImage>
    <div class="title single-clamp">
      <div>
        <span>{{ props.item.name }}</span>
        <span class="info" v-if="props.item?.alia?.length">
          ({{ props.item.alia.join("") }})
        </span>
      </div>
      <div style="display: flex; align-items: center" class="single-clamp">
        <div class="info--vip" v-if="props.item.fee === 1">
          <span>VIP</span>
        </div>
        <div class="info--flag" v-if="props.item.fee === 1">
          <span>试听</span>
        </div>
        <div class="info--flag" v-if="props.item.privilege.maxbr >= 999000">
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
        <div class="single-clamp">
          <span class="ml2" v-for="(items, index) in props.item.ar" :key="items.id">
            <span>{{ index > 0 ? " / " : "" }}</span>
            <span class="gray" @click="jumpArtists(items.id)">{{ items.name }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SongDetailSongsItem } from "i/api/api_song";
import { playOne } from "@/utils/play";
import { useRouter } from "vue-router";

let router = useRouter();

interface Props {
  item: SongDetailSongsItem;
}

let props = defineProps<Props>();

let jumpArtists = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};
</script>

<style scoped lang="scss">
.song {
  margin-top: 20px;
  display: flex;
  align-items: center;

  .title {
    margin-left: 10px;
  }

  background-color: var(--dark-item-backgroundOdd, rgb(243, 243, 243));
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}
</style>
