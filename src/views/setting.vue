<template>
  <section class="section">
    <aside>
      <ul v-for="item in menu" :key="item.title">
        <li @click="openMenu(item)" :class="check === item.title ? 'active' : ''">
          {{ item.title }}
        </li>
      </ul>
    </aside>
    <main>
      <h1 id="shortcut">常规</h1>
      <el-divider />
      <h1 id="shortcut">快捷键</h1>
      <el-divider />
      <h1 id="download">
        下载设置 <span style="font-size: 12px">默认将该音乐文件下载在该文件中</span>
      </h1>
      <p>
        下载目录：{{ download.songDir }}
        <el-button round style="margin-left: 20px" @click="openFolder"
          >更改目录</el-button
        >
      </p>
      <el-divider />
      <h1 id="update">版本更新</h1>
      <p>{{ currentVersion }}</p>
      <el-button round @click="checkUpdate">检查更新</el-button>
      <el-divider />
      <h1 id="about">关于网易云音乐</h1>
      <section>
        <span @click="open(item.href)" v-for="item in about" :key="item.title"
          >《{{ item.title }}》</span
        >
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { version, releaseNotes } from "@/localStorage/init";

//歌曲声音MV下载
import { useDownload } from "@/store/download";

let download = useDownload();

let currentVersion = ref<string>("");

let elMessage = inject("message") as any;

let menu: Array<{
  title: string;
  id: string;
}> = [
  {
    title: "常规",
    id: "normal",
  },
  {
    title: "快捷键",
    id: "shortcut",
  },
  {
    title: "下载设置",
    id: "download",
  },
  {
    title: "版本更新",
    id: "update",
  },
  {
    title: "关于网易云音乐",
    id: "about",
  },
];

let about = [
  {
    title: "网易云音乐官网",
    href: "https://music.163.com/",
  },
  {
    title: "网易云音乐社区管理规则",
    href: "https://music.163.com/static/guideline.html",
  },
  {
    title: "服务条款",
    href: "https://st.music.163.com/official-terms/service",
  },
  {
    title: "隐私政策",
    href: "https://st.music.163.com/official-terms/privacy",
  },
  {
    title: "儿童隐私政策",
    href: "https://st.music.163.com/official-terms/children",
  },
];

let check = ref<string>("常规");

let isNativeApp = window.desktopUpdateAPI ? true : false;

let openMenu = ({ title, id }: { title: string; id: string }) => {
  check.value = title;
  document.getElementById(id)?.scrollIntoView();
};

if (isNativeApp) {
  window.desktopUpdateAPI.message((val: string) => {
    let { type, text } = JSON.parse(val);
    switch (type) {
      case "needUpdate":
        {
          let { version: version1, releaseNotes: releaseNotes1 } = JSON.parse(text);
          version.value = version1;
          releaseNotes.value = releaseNotes1;
          window.desktopUpdateAPI.show();
        }
        break;
      case "version":
        {
          currentVersion.value = text;
        }
        break;
      case "updateChecking":
        {
          elMessage.warning(text);
        }
        break;
      case "notUpdate":
        {
          elMessage.error(text);
        }
        break;
    }
  });

  //检测版本号
  window.desktopUpdateAPI.checkAppVersion();
}

//检查更新
let checkUpdate = () => {
  if (isNativeApp) {
    window.desktopUpdateAPI.checkForUpdate();
  }
};

//打开链接
let open = (href: string) => {
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(href);
  } else {
    window.open(href);
  }
};

//打开文件夹
let openFolder = async () => {
  let path = await window.folderAPI.openFolder("选择下载的存储目录");
  if (!path.length) return;
  download.songDir = path[0];
  window.downloadAPI.setDownloadPath(path[0]);
};
</script>

<style scoped lang="scss">
ul {
  list-style: none;
  li {
    padding: 10px;
    border-radius: 8px;

    transition: all 0.2s;
    &:hover {
      background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
    }

    cursor: pointer;
  }

  .active {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}

.section {
  display: flex;

  justify-content: space-between;

  aside {
    width: 15%;
  }

  main {
    flex: 1;
    padding-left: 10%;

    section {
      span {
        text-decoration: underline;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
