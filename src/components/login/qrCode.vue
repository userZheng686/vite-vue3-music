<template>
  <div class="login--qrCode">
    <div class="qrCode--title">扫码登录</div>
    <qrcode-vue
      style="margin-top: 20px"
      :value="qrCode.url"
      :size="qrCode.size"
      level="H"
    />
    <el-button style="margin-top: 50px" @click="status = ''">返回上级</el-button>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { generateKey, generateQrCode, ScanQrCode, userLogin } from "@/api/api_user";
import { cookie } from "@/localStorage/init";
import QrcodeVue from "qrcode.vue";
let elMessage: any = inject("message") as any;
let status: Ref<string> = inject("status") as Ref<string>;

//二维码
let qrCode = reactive<{
  url: string;
  size: number;
  timer: NodeJS.Timer | number;
}>({
  url: "",
  size: 200,
  timer: 0,
});

/**生成二维码需要经历三个步骤
1.生成key
2.拿到生成的key，去生成二维码
3.轮询查询扫码状态
 */
async function getQrCode() {
  try {
    //拿到unikey
    let {
      data: { unikey },
    } = await generateKey();

    //拿到图片和url
    let {
      data: { qrurl, qrimg },
    } = await generateQrCode(unikey);

    // 修改二维码地址
    qrCode.url = qrurl;

    // 轮询 查询是否登录
    function queryIsLogin() {
      qrCode.timer = setInterval(async () => {
        try {
          let r = await ScanQrCode(unikey);
          if (r) {
            clearInterval(qrCode.timer);
          }
          elMessage.success("登录成功");
          cookie.value = r.cookie;
          if (window.cookieAPI) {
            window.cookieAPI.setCookie(r.cookie);
          }
          location.reload();
        } catch (e: any) {
          if (e.code === "800") {
            ("二维码已经过期了 请重新在生成一遍");
          }
        }
      }, 5000);
    }

    queryIsLogin();
  } catch (e: any) {
    elMessage.error(e?.message || "生成二维码出现了错误 请重新试试");
  }
}

watch(
  () => status.value,
  (val) => {
    if (val === "qrCode") {
      getQrCode();
    }
  }
);
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

.login--qrCode {
  @include login-wrap-style;
  align-items: center;
}

.qrCode--title {
  font-size: 28px;
  text-align: center;
}
</style>
