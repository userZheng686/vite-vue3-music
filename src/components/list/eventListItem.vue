<template>
  <div class="user">
    <el-avatar
      :src="props.item.user.avatarUrl.replace('http', 'https')"
      @click="jumpHomePage(props.item.user.userId)"
    />
    <div class="user_right">
      <div style="display: flex; align-items: center">
        <span class="blue" @click="jumpHomePage(props.item.user.userId)">{{
          props.item.user.nickname
        }}</span>
        <img
          v-if="props.item?.user?.avatarDetail?.identityIconUrl"
          :src="props.item?.user?.avatarDetail?.identityIconUrl"
          alt=""
          width="15"
          height="15"
          style="margin-left: 4px"
        />
        <span class="share info">{{ computedShareType(props.item.parseJson) }}</span>
      </div>
      <div class="time info">{{ commentTime(props.item.eventTime) }}</div>
    </div>
  </div>
  <div class="message">
    <div v-for="items in computedMsg(props.item.parseJson)" :key="items">
      <span
        @click="jumpPage(item)"
        v-for="item in normalizeCommentContent(items)"
        :key="item.content"
        :class="item.isNeedColor ? 'blue' : ''"
      >
        {{ item.content }}
      </span>
    </div>
    <EventSong
      v-if="computedComponent(props.item.parseJson) === 'song'"
      :item="props.item.parseJson.song"
    />
    <EventAlbum
      v-else-if="computedComponent(props.item.parseJson) === 'album'"
      :item="props.item.parseJson.album"
    />
    <EventTopic
      v-else-if="computedComponent(props.item.parseJson) === 'topic'"
      :item="props.item.parseJson.topic"
    />
    <EventPlaylist
      v-else-if="computedComponent(props.item.parseJson) === 'playlist'"
      :item="props.item.parseJson.playlist"
    />
    <EventMV
      v-else-if="computedComponent(props.item.parseJson) === 'mv'"
      :item="props.item.parseJson.mv"
    />
    <EventVideo
      v-else-if="computedComponent(props.item.parseJson) === 'video'"
      :item="props.item.parseJson.video"
    />
    <EventDjRadio
      v-else-if="computedComponent(props.item.parseJson) === 'djRadio'"
      :item="props.item.parseJson.djRadio"
    />
    <EventProgram
      v-else-if="computedComponent(props.item.parseJson) === 'program'"
      :item="props.item.parseJson.program"
    />
    <EventEvent
      v-else-if="computedComponent(props.item.parseJson) === 'event'"
      :item="props.item.parseJson.event"
    />
    <EventArtist
      v-else-if="computedComponent(props.item.parseJson) === 'resource'"
      :item="props.item.parseJson.resource"
    />
    <div class="picture">
      <DefaultImage
        v-for="picture in props.item.pics"
        :key="picture.pcSquareUrl"
        :picUrl="picture.pcSquareUrl"
        loadingWidth="55px"
        loadingHeight="55px"
        :param="110"
        :y="110"
        :lazy="false"
        :needPreview="true"
        :originUrl="picture.originUrl"
        style="max-width: 110px; max-height: 110px; margin-top: 20px; margin-right: 10px"
      />
    </div>
    <div class="bottom">
      <div class="avatar" v-if="props?.item?.xInfo?.info?.latestLikedUsers?.length">
        <span>赞：</span>
        <el-avatar
          v-for="item in props?.item?.xInfo?.info?.latestLikedUsers"
          :key="item.userId"
          :src="item.avatarUrl.replace('http', 'https')"
          @click="jumpUserHomePage(item.userId)"
          alt="user"
          class="img"
        ></el-avatar>
      </div>
      <div class="btn">
        <i
          class="iconfont icon-dianzan gray"
          :class="props.item.info.liked ? 'like' : ''"
          @click="likeComment(props.item)"
          title="点赞"
        ></i>
        <span class="info" style="margin-left: 2px"
          >({{ props.item.info.likedCount }})</span
        >
        <el-divider direction="vertical" />
        <i
          title="分享"
          class="iconfont icon-fenxiang gray"
          @click="event(props.item)"
        ></i>
        <span class="info" style="margin-left: 2px"
          >({{ props.item.info.shareCount }})</span
        >
        <el-divider direction="vertical" />
        <i
          style="margin-top: -4px"
          class="iconfont icon-chakantiezihuifu gray"
          @click="jumpEventDetail"
          title="查看评论"
        ></i>
        <span class="info" style="margin-left: 2px"
          >({{ props.item.info.commentCount }})</span
        >
        <el-divider direction="vertical" v-if="props.isShowDeleteBtn" />
        <el-icon
          title="删除"
          class="gray"
          v-if="props.isShowDeleteBtn"
          @click="deleteEvent"
          style="font-size: 16px"
          ><Delete
        /></el-icon>
      </div>
    </div>
  </div>
  <el-divider />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { getResourceLike } from "@/api/api_like";
import { UserEvenEvents } from "i/api/api_event";
import { useEventShare } from "@/utils/dialogShare";
import { commentTime } from "@/utils/filter";
import { delUserEvent } from "@/api/api_event";
import { ElMessageBox } from "element-plus";
import { normalizeCommentContent } from "@/utils/filter";
import { getSearch } from "@/api/api_search";
import { getTopicSearch } from "@/api/api_topic";

interface Props {
  item: UserEvenEvents;
  isShowDeleteBtn?: boolean;
  refresh?: Function;
}

let elMessage = inject("message") as any;
let props = defineProps<Props>();
let router = useRouter();

//跳转到用户主页
let jumpHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
      id,
      component: "createPlaylist",
      index: 0,
    },
  });
};

//跳转到动态详情
let jumpEventDetail = () => {
  router.push({
    path: "/eventDetail",
    query: {
      uid: props.item.user.userId,
      id: props.item.id,
    },
  });
};

//跳转页面
let jumpPage = async (item: {
  content: string;
  isNeedColor: boolean;
  mark: string;
  url: string;
}) => {
  if (item.mark === "at") {
    let {
      result: { userprofiles },
    } = await getSearch(item.content.replace("@", ""), 1002, 1, 0);
    if (userprofiles?.length) {
      router.push({
        path: "/homePage",
        query: {
          id: userprofiles[0].userId,
        },
      });
    }
  } else if (item.mark === "hash") {
    let {
      result: { topics },
    } = await getTopicSearch(item.content.replace("#", ""));
    router.push({
      path: "/topicDetail",
      query: {
        actId: topics[0].actId,
      },
    });
  } else if (item.mark === "href") {
    if (window.desktopMainAPI) {
      window.desktopMainAPI.href(item.url);
    } else {
      window.open(item.url);
    }
  }
};

//点赞
let likeComment = async (item: UserEvenEvents) => {
  //判断到底是点赞还是取消点赞
  let islike = item.info.liked ? 0 : 1;
  //找id
  let threadId = `A_EV_2_${item.id}_1`;
  try {
    let res = await getResourceLike(6, islike, 0, threadId);
    if (res.code === 200) {
      if (islike) {
        item.info.liked = true;
        item.info.likedCount++;
      } else {
        item.info.liked = false;
        item.info.likedCount--;
      }
    }
  } catch (e: any) {
    elMessage.error(e?.message || "点赞失败 请检查你的网络是否有问题?");
  }
};

//转发
let event = (item: UserEvenEvents) => {
  let id = item.id,
    userId = item.user.userId;
  useEventShare(id, userId, (res: { status: string }) => {
    if (res.status === "success") {
      item.info.shareCount++;
      elMessage.success("转发成功");
      props.refresh && props.refresh();
    }
  });
};

//跳转到用户空间页面
let jumpUserHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
};

//删除动态
let deleteEvent = () => {
  ElMessageBox.confirm("确定删除该动态?", "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        let res = await delUserEvent(props.item.id);
        elMessage.success("删除成功");
        props.refresh && props.refresh();
      } catch (e: any) {
        elMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

let computedMsg = computed(() => {
  return function (parseJson: any) {
    return parseJson.msg.split("\n");
  };
});

let computedShareType = computed(() => {
  return function (parseJson: any) {
    if (parseJson.song) {
      return "分享歌曲";
    } else if (parseJson.album) {
      return "分享专辑";
    } else if (parseJson.topic) {
      return "分享专栏";
    } else if (parseJson.playlist) {
      return "分享歌单";
    } else if (parseJson.mv) {
      return "分享mv";
    } else if (parseJson.video) {
      return "分享视频";
    } else if (parseJson.djRadio) {
      return "分享播客";
    } else if (parseJson.program) {
      return "分享声音";
    } else if (parseJson.event) {
      return "转发";
    }
  };
});

let computedComponent = computed(() => {
  return function (parseJson: any) {
    if (parseJson.song) {
      return "song";
    } else if (parseJson.album) {
      return "album";
    } else if (parseJson.topic) {
      return "topic";
    } else if (parseJson.playlist) {
      return "playlist";
    } else if (parseJson.mv) {
      return "mv";
    } else if (parseJson.video) {
      return "video";
    } else if (parseJson.djRadio) {
      return "djRadio";
    } else if (parseJson.program) {
      return "program";
    } else if (parseJson.event) {
      return "event";
    } else if (parseJson.resource) {
      if (parseJson.resource.id && parseJson.resource.name) {
        return "resource";
      }
    }
  };
});
</script>

<style scoped lang="scss">
.user {
  display: flex;
}

.message {
  margin-left: 50px;
  margin-top: 10px;

  .bottom {
    margin-right: 20px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .avatar {
      display: flex;
      align-items: center;

      .img {
        margin-left: 10px;
        cursor: pointer;
      }
    }

    .btn {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.user_right {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: Event-between;

  .share {
    margin-left: 10px;
  }
}

.picture {
  display: grid;
  grid-template-columns: 110px 110px 110px;
  column-gap: 10px;
}
</style>
