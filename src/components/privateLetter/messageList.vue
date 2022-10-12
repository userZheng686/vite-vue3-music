<template>
  <section class="msg__list">
    <loadingComponent v-if="loading" />
    <MessageEmpty v-else-if="!list.length" />
    <div
      class="list__item"
      v-for="item in list"
      :key="item.lastMsgTime"
      @click="openMessageDetail(item)"
      @contextmenu="contextMenuMessageList($event, list, item)"
    >
      <el-badge :is-dot="computedDot(item)" class="item">
        <el-avatar class="avatarUrl" :src="item.fromUser.avatarUrl" alt="avatarUrl" />
      </el-badge>
      <div class="content single-clamp">
        <div class="top single-clamp">
          <span class="blue single-clamp"
            >{{ item.fromUser.nickname }}
            <img
              :src="item?.fromUser?.avatarDetail?.identityIconUrl"
              width="10"
              v-if="item?.fromUser?.avatarDetail?.identityIconUrl"
              height="10"
              alt="identityIconUrl"
            />
          </span>
          <span class="info">{{ commentTime(Number(item.lastMsgTime)) }}</span>
        </div>
        <div class="bottom single-clamp info">{{ getMsgContent(item) }}</div>
      </div>
    </div>
    <el-button
      class="more"
      @click="getPrivateMsgList"
      type="danger"
      round
      v-if="isMore && !loading"
      >加载更多</el-button
    >
  </section>
</template>

<script setup lang="ts">
import { getPrivateMsg } from "@/api/api_message";
import { contextMenuMessageList } from "@/contextMenu/privateLetter/normal";
import { useUserInformation } from "@/store/user";
import { commentTime } from "@/utils/filter";
import { PrivateMsgItem } from "i/api/api_message";
import { Ref } from "vue";

let offset = 0;
let list = ref<PrivateMsgItem[]>([]);
let isMore = ref<boolean>(true);
let loading = ref<boolean>(true);
let elMessage = inject("message") as any;
let showKey = inject("showKey") as Ref<string>;
let openUserId = inject("openUserId") as Ref<number>;
let user = useUserInformation();

//获取历史私信
let getPrivateMsgList = async () => {
  try {
    let { more, msgs } = await getPrivateMsg(30, offset);
    isMore.value = more;
    if (msgs?.length) {
      offset += msgs.length;
      msgs.forEach((item) => {
        item.parseMsg = JSON.parse(item.lastMsg);
      });
      list.value.push(...msgs);
    }
  } catch (e: any) {
    elMessage.error("获取私信列表失败");
  } finally {
    loading.value = false;
  }
};

//获取最后一条私信内容
let getMsgContent = computed(() => {
  return function (item: PrivateMsgItem) {
    let {
      msg,
      title,
      playlist,
      mv,
      newPub,
      album,
      song,
      video,
      program,
      djRadio,
      picInfo,
    } = item.parseMsg;
    let content = "";
    if (title) {
      content += title + "：";
    }
    if (playlist) {
      content += playlist.name;
    } else if (mv) {
      content += mv.name;
    } else if (album) {
      content += album.name;
    } else if (song) {
      content += song.name;
    } else if (video) {
      content += video.title;
    } else if (program) {
      content += program.name;
    } else if (djRadio) {
      content += djRadio.name;
    } else if (picInfo) {
      content += "图片";
    } else {
      content = msg;
    }
    // video title other name
    return content;
  };
});

//是否是最新消息 没有查看
let computedDot = computed(() => {
  return function (item: PrivateMsgItem) {
    let { newMsgCount } = item;
    return newMsgCount ? true : false;
  };
});

//打开私信详情 这块后期优化使用pinia
let openMessageDetail = (item: PrivateMsgItem) => {
  item.parseMsg.newPub = false;
  showKey.value = "messageDetail";
  openUserId.value = item.fromUser.userId;
};

onMounted(() => {
  if (user?.user_profile?.isLogin) {
    getPrivateMsgList();
  }
});
</script>

<style scoped lang="scss">
.list__item {
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  .avatarUrl {
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    margin-left: 10px;

    .top {
      display: flex;
      align-content: center;
      justify-content: space-between;
    }
  }

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(250, 250, 250));
  }
}

.more {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
}
</style>
