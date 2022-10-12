<template>
  <section class="detail">
    <div class="title">
      <el-icon class="back gray" @click="back"><ArrowLeft /></el-icon>
      <div style="margin: auto; font-weight: boldldisplay:flex;align-items:center">
        {{ title }}
        <img
          v-if="identityIconUrl"
          :src="identityIconUrl"
          alt="identityIconUrl"
          width="12"
          height="12"
        />
      </div>
    </div>
    <el-button
      class="more"
      round
      size="small"
      type="info"
      @click="getPrivateMsgHistoryList"
      v-if="isMore"
      >查看更多消息</el-button
    >
    <div class="list">
      <div class="list__item" v-for="item in msgsList" :key="item.id">
        <div class="info time">{{ commentTime(item.time) }}</div>
        <section class="msg" :class="getMsgDirection(item)">
          <el-avatar
            v-if="item?.fromUser?.avatarUrl && getMsgDirection(item) === 'left'"
            class="avatar"
            alt="avatar"
            :src="item?.fromUser?.avatarUrl"
          ></el-avatar>
          <div
            class="content"
            @contextmenu="contextMenuMessageDetail($event, msgsList, item)"
          >
            <div>{{ getMsgTitle(item) }}</div>
            <DefaultImage
              v-if="item.parseMsg?.picInfo"
              :picUrl="item.parseMsg?.picInfo?.picUrl"
              :param="200"
              :y="200"
              style="width: 200px; height: 200px"
              :needPreview="true"
              :originUrl="item.parseMsg?.picInfo?.picUrl"
            />
            <EventPlaylist
              v-if="item.parseMsg?.playlist"
              :item="item.parseMsg?.playlist"
            />
            <EventAlbum v-if="item.parseMsg?.album" :item="item.parseMsg?.album" />
            <EventSong v-if="item.parseMsg?.song" :item="item.parseMsg?.song" />
            <EventDjRadio v-if="item.parseMsg?.djRadio" :item="item.parseMsg?.djRadio" />
            <EventMV v-if="item.parseMsg?.mv" :item="item.parseMsg?.mv" />
            <EventProgram v-if="item.parseMsg?.program" :item="item.parseMsg?.program" />
            <EventVideo v-if="item.parseMsg?.video" :item="item.parseMsg?.video" />
          </div>
        </section>
      </div>
    </div>
    <MessageTextarea :replyUserName="title" :sendMsgCallback="sendMsgCallback" />
  </section>
</template>

<script setup lang="ts">
import { getPrivateMsgHistory } from "@/api/api_message";
import { userDetail } from "@/api/api_user";
import { contextMenuMessageDetail } from "@/contextMenu/privateLetter/detail";
import { list } from "@/localStorage/init";
import { useUserInformation } from "@/store/user";
import { commentTime } from "@/utils/filter";
import { PrivateMsgHistoryMsgsItem } from "i/api/api_message";
import { Ref } from "vue";

let user = useUserInformation();
let showKey = inject("showKey") as Ref<string>;
let openUserId = inject("openUserId") as Ref<number>;
let msgsList = ref<PrivateMsgHistoryMsgsItem[]>([]);
let title = ref<string>("");
let elMessage = inject("message") as any;
let isMore = ref<boolean>(true);
let identityIconUrl = ref<string>("");
let time = -1;
let offset = 0;

//后退
let back = () => {
  showKey.value = "control";
};

//获取用户详情
let getUserDetail = async () => {
  try {
    let {
      profile: { nickname },
      identify,
    } = await userDetail(openUserId.value);
    title.value = nickname;
    if (identify) {
      identityIconUrl.value = identify.imageUrl;
    }
    getPrivateMsgHistoryList();
  } catch (e: any) {
    elMessage.error(e?.message || "获取用户详情失败");
  }
};

//获取私信历史记录
let getPrivateMsgHistoryList = async () => {
  try {
    let { more, msgs } = await getPrivateMsgHistory(
      openUserId.value,
      title.value,
      offset,
      5,
      time
    );
    if (msgs[0].fromUser?.userId !== user?.user_profile?.userId) {
      title.value = msgs[0].fromUser.nickname;
    } else {
      title.value = msgs[0].toUser.nickname;
    }
    msgs.sort((a, b) => {
      return a.time - b.time;
    });
    msgs.forEach((item) => {
      item.parseMsg = JSON.parse(item.msg);
      if (item.parseMsg.song) {
        item.parseMsg.song.from = {
          path: "",
          name: "私信",
        };
        item.parseMsg.song.status = "play";
        item.parseMsg.song.progress = 0;
      }
      if (item.parseMsg.video) {
        item.parseMsg.video.videoId = item.parseMsg.video.encVid;
      }
    });
    msgsList.value.unshift(...msgs);
    if (time === -1) {
      updateScroll("down");
    } else {
      updateScroll("up");
    }
    isMore.value = more;
    time = msgs[msgs.length - 1].time;
    offset += msgs.length - 1;
  } catch (e: any) {
    elMessage.error("获取私信详情失败");
  }
};

//判断是否是自己发送的私信消息
let getMsgDirection = computed(() => {
  return function (item: PrivateMsgHistoryMsgsItem) {
    let id = user?.user_profile?.userId;
    if (id) {
      return item.fromUser.userId === id ? "right" : "left";
    }
  };
});

//发送消息成功后的回调函数
let sendMsgCallback = (msgs: PrivateMsgHistoryMsgsItem[]) => {
  msgs.forEach((item) => {
    item.parseMsg = JSON.parse(item.msg);
  });
  msgsList.value.push(...msgs);
  updateScroll("down");
};

//获取分享的标题
let getMsgTitle = computed(() => {
  return function (item: PrivateMsgHistoryMsgsItem) {
    let { msg, playlist, mv, album, song, video, program, djRadio } = item.parseMsg;
    let content = "";
    if (playlist) {
      content += "分享歌单：";
    } else if (mv) {
      content += "分享MV：";
    } else if (album) {
      content += "分享专辑：";
    } else if (song) {
      content += "分享单曲：";
    } else if (video) {
      content += "分享视频：";
    } else if (program) {
      content += "分享声音：";
    } else if (djRadio) {
      content += "分享播客：";
    }
    if (msg) {
      content += msg;
    }
    return content;
  };
});

//更新滚动位置
let updateScroll = (direction: string) => {
  nextTick(() => {
    let lists = document.querySelector(".list");
    let scrollHeight = 0;
    if (lists) {
      if (direction === "down") {
        scrollHeight = lists.scrollHeight;
      }
      lists.scrollTo({ top: scrollHeight, behavior: "smooth" });
    }
  });
};

onMounted(() => {
  getUserDetail();
});
</script>

<style scoped lang="scss">
.detail {
  overflow-y: initial !important;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .back {
    position: absolute;
    left: 15px;
  }
  height: 40px;
}

.more {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  height: 24px;
}

.list {
  overflow: scroll;
  margin-top: 20px;
  height: calc(100% - 208px);
}

.list__item {
  padding: 10px;
  display: flex;
  flex-direction: column;
  .time {
    margin: 10px auto;
    width: 100%;
    text-align: center;
  }

  .msg {
    display: flex;
    align-items: center;
  }

  .avatar {
    flex-shrink: 0;
    cursor: pointer;
  }

  .content {
    margin-bottom: 20px;
    background-color: dark;
    border-radius: 14px 25px 14px 2px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 10px;
    margin-left: 10px;
  }
}

.right {
  align-self: flex-end;

  .content {
    border-radius: 14px 25px 2px 14px;
    background-color: var(--dark-msg-content, rgb(213, 231, 249));
  }
}
</style>
