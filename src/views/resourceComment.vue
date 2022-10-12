<template>
  <section>
    <section class="resource--detail">
      <DefaultImage
        :picUrl="detail.picUrl"
        :param="78"
        class="picurl"
        :y="78"
        :lazy="false"
        loadingWidth="39px"
        loadingHeight="39px"
        fit="cover"
        @click="open"
      >
        <template #play>
          <!--播放按钮-->
          <div class="player--circle">
            <i class="iconfont icon-bofang" style="margin-left: 2px"></i>
          </div>
        </template>
      </DefaultImage>
      <div class="detail__right">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px">
          {{ detail.name }}
        </div>
        <div class="right__bottom">
          <div style="margin-right: 20px">
            <span>{{ detail.title }}</span
            ><span class="gray" @click="jump">{{ detail.category }}</span>
          </div>
          <div>
            {{ detail.subTitle
            }}<span class="ml2" v-for="(item, index) in detail.artists" :key="item.id">
              <span>{{ index > 0 ? " / " : "" }}</span>
              <span class="gray" @click="jumpArtists(item.id)">{{ item.name }}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
    <Comment :id="detail.id || 0" :inputType="1" :resourceType="detail.resourceType" />
  </section>
</template>

<script setup lang="ts">
import { getSongDetail } from "@/api/api_song";
//获取评论
import {
  getDjComment,
  getMvComment,
  getSongComment,
  getVideoComment,
} from "@/api/api_comment";
import { getProgramDetail, getRadioDJDetail } from "@/api/api_radio";
import { SongDetailSongsItem } from "i/api/api_song";
//分享
import { comment as commentType, userInfo } from "i/view/videoDetail.d";
import { useRoute, useRouter } from "vue-router";
import { getVideoDetail } from "@/api/api_video";
import { getMvDetail } from "@/api/api_mv";
import { playOne } from "@/utils/play";

//0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
type ResourceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let detail = reactive<{
  picUrl: string;
  name: string;
  category: string;
  artists: Array<{
    id: number;
    name: string;
  }>;
  title: string;
  subTitle: string;
  resourceType: ResourceType;
  id: string | number;
  jumpId: number | string;
  mainSong?: SongDetailSongsItem;
}>({
  picUrl: "",
  name: "",
  category: "",
  artists: [],
  title: "",
  subTitle: "",
  resourceType: 0,
  id: String(route.query.id),
  jumpId: 0,
});
//评论列表
let comment = reactive<commentType>({
  total: 0,
  hotComments: [],
  hotMore: false,
  comments: [],
});

let getSongDetailInfo = async () => {
  try {
    let { songs, privileges } = await getSongDetail(String(route.query.id));
    songs.forEach((item, index) => {
      item.from = {
        path: "",
        name: item.name,
      };
      item.progress = 0;
      item.status = "play";
      item.plLevel = privileges[index].plLevel;
    });
    detail.mainSong = songs[0];
    detail.picUrl = computedPicUrl(songs[0]);
    detail.name = songs[0].name;
    detail.artists = computedAr(songs[0]);
    detail.title = "专辑：";
    detail.category = computedAlbumName(songs[0]);
    detail.subTitle = "歌手：";
    detail.resourceType = 0;
    detail.id = Number(route.query.id);
    detail.jumpId = computedAlbumId(songs[0]);
    let { hotComments, comments, total } = await getSongComment(Number(route.query.id));
    comment.total = total;
    comment.hotComments = hotComments.slice(0, 10);
    comment.comments = comments;
    comment.hotMore = hotComments.length > 10 ? true : false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取歌曲详情失败");
  }
};

let getDjProgramDetailInfo = async () => {
  try {
    let { program } = await getProgramDetail(Number(route.query.id));
    program.mainSong.from = {
      path: "/broadCastDetail",
      name: program.radio.name,
      val: {
        id: program.radio.id,
      },
    };
    program.mainSong.status = "play";
    program.mainSong.progress = 0;
    program.mainSong.plLevel = "standard";
    program.mainSong.radio = program.radio;
    //是否点赞
    program.mainSong.liked = program.liked;
    //图片
    program.mainSong.album.picUrl = program.coverUrl;
    //电台节目id
    program.mainSong.radio.programId = program.id;
    //节目收听数量
    program.mainSong.radio.listenerCount = program.listenerCount;
    //发布时间
    program.mainSong.radio.scheduledPublishTime = program.scheduledPublishTime;

    detail.mainSong = program.mainSong;
    detail.name = program.name;
    detail.category = program.radio.name;
    detail.artists = program.mainSong.artists;
    detail.artists[0].id = program.dj.userId;
    detail.picUrl = program.coverUrl;
    detail.title = "播客：";
    detail.subTitle = "主播：";
    detail.resourceType = 4;
    // detail.id = program.dj.userId;
    detail.id = Number(route.query.id);
    detail.jumpId = program.radio.id;
    let { hotComments, comments, total } = await getDjComment(Number(route.query.id));
    comment.total = total;
    comment.hotComments = hotComments.slice(0, 10);
    comment.comments = comments;
    comment.hotMore = hotComments.length > 10 ? true : false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取节目详情失败");
  }
};

let getDjDetailInfo = async () => {
  try {
    let { data } = await getRadioDJDetail(Number(route.query.id));
    detail.name = data.name;
    detail.category = data.name;
    detail.artists = [{ id: data.dj.userId, name: data.dj.nickname }];
    detail.picUrl = data.picUrl;
    detail.title = "播客：";
    detail.subTitle = "主播：";
    detail.resourceType = 4;
    detail.id = Number(route.query.id);
    let { hotComments, comments, total } = await getDjComment(Number(route.query.id));
    comment.total = total;
    comment.hotComments = hotComments.slice(0, 10);
    comment.comments = comments;
    comment.hotMore = hotComments.length > 10 ? true : false;
    console.log("data", data);
  } catch (e: any) {
    elMessage.error(e?.message || "获取电台详情失败");
  }
};

let getVideoDetailInfo = async () => {
  try {
    let { data } = await getVideoDetail(String(route.query.id));
    detail.name = data.title;
    detail.category = data.title;
    detail.artists = [
      {
        id: data.creator.userId,
        name: data.creator.nickname,
      },
    ];
    detail.picUrl = data.coverUrl;
    detail.title = "视频：";
    detail.subTitle = "用户：";
    detail.resourceType = 5;
    detail.id = String(route.query.id);
    let { hotComments, comments, total } = await getVideoComment(String(route.query.id));
    comment.total = total;
    comment.hotComments = hotComments.slice(0, 10);
    comment.comments = comments;
    comment.hotMore = hotComments.length > 10 ? true : false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取视频详情失败");
  }
};

let getMVDetailInfo = async () => {
  try {
    let { data } = await getMvDetail(Number(route.query.id));
    detail.name = data.name;
    detail.category = data.name;
    detail.artists = data.artists;
    detail.picUrl = data.cover;
    detail.title = "mv：";
    detail.subTitle = "歌手：";
    detail.resourceType = 1;
    detail.id = Number(route.query.id);
    let { hotComments, comments, total } = await getMvComment(Number(route.query.id));
    comment.total = total;
    comment.hotComments = hotComments.slice(0, 10);
    comment.comments = comments;
    comment.hotMore = hotComments.length > 10 ? true : false;
  } catch (e: any) {
    elMessage.error(e?.message || "获取视频详情失败");
  }
};

let computedPicUrl = function (item: SongDetailSongsItem) {
  if (item?.al) {
    return item.al.picUrl;
  } else if (item?.album) {
    return item.album.picUrl;
  } else {
    return "";
  }
};

let computedAlbumName = function (item: SongDetailSongsItem) {
  if (item?.al) {
    return item.al.name;
  } else if (item?.album) {
    return item.album.name;
  } else {
    return "";
  }
};

let computedAlbumId = function (item: SongDetailSongsItem) {
  if (item?.al) {
    return item.al.id;
  } else if (item?.album) {
    return item.album.id;
  } else {
    return "";
  }
};

let computedAr = function (item: SongDetailSongsItem) {
  if (item?.ar) {
    return item.ar;
  } else if (item?.artists) {
    return item.artists;
  } else {
    return [];
  }
};

let switchRequest = () => {
  switch (route.query.type) {
    case "song":
      {
        getSongDetailInfo(); //ok
      }
      break;
    case "dj":
      {
        getDjDetailInfo(); //基本没有测到过电台有评论的情况 可考虑忽略
      }
      break;
    case "djProgram":
      {
        getDjProgramDetailInfo(); //ok
      }
      break;
    case "video":
      {
        getVideoDetailInfo(); //ok
      }
      break;
    case "mv":
      {
        getMVDetailInfo(); //ok
      }
      break;
  }
};

//点击图片
let open = () => {
  let type = route.query.type;
  switch (type) {
    case "song":
      {
        if (detail.mainSong) {
          playOne(detail.mainSong);
        }
      }
      break;
    case "video":
      {
        router.push({
          path: "/videoDetail",
          query: {
            vid: detail.id,
          },
        });
      }
      break;
    case "mv":
      {
        router.push({
          path: "/mvDetail",
          query: {
            mvid: detail.id,
          },
        });
      }
      break;
    case "djProgram":
      {
        if (detail.mainSong) {
          playOne(detail.mainSong);
        }
      }
      break;
  }
};

//跳转
let jump = () => {
  let type = route.query.type;
  switch (type) {
    case "song":
      {
        router.push({
          path: "/albumDetail",
          query: {
            id: detail.jumpId,
          },
        });
      }
      break;
    case "video":
      {
        router.push({
          path: "/videoDetail",
          query: {
            vid: detail.id,
          },
        });
      }
      break;
    case "mv":
      {
        router.push({
          path: "/mvDetail",
          query: {
            mvid: detail.id,
          },
        });
      }
      break;
    case "djProgram":
      {
        router.push({
          path: "/broadCastDetail",
          query: {
            id: detail.jumpId,
          },
        });
      }
      break;
  }
};

//跳转到歌手页/用户页
let jumpArtists = (id: number) => {
  let type = route.query.type;
  switch (type) {
    case "song":
      {
        router.push({
          path: "/artists",
          query: {
            type: 1,
            id,
          },
        });
      }
      break;
    case "video":
      {
        router.push({
          path: "/homePage",
          query: {
            id,
          },
        });
      }
      break;
    case "mv":
      {
        router.push({
          path: "/artists",
          query: {
            type: 1,
            id,
          },
        });
      }
      break;
    case "djProgram":
      {
        router.push({
          path: "/homePage",
          query: {
            id,
          },
        });
      }
      break;
  }
};

watch(
  () => route.query,
  (val) => {
    switchRequest();
  }
);

onActivated(() => {
  switchRequest();
});
</script>

<style scoped lang="scss">
.resource--detail {
  display: flex;
  align-items: center;
  margin-left: 30px;
  margin-top: 20px;
}

.detail__right {
  margin-left: 25px;
}

.right__bottom {
  display: flex;
}

.picurl {
  height: 78px !important;
  width: 78px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
