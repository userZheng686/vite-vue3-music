<template>
  <div class="login--code">
    <div class="phone--title">验证码登录</div>
    <div class="login--form">
      <el-input
        v-model="form.phone"
        class="w-50 m-2"
        size="large"
        placeholder="请输入手机号"
        :prefix-icon="Iphone"
      />
      <el-input
        v-model.number="form.code"
        type="text"
        maxlength="4"
        minlength="4"
        class="w-50 m-2"
        style="margin-top: 20px"
        size="large"
        placeholder="请输入验证码"
        :prefix-icon="Key"
      />
      <el-checkbox class="check" v-model="form.check" label="自动登录" size="large" />
      <el-checkbox class="send" v-model="form.send" label="发送验证码" size="large" />
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
import { userCode, checkUserCode, userLogin } from "@/api/api_user";
import { cookie } from "@/localStorage/init";
import { Iphone, Key } from "@element-plus/icons-vue";

let elMessage: any = inject("message") as any;
let status: Ref<string> = inject("status") as Ref<string>;

/**手机号验证码登录 */
let form = reactive<{
  phone: string;
  code: number | string;
  check: boolean;
  send: boolean;
  loading: boolean;
  timer: NodeJS.Timer | null;
}>({
  phone: "",
  code: "",
  check: true,
  send: false,
  loading: false,
  timer: null,
});

watch(
  () => form.send,
  async (val) => {
    if (val) {
      if (form.phone) {
        try {
          let code = await userCode(Number(form.phone));
          elMessage.success("验证码已经发送，请查收");
        } catch (e: any) {
          elMessage.error(e?.message || "请重新发送一遍验证码");
        }
      }
    }
  }
);

let login = async () => {
  if (form.phone && form.code) {
    try {
      //检查验证码是否正确
      let result = await checkUserCode(Number(form.phone), Number(form.code));
      form.loading = true;
      let params = {
        phone: Number(form.phone),
        captcha: Number(form.code),
      };
      let res = await userLogin(params);
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
      form.loading = false;
    } catch (e) {
      elMessage.error("登录失败，验证码不正确或者手机号不对");
      form.loading = false;
    }
  }
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

.login--code {
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

.send {
  float: right;
}

.login__btn {
  margin-top: 20px;
  width: 100%;
}
</style>
