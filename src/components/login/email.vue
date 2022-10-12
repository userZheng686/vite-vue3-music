<template>
  <!--手机号登录或者手机号注册-->
  <div class="login--phone">
    <div class="phone--title">邮箱登录</div>
    <div class="login--form">
      <el-input
        v-model="form.email"
        class="w-50 m-2"
        size="large"
        placeholder="请输入邮箱号"
        :prefix-icon="Message"
      />
      <el-input
        v-model="form.md5_password"
        type="password"
        class="w-50 m-2"
        style="margin-top: 20px"
        size="large"
        placeholder="请输入密码"
        :prefix-icon="Unlock"
      />
      <el-checkbox class="check" v-model="form.check" label="自动登录" size="large" />
      <el-button
        :disabled="form.loading"
        v-btnAntiShake="login"
        class="login__btn"
        type="danger"
      >
        登录
      </el-button>
      <el-button style="margin-top: 40px" @click="status = ''">返回上级</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { userEmailLogin } from "@/api/api_user";
import { cookie } from "@/localStorage/init";
import md5 from "blueimp-md5";
import { Message, Unlock } from "@element-plus/icons-vue";
let status: Ref<string> = inject("status") as Ref<string>;

let elMessage: any = inject("message") as any;

/**邮箱密码登录 */
let form = reactive<{
  email: string;
  md5_password: string;
  check: boolean;
  loading: boolean;
  timer: NodeJS.Timer | null;
}>({
  email: "",
  md5_password: "",
  check: true,
  loading: false,
  timer: null,
});

let login = async () => {
  form.loading = true;
  try {
    let res = await userEmailLogin(form.email, "", md5(form.md5_password));
    if (res) {
      elMessage({
        message: "登录成功",
        type: "success",
      });
      cookie.value = res.cookie;
      if (window.cookieAPI) {
        window.cookieAPI.setCookie(res.cookie);
      }
      location.reload();
    }
  } catch (e: any) {
    elMessage.error(e?.message || "登陆失败 请重新试试");
  }

  form.loading = false;
};
</script>

<style scoped lang="scss">
@mixin login-wrap-style {
  width: 420px;
  height: 470px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  background-color: var(--dark-blackBackgroundColor, white);
  z-index: 1;
}

.login--phone {
  @include login-wrap-style;
}

.phone--title {
  font-size: 28px;
  text-align: center;
}

.login--form {
  width: 80%;
  height: 230px;
  margin: 40px auto;
  text-align: center;
  height: 230px;
}

.check {
  float: left;
}

.login__btn {
  margin-top: 20px;
  width: 100%;
}
</style>
