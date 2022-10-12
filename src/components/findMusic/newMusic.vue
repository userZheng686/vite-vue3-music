<template>
  <!--最新音乐-->
  <div class="newMusic">
    <!--菜单切换栏-->
    <el-switch
      v-model="switchMenu"
      class="newMusic--switchMenu"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      active-text="新碟上架 "
      inactive-text="新歌速递"
      size="large"
    />
    <!--列表-->
    <div v-show="!switchMenu">
      <!--导航栏 标签 按钮-->
      <div class="newMusic--nav">
        <!--标签-->
        <div class="newMusic--nav--tag">
          <span
            class="gray"
            @click="handleClickTag(item.type)"
            v-for="item in tags"
            :key="item.name"
            :class="checkTag === item.type ? 'newMusic--nav--tag--active' : ''"
            >{{ item.name }}</span
          >
        </div>
        <!--按钮-->
        <div class="newMusic--nav--btn">
          <el-button
            :icon="VideoPlay"
            class="newMusic--nav--btn__play"
            type="danger"
            color="rgba(254,122,158)"
            round
            @click="play(list, list[0].id)"
          >
            播放全部</el-button
          >
          <el-button
            class="newMusic--nav--btn__collect"
            :icon="Star"
            type="danger"
            color="#f23606"
            round
            @click="subAll"
            >收藏全部
          </el-button>
        </div>
      </div>
      <el-skeleton :rows="1" animated :loading="isLoading">
        <!--骨架屏-->
        <template #template>
          <div class="el-skeleton--list">
            <el-skeleton-item
              variant="text"
              class="el-skeleton--list__item"
              v-for="(item, index) in 12"
              :key="index"
            />
          </div>
        </template>
        <!--内容列表-->
        <template #default>
          <!--列表-->
          <div class="newMusic--list" v-show="!switchMenu">
            <!--列表元素-->
            <div
              class="newMusic--list__item"
              v-for="(item, index) in list"
              @dblclick="playOne(item)"
              @contextmenu="contextMenuSong($event, item, [], false)"
              :key="item.id"
            >
              <!--索引-->
              <div class="newMusic--list__item__index">
                <span
                  v-if="
                    computedCurrentSongIsInTablePlayStatus(Number(item.id)) === 'no-play'
                  "
                  >{{ index + 1 < 10 ? "0" + (index + 1) : index + 1 }}</span
                >
                <i
                  class="iconfont icon-24gl-volumeHigh"
                  style="color: #f56c6c"
                  v-if="
                    computedCurrentSongIsInTablePlayStatus(Number(item.id)) === 'play'
                  "
                ></i>
                <i
                  class="iconfont icon-24gl-volumeZero"
                  style="color: #f56c6c"
                  v-else-if="
                    computedCurrentSongIsInTablePlayStatus(Number(item.id)) === 'pause'
                  "
                ></i>
              </div>
              <!--作品封面 名称 MV SQ-->
              <div class="newMusic--list__item__info">
                <PlayImage
                  :picUrl="item.al.picUrl"
                  width="100px"
                  height="100%"
                  @click="playOne(item)"
                />
                <span v-title class="newMusic--list__item__info__name single-clamp"
                  >{{ item.name }}
                  <span class="info single-clamp" v-if="item?.alia?.length"
                    >({{ item?.alia?.join("") }})</span
                  >
                </span>

                <!--标记是HIRes还是SQ还是MV-->
                <div
                  class="info--flag"
                  style="margin-left: 10px"
                  v-if="item?.hrMusic || item.hr"
                >
                  <span>Hi·Res</span>
                </div>
                <div class="info--flag" style="margin-left: 10px" v-else-if="item.sq">
                  <span>SQ</span>
                </div>
                <div
                  class="info--flag"
                  v-if="item.mv || item.mvid"
                  @click="
                    router.push({
                      path: '/mvDetail',
                      query: {
                        mvid: item.mv || item.mvid,
                      },
                    })
                  "
                >
                  <div>MV</div>
                  <el-icon>
                    <CaretRight />
                  </el-icon>
                </div>
              </div>
              <!--作者 歌手-->
              <span v-title class="newMusic--list__item__author single-clamp">
                <span v-for="(items, index) in item.ar" :key="items.id">
                  <span>{{ index > 0 ? " / " : "" }}</span>
                  <span class="gray" v-title @click="jumpArtists(items.id)">{{
                    items.name
                  }}</span>
                </span>
              </span>
              <!--专辑-->
              <span
                v-title
                class="newMusic--list__item__album gray single-clamp"
                @click="jumpAlbumDetail(item.al.id)"
              >
                {{ item.al.name }}
              </span>
              <!--时间-->
              <span class="newMusic--list__item__time info">{{ playTime(item.dt) }}</span>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
    <!--新碟上架-->
    <NewPlate v-if="switchMenu" />
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRouter } from "vue-router";
import { Star, VideoPlay } from "@element-plus/icons-vue";
import { getTopMusic } from "@/api/api_music";
import { getSongDetail } from "@/api/api_song";
import { SongDetailSongsItem } from "i/api/api_song";
import { playOne, play } from "@/utils/play";
import { playTime } from "@/utils/filter";
import { contextMenuSong } from "@/contextMenu/song/normal";
import { useSongStore } from "@/store/playlist";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";

let elMessage: any = inject("message") as any;
//收藏弹窗
let songMenu = useSongMenuPopupStore();
let router = useRouter();
//菜单按钮
let switchMenu = ref<boolean>(false);
//选中的标签
let checkTag = ref<number>(0);
//loading
let isLoading = ref<boolean>(true);
//列表
let list = ref<Array<SongDetailSongsItem>>([]);
//歌曲列表
let songList = useSongStore();

/**标签 */
let tags: Array<{
  name: string;
  type: number;
}> = [
  { name: "全部", type: 0 },
  { name: "华语", type: 7 },
  { name: "欧美", type: 96 },
  { name: "韩国", type: 16 },
  { name: "日本", type: 8 },
];

//判断当前播放的歌曲 是否表格里面也有相同的歌曲?是否正在播放 暂停 没有播放?
let computedCurrentSongIsInTablePlayStatus = computed(() => {
  return function (id: number) {
    if (songList.list[songList.currentListIndex]?.id === id) {
      if (songList.list[songList.currentListIndex]?.status === "play") {
        return "play";
      } else if (songList.list[songList.currentListIndex]?.status === "pause") {
        return "pause";
      }
    } else {
      return "no-play";
    }
  };
});

/**处理点击标签 */
let handleClickTag = (val: number) => {
  checkTag.value = val;
  isLoading.value = true;
  list.value = [];
  getNewMusicSongs();
};

/**获取最新音乐列表 */
let getNewMusicSongs = async () => {
  try {
    let { data } = await getTopMusic(checkTag.value);
    let ids = data.map((item) => item.id);
    let { songs, privileges } = await getSongDetail(ids.join(","));
    songs.forEach((item, index) => {
      item.from = {
        name: "新歌速递页",
        path: "findMusic",
        val: {
          component: "newMusic",
          index: 5,
        },
      };
      //初始化进度
      item.progress = 0;
      //音质
      item.plLevel = privileges[index].plLevel;
    });
    list.value = songs;
    isLoading.value = false;
  } catch (e: any) {
    elMessage.error(e?.message || "请求新歌速递列表失败 请检查你的网络是否有问题?");
  }
};

//收藏全部
let subAll = () => {
  songMenu.collectSongIds = list.value.map((item) => Number(item.id));
  songMenu.collectSongMenuShow = true;
};

//跳转专辑详情
let jumpAlbumDetail = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
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

onMounted(() => {
  getNewMusicSongs();
});
</script>

<style scoped lang="scss">
/**内容区域 */
/**最新音乐 */
.newMusic {
  display: flex;
  flex-direction: column;
}

/**切换栏 */
.newMusic--switchMenu {
  margin: 0 auto;
}

/**导航栏 */
.newMusic--nav {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/**导航栏标签 */
.newMusic--nav--tag {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/**导航栏标签 激活 */
.newMusic--nav--tag--active {
  color: #676767 !important;
  font-weight: 700;
}

/**导航栏按钮 */
.newMusic--nav--btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: end;
}

//列表
.newMusic--list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

//列表元素
.newMusic--list__item {
  display: flex;
  align-items: center;
  transition: all 0.2s;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 12px;
}

//列表元素 奇数
.newMusic--list__item:nth-child(odd) {
  background-color: var(--dark-item-backgroundOdd, rgb(249, 249, 249));
}

//列表元素 激活
.newMusic--list__item:hover {
  background-color: var(--dark-item-backgroundHover, rgb(240, 241, 242));
}

//列表元素 索引
.newMusic--list__item__index {
  margin-right: 20px;
  width: 20px;
  color: rgb(207, 207, 223);
  margin-left: 20px;
}

//列表元素 封面 名称 MV SQ
.newMusic--list__item__info {
  display: flex;
  align-items: center;
  min-width: 45%;
  max-width: 45%;
}

//列表元素 名字
.newMusic--list__item__info__name {
  margin-left: 20px;
  width: auto !important;
  text-align: left;
}

//列表元素 是否是mv还是sq（最高音质）
.newMusic--list__item__info__flag {
  display: flex;
  width: 28px;
  margin-left: 10px;
  font-size: 14px;
  align-items: center;
}

//作者
.newMusic--list__item__author {
  margin-left: 20px;
  text-align: left;
  width: 15%;
}

//专辑
.newMusic--list__item__album {
  margin-left: 30px;
  max-width: 20%;
  min-width: 20%;
  text-align: left;
}

//播放时间
.newMusic--list__item__time {
  flex: 1;
  text-align: right;
  margin-right: 20px;
}

/**骨架屏 */
//列表
.el-skeleton--list {
  margin-top: 10px;
}

//列表子元素
.el-skeleton--list__item {
  height: 80px;
}
</style>
