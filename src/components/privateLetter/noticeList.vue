<template>
  <section>
    <loadingComponent v-if="loading" />
    <MessageEmpty v-else-if="!list.length" />
    <div class="list">
      <div
        class="comment--list__item"
        v-for="item in list"
        :key="item.time"
        @contextmenu="contextMenuNoticeList($event, list, item)"
      >
        <!--头像-->
        <el-avatar
          :size="50"
          style="cursor: pointer; flex-shrink: 0"
          :src="
            item.parseNotice.user.avatarUrl?.replace(/http:\//, 'https:/') +
            '?imageView&enlarge=1&thumbnail=50y50&type=webp'
          "
          @click="jumpUserHomePage(item.parseNotice.user.userId)"
        />
        <!--头像右边-->
        <div class="item--right">
          <!--名字-->
          <div class="right--top">
            <b
              class="right--top__username"
              @click="jumpUserHomePage(item.parseNotice.user.userId)"
              >{{ item.parseNotice.user.nickname }} :
            </b>
            <span class="info">{{ computedAction(item) }}</span>
          </div>
          <!-- 内容-->
          <div class="right--repeat">
            <span
              v-for="items in normalizeCommentContent(computedContent(item))"
              :key="items.content"
              :class="items.isNeedColor ? 'blue' : ''"
              style="word-break: break-all"
              @click="jumpPage(items)"
            >
              {{ items.content }}
            </span>
          </div>
          <!--时间 按钮-->
          <div class="right--bottom">
            <!--时间-->
            <span>{{ commentTime(item.time) }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-button class="more" @click="getMsgNoticeList" type="danger" round v-if="isMore"
      >加载更多</el-button
    >
  </section>
</template>

<script setup lang="ts">
import { getMsgNotices } from "@/api/api_message";
import { getSearch } from "@/api/api_search";
import { getTopicSearch } from "@/api/api_topic";
import { contextMenuNoticeList } from "@/contextMenu/privateLetter/notice";
import { MsgNoticesItem } from "@/interface/api/api_message";
import { useCount } from "@/store/count";
import { useUserInformation } from "@/store/user";
import { normalizeCommentContent, commentTime } from "@/utils/filter";
import { useRouter } from "vue-router";

let elMessage = inject("message") as any;
let list = ref<MsgNoticesItem[]>([]);
let isMore = ref<boolean>(true);
let loading = ref<boolean>(true);
let router = useRouter();
let count = useCount();
let user = useUserInformation();
let time = -1;

//获取通知列表
let getMsgNoticeList = async () => {
  try {
    let { notices, more } = await getMsgNotices(5, time);
    if (notices?.length) {
      notices.forEach((item) => {
        item.parseNotice = JSON.parse(item.notice);
      });
      list.value.push(...notices);
      loading.value = false;
      isMore.value = more;
      time = notices[notices.length - 1].time;
    }
    // count.updateCount();
  } catch (e: any) {
    elMessage.error("获取通知列表失败");
  }
};

//判断动作
let computedAction = computed(() => {
  return function (item: MsgNoticesItem) {
    let action = item.parseNotice.specialType ? "收藏了你的" : "点赞了你的";
    let resource = "";
    if (item.parseNotice.comment) {
      resource = "评论";
    } else if (item.parseNotice.playlist) {
      resource = "歌单";
    } else if (item.parseNotice.track) {
      resource = "动态";
    }
    return action + resource;
  };
});

//内容
let computedContent = computed(() => {
  return function (item: MsgNoticesItem) {
    let content = "";
    if (item.parseNotice.track) {
      let { msg } = JSON.parse(item.parseNotice.track.json);
      content = msg;
    } else if (item.parseNotice.playlist) {
      content = item.parseNotice.playlist.name;
    } else if (item.parseNotice.comment) {
      content = item.parseNotice.comment.content;
    }
    return content;
  };
});

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
let jumpUserHomePage = (id?: number) => {
  if (!id) return;
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
};

onMounted(() => {
  if (user?.user_profile?.isLogin) {
    getMsgNoticeList();
  }
});
</script>

<style scoped lang="scss">
//评论组件
.comment--list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
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
  background-color: var(--dark-normalBackgroundColor, rgb(244, 244, 244));
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

.more {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}
</style>
