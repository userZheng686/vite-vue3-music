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
      <h1 id="shortcut">快捷键</h1>
      <el-divider />
      <h1 id="update">版本更新</h1>
      <p>{{ version }}</p>
      <el-button round @click="checkUpdate">检查更新</el-button>
    </main>
  </section>
</template>

<script setup lang="ts">
let elMessage = inject("message") as any;

let menu: Array<{
  title: string;
  id: string;
}> = [
  {
    title: "快捷键",
    id: "shortcut",
  },
  {
    title: "版本更新",
    id: "update",
  },
];

let check = ref<string>("快捷键");

let version = ref<string>("");

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
          window.desktopUpdateAPI.show();
        }
        break;
      case "version":
        {
          version.value = text;
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
  }
}
</style>
