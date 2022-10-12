<template>
  <!--音乐云盘-->
  <div class="music--disk">
    <!--音乐云盘头部 包含标题 容量 按钮-->
    <div class="disk__top">
      <div class="top__title">我的音乐云盘</div>
      <div class="top__size">
        <span>云盘容量</span>
        <span class="size__percent">
          <el-progress :show-text="false" :percentage="percentage" />
          <span>{{ useCloudSize }} / {{ maxCloudSize }}GB</span>
        </span>
        <span>歌曲永久保存，随时随地多端畅听</span>
        <span class="size__dilatancy" @click="skipDilatancy">扩容</span>
      </div>
      <div class="top__btngroup">
        <el-button type="danger" :icon="CaretRight" @click="playAll"
          >播放全部</el-button
        >
        <input
          style="display: none"
          id="file"
          type="file"
          ref="input"
          multiple
          accept=".mp3,.aac,.wma,.wav,.ogg,.m4a,.ape,.flac,.cue"
          @change="uploadCloudSong"
        />
        <el-button
          style="margin-left: 20px"
          :icon="Plus"
          @click="openInputDialog"
          >上传音乐</el-button
        >
        <el-input
          v-model="search"
          style="width: 200px; float: right; margin-right: 25px"
          placeholder="搜索我的音乐云盘"
          :suffix-icon="Search"
        />
      </div>
    </div>
    <div class="disk__table" v-memo="[list]">
      <CustomElementTable
        :list="list"
        :contextMenu="contextMenuMusicDisk"
        :index="true"
        :isShowLabel="true"
        :name="true"
        :download="true"
        :format="true"
        :album="true"
        :size="true"
        :uploadTime="true"
        :artist="true"
        layout="fixed"
        :setOrigin="setOrigin"
        :pageSize="50"
        :total="total"
        :turnPage="turnPage"
      >
        <template #default>
          <div></div>
        </template>
      </CustomElementTable>
    </div>
  </div>
</template>

<script setup lang="ts">
//获取用户云盘资料 上传文件到云盘
import { getUserCloud, uploadSong } from "@/api/api_cloudDisk";
import { CaretRight, Plus, Search } from "@element-plus/icons-vue";

//防抖
import { refDebounced } from "@vueuse/core";

//loading
import { ElLoading, ElNotification } from "element-plus";

//接口声明
import { SongDetailSongsItem } from "i/api/api_song.d";

import emitter from "@/utils/eventBus";

//容量转换
import { diskSize } from "@/utils/filter";
import { play } from "@/utils/play";
import { contextMenuMusicDisk,refreshCallback } from "@/contextMenu/song/musicDisk";

let elMessage = inject("message") as any;
//ref
let input = ref<null | HTMLInputElement>(null);

//搜索
let search = ref<string>("");
provide("search", search);
let debounced = refDebounced(search, 100);

//监听搜索框
watch(debounced, () => {
  let val = debounced.value;
  if (val === "") {
    emitter.emit("search", {
      list: [],
    });
  } else {
    //拷贝一份数据 做修改
    let copyList = list.value;
    copyList = copyList.filter((item) => {
      let result = false;
      //先遍历名称 看看是否包含
      if (item.name.toLowerCase().includes(val.toLowerCase())) {
        result = true;
      }
      //先遍历ar属性（歌手） 看看是否包含
      item.ar.forEach((items) => {
        if (items.name) {
          if (items.name.toLowerCase().includes(val.toLowerCase()))
            result = true;
        }
      });
      //在遍历专辑名称 看看是否包含
      if (item.al.name) {
        if (item.al.name.toLowerCase().includes(val.toLowerCase()))
          result = true;
      }
      return result;
    });
    emitter.emit("search", {
      list: copyList,
    });
  }
});

//列表
let list = ref<SongDetailSongsItem[]>([]);
//total;
let total = ref<number>(0);
//offset
let offset = 0;

//容量（最大容量和目前使用的容量）
let maxCloudSize = ref<string>("");
let useCloudSize = ref<string>("");
//百分比 （使用的/最大）
let percentage = ref<number>(0);
//上传进度条
let downLoadProgress = ref<number>(0);

//获取用户音乐云盘详情
let getUserCloudDiskDetail = async () => {
  try {
    let { maxSize, size, data, count } = await getUserCloud(50, offset);
    //设置云盘总共歌曲数量
    total.value = count;
    //设置偏移量
    offset += data.length;
    //云盘最大容量
    maxCloudSize.value = diskSize(Number(maxSize) * 8, "G").substring(0, 4);
    //云盘目前使用容量
    useCloudSize.value = diskSize(Number(size) * 8, "G").substring(0, 4);
    //求占比
    percentage.value = Number(
      String((Number(useCloudSize.value) / Number(maxCloudSize.value)) * 100)
    );
    //对data进行格式化
    list.value = data.map((item) => {
      //如果云盘文件没有专辑名称
      if (item.simpleSong.al.name === null && item.album) {
        item.simpleSong.al.name = item.album;
      }
      //如果云盘文件没有歌手名称
      if (item.simpleSong.ar[0].name === null && item.artist) {
        item.simpleSong.ar[0].name = item.artist;
      }
      item.simpleSong.from = {
        path: "musicDisk",
        name: "我的音乐云盘",
      };
      item.simpleSong.progress = 0;
      item.simpleSong.sq = item.simpleSong.privilege.dlLevel === "lossless";
      let splices = item.fileName.split(/\./g);
      item.simpleSong.type = splices[splices.length - 1];
      item.simpleSong.addTime = item.addTime;
      item.simpleSong.fileSize = diskSize(item.fileSize * 8, "M").substring(
        0,
        4
      );
      return item.simpleSong;
    });
  } catch (e: any) {
    elMessage.error(e?.message || "请求云盘详情失败 请检查你的网络是否有问题");
  }
};

//设置来源
let setOrigin = (row: SongDetailSongsItem) => {};

//播放全部
let playAll = () => {
  play(list.value, list.value[0].id);
};

//跳转到外部链接
let skipDilatancy = () => {
  let href = "https://music.163.com/#/store/product/detail?id=34001";
  if (window.desktopMainAPI) {
    window.desktopMainAPI.href(href);
  } else {
    window.open(href);
  }
};

//上传音乐到云盘
let uploadCloudSong = async function (e: Event) {
  if (e.target instanceof HTMLInputElement) {
    let promiseArr: Promise<any>[] = [];
    if (!e?.target?.files?.length) return;
    try {
      const loadingService = ElLoading.service({
        lock: true,
        text: `请稍后等待 文件正在上传中`,
        background: "rgba(0, 0, 0, 0.7)",
      });
      Array.from(e.target.files).forEach((item) => {
        promiseArr.push(uploadSong(item, downLoadProgress));
      });
      Promise.allSettled(promiseArr).then((res) => {
        //提取已经上传好的id
        let sondIds: number[] = [];
        let error: Promise<any>[] = [];
        res.forEach((item, index) => {
          if (item.status === "fulfilled") {
            sondIds.push(item.value.privateCloud.songId);
          } else {
            error.push(promiseArr[index]);
          }
        });
        loadingService.close();
        let message;
        if (error.length) {
          message = `已经成功上传了${sondIds.length}个文件${error.length} 其中有${error.length}个文件失败`;
        } else {
          message = `已经成功上传了${sondIds.length}个文件`;
        }
        ElNotification({
          title: "文件上传",
          message,
          type: "success",
        });
        window.downloadAPI.setDownloadSongs(sondIds);
        //更新页面
        getUserCloudDiskDetail();
      });
    } catch (e: any) {
      elMessage.error(e?.message || "上传失败 请重新上传试试");
    }
  }
};

//打开选择窗口
let openInputDialog = () => {
  if (input.value) {
    input.value.click();
  }
};

//翻页
let turnPage = async (page: number) => {
  getUserCloudDiskDetail();
};

getUserCloudDiskDetail();

refreshCallback((id : number) => {
  let index = list.value.findIndex(item => item.id === id)
  if(index !== -1) {
    list.value.splice(index, 1)
  }
})
</script>

<style scoped lang="scss">
//音乐云盘
.music--disk {
  flex: 1;
  overflow-y: scroll;
}

//音乐云盘 头部
.disk__top {
  width: 95%;
  margin-left: 30px;
  margin-top: 20px;
}

//音乐云盘 标题
.top__title {
  font-size: 20px;
  font-weight: bold;
}

//音乐云盘 容量
.top__size {
  display: flex;
  margin-top: 10px;
  align-items: center;
  color: #909399;
}

//容量 进度条
.size__percent {
  margin-left: 10px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  margin-top: 5px;

  .el-progress {
    width: 150px;
  }

  span {
    margin-left: 10px;
  }
}

//扩容
.size__dilatancy {
  margin-left: 10px;
  cursor: pointer;
  text-decoration: none;
  color: rgb(64, 158, 255, 0.7);
}

.size__dilatancy:hover {
  color: rgb(64, 158, 255, 1);
}

//按钮
.top__btngroup {
  margin-top: 20px;
}

//表格
.disk__table {
  margin-top: 20px;
}
</style>
