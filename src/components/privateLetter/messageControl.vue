<template>
  <template v-if="showKey === 'control'">
    <section>
      <div class="title padding_title">
        <span class="fz__18">消息</span>
        <span class="blue fz__18" @click="readAll">一键已读</span>
      </div>
      <el-tabs
        v-model="activeName"
        class="padding_tabs"
        @tab-click="handleClick"
        :stretch="true"
      >
        <el-tab-pane name="first">
          <template #label
            >私信<el-badge
              :value="count.messageCount"
              v-if="count.messageCount"
            ></el-badge
          ></template>
          <template #default><MessageList /></template>
        </el-tab-pane>
        <el-tab-pane name="second">
          <template #label
            >评论<el-badge
              :value="count.commentCount"
              v-if="count.commentCount"
            ></el-badge
          ></template>
          <template #default><CommentList /></template>
        </el-tab-pane>
        <el-tab-pane name="third">
          <template #label
            >@我<el-badge :value="count.forwardCount" v-if="count.forwardCount"></el-badge
          ></template>
          <template #default><ForwardList /></template>
        </el-tab-pane>
        <el-tab-pane name="fourth">
          <template #label
            >通知<el-badge :value="count.noticeCount" v-if="count.noticeCount"></el-badge
          ></template>
          <template #default><NoticeList /></template>
        </el-tab-pane>
      </el-tabs>
    </section>
  </template>
  <template v-else-if="showKey === 'messageDetail'"><MessageDetail /></template>
</template>

<script setup lang="ts">
import { clearMsgCount } from "@/api/api_message";
import { useCount } from "@/store/count";
import { ElMessageBox, TabsPaneContext } from "element-plus";

let elMessage = inject("message") as any;
let showKey = ref<string>("control");
let openUserId = ref<number>(0);
provide("showKey", showKey);
provide("openUserId", openUserId);

let activeName = ref<string>("first");

let count = useCount();

let readAll = () => {
  ElMessageBox.confirm("确定清空全部新消息提醒?", "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let res = await clearMsgCount();
    count.updateCount();
    elMessage({
      type: "success",
      message: "清空成功",
    });
  });
};

let handleClick = (tab: TabsPaneContext, event: Event) => {
  let index = Number(tab.index);
  switch (index) {
    case 0:
      {
      }
      break;
    case 1:
      {
      }
      break;
    case 2:
      {
      }
      break;
    case 3:
      {
      }
      break;
  }
};
</script>

<style scoped lang="scss">
.fz__18 {
  font-size: 18px;
}

.padding_title {
  padding: 15px 25px 15px 25px;
}

.padding_tabs {
  padding: 0px 25px 0px 25px;
  overflow: scroll;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
