<template>
  <section>
    <loadingComponent v-if="loading" />
    <MessageEmpty v-else-if="!list.length" />
    <div class="list">
      <!--评论组件-->
      <div class="comment--list__item" v-for="item in list" :key="item.time">
        <!--头像-->
        <el-avatar
          :size="50"
          style="cursor: pointer; flex-shrink: 0"
          :src="
            computedUser(item)?.avatarUrl?.replace(/http:\//, 'https:/') +
            '?imageView&enlarge=1&thumbnail=50y50&type=webp'
          "
          @click="jumpUserHomePage(computedUser(item)?.userId)"
        />
        <!--头像右边-->
        <div class="item--right">
          <!--名字 内容-->
          <div class="right--top">
            <b
              class="right--top__username"
              @click="jumpUserHomePage(computedUser(item)?.userId)"
              >{{ computedUser(item)?.nickname }} :
            </b>
            <span>评论：</span>
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
          <EventSong
            v-if="item.parseJson.parseJson?.song || item.parseJson?.resourceType === 4"
            :item="item.parseJson.parseJson?.song || item.parseJson.resource"
          />
          <EventAlbum
            v-if="item.parseJson.parseJson?.album || item.parseJson?.resourceType === 3"
            :item="item.parseJson.parseJson?.album || item.parseJson.resource"
          />
          <EventTopic
            v-if="item.parseJson.parseJson?.topic"
            :item="item.parseJson.parseJson.topic"
          />
          <EventPlaylist
            v-if="
              item.parseJson.parseJson?.playlist || item.parseJson?.resourceType === 0
            "
            :item="item.parseJson.parseJson?.playlist || item.parseJson.resource"
          />
          <EventMV
            v-if="item.parseJson.parseJson?.mv"
            :item="item.parseJson.parseJson.mv"
            :needMaxWidth="false"
          />
          <EventVideo
            v-if="item.parseJson.parseJson?.video"
            :item="item.parseJson.parseJson.video"
            :needMaxWidth="false"
          />
          <EventDjRadio
            v-if="item.parseJson.parseJson?.djRadio"
            :item="item.parseJson.parseJson.djRadio"
          />
          <EventProgram
            v-if="item.parseJson.parseJson?.program || item.parseJson?.resourceType === 1"
            :item="item.parseJson.parseJson?.program || item.parseJson.resource"
          />
          <EventEvent
            v-if="item.parseJson.parseJson?.event"
            :item="item.parseJson.parseJson?.event"
          />
          <EventArtist
            v-if="item.parseJson.parseJson?.resource"
            :item="item.parseJson.parseJson.resource"
          />
          <div class="right--repeat" v-if="item.type === 2">
            <EventListItem :item="item.parseJson.resource" />
          </div>
          <!--时间 按钮-->
          <div class="right--bottom">
            <!--时间-->
            <span>{{ commentTime(item.time) }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-button class="more" @click="getMsgForwardsList" type="danger" round v-if="isMore"
      >加载更多</el-button
    >
  </section>
</template>

<script setup lang="ts">
import { getMsgForwards } from "@/api/api_message";
import { getSearch } from "@/api/api_search";
import { getTopicSearch } from "@/api/api_topic";
import { MsgForwardsItem } from "i/api/api_message";
import { normalizeCommentContent, commentTime } from "@/utils/filter";
import { useRouter } from "vue-router";
import { useCount } from "@/store/count";
import { useUserInformation } from "@/store/user";

let router = useRouter();
let count = useCount();
let user = useUserInformation();
let loading = ref<boolean>(true);
let list = ref<MsgForwardsItem[]>([]);
let elMessage = inject("message") as any;
let offset = 0;
let time = -1;
let isMore = ref<boolean>(true);
let total = "true";

//获取@我的数据列表
let getMsgForwardsList = async () => {
  try {
    let { more, forwards, newCount, lasttime } = await getMsgForwards(
      10,
      offset,
      time,
      total
    );
    isMore.value = more;
    if (forwards?.length) {
      forwards.forEach((item) => {
        item.parseJson = JSON.parse(item.json);
        let resourceType = item.parseJson.resourceType;
        let resource = item.parseJson.resource;
        if (resourceType === 4 && resource) {
          resource.from = {
            path: "",
            name: "私信",
          };
          resource.status = "play";
          resource.progress = 0;
        }

        if (item.parseJson?.json) {
          item.parseJson.parseJson = JSON.parse(item.parseJson.json);
          let song = item.parseJson?.parseJson?.song;
          if (song) {
            song.from = {
              path: "",
              name: "私信",
            };
            song.status = "play";
            song.progress = 0;
          }

          if (item?.parseJson?.parseJson?.event) {
            item.parseJson.parseJson.event.parseJson = JSON.parse(
              item.parseJson.parseJson.event.json
            );
          }
        }
        if (item.type === 2 && item.parseJson?.resource) {
          item.parseJson.resource.parseJson = JSON.parse(item.parseJson.resource.json);
        }
      });
      list.value.push(...forwards);
      offset = forwards.length + 1;
      time = lasttime;
      total = "false";
    }
  } catch (e: any) {
    elMessage.error("获取数据列表失败");
  } finally {
    loading.value = false;
  }
};

//用户
let computedUser = computed(() => {
  return function (item: MsgForwardsItem) {
    if (item.type === 1 && item.parseJson.user) {
      return item.parseJson.user;
    } else if ((item.type === 2 || item.type === 3) && item.parseJson.comment) {
      return item.parseJson.comment.user;
    }
  };
});

//内容
let computedContent = computed(() => {
  return function (item: MsgForwardsItem) {
    if (item.type === 1 && item?.parseJson?.parseJson) {
      return item.parseJson.parseJson.msg;
    } else if ((item.type === 2 || item.type === 3) && item.parseJson.comment) {
      return item.parseJson.comment.content;
    } else {
      return "";
    }
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
    getMsgForwardsList();
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
