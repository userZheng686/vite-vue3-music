<template>
  <!--文本输入-->
  <div class="message--textarea">
    <!--textarea-->
    <div class="textarea--wrap">
      <textarea
        v-model="content"
        class="textarea"
        id="textarea"
        maxlength="200"
        :placeholder="'回复：' + props.replyUserName"
      >
我是一个文本框</textarea
      >
      <div class="inputLength">
        <span>{{ content.length }}</span
        >/{{ computedLength }}
      </div>
    </div>
    <!--表情 艾特 分享 按钮-->
    <div class="control--btn">
      <i
        class="iconfont icon-biaoqing"
        style="cursor: pointer"
        @click="emotionShow = !emotionShow"
      ></i>
      <MessageEmotion v-show="emotionShow" />
      <el-button round @click="sendMsg">发送</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendPrivateMessage } from "@/api/api_message";
import { Ref } from "vue";

interface Props {
  replyUserName: string;
  sendMsgCallback: Function;
}

let props = defineProps<Props>();

let content = ref<string>("");
let emotionShow = ref<boolean>(false);
let elMessage = inject("message") as any;
let openUserId = inject("openUserId") as Ref<number>;
provide("content", content);
provide("emotionShow", emotionShow);

//计算长度
let computedLength = computed(() => 200 - content.value.length);

/**发送私信 */
let sendMsg = async () => {
  try {
    let { newMsgs } = await sendPrivateMessage(String(openUserId.value), content.value);
    elMessage.success("发送成功");
    props.sendMsgCallback && props.sendMsgCallback(newMsgs);
    content.value = "";
  } catch (e: any) {
    elMessage.error("发送失败");
  }
};
</script>

<style scoped lang="scss">
//textarea 外层
.message--textarea {
  width: 95%;
  margin: auto;
}

//textarea
.textarea--wrap {
  position: relative;
  display: flex;
}

//文本输入
.textarea {
  width: 100%;
  height: 70px;
  outline: 0;
  border-radius: 8px;
  border-color: rgb(229, 229, 229);
  resize: none;
  font-size: 14px;
}

//文本输入 显示当前输入的数字
.inputLength {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

//数字
.inputLength {
  font-size: 12px;
}

//表情
.control--btn {
  margin-top: 10px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
