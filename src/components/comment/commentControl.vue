<template>
  <!--文本输入-->
  <div class="control--textarea">
    <!--textarea-->
    <div class="textarea--wrap">
      <textarea
        v-model="sharePopup.content"
        class="textarea"
        id="textarea"
        maxlength="140"
        placeholder="发表你的评论"
        @keyup="enterEvUp($event)"
        @keydown="enterEv($event)"
      >
我是一个文本框</textarea
      >
      <div class="inputLength">
        <span>{{ sharePopup.content.length }}</span
        >/{{ computedLength }}
      </div>
    </div>
    <!--表情 艾特 分享 按钮-->
    <div class="control--btn">
      <BtnIcon type="comment" />
      <el-button round @click="sendComment">发送</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
//发送评论
import { getCommentSend } from "@/api/api_comment";
import emitter from "@/utils/eventBus";
//接口声明
import { VideoCommentItem } from "i/api/api_comment.d";
//歌曲评论弹窗
import { useSongCommentStore } from "@/store/songPopup";
import { useSharePopupStore } from "@/store/sharePopup";
import { loginCallback } from "@/utils/login";

let sharePopup = useSharePopupStore();
let elMessage: any = inject("message") as any;

//0 删除 1 发送 2回复
type InputType = 0 | 1 | 2;
//0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
type ResouceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  inputType: InputType;
  resourceType: ResouceType;
  id: string | number;
  list: Array<VideoCommentItem>;
  total: number;
}
let emit = defineEmits<{
  (e: "update:list", value: VideoCommentItem[]): void;
  (e: "update:total", value: number): void;
}>();

let props = defineProps<Props>();

//评论弹窗是否显示
let songCommentShow = useSongCommentStore();

//计算长度
let computedLength = computed(() => 140 - sharePopup.content.length);

//form 提交评论 因为id type是传进来就固定了 所以不会改变 这里就不写进去了
let form = reactive<{
  inputType: InputType;
  //回复别人相关  别人的内容
  repeatContent: string;
  commentId?: string | number;
  replaceLength: number;
}>({
  inputType: props.inputType,
  repeatContent: "",
  commentId: undefined,
  replaceLength: 0,
});

//回复别人
emitter.on("replyContent", (obj) => {
  let { contents, commentId, repeatContent } = obj as any;
  form.inputType = 2;
  form.commentId = commentId;
  sharePopup.content = String(contents);
  form.repeatContent = String(repeatContent);
  form.replaceLength = contents.length;
});

//清空内容 主要是歌曲评论弹窗关闭时调用
emitter.on("clearContent", () => {
  form.inputType = 1;
  form.repeatContent = "";
  sharePopup.content = "";
  form.replaceLength = 0;
});

//监听键盘
let enterEvUp = (e: KeyboardEvent) => {
  if (sharePopup.childSpaceWindowShow) return;
  if (sharePopup.content[sharePopup.content.length - 1] === "@") {
    sharePopup.at = true;
  } else {
    sharePopup.at = false;
  }
  if (sharePopup.content[sharePopup.content.length - 1] === "#") {
    sharePopup.topic = true;
  } else {
    sharePopup.topic = false;
  }
};

//监听键盘输入事件 主要是输入@或者#的时候打开弹窗 还有就是回退的时候把弹窗关闭
let enterEv = (e: KeyboardEvent) => {
  if (sharePopup.childSpaceWindowShow) return;
  const { keyCode, code } = e;
  const isAtCode =
    ((keyCode === 229 && e.key === "@") ||
      (keyCode === 229 && e.code === "Digit2") ||
      keyCode === 50) &&
    e.shiftKey;
  const isTopicCode =
    ((keyCode === 229 && e.key === "#") ||
      (keyCode === 229 && e.code === "Digit3") ||
      keyCode === 50) &&
    e.shiftKey;
  if (isAtCode) sharePopup.at = true;
  else {
    if (sharePopup.content[sharePopup.content.length - 1] === "@") {
      sharePopup.at = true;
    } else {
      sharePopup.at = false;
    }
  }
  if (isTopicCode) sharePopup.topic = true;
  else {
    if (sharePopup.content[sharePopup.content.length - 1] === "#") {
      sharePopup.topic = true;
    } else {
      sharePopup.topic = false;
    }
  }
};

//发送评论
let sendComment = () => {
  loginCallback(async () => {
    try {
      if (form.replaceLength) {
        sharePopup.content = sharePopup.content.substr(form.replaceLength);
        form.replaceLength = 0;
      }
      let { comment } = await getCommentSend(
        form.inputType,
        props.resourceType,
        props.id,
        sharePopup.content,
        form.commentId
      );
      /**对返回的数据进行扩展 针对ts定义的数据结构 */
      comment.liked = false;
      comment.likedCount = 0;
      comment.beReplied = [];
      if (comment.beRepliedUser) {
        comment.beReplied.push({
          content: form.repeatContent,
          user: {
            nickname: comment.beRepliedUser.nickname,
            userId: comment.beRepliedUser.userId,
          },
        });
      }
      //清空form
      form.inputType = 1;
      sharePopup.content = "";
      form.commentId = "";
      form.repeatContent = "";
      form.replaceLength = 0;
      let list = props.list;
      //timeStr, liked, likedCount, parentCommentId, beReplied
      list.unshift(comment);

      emit("update:list", list);
      emit("update:total", props.total + 1);
      songCommentShow.setSongCommentShow(false);
      songCommentShow.setRadioCommentShow(false);
      elMessage.success("发送成功");
    } catch (e: any) {
      elMessage.error(e?.message || "发送评论失败 请检查你的网络是否有问题?");
    }
  });
};

onActivated(() => {
  sharePopup.content = "";
});
</script>

<style scoped lang="scss">
//textarea 外层
.control--textarea {
  display: flex;
  flex: 1;
  flex-direction: column;
}

//textarea
.textarea--wrap {
  position: relative;
  display: flex;
}

//文本输入
.textarea {
  width: 100%;
  margin-top: 10px;
  height: 70px;
  outline: 0;
  border-radius: 8px;
  border-color: rgb(229, 229, 229);
  resize: none;
  font-size: 14px;
  padding: 5px;
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
