<template>
  <div>
    <LoadingComponent v-if="loading" />
    <div v-else-if="list.length" class="subscriber--list">
      <div class="subscriber--list__item" v-for="item in list" :key="item.userId">
        <div class="user--avatar">
          <el-avatar
            :size="90"
            :src="
              item.avatarUrl.replace(/http:\//, 'https:/') +
              '?imageView&enlarge=1&thumbnail=90y90&type=webp'
            "
          />
        </div>
        <div class="user--info single-clamp">
          <div class="info--name">
            <span style="margin-right: 5px" class="gray"> {{ item.nickname }}</span>
            <el-icon v-if="item.gender === 2" style="color: rgb(255, 205, 232)">
              <Female />
            </el-icon>
            <el-icon v-if="item.gender === 1" style="color: #409eff">
              <Male />
            </el-icon>
          </div>
          <div class="info--signature single-clamp" v-title>
            {{ item.signature }}
          </div>
        </div>
      </div>
    </div>
    <SubscriberEmpty v-else></SubscriberEmpty>
    <!--分页-->
    <div class="page" v-if="list.length">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="20"
        :pager-count="9"
        :hide-on-single-page="listTotal <= 20"
        layout="prev, pager, next"
        :total="listTotal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRadioSubscribers } from "@/api/api_radio";
import { getPlayListSubscribers } from "@/api/api_playList";
import { useRouter } from "vue-router";
import { useSongStore } from "@/store/playList";
import { SubscribersItem } from "i/api/api_radio.d";

interface Props {
  id: number;
  type: number;
}

let props = defineProps<Props>();

let router = useRouter();

let songList = useSongStore();
let elMessage = inject("message") as any;
//当前页数
let currentPage = ref<number>(1);
//loading
let loading = ref<boolean>(true);
//订阅列表
let list = ref<SubscribersItem[]>([]);
//电台订阅使用
let nowTime = new Date().getTime();
//total
let listTotal = ref<number>(0);

//获取电台订阅
let getRadioSubscribersList = async () => {
  try {
    let { subscribers, time } = await getRadioSubscribers(
      nowTime,
      20,
      currentPage.value * 20 - 20,
      props.id
    );
    list.value = subscribers;
    //必须使用传回来的时间 不然数据就是重复的
    if (time) {
      nowTime = time;
    }
    listTotal.value = songList?.radio?.programCount;
    loading.value = false;
  } catch (e: any) {
    elMessage.error("获取订阅列表出现错误");
  }
};

//获取歌单订阅
let getPlayListSubscribersList = async () => {
  try {
    let { subscribers, more, total } = await getPlayListSubscribers(
      props.id,
      20,
      currentPage.value * 20 - 20
    );
    list.value = subscribers;
    loading.value = false;
    listTotal.value = Number(total);
  } catch (e: any) {
    elMessage.error("获取订阅列表出现错误");
  }
};

//封装请求
let request = () => {
  if (props.id && props.type === 4) {
    getRadioSubscribersList();
  } else if (props.id && props.type === 2) {
    getPlayListSubscribersList();
  }
};

//监听翻页事件
watch(currentPage, async function (page: number) {
  try {
    request();
  } catch (e: any) {
    elMessage.error(e?.message || "请求失败 ");
  }
});

watchEffect(() => {
  request();
});
</script>

<style scoped lang="scss">
.page {
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.subscriber--list {
  display: grid;
  margin-left: 30px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 20px;
}

.subscriber--list__item {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.user--avatar {
  width: 90px;
  height: 90px;
}

.user--info {
  margin-left: 10px;
}

.info--name {
  display: flex;
  align-items: center;
}

.info--signature {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}
</style>
