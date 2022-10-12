<template>
  <div class="song" @click="playProgram">
    <DefaultImage
      :picUrl="props.item.coverUrl"
      loadingWidth="25px"
      loadingHeight="25px"
      style="
        width: 50px;
        height: 50px;
        position: relative;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        justify-content: center;
      "
      :param="50"
      :y="50"
      :lazy="false"
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
        {{ props.item.name }}
      </div>
      <div style="display: flex; align-items: center">
        <span class="info--flag">{{ props.item.radio.category }}</span>
        <span class="info">{{ props.item.radio.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Program } from "i/api/api_radio";
import { playOne } from "@/utils/play";
import { useRoute } from "vue-router";
import { getProgramDetail } from "@/api/api_radio";

let route = useRoute();

interface Props {
  item: Program;
}

let props = defineProps<Props>();

let playProgram = async () => {
  if (!props.item.mainSong) {
    let {
      program: { mainSong },
    } = await getProgramDetail(props.item.radio.lastProgramId);
    props.item.mainSong = mainSong;
    //电台
    props.item.mainSong.radio = props.item.radio;
    //电台节目id
    props.item.mainSong.radio.programId = props.item.id;
    //是否点赞
    props.item.mainSong.liked = props.item.canReward;
    //图片
    if (props.item.mainSong.album) {
      props.item.mainSong.album.picUrl = props.item.coverUrl;
    }
    props.item.mainSong.progress = 0;
    props.item.mainSong.from = {
      path: "Event",
      name: props.item.radio.name,
      val: {
        id: Number(route.query.id),
      },
    };
    playOne(props.item.mainSong);
  } else {
    playOne(props.item.mainSong);
  }
};
</script>

<style scoped lang="scss">
.song {
  margin-top: 10px;
  display: flex;
  align-items: center;

  .title {
    margin-left: 10px;
    margin-right: 10px;
  }
  background-color: var(--dark-normalBackgroundColor, rgb(245, 245, 240));
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: var(--dark-normalBackgroundColor, rgb(245, 245, 240));
  }
}
</style>
