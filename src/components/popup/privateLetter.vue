<template>
  <!--分享的弹窗 因为接口不支持图片 所以不做-->
  <el-dialog
    v-model="sharePopup.childPrivateLetterShow"
    title="私信"
    width="30%"
    center
    destroy-on-close
    :before-close="closeDialog"
    :modal="false"
    :lock-scroll="false"
  >
    <div class="select">
      <el-icon class="select--icon">
        <Search />
      </el-icon>
      <span class="select--name">
        <el-tag
          v-for="item in checkFollowNames"
          :key="item"
          type="info"
          class="mx-1"
          effect="light"
          round
        >
          {{ item }}
        </el-tag>
      </span>
    </div>
    <div class="list">
      <div
        class="list__item"
        v-for="item in follows"
        :key="item.userId"
        @click="checkFollowUser(item.userId)"
      >
        <DefaultImage
          :param="25"
          :y="25"
          loadingHeight="12px"
          loadingWidth="12px"
          style="width: 25px; height: 25px; margin-left: 25px; margin-right: 25px"
          :picUrl="item.avatarUrl"
        />
        <span class="list__item__nickname">{{ item.nickname }}</span>
        <el-icon class="list__item__check" v-if="checkFollowIds.includes(item.userId)">
          <Check />
        </el-icon>
      </div>
    </div>
    <el-button class="btn" type="danger" @click="next">下一步</el-button>
  </el-dialog>
</template>

<style scoped lang="scss">
.select {
  width: 100%;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  border-top: 1px solid #eee;
  min-height: 60px;
  overflow: auto;
  display: flex;
  align-items: center;
}

.select--icon {
  width: 25px;
  height: 25px;
  font-size: 25px;
  margin-left: 25px;
  margin-right: 25px;
}

.select--name {
  flex: 1;
}

.mx-1 {
  margin-right: 5px;
  margin-bottom: 5px;
}

.list {
  max-height: 220px;
  overflow: scroll;
  border-bottom: 1px solid #eee;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;

  width: 100%;
}

.list__item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  border-top: 1px solid #eee;
}

.list__item__nickname {
  flex: 1;
}

.list__item__check {
  margin-right: 25px;
  color: rgb(236, 65, 65);
}

.btn {
  margin: 10px auto;
  display: flex;
}
</style>

<script lang="ts" setup>
import { getUserFollows } from "@/api/api_user";
import { useSharePopupStore } from "@/store/sharePopup";
import { useUserInformation } from "@/store/user";

let sharePopup = useSharePopupStore();
let userInfoamtion = useUserInformation();

let elMessage = inject("message") as any;

//联系人 默认选前10个
let follows = ref<
  Array<{
    nickname: string;
    userId: number;
    avatarUrl: string;
  }>
>([]);
//选择的联系人id
let checkFollowIds = ref<number[]>([]);
//选择的联系人名称
let checkFollowNames = ref<string[]>([]);

//获取关注的人 选取前十个
let getRecentlyContactList = async () => {
  try {
    let { follow } = await getUserFollows(userInfoamtion.user_profile.userId);
    follows.value = follow;
  } catch (e: any) {
    elMessage.error(e?.message || "请求关注列表失败 请检查你的网络是否有问题?");
  }
};

//选择关注的人
let checkFollowUser = (id: number) => {
  let index = checkFollowIds.value.indexOf(id);
  let followIndex = follows.value.findIndex((item) => item.userId === id);
  if (index !== -1) {
    checkFollowIds.value.splice(index, 1);
    sharePopup.checkUserIds.splice(index, 1);
    checkFollowNames.value.splice(index, 1);
  } else {
    checkFollowIds.value.push(id);
    sharePopup.checkUserIds.push(id);
    checkFollowNames.value.push(follows.value[followIndex].nickname);
  }
  sharePopup.checkUserNames = checkFollowNames.value;
};

watchEffect(() => {
  if (userInfoamtion?.user_profile?.userId) {
    getRecentlyContactList();
  }
});

//关闭弹窗
let closeDialog = (done: () => void) => {
  //清空已经选择过的人
  checkFollowIds.value = [];
  checkFollowNames.value = [];
  done();
};

//下一步
let next = () => {
  //清空已经选择过的人
  checkFollowIds.value = [];
  checkFollowNames.value = [];
  //打开私信分享窗口
  sharePopup.openChildPrivateLetterShare();
};
</script>
