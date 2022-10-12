<template>
  <div class="update--detaile">
    <div class="title">编辑歌单信息</div>
    <div class="edit">
      <div class="edit--left">
        <div class="edit--item">
          <span class="item__left">歌单名：</span>
          <el-input
            v-model="detail.name"
            style="width: 422px"
            placeholder="请输入歌单名"
          />
        </div>
        <div class="edit--item" style="height: 20px">
          <span class="item__left">标签：</span>
          <el-tag v-for="tag in checkCategoryName" :key="tag" class="mr-1" type="info">
            {{ tag }}
          </el-tag>
          <span
            class="blue"
            style="margin-left: 10px"
            @click="dialogSongMenuCategoryVisible = true"
            >添加标签</span
          >
        </div>
        <div class="edit--item">
          <span class="item__left">简介：</span>
          <el-input
            style="width: 422px"
            v-model="detail.description"
            :rows="2"
            type="textarea"
            :maxlength="1000"
            placeholder="请输入简介"
          />
        </div>
        <div class="edit--item">
          <span class="item__left"></span>
          <el-button type="danger" @click="updateSongMenuDetail">保存</el-button>
          <el-button
            @click="
              router.push({
                path: '/songMenuDetail',
                query: {
                  id: route.query.id,
                },
              })
            "
            >取消</el-button
          >
        </div>
      </div>
      <div class="edit--right">
        <DefaultImage
          :picUrl="detail.coverImgUrl"
          :param="240"
          :y="240"
          loadingHeight="120px"
          loadingWidth="120px"
          style="
            height: 240px;
            width: 240px;
            overflow: hidden;
            border: 1px solid #eee;
            border-radius: 8px;
          "
        />
        <el-button style="margin-top: 20px" @click="updateCover">编辑封面</el-button>
        <input
          alt=""
          accept="image/*"
          id="file"
          style="display: none"
          type="file"
          @change="choseImg"
        />
      </div>
    </div>
  </div>
  <EditSongMenuCategory :songMenuCategoryList="songMenuCategoryList" />
</template>

<script setup lang="ts">
import {
  getSongMenuDetail,
  getEditSongMenuCategory,
  updatePlaylist,
} from "@/api/api_playList";
import { uploadPlaylistCover } from "@/utils/request";
import { playlist, EditSongMenuCategoryItem } from "i/api/api_playList.d";
import { useRoute, useRouter } from "vue-router";
let route = useRoute();
let router = useRouter();
let textarea = ref<string>("");
let elMessage: any = inject("message") as any;
//歌单标签
let songMenuCategoryList = ref<
  Array<{
    title: string;
    list: EditSongMenuCategoryItem[];
  }>
>([]);
let detail = reactive<{
  tags: string[];
  name: string;
  id: number;
  description: string;
  coverImgUrl: string;
}>({
  tags: [],
  name: "",
  id: 0,
  description: "",
  coverImgUrl: "",
});
//歌单标签弹窗
let dialogSongMenuCategoryVisible = ref<boolean>(false);
provide("dialogVisible", dialogSongMenuCategoryVisible);
//选中的歌单标签名称
let checkCategoryName = ref<string[]>([]);
provide("checkCategory", checkCategoryName);

watch(
  () => route.query,
  (val) => {
    getSongMenuDetailInfo(Number(val.id));
  }
);

//获取歌单详情
let getSongMenuDetailInfo = async (id: number) => {
  try {
    let { playlist } = await getSongMenuDetail(id);
    Object.assign(detail, playlist);
    if (playlist?.tags?.length) {
      checkCategoryName.value = playlist.tags;
    }
  } catch (e: any) {}
};

//获取添加歌单标签
let getEditCategory = async () => {
  try {
    let { categories, tags } = await getEditSongMenuCategory();
    for (let [k, v] of Object.entries(categories)) {
      songMenuCategoryList.value.push({
        title: v,
        list: tags.filter((item) => item.category === Number(k)),
      });
    }
  } catch (e: any) {
    elMessage.error(e?.message || "获取歌单标签失败 请检查你的网络是否有问题");
  }
};

//更新歌单详情
let updateSongMenuDetail = async () => {
  try {
    let res = await updatePlaylist(
      Number(detail.id),
      detail.name,
      detail.description,
      checkCategoryName.value.join(";")
    );
    detail.tags = checkCategoryName.value;
    elMessage.success("修改成功");
  } catch (e: any) {
    elMessage.error(e?.message || "更新歌单失败 请检查你的网络是否有问题");
  }
};

//更新歌单封面
let updateCover = () => {
  let file: null | HTMLInputElement = document.querySelector("#file");
  if (file) {
    file.click();
  }
};

//选择图片
let choseImg = async function (e: Event) {
  if (e.target instanceof HTMLInputElement) {
    if (e.target.files?.length) {
      let file = e.target.files[0];
      console.log("file", file);
      e.target.value = "";
      try {
        let res = await uploadPlaylistCover(detail.id, file);
        detail.coverImgUrl = res.data.url;
        elMessage.success("更新成功");
      } catch (e: any) {
        elMessage.error(e.message || "更新失败");
      }
    }
  }
};

getEditCategory();

onActivated(() => {
  getSongMenuDetailInfo(Number(route.query.id));
});
</script>

<style scoped lang="scss">
.update--detaile {
  margin-left: 30px;
  margin-top: 20px;
  width: 50%;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.edit {
  display: flex;
}

.edit--left {
}

.edit--right {
  width: 30%;
  padding-top: 20px;
  margin-left: 30px;
}

.edit--item {
  display: flex;
  align-items: center;
  margin-top: 20px;
  line-height: 18px;
}

.item__left {
  width: 60px;
}

:deep(.el-textarea__inner) {
  height: 150px;
  resize: none;
}

.mr-1 {
  margin-right: 5px;
}
</style>
