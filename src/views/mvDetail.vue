<template>
  <!--MV详情 根节点-->
  <div class="video--detail--wrap">
    <!--菜单栏 视频控件 用户信息 视频名称 发布时间 播放次数 视频标签 点赞收藏分享下载按钮 评论-->
    <div class="video--detail">
      <!--视频详情 菜单栏-->
      <div class="video--detail--menu">
        <el-icon style="cursor: pointer" @click="router.go(-1)">
          <ArrowLeft />
        </el-icon>
        <span class="menu--title">MV详情</span>
      </div>
      <!--视频控件 这里先做成组件引入-->
      <div class="video--detail--control">
        <Control />
      </div>
      <!--用户信息-->
      <div class="video--detail--userInfo">
        <div class="userInfo--avatar">
          <el-avatar
            :size="50"
            :src="
              userInfo[0].img1v1Url.replace(/http:\//, 'https:/') +
              '?imageView&enlarge=1&thumbnail=50y50&type=webp'
            "
            fit="fill"
          />
          <span
            style="margin-left: 10px"
            v-for="(item, index) in userInfo"
            :key="item.id"
          >
            <span class="gray" @click="jumpArtists(item.id)">
              {{ item.name }}
            </span>
            <span
              v-if="index !== userInfo.length - 1"
              style="margin-left: 10px; height: 18px; line-height: 16px"
              >/</span
            >
          </span>
        </div>
        <!-- <el-button
          class="userInfo--follow"
          type="danger"
          :icon="Plus"
          @click="follow(elMessage)"
          >{{ userInfo.followed ? "已关注" : "关注" }}</el-button
        > -->
      </div>
      <!--标题 发布时间 播放次数-->
      <div class="video--detail--name">
        <div class="name--title">
          {{ mvName.name }}
          <el-icon v-if="mvDescription" @click="isShowDescription = !isShowDescription">
            <ArrowDownBold v-if="!isShowDescription" />
            <ArrowUpBold v-else />
          </el-icon>
        </div>
        <div class="name--publishTime">
          <span style="margin-right: 10px"
            >发布 : <span >{{ mvName.publishTime }}</span></span
          >
          <span
            >播放 : <span >{{ filter(mvName.playCount) }}</span
            >次</span
          >
        </div>
      </div>
      <!--视频文案介绍-->
      <div
        class="video--detail--description"
        :style="{ display: isShowDescription ? 'block' : 'none' }"
        v-if="mvDescription"
      >
        {{ mvDescription }}
      </div>
      <!--点赞收藏分享下载按钮-->
      <div class="video--detail--btn">
        <el-button
          round
          :icon="Pointer"
          @click="likeVideo(elMessage)"
          :type="btn.liked ? 'danger' : ''"
          >点赞({{ btn.likeCount }})</el-button
        >
        <el-button
          round
          :icon="Collection"
          @click="collectVideo(elMessage)"
          :type="btn.subscribed ? 'danger' : ''"
        >
          收藏({{ btn.subscribeCount }})</el-button
        >
        <el-button round :icon="Share" @click="shareVideo"
          >分享({{ btn.shareCount }})</el-button
        >
        <el-button v-if="isCompleteDownload" disabled round :icon="Download"
          >下载完毕</el-button
        >
        <el-button v-else-if="!isDownload" round :icon="Download" @click="downloadMv"
          >下载MV</el-button
        >
        <el-progress
          v-else-if="isDownload"
          style="width: 101px; margin-left: 12px"
          :text-inside="true"
          :stroke-width="32"
          :percentage="progress"
          :status="progress === 100 ? 'success' : ''"
        />
      </div>
      <!--评论 提交评论这里先做成组件把 其他地方应该有用到-->
      <div class="video--detail--comment">
        <div class="comment--title">
          <span>评论</span>
        </div>
        <Comment
          style="margin-left: 0px; margin-top: 0px; width: 100%"
          :id="currentMvid"
          :inputType="1"
          :resourceType="1"
        />
      </div>
    </div>
    <!--视频相关推荐-->
    <div class="video--recommend">
      <div class="video--detail--menu">
        <span class="menu--title">相关推荐</span>
      </div>
      <videoRelatedRecommendItem :recommendList="simiList" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"; //保留
import {
  ArrowLeft,
  ArrowDownBold,
  ArrowUpBold,
  Plus,
  Collection,
  Share,
  Pointer,
  Download,
} from "@element-plus/icons-vue"; //保留
import useInit from "c/mvDetail/useInit";
import {filter,videoTime} from '@/utils/filter'

let elMessage: any = inject("message") as any;

//路由实例
let route = useRoute();
let router = useRouter();

//调用useInit方法 初始化数据状态
let {
  currentMvid,
  mvDescription,
  currentMvImg,
  userInfo,
  mvName,
  simiList,
  btn,
  comment,
  progress,
  isDownload,
  isCompleteDownload,
  isShowDescription,
  // follow,
  likeVideo,
  collectVideo,
  shareVideo,
  flushOption,
  downloadMv,
} = useInit(elMessage);

//监听路由
watch(
  () => route.query,
  (toParams) => {
    if (toParams?.mvid) {
      flushOption(Number(toParams.mvid));
    }
  }
);

//跳转到歌手页
let jumpArtists = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};

</script>

<style scoped lang="scss">
//视频详情 根节点
.video--detail--wrap {
  display: flex;
  width: 80%;
  min-width: 800px;
  margin: auto;
}

//视频详情
.video--detail {
  margin-left: 15px;
  margin-top: 20px;
  display: flex;
  width: 60%;
  flex-direction: column;
}

//视频推荐
.video--recommend {
  margin-top: 20px;
  flex: 1;
  margin-left: 25px;
}

//菜单栏
.video--detail--menu {
  display: flex;
  align-items: center;
  font-weight: bold;
  height: 20px;
}

//视频详情
.menu--title {
  margin-left: 5px;
  font-size: 16px;
  line-height: 20px;
}

//视频控件
.video--detail--control {
  width: 100%;
  height: 444px;
  margin-top: 20px;
  z-index: 2;
}

//用户信息
.video--detail--userInfo {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

//用户信息 用户头像和名字
.userInfo--avatar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

//用户信息 关注
.userInfo--follow {
  margin-top: -1px;
}

//用户信息 标题 发布时间 播放次数
.video--detail--name {
  display: flex;
  flex-direction: column;
  text-align: left;
}

//标题
.name--title {
  font-size: 24px;

  margin-top: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

//发布时间 播放数量
.name--publishTime {
  color: rgb(207, 207, 207);
  margin-top: 10px;
  user-select: none;
}

//视频文案介绍
.video--detail--description {
  display: none;
  margin-top: 10px;
}

//点赞收藏分享
.video--detail--btn {
  text-align: left;
  margin-top: 24px;
  display: flex;
  align-items: center;
}

//评论
.video--detail--comment {
  margin-top: 30px;
  text-align: left;
  width: 100%;
}

//评论标题
.comment--title {
  span {
    font-weight: bold;
    font-size: 24px;
  }
}

//标题
.comment--title {
  font-weight: bold;
}
</style>
