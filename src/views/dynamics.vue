<template>
  <section class="dynamic">
    <div class="event">
      <div class="title">
        <h1>动态</h1>
        <el-button class="send" round @click="sendEvent()">
          <el-icon>
            <Edit />
          </el-icon>
          <span>发动态</span>
        </el-button>
      </div>
      <div class="notice" @click="jumpNewSong">
        <img
          v-if="notice.leftIcons"
          :src="notice.leftIcons"
          width="20"
          height="20"
          alt=""
        />
        <span style="margin-left: 10px">{{ notice.text }}</span>
      </div>
      <div class="list" v-for="item in eventList" :key="item.id">
        <EventListItem
          :item="item"
          :isShowDeleteBtn="isShowDeleteBtn(item)"
          :refresh="refreshEventHistoryList"
        />
      </div>
      <el-button
        v-if="isMore && eventList.length"
        style="margin: 10px auto; display: flex; align-items: center"
        type="danger"
        @click="getEventHistoryList()"
        >加载更多</el-button
      >
    </div>
    <div class="user">
      <div class="wrap">
        <div class="profile">
          <el-avatar
            style="cursor: pointer"
            @click="openPage('homePage', userProfile.userId)"
            :src="userProfile?.avatarUrl?.replace('http', 'https')"
            :size="60"
          />
          <div class="other">
            <div class="name">
              <span class="gray">{{ userProfile.nickname }}</span>
              <el-icon v-if="userProfile.gender === 2" style="color: rgb(255, 205, 232)">
                <Female />
              </el-icon>
              <el-icon v-if="userProfile.gender === 1" style="color: #409eff">
                <Male />
              </el-icon>
            </div>
            <div class="single-clamp">{{ userProfile.signature }}</div>
          </div>
        </div>
        <div class="count">
          <div class="count__item gray" @click="openPage('event', userProfile.userId)">
            <div>{{ userProfile.eventCount }}</div>
            <div>动态</div>
          </div>
          <el-divider direction="vertical" />
          <div class="count__item gray" @click="openPage('follow', userProfile.userId)">
            <div>{{ userProfile.newFollows }}</div>
            <div>关注</div>
          </div>
          <el-divider direction="vertical" />
          <div class="count__item gray" @click="openPage('followed', userProfile.userId)">
            <div>{{ userProfile.followeds }}</div>
            <div>粉丝</div>
          </div>
        </div>
      </div>
      <div class="topic">
        <div class="more">
          <span style="font-weight: bold">热门话题</span>
          <span class="gray" @click="jumpHotTopic">更多></span>
        </div>
        <div
          class="item"
          v-for="item in topicList"
          :key="item.actId"
          @click="jumpTopicDetail(item.actId)"
        >
          <DefaultImage
            :picUrl="item.sharePicUrl"
            :param="44"
            :y="44"
            style="width: 44px; height: 44px"
            loadingWidth="22px"
            loadingHeight="22px"
          />
          <div class="detail">
            <div>#{{ item.title }}#</div>
            <div class="info">{{ item.participateCount }}人参与</div>
          </div>
        </div>
      </div>
      <div class="know">
        <div class="more">
          <span style="font-weight: bold">认识的人</span>
        </div>
        <div
          class="item"
          v-for="item in knowList"
          :key="item.userId"
          @click="follow(item)"
        >
          <el-avatar
            style="cursor: pointer"
            @click="openPage('homePage', item.userId)"
            :size="44"
            :src="item.avatarUrl.replace('http', 'https')"
          />
          <div class="name single-clamp">
            <div class="single-clamp">{{ item.nickname }}</div>
            <div class="info single-clamp">手机联系人：{{ item.snsNickname }}</div>
          </div>
          <el-button :icon="Plus" size="small" circle v-if="!item.followed" />
        </div>
        <div class="info" v-if="!knowList.length">暂无认识的人</div>
      </div>
      <div class="follow">
        <div class="more">
          <span style="font-weight: bold">添加关注</span>
        </div>
        <el-button @click="jumpRecommendUser('star', 0)" class="item" type="danger" round
          >明星({{ recommendCount.starCount }})</el-button
        >
        <el-button
          @click="jumpRecommendUser('talent', 1)"
          class="item"
          type="danger"
          round
          >音乐达人({{ recommendCount.totalPlaylistTalentCount }})
        </el-button>
        <el-button @click="jumpRecommendUser('dj', 2)" class="item" type="danger" round
          >DJ({{ recommendCount.djCount }})
        </el-button>
        <el-button
          @click="jumpRecommendUser('musician', 3)"
          class="item"
          type="danger"
          round
          >网易音乐人({{ recommendCount.musicianCount }})</el-button
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  getUserFollowRecommend,
  getUserFriendNoticeSong,
  getUserFollowRecommendCount,
  getFollow,
} from "@/api/api_user";
import { getUserRecommendCelebrities } from "@/api/api_recommend";
import { getHotTopic } from "@/api/api_topic";
import { getEventHistory } from "@/api/api_event";
import { UserFollowRecommendItem } from "i/api/api_user";
import { UserEvenEvents } from "i/api/api_event";
import { HotTopicItem } from "i/api/api_topic";
import { useRouter } from "vue-router";
import { Plus } from "@element-plus/icons-vue"; //保留
import { useUserInformation } from "@/store/user";
import { useSharePopupStore } from "@/store/sharePopup";
let sharePopup = useSharePopupStore();
let userInfo = useUserInformation();

let notice = reactive<{
  leftIcons: string;
  text: string;
}>({
  leftIcons: "",
  text: "",
});
let eventList = ref<UserEvenEvents[]>([]);
let time: string | number = -1;
let topicList = ref<HotTopicItem[]>([]);
let isMore = ref<boolean>(true);
let knowList = ref<UserFollowRecommendItem[]>([]);
let recommendCount = reactive<{
  starCount: number;
  totalPlaylistTalentCount: number;
  musicianCount: number;
  djCount: number;
}>({
  starCount: 0,
  totalPlaylistTalentCount: 0,
  musicianCount: 0,
  djCount: 0,
});
let router = useRouter();
let elMessage = inject("message") as any;

let initJson = (parseJson: any, uid: number, id: number) => {
  if (parseJson.song) {
    parseJson.song.progress = 0;
    parseJson.song.stauts = "play";
    parseJson.song.from = {
      path: "eventDetail",
      name: "动态",
      val: {
        uid,
        id,
      },
    };
  }
  if (parseJson.program) {
    //电台
    parseJson.program.mainSong.radio = parseJson.program.radio;
    //电台节目id
    parseJson.program.mainSong.radio.programId = parseJson.program.id;
    //是否点赞
    parseJson.program.mainSong.liked = parseJson.program.canReward;
    //图片
    parseJson.program.mainSong.album.picUrl = parseJson.program.coverUrl;
    parseJson.program.mainSong.progress = 0;
    parseJson.program.mainSong.from = {
      path: "eventDetail",
      name: "动态",
      val: {
        uid,
        id,
      },
    };
  }
  if (parseJson.event) {
    parseJson.event.parseJson = JSON.parse(parseJson.event.json);
    initJson(parseJson.event.parseJson, parseJson.event.user.userId, parseJson.event.id);
  }
};

let refreshEventHistoryList = async () => {
  let {
    data: { cursor, events, more },
  } = await getEventHistory(new Date().getTime());
  time = cursor;
  isMore.value = more;
  events.forEach((item) => {
    item.parseJson = JSON.parse(item.json);
    initJson(item.parseJson, item.user.userId, item.id);
  });
  eventList.value = events;
  userInfo.refreshUserInfo();
};

let getEventHistoryList = async () => {
  let {
    data: { cursor, events, more },
  } = await getEventHistory(time);
  time = cursor;
  isMore.value = more;
  events.forEach((item) => {
    item.parseJson = JSON.parse(item.json);
    initJson(item.parseJson, item.user.userId, item.id);
  });
  eventList.value = eventList.value.concat(events);
};

let getDynamicsBatch = async () => {
  try {
    let {
      data: { leftIcons, text },
    } = await getUserFriendNoticeSong(new Date().getTime());
    let { hot } = await getHotTopic();
    notice.leftIcons = leftIcons[0]?.url;
    notice.text = text;
    topicList.value = hot.slice(0, 5);
    let {
      totalPlaylistTalentCount,
      starCount,
      musicianCount,
    } = await getUserFollowRecommendCount();
    let { djCount } = await getUserRecommendCelebrities(3, 0, 0);
    recommendCount.totalPlaylistTalentCount = totalPlaylistTalentCount;
    recommendCount.starCount = starCount;
    recommendCount.musicianCount = musicianCount;
    recommendCount.djCount = djCount;
    let { snsFriends } = await getUserFollowRecommend(0, 8);
    knowList.value = snsFriends.slice(0, 6);
  } catch (e: any) {
    elMessage.error(e?.message || "获取失败");
  }
};

let userProfile = computed(() => {
  return userInfo.user_profile;
});

let isShowDeleteBtn = computed(() => {
  return function (item: UserEvenEvents) {
    return userProfile.value.userId === item.user.userId;
  };
});

//发动态
let sendEvent = () => {
  sharePopup.childShareEventWindowCallback = refreshEventHistoryList;
  sharePopup.openChildShareEvent();
};

//用户列表推荐
let jumpRecommendUser = (component: string, index: number) => {
  router.push({
    path: "/recommendUser",
    query: {
      component,
      index,
    },
  });
};

//话题详情
let jumpTopicDetail = (actId: number) => {
  router.push({
    path: "/topicDetail",
    query: {
      actId,
    },
  });
};

//跳转到热门话题
let jumpHotTopic = () => {
  router.push({
    path: "/topicSoaring",
  });
};

//跳转到新歌发布
let jumpNewSong = () => {
  router.push({
    path: "/newSong",
  });
};

//打开页面
let openPage = (path: string, id: number) => {
  router.push({
    path,
    query: {
      id,
    },
  });
};

//关注用户
let follow = async (item: UserFollowRecommendItem) => {
  try {
    let res = await getFollow(item.userId, 1);
    item.followed = !item.followed;
    elMessage.success("关注成功");
  } catch (e: any) {
    elMessage.success("关注失败");
  }
};

onActivated(() => {
  getDynamicsBatch();
  getEventHistoryList();
});
</script>

<style scoped lang="scss">
.dynamic {
  display: flex;

  .event {
    border-right: 1px solid #eee;
    padding-left: 40px;
    padding-right: 40px;
    width: calc(100% - 365px);
  }

  .user {
    width: 290px;
    position: fixed;
    right: 0;
    overflow: scroll;
    top: 60px;
    bottom: 120px;

    .wrap {
      background-color: var(--dark-normalBackgroundColor, rgb(245, 245, 247));
      margin: auto;
      padding: 20px;
    }

    .topic {
      padding: 20px;

      .more {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .item {
        display: flex;
        margin-top: 5px;
        cursor: pointer;
        align-items: center;

        .detail {
          margin-left: 10px;
        }

        &:hover {
          background-color: var(--dark-normalBackgroundColor, rgb(245, 245, 247));
        }
      }
    }

    .know {
      padding: 20px;

      .more {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .item {
        display: flex;
        margin-top: 5px;
        align-items: center;

        .name {
          margin-left: 10px;
          width: 180px;
        }
      }
    }

    .follow {
      padding: 20px;

      .more {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .item {
        margin-top: 5px;
      }
    }
  }
}

::-webkit-scrollbar {
  width: 0;
}

.title {
  display: flex;
  align-items: center;

  .send {
    margin-left: 20px;
    background-color: rgb(236, 65, 65);
    color: white;
    border: none;
  }
}

.notice {
  margin-top: 10px;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
  height: 66px;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
}

.list {
  display: flex;
  margin-top: 20px;
  flex-direction: column;
}

.profile {
  display: flex;
  align-items: center;
  padding-top: 10px;

  .other {
    margin-left: 10px;

    .name {
      display: flex;
      align-items: center;
    }
  }
}

.count {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .count__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
  }
}
</style>
