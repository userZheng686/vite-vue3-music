<template>
  <div class="update--dialog" ref="desktop">
    <p>发现新版本 v{{ version }}</p>
    <dl>
      <dt v-for="item in releaseNotes.split(' ')" :key="item">{{ item }}</dt>
    </dl>
    <span v-if="updateProgress">当前进度：</span>
    <el-progress
      :indeterminate="true"
      :percentage="updateProgress"
      style="width: 170px"
      :text-inside="true"
      :stroke-width="20"
      v-if="updateProgress"
      :status="updateProgress === 100 ? 'success' : ''"
    />
    <div style="display: flex; align-items: center" v-if="!updateProgress">
      <el-button round @click="notUpdate">暂不更新</el-button>
      <el-button round type="danger" @click="update">立即更新</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { version, releaseNotes } from "@/localStorage/init";

const desktop = ref<null | HTMLElement>(null);

let elMessage = inject("message") as any;

let updateProgress = ref<number>(0);

let initDrag = async function () {
  let { width, height } = await window.desktopMiniAPI.getBounds();
  let biasX = 0;
  let biasY = 0;

  const moveEvent = (e: MouseEvent) => {
    window.desktopUpdateAPI.setBounds({
      x: e.screenX - biasX,
      y: e.screenY - biasY,
      width,
      height,
    });
  };

  if (desktop.value) {
    desktop.value.addEventListener("mousedown", async function (e) {
      let { width: width1, height: height1 } = await window.desktopUpdateAPI.getBounds();
      width = width1;
      height = height1;
      switch (e.button) {
        case 0:
          biasX = e.x;
          biasY = e.y;
          desktop.value.addEventListener("mousemove", moveEvent);
          break;
        case 2:
          break;
      }
    });

    desktop.value.addEventListener("mouseup", (e) => {
      biasX = 0;
      biasY = 0;
      desktop.value.removeEventListener("mousemove", moveEvent);
    });
    desktop.value.addEventListener("mouseleave", (e) => {
      biasX = 0;
      biasY = 0;
      desktop.value.removeEventListener("mousemove", moveEvent);
    });
  }
};

window.desktopUpdateAPI.message2((val: string) => {
  let { type, text } = JSON.parse(val);
  console.log("text", text);
  switch (type) {
    case "progress":
      {
        updateProgress.value = Number(Number(text).toFixed(2));
        console.log("updateProgress.value", updateProgress.value);
      }
      break;
    case "downloaded":
      {
        elMessage.success(text);
        window.desktopUpdateAPI.quitAndInstall();
      }
      break;
  }
});

//不更新
let notUpdate = () => {
  window.desktopUpdateAPI.hide();
};

//更新
let update = () => {
  //   updateProgress.value = 50;
  window.desktopUpdateAPI.downloadUpdate();
};

onMounted(() => {
  initDrag();
});
</script>

<style lang="scss">
body {
  min-width: auto;
  min-height: auto;
  overflow: hidden;
}

body::-webkit-scrollbar {
  display: none;
}

.update--dialog {
  height: 300px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 50px;
  background: #f8f8f8 url(../assets/image/loginBg.jpg) top center/contain no-repeat;

  > p {
    font-weight: bold;
  }

  > dl {
    margin: 15px;
  }

  > div {
    margin-top: 10px;
  }
}
</style>
