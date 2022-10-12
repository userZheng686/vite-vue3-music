<template>
  <!--电台详情-->
  <div class="radio__detail">
    <!--电台详情 头部-->
    <div class="detail__top">
      <!--头部 封面-->
      <div class="top__picture">
        <DefaultImage
          style="width: 100%; height: 100%"
          :picUrl="songList?.radio?.picUrl"
          loadingWidth="100px"
          loadingHeight="100px"
          :param="200"
          :y="200"
          :lazy="false"
        />
      </div>
      <!--头部 信息 分类 用户 按钮 介绍-->
      <div class="top__info">
        <div class="info__category">
          <span class="category">播客</span>
          <span class="category__title">{{ songList?.radio?.name }}</span>
        </div>
        <div class="info__user">
          <el-avatar
            :size="30"
            :src="
              songList?.radio?.dj?.avatarUrl.replace(/http:\//, 'https:/') +
              '?imageView&enlarge=1&thumbnail=30y30&type=webp'
            "
          />
          <span
            class="user__name blue"
            @click="jumpUserHomePage(songList?.radio?.dj?.userId)"
            >{{ songList?.radio?.dj?.nickname }}</span
          >
        </div>
        <div class="info__btns">
          <el-button type="danger" :icon="CaretRight" @click="playAll"
            >播放全部</el-button
          >
          <el-button v-if="songList?.radio?.subed" @click="collectRadio">
            <el-icon style="color: red">
              <StarFilled />
            </el-icon>
            <span>已收藏({{ songList?.radio?.subCount }})</span>
          </el-button>
          <el-button
            :icon="Star"
            v-else-if="!songList?.radio?.subed"
            @click="collectRadio"
            >收藏({{ songList?.radio?.subCount }})</el-button
          >
          <el-button :icon="Share" @click="shareRadio"
            >分享({{ songList?.radio?.shareCount }})</el-button
          >
        </div>
        <div :class="{ 'more-clamp3': isMore }">
          <div class="info__introduction">
            <span class="category">{{ songList?.radio?.category }}</span>
            <span class="desc">
              {{ desc[0] }}
            </span>
            <el-icon
              style="float: right; margin-right: 25px"
              v-if="desc.length >= 5"
              @click="isMore = !isMore"
            >
              <ArrowDownBold v-if="isMore" />
              <ArrowUpBold v-else />
            </el-icon>
          </div>
          <div class="info__introduction" v-for="(item, index) in desc" :key="index">
            {{ index > 0 ? item : "" }}
          </div>
        </div>
      </div>
    </div>
    <!--电台详情 底部-->
    <div class="detail__bottom">
      <!--导航路由-->
      <div class="router--list">
        <ul class="menu">
          <li
            class="menu--item gray"
            :class="menu.active === index ? 'is-active' : ''"
            v-for="(item, index) in menu.list"
            :key="index"
            @click="
              router.push({
                path: '/broadCastDetail',
                query: { type: `${index + 1}` },
              })
            "
          >
            <span
              >{{ item.title }}({{
                index === 0 ? songList?.radio?.programCount : songList?.radio?.subCount
              }}){{
            }}</span>
          </li>
        </ul>
      </div>
      <!--组件-->
      <transition name="el-fade-in">
        <keep-alive>
          <component
            :id="songList?.radio?.id"
            :type="4"
            :is="componentMap.list.get(componentMap.key)"
          ></component>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { getRadioDJDetail, RadioSub } from "@/api/api_radio";
import { CaretRight, Star, Share, StarFilled } from "@element-plus/icons-vue";
import { useSongStore } from "@/store/playList";
import { play } from "@/utils/play";
import { RadioProgramDetailItem } from "i/api/api_radio.d";
//分享弹窗
import { useRadioShare } from "@/utils/dialogShare";
import { patchUpdateRadioSubed } from "@/utils/update";
import { loginCallback } from "@/utils/login";

let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let songList = useSongStore();
//简介长度是否超过了一般的长度
let isMore = ref<boolean>(false);
//简介
let desc = ref<string[]>([]);
//节目列表
let programList = ref<RadioProgramDetailItem[]>([]);
//search
let search = ref<string>("");
//id
let id = ref<number>(0);
provide("programList", programList);
provide("search", search);

watchEffect(() => {
  if (route?.query?.id) {
    id.value = Number(route.query.id);
  }
});

watch(
  () => route.query.id,
  (val) => {
    if (val && route.name === "BroadCastDetail") {
      getBroadCastDetail(Number(val));
      id.value = Number(val);
    }
  }
);

//获取电台详情
let getBroadCastDetail = async (rid: number) => {
  try {
    let res = await getRadioDJDetail(rid);
    songList.setRadio(res.data);
    desc.value = res.data.desc.split(/\n/);
    if (desc.value.length >= 5) {
      isMore.value = true;
    }
  } catch (e: any) {
    elMessage.error(e?.msg || "获取电台详情失败 请重新打开页面试试");
    history.go(-1);
  }
};

//收藏电台
let collectRadio = () => {
  loginCallback(async () => {
    try {
      let res = await RadioSub(Number(route.query.id), songList?.radio?.subed ? 2 : 1);
      if (songList?.radio) {
        if (songList?.radio?.subed === true) {
          elMessage.success("取消收藏成功");
          songList.radio.subCount--;
        } else {
          elMessage.success("收藏成功");
          songList.radio.subCount++;
        }
        songList.radio.subed = !songList.radio.subed;
        //遍历当前播放的列表 判断是否都是同一个电台id   如果是就取消收藏
        songList.list.forEach((item) => {
          if (item.radio) {
            if (item.radio.id === songList.radio?.id) {
              item.radio.subed = !item.radio.subed;
            }
          }
        });
        patchUpdateRadioSubed(songList.radio.id, songList.radio.subed);
      }
    } catch (e: any) {
      elMessage.error(e?.message || "操作失败 请重新试试");
    }
  });
};

onActivated(() => {
  getBroadCastDetail(Number(route.query.id));
});

onDeactivated(() => {
  songList.setRadio(null);
});

//菜单列表
let menu = reactive<{
  active: number;
  list: Array<{
    key: string;
    title: string;
  }>;
}>({
  active: 0,
  list: [
    {
      key: "audio",
      title: "声音",
    },
    {
      key: "subers",
      title: "收藏者",
    },
  ],
});

//引入组件
let shallowAudio = markRaw(
  defineAsyncComponent(() => import("c/broadCastDetail/audio.vue"))
);
let shallowSubers = markRaw(
  defineAsyncComponent(() => import("@/components/broadCastDetail/subscriber.vue"))
);

//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "audio",
  list: new Map(),
});

//设置路由map
let setMap = () => {
  componentMap.list.set("audio", shallowAudio);
  componentMap.list.set("subers", shallowSubers);
};

//获取当前路由
let getCurrentUrl = () => {
  if (route.query) {
    let type = route.query.type;
    setCurrentUrlComponent(String(type));
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

//监听当前路由
watch(
  () => route.query,
  (Query) => {
    if (route.name !== "BroadCastDetail") return;
    let type = Query?.type;
    setCurrentUrlComponent(type ? String(type) : "1");
  }
);

let setCurrentUrlComponent = (type: string) => {
  if (type === "1") {
    menu.active = 0;
    componentMap.key = "audio";
  } else if (type === "2") {
    menu.active = 1;
    componentMap.key = "subers";
  }
};

//播放全部
let playAll = () => {
  let mainSong = programList.value.map((item) => item.mainSong);
  play(mainSong, mainSong[0].id);
};

//分享的回调事件
let shareRadioCallback = (res: { status: string }) => {
  if (res.status === "success" && songList.radio) {
    songList.radio.shareCount++;
  }
};

//分享电台
let shareRadio = () => {
  if (songList.radio) {
    useRadioShare(
      songList.radio.id,
      songList?.radio?.picUrl,
      `${songList?.radio?.name} by ${songList?.radio?.dj?.nickname}`,
      shareRadioCallback
    );
  }
};

onMounted(() => {
  setMap();
  getCurrentUrl();
});
</script>

<style lang="scss" scoped>
//电台详情
.radio__detail {
  flex: 1;
  overflow-y: scroll;
}

//电台详情 头部
.detail__top {
  margin-left: 30px;
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
}

.top__picture {
  width: 200px;
  height: 200px;
  overflow: hidden;
}

//头部 信息
.top__info {
  flex: 1;
  margin-left: 20px;
}

//分类 外层
.info__category {
  display: flex;
  align-items: center;
}

//分类
.category {
  border: 1px solid rgb(254, 174, 196);
  color: rgb(254, 174, 196);
  padding: 2px;
  border-radius: 4px;
  font-size: 12px;
  word-break: keep-all;
}

//名字
.category__title {
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
}

//用户
.info__user {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

//用户名
.user__name {
  margin-left: 10px;
}

//按钮
.info__btns {
  margin-top: 20px;
}

//简介
.info__introduction {
  margin-top: 10px;
  font-size: 14px;
}

.desc {
  margin-left: 10px;
}
</style>
