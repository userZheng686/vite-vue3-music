<template>
  <div class="album--wrap">
    <div class="album">
      <DefaultImage
        :picUrl="props.item.info.blockTitle.resourcePicUrl"
        loadingWidth="25px"
        loadingHeight="25px"
        style="
          width: 50px;
          height: 50px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
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
      <div class="title">
        <div>
          {{ props.item.info.blockTitle.resourceName }}
        </div>
        <div>
          {{ props.item.info.blockTitle.artistName }}
        </div>
      </div>
    </div>
    <el-divider style="margin-top: 5px; margin-bottom: 5px" />
    <div
      class="song"
      v-for="(items, index) in props.item.info.songLists"
      :key="items.id"
      @dblclick="playOne(items)"
    >
      <div class="index">{{ index + 1 }}</div>
      <div>
        <div>
          <span>{{ items.name }}</span>
          <span v-if="items.alia?.length" class="info">({{ items.alia?.join("") }})</span>
        </div>
        <div class="other">
          <div class="info--vip" v-if="items.fee === 1">
            <span>VIP</span>
          </div>
          <div class="info--flag" v-if="items.fee === 1">
            <span>试听</span>
          </div>
          <div class="info--flag" v-if="items.privilege.maxbr >= 999000">
            <span>SQ</span>
          </div>
          <div
            class="info--flag"
            v-if="items.mv || items.mvid"
            @click="
              router.push({
                path: '/mvDetail',
                query: {
                  mvid: items.mv || items.mvid,
                },
              })
            "
          >
            <div>MV</div>
            <el-icon>
              <CaretRight />
            </el-icon>
          </div>
          <span class="ml2" v-for="(item, index) in items.ar" :key="item.id">
            <span>{{ index > 0 ? " / " : "" }}</span>
            <span class="gray" @click="jumpArtists(item.id)">{{ item.name }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { playOne } from "@/utils/play";
import { useRouter } from "vue-router";
import { ArtistNewSongItem } from "i/api/api_artist";

let router = useRouter();

interface Props {
  item: ArtistNewSongItem;
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
.album--wrap {
  background-color: var(--dark-item-backgroundOdd, rgb(243, 243, 243));
  width: 100%;
  padding-left: 10px;
}

.album {
  margin-top: 20px;
  display: flex;
  align-items: center;

  .title {
    margin-left: 10px;
  }

  padding-top: 5px;
  padding-bottom: 5px;

  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.song {
  display: flex;
  align-items: center;
  cursor: pointer;
  .index {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .other {
    display: flex;
  }
}
</style>
