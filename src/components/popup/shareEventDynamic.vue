<template>
  <!--转发的弹窗 因为接口不支持图片 所以不做-->
  <el-dialog
    v-model="sharePopup.childShareEventWindowShow"
    title="分享"
    width="30%"
    center
    custom-class="event--dialog"
    destroy-on-close
    :modal="false"
    :lock-scroll="false"
  >
    <!--输入框 主要是用户输入的文字-->
    <el-input
      v-model="sharePopup.content"
      :rows="2"
      class="textarea"
      type="textarea"
      :autosize="true"
      resize="none"
      :maxlength="140"
      show-word-limit
      @keyup="enterEvUp($event)"
      @keydown="enterEv($event as KeyboardEvent)"
      placeholder="一起聊聊音乐吧~"
      :input-style="{
        borderRadius: '4px 4px 0px 0px',
      }"
    />
    <!--表情 at 话题-->
    <div class="share--btn">
      <BtnIcon />
    </div>
    <el-button
      type="danger"
      round
      :icon="Plus"
      class="add"
      v-if="!isShowSearch"
      @click="isShowSearch = !isShowSearch"
      >给动态配上音乐</el-button
    >
    <div class="search" v-if="isShowSearch">
      <el-input
        @keyup.enter="searchResult"
        :prefix-icon="Search"
        v-if="!shareResource.img"
        v-model="searchParam.keywords"
        placeholder="单曲 / 歌手 / 专辑 / 歌单 / 播客"
      ></el-input>
      <el-tabs
        v-model="activeName"
        v-if="!shareResource.img"
        class="demo-tabs"
        @tab-click="handleClick"
        :stretch="true"
      >
        <el-tab-pane label="单曲" name="song">
          <section class="search--result">
            <div
              class="result--list"
              v-for="item in searchParam.songList"
              :key="item.id"
              @click="handleSong(item)"
            >
              <div class="list__item single-clamp">{{ item.name }}</div>
              <div class="list__item single-clamp">
                <span v-for="(items, index) in item.ar" :key="items.id">
                  <span>{{ index > 0 ? " / " : "" }}</span>
                  <span class="info">{{ items.name }}</span>
                </span>
              </div>
            </div>
          </section>
        </el-tab-pane>
        <el-tab-pane label="歌手" name="artist">
          <section class="search--result">
            <div
              class="result--list"
              v-for="item in searchParam.artistList"
              :key="item.id"
              @click="handleArtist(item)"
            >
              <div class="list__item single-clamp">
                <img
                  :src="item.img1v1Url"
                  alt="avatar"
                  width="40"
                  height="40"
                />
              </div>
              <div class="list__item single-clamp info">
                {{ item.name }}
              </div>
            </div>
          </section>
        </el-tab-pane>
        <el-tab-pane label="专辑" name="album">
          <section class="search--result">
            <div
              class="result--list"
              v-for="item in searchParam.albumList"
              :key="item.id"
              @click="handleAlbum(item)"
            >
              <div class="list__item single-clamp">
                <img
                  :src="item.blurPicUrl"
                  alt="avatar"
                  width="40"
                  height="40"
                />
              </div>
              <div class="list__item single-clamp">
                {{ item.name }}
              </div>
              <div class="list__item single-clamp">
                <span v-for="(items, index) in item.artists" :key="items.id">
                  <span>{{ index > 0 ? " / " : "" }}</span>
                  <span class="info">{{ items.name }}</span>
                </span>
              </div>
            </div>
          </section>
        </el-tab-pane>
        <el-tab-pane label="歌单" name="playlist">
          <section class="search--result">
            <div
              class="result--list"
              v-for="item in searchParam.playList"
              :key="item.id"
              @click="handlePlaylist(item)"
            >
              <div class="list__item single-clamp">
                <img
                  :src="item.coverImgUrl"
                  alt="avatar"
                  width="40"
                  height="40"
                />
              </div>
              <div class="list__item single-clamp">
                {{ item.name }}
              </div>
              <div class="list__item single-clamp info">
                by {{ item.creator.nickname }}
              </div>
            </div>
          </section>
        </el-tab-pane>
        <el-tab-pane label="播客" name="dj">
          <section class="search--result">
            <div
              class="result--list"
              v-for="item in searchParam.radioList"
              :key="item.id"
              @click="handleRadio(item)"
            >
              <div class="flex single-clamp">
                <img
                  :src="item.picUrl.replace(/http/, 'https')"
                  alt="avatar"
                  width="40"
                  height="40"
                />
              </div>
              <div class="flex single-clamp">
                <span class="info--flag">播客</span>
                <span class="single-clamp">{{ item.name }}</span>
              </div>
              <div class="flex single-clamp info">
                by {{ item.dj.nickname }}
              </div>
            </div>
          </section>
        </el-tab-pane>
      </el-tabs>
      <div class="share--source" v-if="shareResource.img">
        <!--这里用inject注入依赖 内容由外部的组件决定 然后接受就祖组件的注入-->
        <!--左中右结构 左边是图片 中间来源名 右边是文案-->
        <div class="source--img">
          <DefaultImage
            :picUrl="shareResource.img"
            :param="28"
            loadingWidth="14"
            loadingHeight="14"
            :y="28"
            style="width: 28px; height: 28px"
          />
        </div>
        <div class="source--name single-clamp">
          {{ shareResource.type + ":" + shareResource.name }}
        </div>
        <div style="margin-left: 10px" class="info" v-if="shareResource.name">
          -
        </div>
        <div class="source--artist single-clamp">
          {{ shareResource.artists.join(" / ") }}
        </div>
      </div>
    </div>
    <!--footer-->
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="cancelMusic" v-if="isShowSearch"
          >取消音乐</el-button
        >
        <el-button @click="sharePopup.closeChildShareEvent">关闭</el-button>
        <el-button
          type="primary"
          @click="shareCloud"
          :disabled="shareResource.id === 0"
          >分享</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getSearch } from "@/api/api_search";
import { useSharePopupStore } from "@/store/sharePopup";
import { Plus, Search } from "@element-plus/icons-vue";
import { TabsPaneContext } from "element-plus";
import { ArtistItem } from "i/api/api_artist";
import { Album } from "i/api/api_album";
import { SongDetailSongsItem } from "i/api/api_song";
import { playlist } from "i/api/api_playList";
import { Radio } from "i/api/api_radio";
import { getShareResource } from "@/api/api_share";
import { loginCallback } from "@/utils/login";

let sharePopup = useSharePopupStore();
//是否展示搜索框
let isShowSearch = ref<boolean>(false);
//展示的tab
let activeName = ref<string>("song");
//搜索参数
let searchParam = reactive<{
  keywords: string;
  type: number;
  songList: SongDetailSongsItem[];
  artistList: ArtistItem[];
  albumList: Album[];
  playList: playlist[];
  radioList: Radio[];
}>({
  keywords: "",
  type: 1,
  songList: [],
  artistList: [],
  albumList: [],
  playList: [],
  radioList: [],
});
//分享的资源
let shareResource = reactive<{
  id: number;
  img: string;
  type: string;
  shareType: string;
  name: string;
  artists: string[];
}>({
  id: 0,
  img: "",
  type: "",
  shareType: "",
  name: "",
  artists: [],
});
let elMessage: any = inject("message") as any;

//计算样式
let computedSourceType = computed(() => {
  if (sharePopup.childSpaceWindowSource === "noresource") return "share--reply";
});

//监听键盘
let enterEvUp = (e: KeyboardEvent) => {
  if (sharePopup.shareContent[sharePopup.shareContent.length - 1] === "@") {
    sharePopup.shareAt = true;
  } else {
    sharePopup.shareAt = false;
  }
  if (sharePopup.shareContent[sharePopup.shareContent.length - 1] === "#") {
    sharePopup.shareTopic = true;
  } else {
    sharePopup.shareTopic = false;
  }
};

//监听键盘输入事件
let enterEv = (e: KeyboardEvent) => {
  const { keyCode, code } = e;
  const isAtCode =
    ((keyCode === 229 && e.key === "@") ||
      (keyCode === 229 && e.code === "Digit2") ||
      keyCode === 50) &&
    e.shiftKey;
  const isTopicCode =
    ((keyCode === 229 && e.key === "#") ||
      (keyCode === 229 && e.code === "Digit3") ||
      keyCode === 50) &&
    e.shiftKey;
  if (isAtCode) sharePopup.shareAt = true;
  else {
    if (sharePopup.shareContent[sharePopup.shareContent.length - 1] === "@") {
      sharePopup.shareAt = true;
    } else {
      sharePopup.shareAt = false;
    }
  }
  if (isTopicCode) sharePopup.shareTopic = true;
  else {
    if (sharePopup.shareContent[sharePopup.shareContent.length - 1] === "#") {
      sharePopup.shareTopic = true;
    } else {
      sharePopup.shareTopic = false;
    }
  }
};

//分享到动态
let shareCloud = () => {
  loginCallback(async () => {
    try {
      let { code } = await getShareResource(
        shareResource.id,
        shareResource.shareType,
        sharePopup.content
      );
      if (code === 200) {
        elMessage.success("分享成功");
        //执行回调事件
        sharePopup.childShareEventWindowCallback();
      }
    } catch (e: any) {
      elMessage.error(e?.message || "分享失败 请检查你的网络是否有问题?");
    } finally {
      sharePopup.closeChildShareEvent();
    }
  });
};

//取消音乐
let cancelMusic = () => {
  isShowSearch.value = false;
  shareResource.id = 0;
  shareResource.img = "";
  shareResource.type = "";
  shareResource.shareType = "";
  shareResource.name = "";
  shareResource.artists = [];
};

//打开tab
let handleClick = (tab: TabsPaneContext, event: Event) => {
  switch (tab.index) {
    case "0":
      {
        searchParam.type = 1;
      }
      break;
    case "1":
      {
        searchParam.type = 100;
      }
      break;
    case "2":
      {
        searchParam.type = 10;
      }
      break;
    case "3":
      {
        searchParam.type = 1000;
      }
      break;
    case "4":
      {
        searchParam.type = 1009;
      }
      break;
  }
  searchResult();
};

//搜索
let searchResult = async () => {
  try {
    let {
      result: { songs, artists, albums, playlists, djRadios },
    } = await getSearch(searchParam.keywords, searchParam.type, 100, 0);
    if (songs) {
      searchParam.songList = songs;
    }
    if (artists) {
      searchParam.artistList = artists;
    }
    if (albums) {
      searchParam.albumList = albums;
    }
    if (playlists) {
      searchParam.playList = playlists;
    }
    if (djRadios) {
      searchParam.radioList = djRadios;
    }
  } catch (e: any) {}
};

//选择单曲
let handleSong = (item: SongDetailSongsItem) => {
  shareResource.id = Number(item.id);
  shareResource.img = item.al.picUrl;
  shareResource.type = "单曲";
  shareResource.shareType = "song";
  shareResource.name = item.name;
  shareResource.artists = item.ar.map((item) => item.name);
};

//选择歌手
let handleArtist = (item: ArtistItem) => {
  shareResource.id = Number(item.id);
  shareResource.img = item.img1v1Url;
  shareResource.type = "歌手";
  shareResource.shareType = "artist";
  shareResource.name = "";
  shareResource.artists = [item.name];
};

//选择专辑
let handleAlbum = (item: Album) => {
  shareResource.id = Number(item.id);
  shareResource.img = item.blurPicUrl;
  shareResource.type = "专辑";
  shareResource.shareType = "album";
  shareResource.name = item.name;
  shareResource.artists = item.artists.map((artist) => artist.name);
};

//选择专辑
let handlePlaylist = (item: playlist) => {
  shareResource.id = Number(item.id);
  shareResource.img = item.coverImgUrl;
  shareResource.type = "歌单";
  shareResource.shareType = "playlist";
  shareResource.name = item.name;
  shareResource.artists = [item.creator.nickname];
};

//选择播客
let handleRadio = (item: Radio) => {
  shareResource.id = Number(item.id);
  shareResource.img = item.picUrl;
  shareResource.type = "播客";
  shareResource.shareType = "djradio";
  shareResource.name = item.name;
  shareResource.artists = [item.dj.nickname];
};
</script>

<style lang="scss">
.event--dialog {
  .el-dialog__body {
    padding-bottom: 0px;
  }
}
</style>

<style scoped lang="scss">
@mixin container {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  padding: 5px 11px;
}

//文本
.textarea {
  :deep(.el-textarea__inner) {
    border-right: 1px solid var(--el-input-border-color, var(--el-border-color));
    box-shadow: 1px 1px 1px 0
      var(--el-input-border-color, var(--el-border-color)) inset;
  }

  :deep(.el-input__count) {
    bottom: -22px;
  }
}

//分享 表情 at 话题
.share--btn {
  /* @include container; */
  padding: 5px 11px;
  border: 1px solid var(--el-input-border-color, var(--el-border-color));
  border-top: 0;
  height: 20px;
}

//分享的来源 有歌曲 MV 评论 等
.share--source {
  @include container;
  display: flex;
  align-items: center;
}

//封面
.source--img {
  margin-right: 5px;
}

//内容
.source--content {
  flex: 1;
}

.source--artist {
  margin-left: 10px;
}

//评论转发别人
.share--reply {
  color: rgb(80, 125, 175, 1);
}

.add {
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search--result {
  max-height: 200px;
  overflow-y: scroll;
}

.result--list {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  height: 45px;
  .list__item {
    flex: 1;
    margin-right: 10px;
  }

  .flex {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &:nth-child(even) {
    background-color: var(--dark-item-backgroundOdd, rgb(250, 250, 250));
  }
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(241, 242, 243));
  }
}
</style>
