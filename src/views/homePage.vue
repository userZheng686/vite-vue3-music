<template>
  <div class="homepage">
    <div class="user">
      <el-avatar :size="186" :src="detail.avatarUrl"></el-avatar>
      <div class="other">
        <div class="nickname">{{ detail.nickname }}</div>
        <div class="identity">
          <img
            v-if="detail.redVipLevelIcon"
            :src="detail.redVipLevelIcon"
            width="80"
            style="margin-right: 10px"
            height="26"
            alt=""
          />
          <span class="icon" v-for="item in detail.identity" :key="item.iconUrl">
            <img :src="item.iconUrl" width="18" height="18" alt="" />
            <span>{{ item.showName }}</span>
          </span>
          <span class="icon level">Lv{{ detail.level }}</span>
          <span
            class="icon sex"
            :class="{ femaleColor: detail.gender === 2, maleColor: detail.gender === 1 }"
            v-if="detail.gender"
          >
            <el-icon class="female" v-if="detail.gender === 2">
              <Female />
            </el-icon>
            <el-icon class="male" v-if="detail.gender === 1">
              <Male />
            </el-icon>
          </span>
          <div class="btn" v-if="!isSelf">
            <el-button
              round
              v-if="detail.artistId"
              @click="openPage('artists', detail.artistId)"
            >
              <el-icon><Microphone /></el-icon>
              <span>歌手页</span>
            </el-button>
            <el-button round>
              <el-icon><Message /></el-icon>
              <span>发私信</span>
            </el-button>
            <el-button round @click="follow(detail.followed ? 0 : 1)">
              <el-icon v-if="!detail.followed" style="color: red"><Plus /></el-icon>
              <el-icon v-else><Check /></el-icon>
              <span>{{ detail.followed ? "已关注" : "关注" }}</span>
            </el-button>
            <el-button round>
              <el-icon><More /></el-icon>
            </el-button>
          </div>
          <div class="btn" v-else>
            <el-button
              round
              @click="openPage('updateUserInformation', Number(route.query.id))"
            >
              <el-icon><Edit /></el-icon>
              <span>编辑个人信息</span>
            </el-button>
          </div>
        </div>
        <el-divider />
        <div class="count">
          <div class="count__item" @click="openPage('event', Number(route.query.id))">
            <div class="size">{{ detail.eventCount }}</div>
            <div class="info">动态</div>
          </div>
          <el-divider direction="vertical" />
          <div class="count__item" @click="openPage('follow', Number(route.query.id))">
            <div class="size">{{ detail.follows }}</div>
            <div class="info">关注</div>
          </div>
          <el-divider direction="vertical" />
          <div class="count__item" @click="openPage('followed', Number(route.query.id))">
            <div class="size">{{ detail.followeds }}</div>
            <div class="info">粉丝</div>
          </div>
        </div>
        <div class="binding">
          <span>社交网络：</span>
          <i
            class="iconfont icon-shejiaotubiao-42"
            style="color: rgb(230, 75, 78); cursor: pointer"
            v-if="detail.weiboUrl"
            @click="jumpWeibo(detail.weiboUrl)"
          ></i>
        </div>
        <div class="signature">
          <span>个人介绍：</span>
          <span class="info">{{ detail.signature || "暂无介绍" }}</span>
        </div>
      </div>
    </div>
    <!--导航路由-->
    <div class="router--list">
      <ul class="menu">
        <li
          class="menu--item gray"
          :class="menu.active === index ? 'is-active' : ''"
          v-for="(item, index) in menu.list"
          :key="index"
          @click="handlerClick(index, item.key)"
        >
          <span>{{ item.title }}</span>
        </li>
      </ul>
      <div class="icon__right" v-show="menu.active === 0 || menu.active === 1">
        <i
          class="iconfont icon-datu"
          @click="mode = 'picturePreview'"
          :class="{ active: mode === 'picturePreview' }"
          title="大图模式"
        ></i>
        <i
          class="iconfont icon-liebiao"
          @click="mode = 'list'"
          :class="{ active: mode === 'list' }"
          title="列表模式"
        ></i>
        <i
          class="iconfont icon-relituliebiao"
          @click="mode = 'chartList'"
          :class="{ active: mode === 'chartList' }"
          title="图列模式"
        ></i>
      </div>
    </div>
    <!--组件-->
    <transition name="el-fade-in-linear">
      <keep-alive>
        <component
          style="margin-bottom: 20px"
          :is="componentMap.list.get(componentMap.key)"
        ></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { getUsersBatch, getUserDj, getFollow } from "@/api/api_user";
import { useRoute, useRouter } from "vue-router";
import { useUserInformation } from "@/store/user";
import { copyVal } from "@/utils/copy";

let route = useRoute();
let router = useRouter();
let elMessage = inject("message") as any;
let user = useUserInformation();
let detail = reactive<{
  //头像
  avatarUrl: string;
  //歌手id
  artistId: number;
  //用户名
  nickname: string;
  //识别图标
  identity: Array<{
    iconUrl: string;
    showName: string;
  }>;
  //等级
  level: number;
  //性别 1 男 2 女
  gender: number;
  //动态数量
  eventCount: number;
  //关注数量
  follows: number;
  //粉丝
  followeds: number;
  //是否关注
  followed: boolean;
  //个人介绍
  signature: string;
  //是否在黑名单
  blacklist: boolean;
  //黑胶会员等级
  redVipLevelIcon: string;
  //微博链接
  weiboUrl: string;
}>({
  avatarUrl: "",
  artistId: 0,
  identity: [],
  level: 0,
  nickname: "",
  followed: false,
  signature: "",
  followeds: 0,
  follows: 0,
  blacklist: false,
  eventCount: 0,
  gender: 0,
  redVipLevelIcon: "",
  weiboUrl: "",
});

//菜单
let menu = reactive<{
  active: number;
  list: Array<{
    key: string;
    title: string;
    show: boolean;
  }>;
}>({
  active: 0,
  list: [],
});
//模式
let mode = ref<string>("chartList");
provide("mode", mode);

//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "createPlaylist",
  list: new Map(),
});

//打开组件
let handlerClick = (index: number, key: string) => {
  router.push({
    path: "/homePage",
    query: {
      component: key,
      index,
      id: route.query.id,
    },
  });
};

//设置路由map
let setMap = () => {
  let shallowCreatePlaylist = markRaw(
    defineAsyncComponent(() => import("c/homePage/createPlaylist.vue"))
  );
  let shallowCollectPlaylist = markRaw(
    defineAsyncComponent(() => import("c/homePage/collectPlaylist.vue"))
  );
  let shallowListen = markRaw(
    defineAsyncComponent(() => import("c/homePage/listen.vue"))
  );
  let shallowCreateDj = markRaw(
    defineAsyncComponent(() => import("c/homePage/createDj.vue"))
  );
  let shallowCollectDj = markRaw(
    defineAsyncComponent(() => import("c/homePage/collectDj.vue"))
  );
  let shallowCreateSpecialColumn = markRaw(
    defineAsyncComponent(() => import("c/homePage/createSpecialColumn.vue"))
  );
  componentMap.list.set("createPlaylist", shallowCreatePlaylist);
  componentMap.list.set("collectPlaylist", shallowCollectPlaylist);
  componentMap.list.set("listen", shallowListen);
  componentMap.list.set("createDj", shallowCreateDj);
  componentMap.list.set("collectDj", shallowCollectDj);
  componentMap.list.set("createSpecialColumn", shallowCreateSpecialColumn);
};

//初始化菜单列表
let initialMenu = (createRadioCount: number, subRadioCount: number) => {
  let list = [
    {
      key: "createPlaylist",
      title: "创建的歌单",
      show: true,
    },
    {
      key: "collectPlaylist",
      title: "收藏的歌单",
      show: true,
    },
    {
      key: "listen",
      title: "听歌排行",
      show: Number(route.query.id) === user?.user_profile?.userId,
    },
    {
      key: "createDj",
      title: "创建的播客",
      show: createRadioCount ? true : false,
    },
    {
      key: "collectDj",
      title: "收藏的播客",
      show: subRadioCount ? true : false,
    },
    {
      key: "createSpecialColumn",
      title: "创建的音乐专栏",
      show: true,
    },
  ];
  list = list.filter((item) => item.show);
  menu.list = list;
};

let getUserDetail = async () => {
  try {
    let {
      "/api/music-vip-membership/front/vip/info": vip,
      "/api/authentication/identity/user/all": identity,
      [`/api/w/v1/user/detail/${route.query.id}`]: info,
    } = await getUsersBatch(Number(route.query.id));
    let { createRadioCount, subRadioCount } = await getUserDj(Number(route.query.id));
    // console.log('profile',user.user_profile)
    initialMenu(createRadioCount, subRadioCount);
    copyVal(vip.data, detail);
    copyVal(info, detail);
    copyVal(info.profile, detail);
    identity.data = identity.data.filter((item) => item.iconUrl);
    let index = info.bindings.findIndex((item) => item.url);
    if (index !== -1) {
      detail.weiboUrl = info.bindings[index].url;
    } else {
      detail.weiboUrl = "";
    }
    detail.identity = identity.data;
  } catch (e: any) {
    elMessage.error("请求用户详情失败");
  }
};

onActivated(() => {
  setTimeout(() => {
    getUserDetail();
  }, 200);
});

let handleComponent = (key: string, index: number) => {
  if (componentMap.list.get(String(key))) {
    componentMap.key = String(key);
    menu.active = index;
  }
};

//根据路由记录匹配组件
let setupComponent = () => {
  if (route.query.component && route.query.index) {
    handleComponent(String(route.query.component), Number(route.query.index));
  }
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

//是否是用户自己
let isSelf = computed(() => {
  return Number(route.query?.id) === user?.user_profile?.userId;
});

//关注/取消关注用户
let follow = async (type: number) => {
  try {
    let res = await getFollow(Number(route.query.id), type);
    detail.followed = !detail.followed;
    elMessage.success(`${type === 1 ? "关注成功" : "取消关注成功"}`);
  } catch (e: any) {
    elMessage.success("关注失败");
  }
};

watch(
  () => route.query,
  (Query) => {
    if (Query.component && Query.index && route.name === "HomePage") {
      handleComponent(String(Query.component), Number(Query.index));
    }
  }
);

watch(
  () => route.query?.id,
  () => {
    if (route.name !== "HomePage") return;
    detail.artistId = 0;
    // componentMap.key = 'createPlaylist'
    getUserDetail();
  }
);

//跳转到微博
let jumpWeibo = (href: string) => {
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(href);
  } else {
    window.open(href);
  }
};

onMounted(() => {
  setMap();
  setupComponent();
});
</script>

<style scoped lang="scss">
.homepage {
  margin-left: 30px;
  margin-top: 20px;
  margin-right: 20px;
}

.icon__right {
  margin-right: 20px;
  display: flex;
  align-items: center;

  i {
    font-size: 14px;
    background-color: rgb(242, 242, 242);
    color: black;
    padding: 5px;
    margin-left: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .active {
    background-color: rgb(191, 191, 191);
  }
}

.user {
  display: flex;

  .other {
    margin-left: 20px;
    flex: 1;
    .nickname {
      font-size: 20px;
      font-weight: bold;
    }
  }
}

.identity {
  margin-top: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  .icon {
    background-color: rgb(255 213 209);
    border-radius: 6px;
    display: flex;
    align-items: center;
    color: red;
    font-size: 12px;
    margin-right: 10px;
    padding: 5px;
    span {
      margin-left: 5px;
    }
  }

  .level {
    background-color: rgb(240 240 240);
    color: black;
  }

  .sex {
    height: 16px;

    border-radius: 50%;
    .male {
      color: rgb(53, 156, 207);
      transform: rotate(360deg);
    }
    .female {
      color: rgb(230, 72, 135);
      transform: rotate(45deg);
    }
  }

  .maleColor {
    background-color: rgb(191, 243, 255);
  }
  .femaleColor {
    background-color: rgb(255, 204, 231);
  }

  .btn {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}

.count {
  display: flex;
  align-items: center;

  .count__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;
    .size {
      font-size: 18px;
    }
  }
}

.binding,
.signature {
  margin-top: 10px;
}
</style>
