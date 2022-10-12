<template>
  <section class="topic--soaring">
    <div class="soaring--list">
      <h1>话题飙升榜</h1>
      <el-tabs v-model="activeName" type="card" class="demo-tabs">
        <el-tab-pane label="24小时" name="24">
          <TopicSoaringListItem
            v-for="(item, index) in dayList"
            :key="item.actId"
            :item="item"
            :index="index + 1"
            @click="jumpTopicDetail(item.actId)"
          />
        </el-tab-pane>
        <el-tab-pane label="7天" name="7">
          <TopicSoaringListItem
            v-for="(item, index) in weekList"
            :key="item.actId"
            :item="item"
            :index="index + 1"
            @click="jumpTopicDetail(item.actId)"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="rcmd--list">
      <el-input
        v-model="search"
        class="search"
        placeholder="搜索话题"
        :suffix-icon="Search"
      />
      <div class="search--result" v-show="search">
        <div class="title" v-if="searchList.length">搜索结果</div>
        <div
          class="item"
          v-for="item in searchList"
          :key="item.actId"
          @click="jumpTopicDetail(item.actId)"
        >
          <DefaultImage
            :picUrl="item.sharePicUrl"
            :param="44"
            :y="44"
            style="min-width: 44px; min-height: 44px; width: 44px; height: 44px"
            loadingWidth="22px"
            loadingHeight="22px"
            :lazy="false"
          />
          <div class="rcmd__detail single-clamp">
            <div class="single-clamp">#{{ item.title }}#</div>
            <div class="info">{{ item.participateCount }}人参与</div>
          </div>
        </div>
        <div v-if="!searchList.length">
          未能找到与<span class="blue">{{ search }}</span
          >相关的话题
        </div>
      </div>
      <div style="font-size: 16px; margin-top: 25px">推荐话题</div>
      <div
        class="item"
        v-for="item in rcmdList"
        :key="item.actId"
        @click="jumpTopicDetail(item.actId)"
      >
        <DefaultImage
          :picUrl="item.sharePicUrl"
          :param="44"
          :y="44"
          style="min-width: 44px; min-height: 44px; width: 44px; height: 44px"
          loadingWidth="22px"
          loadingHeight="22px"
          :lazy="false"
        />
        <div class="rcmd__detail">
          <div>#{{ item.title }}#</div>
          <div class="info">
            <span v-if="item.reason">{{ item.reason }}</span>
            <span v-else>{{ item.participateCount }}人参与</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getTopicSoaring, getTopicDetailRcmdList, getTopicSearch } from "@/api/api_topic";
import { Search } from "@element-plus/icons-vue";
import { HotTopicItem, TopicDetailRcmdListItem } from "i/api/api_topic";
import { useRouter } from "vue-router";
import { getHotSearch } from "@/api/api_other";

let router = useRouter();
let elMessage = inject("message") as any;
let activeName = ref<string>("24");
let dayList = ref<HotTopicItem[]>([]);
let weekList = ref<HotTopicItem[]>([]);
let search = ref<string>("");
let rcmdList = ref<TopicDetailRcmdListItem[]>([]);
let searchList = ref<HotTopicItem[]>([]);

let getTopicSoaringBatch = async () => {
  try {
    let { soaring: soaringDay } = await getTopicSoaring(1, 0, 10);
    let { soaring: soaringWeek } = await getTopicSoaring(7, 0, 10);
    dayList.value = soaringDay;
    weekList.value = soaringWeek;
    let { rcmd } = await getTopicDetailRcmdList(0, 10);
    rcmdList.value = rcmd;
  } catch (e: any) {
    elMessage.error(e?.message || "获取话题列表失败");
  }
};

//话题详情
let jumpTopicDetail = (actId: number) => {
  router.push({
    path: "/topicDetail",
    query: {
      actId,
    },
  });
};

watch(
  () => search.value,
  async (val: string) => {
    let {
      result: { topics },
    } = await getTopicSearch(val);
    searchList.value = topics ? topics : [];
  }
);

onActivated(() => {
  getTopicSoaringBatch();
});
</script>

<style scoped lang="scss">
.topic--soaring {
  display: flex;
  height: 100%;
}

.soaring--list {
  border-right: 1px solid #eee;
  padding-left: 40px;
  width: calc(100% - 325px);
}

.rcmd--list {
  width: 250px;
  position: fixed;
  right: 0;
  overflow: scroll;
  top: 60px;
  bottom: 120px;
  padding: 20px;

  .item {
    display: flex;
    margin-top: 5px;
    cursor: pointer;
    align-items: center;

    .rcmd__detail {
      margin-left: 10px;
      overflow: hidden;
    }

    &:hover {
      background-color: var(--dark-item-backgroundHover, rgb(245, 245, 245));
    }
  }

  .search {
    font-size: 12px;
  }

  .search--result {
    position: absolute;
    margin-top: 5px;
    width: 82%;
    box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
    background-color: var(--dark-normalBackgroundColor, white);
    padding-left: 11px;
    z-index: 3;
    max-height: 350px;
    overflow: scroll;

    .title {
      height: 36px;
      display: flex;
      align-items: center;
      font-size: 12px;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
