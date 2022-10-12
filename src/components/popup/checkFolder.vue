<template>
  <el-dialog
    v-model="folderVisible"
    title="选择本地音乐文件夹"
    @close="folderVisible = false"
    width="40%"
    center
  >
    <div>将自动扫描您勾选的目录，文件增删实时同步。</div>
    <el-checkbox-group
      v-model="folder.checkScanFolder"
      style="display: flex; flex-direction: column"
    >
      <el-checkbox
        :label="item"
        v-for="(item, index) in folder.scanFolder"
        :key="index"
      />
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="folderVisible = false">确认</el-button>
        <el-button @click="openFolder">添加文件夹</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { inject } from "vue";

import { useFolder } from "@/store/folder";

//文件夹
let folder = useFolder();

let folderVisible = inject("folderVisible") as Ref<boolean>;

//打开文件夹
let openFolder = async () => {
  let path = await window.folderAPI.openFolder();
  if (!path.length) return;
  folder.setScanFolder(path[0]);
};

watch(
  () => folder.checkScanFolder.length,
  () => {
    window.folderAPI.setUserCheckScanFolder(JSON.stringify(folder.checkScanFolder));
  }
);
</script>

<style></style>
