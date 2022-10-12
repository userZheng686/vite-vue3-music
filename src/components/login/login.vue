<template>
  <div class="login" v-show="popupStatus.isOpenLoginPopup">
    <div class="login__container">
      <el-icon class="close" @click="popupStatus.isOpenLoginPopup = false">
        <Close />
      </el-icon>
      <div class="container" v-show="status === ''">
        <div class="card">
          <div class="card-icon">
            <i class="iconfont icon-iconfontscan"></i>
          </div>
          <div class="content">
            <h2>01</h2>
            <h3>扫码登录</h3>
            <a href="#" @click="changeStatus($event, 'qrCode')">entry</a>
          </div>
        </div>
        <div class="card">
          <div class="card-icon">
            <i class="iconfont icon-shoujihao"></i>
          </div>
          <div class="content">
            <h2>02</h2>
            <h3>手机号登录</h3>
            <a href="#" @click="changeStatus($event, 'phone')">entry</a>
          </div>
        </div>
        <div class="card">
          <div class="card-icon">
            <i class="iconfont icon-yanzhengma"></i>
          </div>
          <div class="content">
            <h2>03</h2>
            <h3>验证码登录</h3>
            <a href="#" @click="changeStatus($event, 'phoneCode')">entry</a>
          </div>
        </div>
        <div class="card">
          <div class="card-icon">
            <i class="iconfont icon-youxiang"></i>
          </div>
          <div class="content">
            <h2>04</h2>
            <h3>邮箱登录</h3>
            <a href="#" @click="changeStatus($event, 'email')">entry</a>
          </div>
        </div>
      </div>
      <QrCode v-show="status === 'qrCode'"></QrCode>
      <Phone v-show="status === 'phone'"></Phone>
      <PhoneCode v-show="status === 'phoneCode'"></PhoneCode>
      <Email v-show="status === 'email'"></Email>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInformation } from "@/store/user";
import { usePopupStore } from "@/store/popup";
import { reactive, ref, onMounted, inject } from "vue";

let elMessage: any = inject("message") as any;

//判断是二维码登录还是手机号登录还是验证码登录还是邮箱登录
let status = ref<string>("");

provide("status", status);

//判断是否登陆了
let userinfo = useUserInformation();

//弹窗显示状态
let popupStatus = usePopupStore();

//打开组件
let changeStatus = (e: Event, key: string) => {
  e.preventDefault();
  status.value = key;
};

onMounted(() => {
  //查看用户信息
  let user_profile = userinfo?.user_profile;
  if (Object.keys(user_profile).length) {
  } else {
  }
});
</script>

<style scoped lang="scss">
.login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login__container {
  position: relative;
  border-radius: 5px;
  background: linear-gradient(45deg, #201a1a, #a5202000);
}

.close {
  font-size: 24px;
  position: absolute;
  right: 4px;
  top: 4px;
  color: #f3caca;
  cursor: pointer;
  z-index: 2;
}

@import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");

* {
  /* 初始化 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* 设置字体 */
  font-family: "Poppins";
}

body {
  /* 100%窗口高度 */
  min-height: 100vh;
  /* 弹性布局 水平+垂直居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #161626;
}

/* 给背景增加两个渐变圆 */
body::before {
  content: "";
  /* 绝对定位 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 渐变背景 */
  background: linear-gradient(#2193b0, #6dd5ed);
  /* 将元素剪切微一个圆形【30%表示圆的直径】【right 70%表示圆心位置】 */
  clip-path: circle(30% at right 70%);
}

body::after {
  content: "";
  /* 绝对定位 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 渐变背景 */
  background: linear-gradient(#ee9ca7, #ffdde1);
  /* 将元素剪切微一个圆形【30%表示圆的直径】【right 70%表示圆心位置】 */
  clip-path: circle(20% at 10% 10%);
}

.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.card-icon {
  color: white;
  position: absolute;
  opacity: 1;
  transition: all 0.25s;

  .iconfont {
    font-size: 60px;
  }
}

.container .card {
  /* 相对定位 */
  position: relative;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 30px;
  border-radius: 15px;
  /* 阴影 */
  box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5);
  /* 溢出隐藏 */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-left: 1px solid rgba(255, 255, 255, 0.5);
  /* 背景模糊 */
  backdrop-filter: blur(5px);
}

.container .card .content {
  padding: 20px;
  text-align: center;
  /* 默认下移+隐藏 */
  transform: translateY(100px);
  opacity: 0;
  transition: 0.5s;
}

.card:hover {
  .card-icon {
    opacity: 0;
  }
}

.card:hover .content {
  /* 鼠标移入，上移+显示 */
  transform: translateY(0);
  opacity: 1;
}

.container .card .content h2 {
  position: absolute;
  top: -80px;
  right: 25px;
  font-size: 128px;
  color: rgba(255, 255, 255, 0.25);
}

.container .card .content h3 {
  font-size: 28px;
  color: #fff;
  margin-top: 50px;
}

.container .card .content p {
  font-size: 16px;
  color: #fff;
  font-weight: 300;
  margin: 10px 0 15px 0;
}

.container .card .content a {
  position: relative;
  display: inline-block;
  padding: 8px 20px;
  margin-top: 15px;
  background-color: #fff;
  color: #000;
  text-decoration: none;
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
