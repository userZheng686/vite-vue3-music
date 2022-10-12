<template>
  <!--歌手-->
  <div class="artist">
    <!--歌手标签选择-->
    <div class="artist--selectTag">
      <!--语种-->
      <div class="artist--selectTag__language">
        <div class="artist--selectTag--title">语种:</div>
        <div class="artist--selectTag--list">
          <span
            class="artist--selectTag--list__item gray"
            v-for="(item, index) in languageTag"
            :key="index"
            @click="handleQueryList('languageTagClick', index, 'language', item.val)"
            :class="
              index === languageTagClick ? 'artist--selectTag--list__item--active' : ''
            "
            >{{ item.key }}</span
          >
        </div>
      </div>
      <!--分类-->
      <div class="artist--selectTag__type">
        <div class="artist--selectTag--title">分类:</div>
        <div class="artist--selectTag--list">
          <span
            class="artist--selectTag--list__item gray"
            v-for="(item, index) in typeTag"
            @click="handleQueryList('typeTagClick', index, 'type', item.val)"
            :key="index"
            :class="index === typeTagClick ? 'artist--selectTag--list__item--active' : ''"
            >{{ item.key }}</span
          >
        </div>
      </div>
      <!--筛选-->
      <div class="artist--selectTag__letters">
        <div class="artist--selectTag--title" style="align-self: flex-start">筛选:</div>
        <div
          class="artist--selectTag--list"
          style="flex-wrap: wrap; align-items: flex-start"
        >
          <span
            class="artist--selectTag--list__item gray"
            @click="handleQueryList('letterTagClick', index, 'letter', item)"
            :class="
              index === letterTagClick ? 'artist--selectTag--list__item--active' : ''
            "
            v-for="(item, index) in lettersTag"
            :key="index"
            >{{ item }}</span
          >
        </div>
      </div>
    </div>
    <!--列表-->
    <el-skeleton :rows="5" animated :loading="form.isLoading">
      <!--骨架屏-->
      <template #template>
        <!--歌手 列表-->
        <div class="el-skeleton--artist--list">
          <div
            class="el-skeleton--artist--list__item"
            v-for="(item, index) in 20"
            :key="index"
          >
            <!--歌手 封面-->
            <el-skeleton-item
              variant="image"
              class="el-skeleton--artist--list__item__img"
            />
            <!--歌手 名称-->
            <el-skeleton-item
              variant="text"
              class="el-skeleton--artist--list__item__name"
            />
          </div>
        </div>
      </template>
      <!--内容-->
      <template #default>
        <!--无限滚动-->
        <InfiniteList
          :request="getArtistList"
          :hasMore="form.hasMore"
          columns="1fr 1fr 1fr 1fr 1fr 1fr"
        >
          <div
            class="artist--list__item"
            v-for="item in form.list"
            :key="item.id"
            @contextmenu="contextMenuArtist($event, item)"
          >
            <!--封面-->
            <DefaultImage
              :picUrl="item.img1v1Url"
              :param="200"
              :lazy="false"
              :y="200"
              class="artist--list__item__img"
              @click="jumpArtistHomePage(item.id)"
            />
            <!--名字-->
            <div class="artist--list__item__name">
              <span class="gray" @click="jumpArtistHomePage(item.id)">{{
                item.name
              }}</span>
              <div
                @click="jumpUserHomePage(item.accountId)"
                class="artist--list__item__name__user"
                v-if="item.accountId"
              >
                <el-icon>
                  <User />
                </el-icon>
              </div>
            </div>
          </div>
        </InfiniteList>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { getArtist } from "@/api/api_artist";
import { ArtistItem } from "i/api/api_artist.d";
import { contextMenuArtist } from "@/contextMenu/artist/normal";
import { User } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

let router = useRouter();

let elMessage: any = inject("message") as any;

//歌手标签
interface tagItem {
  key: string;
  val: number;
}

//歌手标签列表 语种 分类 筛选
let languageTag: tagItem[] = [
  { key: "全部", val: -1 },
  { key: "华语", val: 7 },
  { key: "欧美", val: 96 },
  { key: "日本", val: 8 },
  { key: "韩国", val: 16 },
  { key: "其他", val: 0 },
];
let typeTag: tagItem[] = [
  { key: "全部", val: -1 },
  { key: "男歌手", val: 1 },
  { key: "女歌手", val: 2 },
  { key: "乐队", val: 3 },
];
//分类标签 根据字母来分类
let lettersTag: string[] = [
  "热门",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "#",
];

//歌手标签 选中状态
let languageTagClick = ref<number>(0);
let typeTagClick = ref<number>(0);
let letterTagClick = ref<number>(0);

//map类型定义
interface map {
  [key: string]: any;
}

//map 转换 用来判断是否重复了
let mapTagClick: map = {
  languageTagClick,
  typeTagClick,
  letterTagClick,
};

//选取歌手
let form = reactive<{
  language: number;
  type: number;
  letter: string;
  offset: number;
  list: Array<ArtistItem>;
  hasMore: boolean;
  isLoading: boolean;
  [propname: string]: any;
}>({
  language: -1,
  type: -1,
  letter: "",
  offset: 0,
  list: [],
  hasMore: true,
  isLoading: true,
});

//请求歌手分类列表
let getArtistList = async () => {
  try {
    let res = await getArtist(30, form.offset, form.letter, form.type, form.language);
    form.offset += 30;
    if (res.artists.length) {
      form.list.push(...res.artists);
    }
    form.hasMore = res.more;
    if (form.isLoading) {
      setTimeout(() => {
        form.isLoading = false;
      }, 100);
    }
  } catch (e: any) {
    elMessage.error(e?.message || "请求歌手分类列表失败 请检查你的网络是否有问题?");
  }
};

//处理点击
//type 对应mapTagClick
//index 对应索引
//key 对应form里面的key
//val 值
let handleQueryList = (
  type: string,
  index: number,
  key: string,
  val: number | string
) => {
  if (mapTagClick[type].value === index) return;
  else mapTagClick[type].value = index;
  if (val === "热门") val = -1;
  if (val === "#") val = 0;
  form[key] = val;
  form.list = [];
  form.offset = 0;
  form.isLoading = true;
  getArtistList();
};

//跳转到用户空间页面
let jumpUserHomePage = (id: number) => {
  router.push({
    path: "/homePage",
    query: {
      id,
    },
  });
};

//跳转到歌手页
let jumpArtistHomePage = (id: number) => {
  router.push({
    path: "/artists",
    query: {
      id,
    },
  });
};

onMounted(() => {
  getArtistList();
});
</script>

<style scoped lang="scss">
//复用样式
/**骨架屏 列表*/
@mixin list {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 15px;
}

/**骨架屏 列表元素*/
@mixin list__item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/**骨架屏幕 封面 */
@mixin list__item__img {
  width: 100%;
  height: 240px !important;
}

/**骨架屏幕 名字 */
@mixin list__item__name {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  text-align: left;
}

/**骨架屏 列表*/
.el-skeleton--artist--list {
  @include list;
}

/**骨架屏 列表元素*/
.el-skeleton--artist--list__item {
  @include list__item;
}

/**骨架屏幕 封面 */
.el-skeleton--artist--list__item__img {
  @include list__item__img;
}

/**骨架屏幕 名字 */
.el-skeleton--artist--list__item__name {
  @include list__item__name;
}

//歌手
.artist {
  display: flex;
  flex-direction: column;
  text-align: center;
}

//歌手 标签选择
.artist--selectTag {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

//歌手 标签选择 语种 分类 筛选
.artist--selectTag__language,
.artist--selectTag__type,
.artist--selectTag__letters {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  line-height: 18px;
}

//歌手 标签选择 标题
.artist--selectTag--title {
  width: 10%;
  text-align: left;
  height: 30px;
  display: flex;
  align-items: center;
}

//歌手 标签选择 列表
.artist--selectTag--list {
  display: flex;
  flex: 1;
  align-items: flex-start;
}

//歌手 标签选择 列表元素
.artist--selectTag--list__item {
  margin-right: 40px;
  width: 60px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

//歌手 标签选择 列表元素 选中状态
.artist--selectTag--list__item--active {
  color: rgba(254, 141, 158) !important;
  background-color: rgba(254, 248, 250);
  border-radius: 8px;
}

//歌手列表 元素
.artist--list__item {
  @include list__item;
}

//歌手列表元素 封面
.artist--list__item__img {
  /* @include list__item__img; */
  /* height: 240px; */
  width: 100%;
}

//歌手列表元素 名字
.artist--list__item__name {
  @include list__item__name;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

//歌手列表元素 图标
.artist--list__item__name__user {
  background-color: red;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
