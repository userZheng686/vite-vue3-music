<template>
  <section>
    <loadingComponent v-if="loading" />
    <MessageEmpty v-else-if="!list.length" />
    <div class="list" v-else-if="list.length">
      <!--评论组件-->
      <div class="comment--list__item" v-for="item in list" :key="item.time">
        <!--头像-->
        <el-avatar
          :size="50"
          style="cursor: pointer; flex-shrink: 0"
          :src="
            item.user.avatarUrl.replace(/http:\//, 'https:/') +
            '?imageView&enlarge=1&thumbnail=50y50&type=webp'
          "
          @click="jumpUserHomePage(item.user.userId)"
        />
        <!--头像右边-->
        <div class="item--right">
          <!--名字 内容-->
          <div class="right--top">
            <b class="right--top__username" @click="jumpUserHomePage(item?.user?.userId)"
              >{{ item.user.nickname }} :
            </b>
            <span
              v-for="items in normalizeCommentContent(item.content)"
              :key="items.content"
              :class="items.isNeedColor ? 'blue' : ''"
              style="word-break: break-all"
              @click="jumpPage(items)"
            >
              {{ items.content }}
            </span>
          </div>
          <!--回复-->
          <div class="right--repeat">
            <span
              v-for="items in normalizeCommentContent(item.beRepliedContent)"
              :key="items.content"
              :class="items.isNeedColor ? 'blue' : ''"
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
    <el-button class="more" @click="getMsgCommentsList" type="danger" round v-if="isMore"
      >加载更多</el-button
    >
  </section>
</template>

<script setup lang="ts">
import { getMsgComments } from "@/api/api_message";
import { MsgCommentsItem } from "i/api/api_message";
import { useUserInformation } from "@/store/user";
import { useCount } from "@/store/count";
import { useRouter } from "vue-router";
import { normalizeCommentContent, commentTime } from "@/utils/filter";
import { getSearch } from "@/api/api_search";
import { getTopicSearch } from "@/api/api_topic";

let elMessage = inject("message") as any;
let user = useUserInformation();
let router = useRouter();
let count = useCount();
let loading = ref<boolean>(true);
let isMore = ref<boolean>(true);
let list = ref<MsgCommentsItem[]>([]);
let time = -1;

watch(
  () => user?.user_profile?.userId,
  (val) => {
    getMsgCommentsList();
  },
  {
    deep: true,
  }
);

onMounted(() => {
  if (user?.user_profile?.userId) {
    getMsgCommentsList();
  }
});

//获取评论列表
let getMsgCommentsList = async () => {
  try {
    let { more, comments } = await getMsgComments(user?.user_profile?.userId, 3, time);
    isMore.value = more;

    if (comments?.length) {
      list.value.push(...comments);
      time = comments[comments.length - 1].time;
      loading.value = false;
      count.updateCount();
    }
  } catch (e: any) {
    elMessage.error("获取评论列表失败");
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
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
};
</script>

<style scoped lang="scss">
.more {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

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
</style>
