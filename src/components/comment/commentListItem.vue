<template>
  <!--评论组件-->
  <div class="comment--list__item">
    <!--头像-->
    <el-avatar
      :size="50"
      style="cursor: pointer"
      :src="
        props.item.user.avatarUrl.replace(/http:\//, 'https:/') +
        '?imageView&enlarge=1&thumbnail=50y50&type=webp'
      "
      @click="jumpUserHomePage(props.item?.user?.userId)"
    />
    <!--头像右边-->
    <div class="item--right">
      <!--名字 内容-->
      <div class="right--top">
        <b
          class="right--top__username"
          @click="jumpUserHomePage(props.item?.user?.userId)"
          >{{ props.item.user.nickname }} :
        </b>
        <span
          v-for="item in normalizeCommentContent(props.item.content)"
          :key="item.content"
          :class="item.isNeedColor ? 'blue' : ''"
          style="word-break: break-all"
          @click="jumpPage(item)"
        >
          {{ item.content }}
        </span>
      </div>
      <!--回复-->
      <div class="right--repeat" v-if="props.item?.beReplied?.length">
        <b class="right--top__username"
          >@{{ props.item.beReplied[0].user.nickname }} :
        </b>
        <span
          v-for="item in normalizeCommentContent(props.item.beReplied[0].content)"
          :key="item.content"
          :class="item.isNeedColor ? 'blue' : ''"
        >
          {{ item.content }}
        </span>
      </div>
      <!--时间 按钮-->
      <div class="right--bottom">
        <!--时间-->
        <span>{{ commentTime(props.item.time) }}</span>
        <!--点赞 分享 回复-->
        <div class="bottom-btn">
          <i
            class="iconfont icon-dianzan gray"
            :class="props.item.liked ? 'like' : ''"
            @click="likeComment"
          ></i>
          <span style="margin-left: 2px">{{ props.item.likedCount }}</span>
          <el-divider direction="vertical" />
          <i class="iconfont icon-fenxiang gray" @click="shareCloud"></i>
          <el-divider direction="vertical" />
          <i
            style="margin-top: -4px"
            class="iconfont icon-chakantiezihuifu gray"
            @click="replyComment"
          ></i>
          <el-divider direction="vertical" v-if="props.isShowDelBtn" />
          <i
            style=""
            class="iconfont icon-shanchu gray"
            @click="deleteComment"
            v-if="props.isShowDelBtn"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { normalizeCommentContent, commentTime } from "@/utils/filter";
import { useCommentShare } from "@/utils/dialogShare";
import emitter from "@/utils/eventBus";
import { VideoCommentItem } from "i/api/api_comment.d";
//歌曲评论弹窗
import { useSongCommentStore } from "@/store/songPopup";
//歌曲列表
import { useSongStore } from "@/store/playList";
import { getCommentLike } from "@/api/api_like";
import { getSearch } from "@/api/api_search";
import { getTopicSearch } from "@/api/api_topic";
import { getCommentSend } from "@/api/api_comment";
import { useRouter } from "vue-router";
import { Ref } from "vue";
import { useHeader } from "@/store/header";

//评论弹窗
let songCommentShow = useSongCommentStore();
//歌曲列表
let songList = useSongStore();
//header
let header = useHeader();
//路由
let router = useRouter();
//全局消息提示
let elMessage: any = inject("message") as any;
//歌曲详情
let isSongDetailVisible = inject("songDetailVisible") as Ref<boolean>;

//0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
type ResourceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  item: VideoCommentItem;
  id: string | number;
  resourceType: ResourceType;
  delComment?: Function;
  isShowDelBtn?: boolean;
}

let props = defineProps<Props>();

//点赞
let likeComment = async () => {
  //找id
  let id = props.id;
  //判断到底是点赞还是取消点赞
  let islike = props.item.liked ? 0 : 1;
  try {
    let res = await getCommentLike(id, props.item.commentId, islike, props.resourceType);
    if (res.code === 200) {
      if (islike) {
        props.item.liked = true;
        props.item.likedCount++;
      } else {
        props.item.liked = false;
        props.item.likedCount--;
      }
    }
  } catch (e: any) {
    elMessage.error(e?.message || "点赞失败 请检查你的网络是否有问题?");
  }
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

//跳转到用户空间页面
let jumpUserHomePage = (id: number) => {
  isSongDetailVisible.value = false;
  header.setHeaderVisible(false);
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
};

//分享到空间
let shareCloud = () => {
  useCommentShare(props.item.commentId, props.item.user.nickname, props.item.content);
  nextTick(() => {
    //置顶 这地方用dom操作
    let songDetail = document.querySelector(".song--detail");
    if (songDetail) {
      songDetail.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
};

//回复
let replyComment = () => {
  //完美解决滚动问题 主要是点击回复的按钮 页面自动往上面滚动
  //文本
  let textarea = document.querySelector(".textarea--wrap");
  textarea?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "nearest",
  });
  //打开歌曲评论弹窗
  if (
    !songCommentShow.isShowSongComment &&
    !songList.list[songList.currentListIndex]?.radio
  ) {
    songCommentShow.setSongCommentShow(true);
    nextTick(() => {
      //置顶 这地方用dom操作
      let songDetail = document.querySelector(".song--detail");
      if (songDetail) {
        songDetail.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  } else if (!songCommentShow.isShowRadioComment) {
    songCommentShow.setRadioCommentShow(true);
    nextTick(() => {
      //置顶 这地方用dom操作
      let radioDetail = document.querySelector(".radio--detail");
      if (radioDetail) {
        radioDetail.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
  nextTick(() => {
    //回复别人
    emitter.emit("replyContent", {
      contents: `回复${props.item.user.nickname}：`,
      repeatContent: props.item.content,
      commentId: props.item.commentId,
    });
  });
};

//删除评论
let deleteComment = async () => {
  try {
    let res = await getCommentSend(
      0,
      props.resourceType,
      props.id,
      "",
      props.item.commentId
    );
    props.delComment && props.delComment(props.item.commentId);
    elMessage.success("删除成功");
  } catch (e: any) {
    elMessage.error("删除失败");
  }
};
</script>

<style scoped lang="scss">
//评论组件
.comment--list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  width: 100%;
}

//组件右边
.item--right {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-left: 15px;
  flex: 1;
  overflow: hidden;
}

//用户名
.right--top__username {
  color: rgb(80, 125, 175, 0.8);
  cursor: pointer;
}

.right--top__username:hover {
  color: rgb(80, 125, 175, 1);
}

//回复
.right--repeat {
  background-color: var(--dark-blackBackgroundColor, rgb(244, 244, 244));
  padding: 10px;
  border-radius: 3px;
  margin-top: 5px;
}

//组件右边下边
.right--bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 5px;
  color: #909399;
}

//按钮 点赞 分享 回复
.bottom-btn {
  display: flex;
  align-items: center;
  /* width: 20%; */

  justify-content: space-between;
}

//点赞
.like {
  color: #f56c6c;
}
</style>
