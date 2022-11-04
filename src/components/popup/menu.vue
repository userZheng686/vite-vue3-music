<template>
  <div class="menu" v-show="Popup.isOpenMenuPopup">
    <!--动态 关注 粉丝-->
    <div class="menu--info">
      <div class="info__eventCount" @click="toJump('', 'event')">
        <div class="info__count">
          {{ store_infoamtion.user_profile.eventCount || 0 }}
        </div>
        <div class="info__title">动态</div>
      </div>
      <div class="info__follows" @click="toJump('', 'follow')">
        <div class="info__count">
          {{ store_infoamtion.user_profile.follows || 0 }}
        </div>
        <div class="info__title">关注</div>
      </div>
      <div class="info__followed" @click="toJump('', 'followed')">
        <div class="info__count">
          {{ store_infoamtion.user_profile.followeds || 0 }}
        </div>
        <div class="info__title">粉丝</div>
      </div>
    </div>
    <!--签到-->
    <div style="display: flex; align-items: center; justify-content: center">
      <el-button
        :disabled="store_infoamtion?.user?.pcSign"
        v-btnAntiShake="signin"
        style="margin-bottom: 10px"
        round
      >
        <el-icon><Coin /></el-icon>
        <span>{{ store_infoamtion?.user?.pcSign ? "已签到" : "签到" }}</span>
      </el-button>
    </div>
    <!--菜单栏-->
    <div class="menu--list">
      <div class="list--break"></div>
      <div
        class="list--item"
        :style="item.isBreak ? ' border-bottom: 1px solid #eee;' : ''"
        v-for="(item, index) in list"
        @click="toJump(item.href, item.path)"
        :key="index"
      >
        <i class="iconfont" :class="item.icon"></i>
        <span class="item__title">{{ item.title }}</span>
        <div class="item__allow">
          <span
            style="
              margin-right: 4px;
              position: relative;
              color: rgba(224, 58, 36, 1);
              font-weight: bold;
            "
          >
            <i v-if="item.allowText" class="item__level"></i>
            {{ item.allowText }}</span
          >
          <el-icon v-if="index < 4 ? true : false">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>

    <Mask :click="closeMenuPopup" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { userSignin } from "@/api/api_user";
import { usePopupStore } from "@/store/popup";
import { useUserInformation } from "@/store/user";

let router = useRouter();
let Popup = usePopupStore();
let store_infoamtion = useUserInformation();

let elMessage: Function = inject("message") as Function;

let list = reactive<
  Array<{
    icon: string;
    title: string;
    allowText: string;
    isBreak: boolean;
    href: string;
    path: string;
  }>
>([
  {
    icon: "icon-dengji",
    title: "等级",
    allowText: "9",
    isBreak: false,
    href: "https://music.163.com/#/user/level",
    path: "",
  },
  {
    icon: "icon-shouye",
    title: "商城",
    allowText: "",
    isBreak: true,
    href: "https://music.163.com/store/product",
    path: "",
  },
  {
    icon: "icon-gerenxinxi",
    title: "个人信息设置",
    allowText: "",
    isBreak: false,
    href: "",
    path: "updateUserInformation",
  },
  {
    icon: "icon-bangding",
    title: "绑定社交账号",
    allowText: "",
    isBreak: true,
    href: "https://music.163.com/#/user/binding/m/list",
    path: "",
  },
  {
    icon: "icon-tuichu",
    title: "退出登录",
    allowText: "",
    isBreak: false,
    href: "",
    path: "",
  },
]);

function clearCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  keys;
  if (keys) {
    for (var i = keys.length; i--; ) {
      document.cookie = keys[i] + "=0;path=/;expires=" + new Date(0).toUTCString(); //清除当前域名下的,例如：m.kevis.com
      document.cookie =
        keys[i] +
        "=0;path=/;domain=" +
        document.domain +
        ";expires=" +
        new Date(0).toUTCString(); //清除当前域名下的，例如 .m.kevis.com
      document.cookie =
        keys[i] + "=0;path=/;domain=kevis.com;expires=" + new Date(0).toUTCString(); //清除一级域名下的或指定的，例如 .kevis.com
    }
  }
}

// href 链接 path 跳转路由 什么都没有 就是退出登录
let toJump = (href: string, path: string) => {
  if (href) {
    if (window.desktopMainAPI) {
      window.desktopMainAPI.href(href);
    } else {
      window.open(href);
    }
  } else if (path) {
    router.push({
      path,
      query: {
        id: store_infoamtion?.user_profile?.userId,
      },
    });
  } else {
    clearCookie();
    window.localStorage.clear();
    elMessage({
      message: "退出成功",
      type: "success",
    });
    location.reload();
  }
  Popup.isOpenMenuPopup = false;
};

let signin = async () => {
  try {
    let res = await userSignin();
    store_infoamtion.user.pcSign = true;
    elMessage({
      message: "签到成功",
      type: "success",
    });
  } catch (e: any) {
    elMessage({
      message: e?.message || "签到失败，请重新再试试",
      type: "error",
    });
  }
};

// 关掉弹窗
let closeMenuPopup = () => {
  Popup.isOpenMenuPopup = false;
  Popup.isOpenMask = false;
};
</script>

<style scoped lang="scss">
.menu {
  position: absolute;
  top: 35px;
  left: 0px;
  width: 320px;
  right: 50px;
  max-height: 420px;
  transition: all 0.5s;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 1px 4px #dddddd;
  background-color: var(--dark-blackBackgroundColor, #fff);
  z-index: 100;
}

.menu--info {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 10px auto;
  justify-content: space-between;

  .info__eventCount,
  .info__follows,
  .info__followed {
    cursor: pointer;
  }

  div {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}

.info__count {
  font-size: 20px;
  font-weight: 700;
}

.info__title {
  font-size: 12px;
}

.sign {
  margin-right: 2px;
}

.menu--list {
  margin: auto;
  display: flex;
  flex-direction: column;
}

.list--break {
  width: 90%;
  margin: auto;
  border-top: 1px solid #eee;
}

.list--item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;

  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.item__title {
  margin-left: 5px;
  font-size: 12px;
}

.item__allow {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  font-size: 12px;
}

.item__level {
  background: url(https://s2.music.126.net/style/web2/img/mylevel.png?47b6e37…) 0px 9999px
    no-repeat;
  position: absolute;
  top: -7px;
  right: 1px;
  width: 30px;
  transform: scale(0.5);
  height: 30px;
  background-position: left 4px;
}
</style>
