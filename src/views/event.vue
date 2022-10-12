<template>
  <!--动态信息-->
  <section class="Event">
    <h1>{{ list[0]?.user?.nickname }}的动态</h1>
    <div class="list" v-for="item in list" :key="item.id">
      <EventListItem
        :item="item"
        :isShowDeleteBtn="isShowDeleteBtn(item)"
        :refresh="refreshUserEvenList"
      />
    </div>
    <el-pagination
      v-model:currentPage="currentPage"
      :page-size="50"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        margin-bottom: 20px;
      "
      background
      :pager-count="9"
      :hide-on-single-page="total <= 50"
      layout="prev, pager, next"
      :total="total"
    />
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { getUserEvent } from "@/api/api_event";
import { UserEvenEvents } from "i/api/api_event";
import { useUserInformation } from "@/store/user";

let route = useRoute();
let elMessage = inject("message") as any;
let userInfo = useUserInformation();
let offset = 0;
let time = new Date().getTime();
let isMore = ref<boolean>(true);
let total = ref<number>(0);
let list = ref<UserEvenEvents[]>([]);

let initJson = (parseJson: any) => {
  if (parseJson.song) {
    parseJson.song.progress = 0;
    parseJson.song.stauts = "play";
    parseJson.song.from = {
      path: "Event",
      name: "动态",
      val: {
        id: Number(route.query.id),
      },
    };
  }
  if (parseJson.program && parseJson.program.mainSong) {
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
      path: "Event",
      name: parseJson.program.radio.name,
      val: {
        id: Number(route.query.id),
      },
    };
  }
  if (parseJson.event) {
    parseJson.event.parseJson = JSON.parse(parseJson.event.json);
    initJson(parseJson.event.parseJson);
  }
};

let refreshUserEvenList = async () => {
  time = new Date().getTime();
  getUserEvenList();
};

let getUserEvenList = async () => {
  try {
    let { lasttime, more, size, events } = await getUserEvent(
      Number(route.query.id),
      offset,
      time,
      50
    );
    time = lasttime;
    isMore.value = more;
    total.value = size;
    events.forEach((item) => {
      item.parseJson = JSON.parse(item.json);
      initJson(item.parseJson);
    });
    list.value = events;
  } catch (e: any) {
    elMessage.error(e?.message || "获取动态列表失败");
  }
};

let currentPage = ref<number>(1);

let isShowDeleteBtn = computed(() => {
  return function (item: UserEvenEvents) {
    return userInfo?.user_profile?.userId === Number(route.query.id);
  };
});

watch(
  () => route.query?.id,
  (val) => {
    if (route.name !== "Event") return;
    getUserEvenList();
  }
);

watch(currentPage, (val) => {
  offset = val * 50 - 50;
  getUserEvenList();
});

nextTick(() => {
  let list = document.querySelectorAll(".href");
  list.forEach((item) => {
    item.addEventListener("click", (event) => {
      console.log("event", event.target);
    });
  });
});

onActivated(() => {
  getUserEvenList();
});
</script>

<style scoped lang="scss">
.Event {
  margin-left: 30px;
  margin-top: 20px;
  margin-right: 30px;
}

.list {
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
}
</style>
