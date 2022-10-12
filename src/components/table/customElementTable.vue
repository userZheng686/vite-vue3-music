<template>
  <!--element table封装-->
  <div class="custom--table" ref="table">
    <el-table
      :data="computedList"
      :cell-class-name="cellClassName"
      row-key="id"
      :table-layout="props.layout"
      @row-dblclick="dbClick"
      @row-contextmenu="contextmenu"
      :show-header="props.isShowLabel"
    >
      <el-table-column width="50" v-if="props.index">
        <template #default="scope">
          <div>
            <span
              class="el-table__column__info"
              v-if="computedCurrentSongIsInTablePlayStatus(scope.row.id) === 'no-play'"
              >{{
                scope.row?.serialNum && props?.isShowSerialNum
                  ? scope.row.serialNum
                  : scope.$index + 1
              }}</span
            >
            <i
              class="iconfont icon-24gl-volumeHigh"
              style="color: #f56c6c"
              v-if="computedCurrentSongIsInTablePlayStatus(scope.row.id) === 'play'"
            ></i>
            <i
              class="iconfont icon-24gl-volumeZero"
              style="color: #f56c6c"
              v-else-if="computedCurrentSongIsInTablePlayStatus(scope.row.id) === 'pause'"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        :label="props.operateLabel ? '操作' : ''"
        v-if="props.operate"
      >
        <template #default="scope">
          <CustomTableOperate
            :item="scope.row"
            :songMenu="userInfo.songMenu"
            :likes="userInfo.likes"
            :updateLikes="updateLikes"
          />
          <CustomTableDownload
            style="margin-left: 5px"
            :item="scope.row"
            :downloadIds="download.completeDownloadSongsIds"
          />
        </template>
      </el-table-column>
      <el-table-column width="25" label="" v-if="props.download">
        <template #default="scope">
          <CustomTableDownload
            :item="scope.row"
            :downloadIds="download.completeDownloadSongsIds"
          />
        </template>
      </el-table-column>
      <el-table-column label="音乐标题" v-if="props.name" min-width="240">
        <template #default="scope">
          <CustomTableName :item="scope.row" :nameMaxWidth="props.nameMaxWidth" />
        </template>
      </el-table-column>
      <el-table-column label="歌手" v-if="props.artist">
        <template #default="scope">
          <CustomTableArtist :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="专辑" v-if="props.album">
        <template #default="scope">
          <CustomTableAlbum :item="scope.row" :jumpAlbumDetail="jumpAlbumDetail" />
        </template>
      </el-table-column>
      <el-table-column label="格式" v-if="props.format">
        <template #default="scope">
          <CustomTableFormat :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="大小" v-if="props.size">
        <template #default="scope">
          <CustomTableSize :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="来源" v-if="props.origin">
        <template #default="scope">
          <CustomTableOrigin :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        sortable
        :sort-method="sortMethod"
        v-if="props.uploadTime"
      >
        <template #default="scope">
          <CustomTableUploadTime :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column width="80" label="时长" v-if="props.duration">
        <template #default="scope">
          <CustomTableDuration :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="热度" v-if="props.heat">
        <template #default="scope">
          <CustomTableHeat :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="播放时间" v-if="props.recentlyPlayed">
        <template #default="scope">
          <CustomTableRecentlyPlayed :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="下载时间" v-if="props.downloadTime">
        <template #default="scope">
          <CustomTableDownloadTime :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="播放次数" v-if="props.playCount">
        <template #default="scope">
          <div class="info">{{ scope.row.playCount }}次</div>
        </template>
      </el-table-column>
      <el-table-column label="歌词" v-if="props.lyric">
        <template #default="scope">
          <div class="more-clamp2 info" :title="scope.row.lyrics.join('\n')">
            <div v-for="item in scope.row.lyrics" :key="item" v-html="item"></div>
          </div>
          <el-button type="danger" round size="small" @click="copyLyric(scope.row.lyrics)"
            >复制歌词</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
        <!--歌曲列表-->
        <div v-if="filterList.length === 0 && search">
          未能找到与"<span class="blue">{{ search }}</span
          >"相关的任何音乐
        </div>
        <slot name="default"></slot>
      </template>
    </el-table>
    <div v-if="isPc" style="margin-top: 10px" class="el-table__column__info__auto">
      标有<i class="iconfont icon-yunpan"></i>的音乐是我的云盘文件，其他用户无法查看
    </div>
    <!--分页-->
    <div class="page" v-if="computedTotal">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="props.pageSize"
        :pager-count="9"
        :hide-on-single-page="computedTotal <= props.pageSize"
        layout="prev, pager, next"
        :total="computedTotal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRouter } from "vue-router";
//导入store里面的playList 主要是播放音乐 添加到列表里面 到时候播放器会自动取值
import { useSongStore } from "@/store/playList";
//导入user store里面的数据 主要用来判断是否是喜欢的音乐 收藏等等
import { useUserInformation } from "@/store/user";
//下载的所有歌曲
import { useDownload } from "@/store/download";
//检查音乐是否可用
import { getSongStatus } from "@/api/api_song";

//播放方法
import { play } from "@/utils/play";

//mitt
import emitter from "@/utils/eventBus";

//接口声明
//此定义主要用于父组件list声明
//SongDetailSongsItem 最基础的歌曲声明
//currentPlayList 当前播放列表（扩展SongDetailSongsItem）
import { SongDetailSongsItem } from "i/api/api_song.d";
import { Column, ElLoading, ElMessage } from "element-plus";
import { useClipboard } from "@vueuse/core";

//layout 对应table的layout
//isShowLabel 是否展示el-table-column的label(标题)
//index 索引
//operate 操作的意思 喜欢
//operateLabel label是否展示
//download 下载 在云盘体现
//name 标题 包含歌曲名称 别名 tns(这个不知道是什么意思) MV SQ
//nameMaxWidth 名字最大宽度 用于限制样式
//artist 作者 包含别名
//album 专辑
//format 格式 音乐格式
//size 大小 音乐大小
//origin 来源 当前播放列表里面的 点进去会跳转到不同的页面
//uploadTime 上传时间
//duration 时长
//heat 热度
//recentlyPlayed 最近播放(时间)
//downloadTime 下载时间
//setOrigin 设置来源
//row ： 单行还是双行
//pageSize ： 每页数量
//total 数据总数
//turnPage 翻页
//contextMenu 右键菜单
//isShowSerialNum 是否展示序列号
//playCount 播放次数
//isSearchPage 是否是搜索页

const table = ref<null | HTMLElement>(null);

interface Props {
  layout?: string;
  list: SongDetailSongsItem[];
  isShowLabel: boolean;
  index: boolean;
  operate?: boolean;
  operateLabel?: boolean;
  download?: boolean;
  name?: boolean;
  nameMaxWidth?: string;
  artist?: boolean;
  album?: boolean;
  format?: boolean;
  size?: boolean;
  origin?: boolean;
  uploadTime?: boolean;
  duration?: boolean;
  heat?: boolean;
  recentlyPlayed?: boolean;
  downloadTime?: boolean;
  setOrigin?: Function;
  row?: string;
  pageSize: number;
  total: number;
  turnPage?: Function;
  contextMenu?: Function;
  isShowSerialNum?: boolean;
  playCount?: boolean;
  isSearchPage?: boolean;
  lyric?: boolean;
}

let props = withDefaults(defineProps<Props>(), {
  layout: "fixed",
  isShowLabel: true,
  operate: false,
  operateLabel: false,
  download: false,
  name: false,
  nameMaxWidth: "12vw",
  artist: false,
  album: false,
  format: false,
  size: false,
  origin: false,
  uploadTime: false,
  duration: false,
  heat: false,
  recentlyPlayed: false,
  downloadTime: false,
  setOrigin: () => {},
  row: "odd",
  isShowSerialNum: false,
  playCount: false,
  isSearchPage: false,
  lyric: false,
});

let filterList = ref<SongDetailSongsItem[]>([]);
//是否已经搜索过了
let isSearch = false;
//搜索
let search = inject("search") as Ref<string>;

let router = useRouter();
//歌曲列表
let songList = useSongStore();
//用户信息
let userInfo = useUserInformation();
//下载
let download = useDownload();
//当前页数
let currentPage = ref<number>(1);
//是否包含云盘
let isPc = ref<boolean>(false);
//是否展开歌曲详情
let isSongDetailVisible = inject("songDetailVisible") as Ref<boolean>;

//复制粘贴
const source = ref("Hello");
const { text, copy, copied, isSupported } = useClipboard({ source });

//如果搜索了 那就计算符合搜索条件的total
let computedTotal = computed(() => {
  if (search.value && !props.isSearchPage) {
    return computedList.value.length;
  } else {
    return props.total;
  }
});

//监听翻页事件
watch(currentPage, async function (page: number) {
  filterList.value = [];
  isSearch = false;
  const elLoading = ElLoading.service({
    lock: false,
    text: "加载列表中... 请稍后",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    if (props.turnPage) {
      props.turnPage(page);
    }
  } catch (e: any) {
    ElMessage.error(e?.message || "请求失败 ");
  } finally {
    elLoading.close();
  }
});

//右键菜单
let contextmenu = (row: SongDetailSongsItem, column: Column, event: Event) => {
  props.contextMenu && props.contextMenu(event, row, column.getColumnIndex());
};

//双击
let dbClick = async (row: SongDetailSongsItem) => {
  //判断是否是VIP歌曲
  // if(row.fee === 1 && row?.from?.path !== "本地") {
  //    ElMessage.warning("当前歌曲为vip");
  //    return;
  // }
  // //判断是否有版权  如果没有就提示无版权 播放不了
  // if (row.noCopyrightRcmd && row?.from?.path !== "本地") {
  //   ElMessage.warning("当前歌曲暂无版权");
  //   return;
  // }
  if (typeof row.id === "number" && row?.from?.path !== "本地") {
    // try {
    //   let res = await getSongStatus(row.id);
    //   if (!res.success) {
    //     row.noCopyrightRcmd = true;
    //     ElMessage.warning("当前歌曲暂无版权");
    //   }
    // } catch (e) {
    //   row.noCopyrightRcmd = true;
    //   ElMessage.warning("当前歌曲暂无版权");
    //   return;
    // }
  }
  //调用播放方法
  play(computedList.value, row.id);
  //这里接受父组件定义的办法 对row进行一层封装
  props.setOrigin(row);
  //重新打开歌曲详情
  if (isSongDetailVisible.value === true) {
    isSongDetailVisible.value = false;
    nextTick(() => {
      isSongDetailVisible.value = true;
    });
  }
};

//首先先设置索引位置居中 然后单/双行颜色背景
let cellClassName = ({
  columnIndex,
  rowIndex,
}: {
  columnIndex: number;
  rowIndex: number;
}) => {
  let cellstyle = "el-table__set__row__normalheight ";
  if (columnIndex === 0) {
    cellstyle += "el-table__column__center ";
  }

  if (props.row === "odd") {
    if (rowIndex % 2 === 0) {
      cellstyle += "el-table__set__row_bgColor ";
    }
  } else {
    if (rowIndex % 2 !== 0) {
      cellstyle += "el-table__set__row_bgColor ";
    }
  }

  return cellstyle;
};

//判断当前播放的歌曲 是否表格里面也有相同的歌曲?是否正在播放 暂停 没有播放?
let computedCurrentSongIsInTablePlayStatus = computed(() => {
  return function (id: number) {
    if (songList.list[songList.currentListIndex]?.id === id) {
      if (songList.list[songList.currentListIndex]?.status === "play") {
        return "play";
      } else if (songList.list[songList.currentListIndex]?.status === "pause") {
        return "pause";
      }
    } else {
      return "no-play";
    }
  };
});

//排序方法
let sortMethod = (a: number, b: number) => {
  return a - b;
};

//侦听搜索
emitter.on("search", (val: any) => {
  isSearch = true;
  filterList.value = val.list;
});

//判断是否是喜欢的音乐
let isLike = () => {
  props.list.forEach((item) => {
    if (userInfo.likes.includes(Number(item.id))) {
      item.like = true;
    } else {
      item.like = false;
    }
  });
};

//自动取列表数据
let computedList = computed(() => {
  if ((filterList.value?.length || isSearch) && search.value) {
    isIncludeCloud(filterList.value);
    return filterList.value;
  } else if (props?.list?.length) {
    isLike();
    isDownloadComplete();
    isIncludeCloud(props.list);
    return props.list;
  } else {
    isPc.value = false;
    return [];
  }
});

//是否是已经下载好的文件
let isDownloadComplete = () => {
  props.list.forEach((item) => {
    let index = download.completeDownloadSongItem.findIndex(
      (items) => items.id === item.id
    );
    if (index !== -1) {
      Object.assign(item, download.completeDownloadSongItem[index]);
    }
  });
};

//是否包含云盘文件
let isIncludeCloud = (list: SongDetailSongsItem[]) => {
  let res = false;
  for (let i = 0; i < list.length; i++) {
    if (list[i].pc) {
      res = true;
      break;
    }
  }
  isPc.value = res;
};

//更改 是否是喜欢的音乐
let updateLikes = (id: number) => {
  userInfo.updateUserLikeIds(id);
};

//跳转专辑详情
let jumpAlbumDetail = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};

//拷贝歌词
let copyLyric = (lyrics: string[]) => {
  let newLyrics: string[] = [];
  lyrics.forEach((item) => {
    item = item.replace('<span class="s-fc2">', "");
    item = item.replace("</span>", "");
    newLyrics.push(item);
  });
  source.value = newLyrics.join("\n");
  console.log("source", source.value);
  copy();
  ElMessage.success("复制成功");
};
</script>

<style scoped lang="scss">
.custom--table {
  /* overflow-y: scroll; */
  touch-action: none;
  content-visibility: auto;
}

:deep(.cell) {
  padding: 0;
}

.lyric {
  display: flex;
  flex-direction: column;
}
</style>
