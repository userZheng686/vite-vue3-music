<template>
  <section class="topic--detail">
    <div class="detail">
      <div class="cover">
        <div class="img--wrap">
          <img class="img" :src="cover.coverPCUrl" width="400" height="200" alt="cover" />
          <div class="title">#{{ cover.title }}#</div>
          <div class="participateCount">{{ cover.participateCount }}人参与</div>
          <el-button class="join" :icon="Edit" round @click="sendEvent"
            >立即参与</el-button
          >
          <el-button class="share" :icon="Share" round @click="share">分享</el-button>
        </div>
      </div>
      <div class="topic--text" v-if="cover.text.length">
        <div class="dot"></div>
        <span class="info">{{ cover.text.join("") }}</span>
      </div>
      <el-divider />
      <div class="event">
        <div class="info" v-if="hotEventList.length">热门动态</div>
        <div class="list" v-for="item in hotEventList" :key="item.id">
          <EventListItem :item="item" />
        </div>
        <div class="info" v-if="event.events.length">所有动态</div>
        <div class="list" v-for="item in event.events" :key="item.id">
          <EventListItem :item="item" />
        </div>
        <el-button
          v-if="event.more"
          style="margin: 10px auto; display: flex; align-items: center"
          type="danger"
          @click="getTopicDetailEventList()"
          >加载更多</el-button
        >
      </div>
    </div>
    <div class="rcmd">
      <div class="info">推荐话题</div>
      <div
        class="item"
        v-for="item in rcmdList"
        :key="item.actId"
        @click="jumpTopicDetail(item.actId)"
      >
        <DefaultImage
          :picUrl="item.sharePicUrl"
          :param="44"
          :y="44"
          style="min-width: 44px; min-height: 44px; width: 44px; height: 44px"
          loadingWidth="22px"
          loadingHeight="22px"
          :lazy="false"
        />
        <div class="rcmd__detail">
          <div>#{{ item.title }}#</div>
          <div class="info">
            <span v-if="item.reason">{{ item.reason }}</span>
            <span v-else>{{ item.participateCount }}人参与</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  getTopicDetail,
  getTopicDetailEventHot,
  getTopicDetailEvent,
  getTopicDetailRcmdList,
} from "@/api/api_topic";
import { copyVal } from "@/utils/copy";
import { useRoute, useRouter } from "vue-router";
import { Edit, Share } from "@element-plus/icons-vue"; //保留
import { UserEvenEvents } from "i/api/api_event";
import { TopicDetailRcmdListItem } from "i/api/api_topic";
import { useSharePopupStore } from "@/store/sharePopup";
import { useTopicShare } from "@/utils/dialogShare";

let route = useRoute();
let router = useRouter();
let sharePopup = useSharePopupStore();
let elMessage = inject("message") as any;
let cover = reactive<{
  title: string;
  text: string[];
  coverPCUrl: string;
  coverPCListUrl: string;
  participateCount: number;
}>({
  title: "",
  text: [],
  coverPCUrl: "",
  coverPCListUrl: "",
  participateCount: 0,
});
let hotEventList = ref<UserEvenEvents[]>([]);
let event = reactive<{
  lasttime: number;
  pagesize: number;
  events: UserEvenEvents[];
  more: boolean;
  size: number;
}>({
  lasttime: new Date().getTime(),
  pagesize: 20,
  events: [],
  more: true,
  size: 0,
});
let rcmdList = ref<TopicDetailRcmdListItem[]>([]);

let computedPcListUrl = computed(() => {
  return `url(${cover.coverPCListUrl})`;
});

//发动态
let sendEvent = () => {
  //   sharePopup.childShareEventWindowCallback = refreshEventHistoryList
  sharePopup.content = `#${cover.title}# `;
  sharePopup.openChildShareEvent();
};

//话题详情
let getTopicDetailBatch = async () => {
  try {
    let { act } = await getTopicDetail(Number(route.query.actId));
    copyVal(act, cover);
    let { events } = await getTopicDetailEventHot(Number(route.query.actId));
    initialEvent(events);
    hotEventList.value = events;
  } catch (e: any) {
    elMessage.error(e?.message || "获取详情失败");
  }
};

//话题动态列表
let getTopicDetailEventList = async () => {
  try {
    let { events, lasttime, more, size } = await getTopicDetailEvent(
      Number(route.query.actId),
      event.pagesize,
      event.lasttime,
      20
    );
    initialEvent(events);
    event.lasttime = lasttime;
    event.more = more;
    event.size = size;
    event.events = event.events.concat(events);
  } catch (e: any) {
    console.log("e", e);
    elMessage.error("获取动态列表失败");
  }
};

//推荐话题列表
let getRcmdList = async () => {
  try {
    let { rcmd } = await getTopicDetailRcmdList(0, 10);
    rcmdList.value = rcmd;
  } catch (e: any) {
    elMessage.error("获取推荐话题列表失败");
  }
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

//初始化动态列表
let initialEvent = (events: UserEvenEvents[]) => {
  events.forEach((item) => {
    item.parseJson = JSON.parse(item.json);
    if (item.parseJson.song) {
      item.parseJson.song.progress = 0;
      item.parseJson.song.from = {
        path: "Event",
        name: "动态",
        val: {
          id: Number(route.query.id),
        },
      };
    }
    if (item.parseJson.program && item.parseJson.program.mainSong) {
      //电台
      item.parseJson.program.mainSong.radio = item.parseJson.program.radio;
      //电台节目id
      item.parseJson.program.mainSong.radio.programId = item.parseJson.program.id;
      //是否点赞
      item.parseJson.program.mainSong.liked = item.parseJson.program.canReward;
      //图片
      if (item.parseJson.program.mainSong.album) {
        item.parseJson.program.mainSong.album.picUrl = item.parseJson.program.coverUrl;
      }

      item.parseJson.program.mainSong.progress = 0;
      item.parseJson.program.mainSong.from = {
        path: "Event",
        name: item.parseJson.program.radio.name,
        val: {
          id: Number(route.query.id),
        },
      };
    }
    if (item.parseJson.event) {
      item.parseJson.event.parseJson = JSON.parse(item.parseJson.event.json);
    }
  });
};

//分享
let share = () => {
  useTopicShare(Number(route.query.actId), cover.coverPCUrl, cover.title);
};

watch(
  () => route.query?.actId,
  (val) => {
    if (route.name !== "TopicDetail") return;
    getTopicDetailBatch();
    getTopicDetailEventList();
  }
);

onActivated(() => {
  getTopicDetailBatch();
  getTopicDetailEventList();
  getRcmdList();
});
</script>

<style scoped lang="scss">
.topic--detail {
  display: flex;
}

.detail {
  flex: 1;
  padding-right: 40px;
  padding-left: 40px;
  padding-top: 20px;
  border-right: 1px solid #eee;
  position: relative;
  overflow: hidden;

  .cover {
    /* background-image: v-bind(computedPcListUrl); */
    background-color: rgb(228 227 227);
    width: 100%;
    height: 200px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-position: bottom;

    .img--wrap {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      img {
        object-fit: cover;
        width: 50%;
      }

      .title {
        position: absolute;
        left: 50%;
        top: 20%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 14px;
      }

      .participateCount {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 14px;
      }

      .join {
        position: absolute;
        left: 50%;
        top: 60%;
        transform: translate(-50%, -50%);
        margin-left: 0px;
      }

      .share {
        position: absolute;
        left: 50%;
        top: 82%;
        transform: translate(-50%, -50%);
        margin-left: 0px;
      }
    }
  }

  .topic--text {
    display: flex;
    align-items: center;

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: red;
      margin-right: 5px;
    }
  }

  .event {
    .list {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
    }
  }
}

.rcmd {
  width: 250px;
  padding: 20px;

  .item {
    display: flex;
    margin-top: 5px;
    cursor: pointer;
    align-items: center;

    .rcmd__detail {
      margin-left: 10px;
    }

    &:hover {
      background-color: var(--dark-item-backgroundHover, rgb(245, 245, 245));
    }
  }
}
</style>
