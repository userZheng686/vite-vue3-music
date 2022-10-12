<template>
  <!--at功能-->
  <div class="at">
    <el-select
      v-model="at"
      filterable
      placeholder="选择最近@的人或直接输入"
      @change="change"
    >
      <el-option
        v-for="item in follows"
        :key="item.nickname"
        :label="item.nickname"
        :value="item.nickname"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { getUserFollows } from "@/api/api_user";
import { useUserInformation } from "@/store/user";
import { useSharePopupStore } from "@/store/sharePopup";
let sharePopup = useSharePopupStore();

let elMessage = inject("message") as any;
let userInfoamtion = useUserInformation();

//关闭at组件
let closeAt = () => {
  if (sharePopup.childSpaceWindowShow) {
    sharePopup.shareAt = false;
  } else {
    sharePopup.at = false;
  }
};

//联系人 默认选前10个
let follows = ref<
  Array<{
    nickname: string;
    userId: number;
  }>
>([]);

//at具体的人
let at = ref<string>("");

//获取关注的人 选取前十个
let getRecentlyContactList = async () => {
  try {
    let { follow } = await getUserFollows(userInfoamtion.user_profile.userId);
    follows.value = follow.slice(0, 10);
  } catch (e: any) {
    elMessage.error(e?.message || "请求关注列表失败 请检查你的网络是否有问题?");
  }
};

//select change
let change = () => {
  if (sharePopup.childSpaceWindowShow) {
    sharePopup.shareContent += at.value + " ";
  } else {
    sharePopup.content += at.value + " ";
  }

  closeAt();
};

watchEffect(() => {
  if (userInfoamtion?.user_profile?.userId) {
    getRecentlyContactList();
  }
});
</script>

<style lang="scss" scoped>
.at {
  width: 500px;
  font-size: 14px;
  position: absolute;
  left: 28px;
  top: 35px;
  z-index: 2;
}
</style>
