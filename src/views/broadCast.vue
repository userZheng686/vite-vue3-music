<template>
  <!--我的播客-->
  <div class="broad--cast">
    <!--我的播客头部-->
    <div class="cast__title">我的播客</div>
    <div class="cast__subtitle">收藏的播客({{ djRadioCount }})</div>
    <LoadingComponent v-if="isLoading" />
    <TableEmpty v-else-if="djRadioSubList.length === 0 && !isLoading">
      <template #empty>暂无收藏播客</template>
    </TableEmpty>
    <!--我的播客列表-->
    <div class="cast__subList">
      <div
        class="list__item"
        @click="jumpBroadCastDetail(item.id)"
        v-for="item in djRadioSubList"
        @contextmenu="
          contextMenuDj($event, {
            id: item.id,
            name: item.name,
            picUrl: item.intervenePicUrl,
          })
        "
        :key="item.id"
      >
        <div style="display: flex; align-items: center; margin-left: 30px; width: 50%">
          <DefaultImage
            style="width: 80px; height: 80px"
            :picUrl="item.intervenePicUrl"
            loadingWidth="40px"
            loadingHeight="40px"
            :param="80"
            :y="80"
          >
            <template #count>
              <div class="count" v-if="item.newProgramCount > 0">
                {{ item.newProgramCount }}
              </div>
            </template>
          </DefaultImage>
          <span class="list__item__name gray single-clamp">{{ item.name }}</span>
        </div>
        <div class="list__item__username gray">by {{ item.dj.nickname }}</div>
        <div class="list__item__count gray">声音 {{ item.programCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserInformation } from "@/store/user";
import { clearRadioCount, getRadioSublist } from "@/api/api_radio";
//播客列表声明
import { RadioSublistItem } from "i/api/api_radio.d";
import { contextMenuDj } from "@/contextMenu/dj/normal";

let elMessage = inject("message") as any;

let userInfo = useUserInformation();
let router = useRouter();
let djRadioCount = ref<number>(0);
let djRadioSubList = ref<RadioSublistItem[]>([]);
let isLoading = ref<boolean>(false);

//获取用户订阅的播客列表
let getDjRadioList = async () => {
  try {
    let subList = await getRadioSublist(userInfo.user_profile.userId, 0, 1000);
    djRadioCount.value = subList.count;
    djRadioSubList.value = subList.djRadios;
    let clear = await clearRadioCount();
  } catch (e: any) {
    elMessage.error(e?.message || "获取用户电台列表失败 请重新打开页面试试");
  }
};

onActivated(() => {
  getDjRadioList();
});

//跳转到播客详情
let jumpBroadCastDetail = (id: number) => {
  router.push({
    path: "/broadCastDetail",
    query: { id },
  });
};
</script>

<style scoped lang="scss">
//我的播客
.broad--cast {
  flex: 1;
}

//我的播客 头部
.cast__title {
  width: 95%;
  margin-left: 30px;
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}

//我的播客 头部
.cast__subtitle {
  width: 95%;
  margin-left: 30px;
  margin-top: 20px;
  font-size: 15px;
  font-weight: bold;
}

//我的播客列表
.cast__subList {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

//我的播客列表 元素
.list__item {
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  justify-content: space-between;
  cursor: pointer;

  &:nth-child(odd) {
    background-color: var(--dark-item-backgroundOdd, rgb(250, 250, 250));
  }
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

//我的播客列表 元素 名字
.list__item__name {
  margin-left: 10px;
}

//我的播客列表 元素 作者
.list__item__username {
  flex: 1;
  margin-left: 10px;
}

//我的播客列表 元素 数量
.list__item__count {
  width: 10%;
}

//数字
.count {
  background-color: rgb(255, 125, 128);
  color: white;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  min-height: 15px;
  border-radius: 50%;
}
</style>
