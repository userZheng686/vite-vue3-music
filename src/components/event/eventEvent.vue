<template>
  <div class="event">
    <span class="blue">@{{ props.item.user.nickname }}</span>
    <span class="share info">{{ computedShareType(props.item.parseJson) }}</span>
    <div
      class="info text"
      v-for="items in computedMsg(props.item.parseJson)"
      :key="items"
    >
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
      :item="item.parseJson.song"
      style="background-color: var(--dark-eventBackgroundColor, rgb(252, 252, 252))"
    />
    <EventAlbum
      v-else-if="computedComponent(props.item.parseJson) === 'album'"
      :item="item.parseJson.album"
      style="background-color: var(--dark-eventBackgroundColor, rgb(252, 252, 252))"
    />
    <EventTopic
      v-else-if="computedComponent(props.item.parseJson) === 'topic'"
      :item="item.parseJson.topic"
    />
    <EventPlaylist
      v-else-if="computedComponent(props.item.parseJson) === 'playlist'"
      :item="item.parseJson.playlist"
      style="background-color: var(--dark-eventBackgroundColor, rgb(252, 252, 252))"
    />
    <EventMV
      v-else-if="computedComponent(props.item.parseJson) === 'mv'"
      :item="item.parseJson.mv"
      style="background-color: var(--dark-eventBackgroundColor, rgb(252, 252, 252))"
    />
    <EventVideo
      v-else-if="computedComponent(props.item.parseJson) === 'video'"
      :item="item.parseJson.video"
      style="bbackground-color: var(--dark-eventBackgroundColor, rgb(252, 252, 252))"
    />
    <EventDjRadio
      v-else-if="computedComponent(item.parseJson) === 'djRadio'"
      :item="item.parseJson.djRadio"
    />
    <EventProgram
      v-else-if="computedComponent(item.parseJson) === 'program'"
      :item="item.parseJson.program"
    />
    <EventArtist
      v-else-if="computedComponent(item.parseJson) === 'resource'"
      :item="item.parseJson.resource"
    />
    <div class="picture">
      <DefaultImage
        v-for="picture in props.item.pics"
        :key="picture.pcSquareUrl"
        :picUrl="picture.pcSquareUrl"
        loadingWidth="100px"
        loadingHeight="100px"
        :param="200"
        :y="200"
        :lazy="false"
        :needPreview="true"
        :originUrl="picture.originUrl"
        style="width: 200px; height: 200px; margin-top: 20px; margin-right: 10px"
      />
    </div>
    <div class="btn">
      <i
        class="iconfont icon-dianzan gray"
        :class="item.info.liked ? 'like' : ''"
        @click="likeComment(item)"
      ></i>
      <span class="info" style="margin-left: 2px">({{ item.info.likedCount }})</span>
      <el-divider direction="vertical" />
      <i class="iconfont icon-fenxiang gray" @click="event(item)"></i>
      <span class="info" style="margin-left: 2px">({{ item.info.shareCount }})</span>
      <el-divider direction="vertical" />
      <i
        style="margin-top: -4px"
        class="iconfont icon-chakantiezihuifu gray"
        @click="jumpEventDetail"
      ></i>
      <span class="info" style="margin-left: 2px">({{ item.info.commentCount }})</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getResourceLike } from "@/api/api_like";
import { useEventShare } from "@/utils/dialogShare";
import { UserEvenEvents } from "i/api/api_event";
import { useRouter } from "vue-router";
import { normalizeCommentContent } from "@/utils/filter";
import { getSearch } from "@/api/api_search";
import { getTopicSearch } from "@/api/api_topic";

let router = useRouter();
interface Props {
  item: UserEvenEvents;
}

let props = defineProps<Props>();
let elMessage = inject("message") as any;

let computedMsg = computed(() => {
  return function (parseJson: any) {
    return parseJson.msg.split("\n");
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
    } else if (parseJson.resource) {
      return "resource";
    }
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

//跳转页面
let jumpPage = async (item: { content: string; isNeedColor: boolean; mark: string }) => {
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
    }
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
</script>

<style scoped lang="scss">
.event {
  background-color: var(--dark-normalBackgroundColor, rgb(243, 243, 243));
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;

  .share {
    margin-left: 10px;
  }

  &:hover {
    background-color: var(--dark-normalBackgroundColor, rgb(239, 240, 240));
  }

  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .picture {
    display: grid;
    grid-template-columns: 200px 200px 200px;
    column-gap: 10px;
  }

  .text {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>
