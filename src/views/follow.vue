<template>
  <section class="follow">
    <h1>{{ userNickName }}的关注</h1>
    <div class="follow--list">
      <div class="list__item" v-for="item in list" :key="item.userId">
        <el-avatar
          :src="item.avatarUrl.replace('http', 'https')"
          :size="90"
          style="cursor: pointer"
          @click="jumpHomePage(item.userId)"
        ></el-avatar>
        <div class="user">
          <div class="item">
            <span class="single-clamp">{{ item.nickname }}</span>
            <img
              v-if="item?.avatarDetail?.identityIconUrl"
              :src="item?.avatarDetail?.identityIconUrl"
              width="15"
              height="15"
              alt=""
              style="margin-left: 10px"
            />
            <el-icon class="female" v-if="item.gender === 2">
              <Female />
            </el-icon>
            <el-icon class="male" v-if="item.gender === 1">
              <Male />
            </el-icon>
          </div>
          <div class="item single-clamp info" style="width: 250px; display: block">
            {{ item.signature }}
          </div>
          <div class="item info">
            <span>动态：{{ item.eventCount }}</span>
            <el-divider direction="vertical" />
            <span>歌单：{{ item.playlistCount }}</span>
            <el-divider direction="vertical" />
            <span>粉丝：{{ item.followeds }}</span>
          </div>
        </div>
        <el-button style="margin-bottom: 10px" round v-if="!isSelf(item.userId)">
          <el-icon>
            <Message />
          </el-icon>
          <span>私信</span>
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { getUserFollows, userDetail } from "@/api/api_user";
import { UserFollowsItem } from "i/api/api_user";
import { useUserInformation } from "@/store/user";

let route = useRoute();
let router = useRouter();
let user = useUserInformation();
let elMessage = inject("message") as any;
let list = ref<UserFollowsItem[]>([]);
let userNickName = ref<string>("");

let getFollow = async () => {
  try {
    let { more, follow } = await getUserFollows(Number(route.query.id));
    let {
      profile: { nickname },
    } = await userDetail(Number(route.query.id));
    list.value = follow;
    userNickName.value = nickname;
  } catch (e: any) {
    elMessage.error("获取关注列表失败");
  }
};

let jumpHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
      id,
      component: "createPlaylist",
      index: 0,
    },
  });
};

let isSelf = computed(() => {
  return function (id: number) {
    return id === user?.user_profile?.userId;
  };
});

onActivated(() => {
  getFollow();
});

watch(
  () => route.query?.id,
  (val) => {
    if (route.name !== "Follow") return;
    getFollow();
  }
);
</script>

<style scoped lang="scss">
.follow {
  margin-left: 20px;
  margin-right: 20px;
}

.follow--list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  column-gap: 20px;
}

@media (min-width: 1000px) and (max-width: 1100px) {
  .follow--list {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1100px) and (max-width: 1500px) {
  .follow--list {
    grid-template-columns: 1fr 1fr;
  }
}

.list__item {
  display: flex;
  align-items: center;
  overflow: hidden;
  .user {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 60%;
    margin-left: 10px;

    .item {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
  }
}

.male {
  color: rgb(53, 156, 207);
  transform: rotate(360deg);
  margin-left: 10px;
}

.female {
  color: rgb(230, 72, 135);
  transform: rotate(45deg);
  margin-left: 10px;
}
</style>
