<template>
  <div class="look">
    <div class="look--top">
      <div style="font-size: 20px; font-weight: bold">Look直播</div>
      <div class="info" style="margin-left: 10px">在这里，看见音乐</div>
      <div
        class="info"
        style="flex: 1; text-align: right; cursor: pointer"
        @click="jumpLive(`https://look.163.com/hot`)"
      >
        更多>
      </div>
    </div>
    <div class="look--list" v-if="list.length">
      <div
        class="list__item"
        v-for="item in list"
        :key="item?.liveData?.liveId"
        @click="jumpLive(item?.liveData?.webRoomUrl)"
      >
        <DefaultImage :picUrl="item?.liveData?.liveCoverUrl" :param="318" :y="318">
          <template #tag>
            <!--分类-->
            <div
              class="item__tag"
              :class="{ item__tag__violet: item.liveData?.tag?.type === 8 }"
              v-if="item.liveData?.tag?.content"
            >
              <span style="margin-left: 2px">{{ item.liveData?.tag?.content }}</span>
            </div>
          </template>
          <template #hot>
            <!--热度-->
            <div class="item__cover__hot">
              <i class="iconfont icon-redu"></i>
              <span style="margin-left: 2px">{{ item.liveData.popularity }}</span>
            </div>
          </template>
          <template #user>
            <!--热度-->
            <div class="item__user single-clamp">
              <el-avatar
                :size="30"
                :src="
                  item?.liveData?.userInfo?.avatarUrl.replace(/http:\//, 'https:/') +
                  '?imageView&enlarge=1&thumbnail=30y30&type=webp'
                "
              />
              <span style="margin-left: 2px" class="single-clamp">{{
                item?.liveData?.userInfo?.artistName
              }}</span>
              <img
                alt=""
                style="margin-left: 5px"
                v-if="item?.liveData?.userInfo?.avatarDetail?.identityIconUrl"
                :src="item?.liveData?.userInfo?.avatarDetail?.identityIconUrl"
                width="10"
                height="10"
              />
            </div>
          </template>
        </DefaultImage>
        <div style="margin-top: 10px">{{ item?.liveData?.liveTitle }}</div>
      </div>
    </div>
    <LoadingComponent
      v-if="more"
      ref="loadingComponent"
      style="margin-left: 30px; margin-top: 20px"
    />
  </div>
</template>

<script setup lang="ts">
import { getRecommentLive } from "@/api/api_livestream";
import { RecommentLiveItem } from "i/api/api_livestream";
import { useIntersectionObserver } from "@vueuse/core";

let offset = 0;
let more = ref<boolean>(true);
//ref loadingComponent
const loadingComponent = ref<null | HTMLElement>(null);
let list = shallowRef<RecommentLiveItem[]>([]);

let getRecommentLiveList = async () => {
  try {
    let {
      data: { hasMore, itemList },
    } = await getRecommentLive(offset, 20);
    more.value = hasMore;
    let filterList = itemList.filter((item) => item.liveData);
    list.value = list.value.concat(filterList);
    offset += itemList.length;
  } catch (e: any) {}
};

let jumpLive = (href: string) => {
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(href);
  } else {
    window.open(href);
  }
};

//监听 是否翻到了loading组件
const { stop } = useIntersectionObserver(
  loadingComponent,
  ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
      getRecommentLiveList();
    }
  }
);
</script>

<style scoped lang="scss">
.look {
  margin-left: 30px;
  margin-right: 25px;
  margin-top: 20px;
}

.look--top {
  display: flex;
  align-items: center;
  width: 100%;
}

.look--list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  row-gap: 30px;
  margin-top: 20px;
}

//分类
.item__tag {
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: rgb(255, 44, 85);
  border-radius: 0px 0px 10px 0px;
  color: white;
  padding: 2px;
}

.item__tag__violet {
  background-color: rgb(55, 0, 157);
}

//热度
.item__cover__hot {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #fff;
  text-shadow: 1px 1px 5px #0a0101;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
}

//用户
.item__user {
  position: absolute;
  bottom: 10px;
  color: #fff;
  text-shadow: 1px 1px 5px #0a0101;
  font-family: "Microsoft JhengHei", "明黑", Arial, Helvetica;
  display: flex;
  align-items: center;
  left: 10px;
}

:deep(.el-image__inner:hover) {
  transform: scale(1.1);
}
</style>
