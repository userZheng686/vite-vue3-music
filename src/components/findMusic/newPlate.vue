<template>
  <!--导航栏 标签 按钮-->
  <div class="newPlate--nav">
    <!--标签-->
    <div class="newPlate--nav--tag">
      <span
        class="gray"
        @click="handleClickTag('area', item.name, item.val)"
        v-for="(item, index) in tags"
        :key="index"
        :class="checkTag === item.name ? 'newPlate--nav--tag--active' : ''"
        >{{ item.name }}</span
      >
    </div>
    <!--按钮-->
    <div class="newPlate--nav--btn">
      <el-button
        v-for="item in tagBtns"
        :key="item.id"
        :type="switchTagBtnName === item.name ? 'danger' : ''"
        @click="handleClickTag('type', item.name, item.val)"
        text
        >{{ item.name }}</el-button
      >
    </div>
  </div>
  <!--列表-->
  <div class="newPlate--listWrap">
    <!--固钉-->
    <div class="newPlate--affix">本周新碟</div>
    <!--骨架屏-->
    <el-skeleton :rows="1" animated :loading="isLoading">
      <!--骨架屏-->
      <template #template>
        <!--列表-->
        <div class="el-skeleton--newPlate--list">
          <!--列表元素-->
          <div
            class="el-skeleton--newPlate--list__item"
            v-for="(item, index) in 20"
            :key="index"
          >
            <!--封面-->
            <el-skeleton-item
              class="el-skeleton--newPlate--list__item__img"
              variant="image"
            />
            <!--作品名称-->
            <el-skeleton-item
              variant="text"
              class="el-skeleton--newPlate--list__item__name"
            />
            <!--作者 歌手-->
            <el-skeleton-item
              variant="text"
              class="el-skeleton--newPlate--list__item__author"
            />
          </div>
        </div>
      </template>
      <!--内容区域-->
      <template #default>
        <!--无限滚动-->
        <InfiniteList
          :request="handleInfiteQueryList"
          :hasMore="form.hasMore"
          rows=" "
          customClass="custom--list"
        >
          <!--列表元素-->
          <div
            class="newPlate--list__item"
            v-for="(item, index) in form.result"
            :key="index"
            @contextmenu="contextMenuAlbum($event, item)"
          >
            <!--封面-->
            <PlayImage
              :picUrl="item.blurPicUrl"
              :param="200"
              :cursor="true"
              :y="200"
              @click="jumpAlbum(item.id)"
            />
            <!--作品名-->
            <div class="newPlate--list__item__name more-clamp2" v-title>
              <span class="gray" @click="jumpAlbum(item.id)">{{ item.name }}</span>
              <span class="info" v-if="item.alias.length"
                >({{ item.alias?.join("") }})</span
              >
            </div>
            <!--作者-->
            <div class="newPlate--list__item__author single-clamp" v-title>
              <span
                class="ml2"
                v-for="(items, index) in item.artists"
                :key="items.id"
              >
                <span>{{ index > 0 ? " / " : "" }}</span>
                <span
                  class="gray"
                  @click="jumpArtists(items.id)"
                >{{items.name}}</span>
              </span>
            </div>
          </div>
        </InfiniteList>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, inject } from "vue";
import { getTopAlbum } from "@/api/api_album";
import { TopAlbumItem } from "i/api/api_album.d";
import { contextMenuAlbum } from "@/contextMenu/album/normal";
import {useRouter} from "vue-router";

let elMessage: any = inject("message") as any;
let router = useRouter();
//菜单标签列表
let tags: Array<{
  id: number;
  name: string;
  val: string;
}> = [
  { id: 1, name: "全部", val: "ALL" },
  { id: 2, name: "华语", val: "ZH" },
  { id: 3, name: "欧美", val: "EA" },
  { id: 4, name: "韩国", val: "KR" },
  { id: 5, name: "日本", val: "JP" },
];

//菜单按钮列表
let tagBtns: Array<{
  id: number;
  name: string;
  val: string;
}> = [
  {
    id: 1,
    name: "推荐",
    val: "new",
  },
  {
    id: 2,
    name: "全部",
    val: "hot",
  },
];

//选中的菜单标签
let checkTag = ref<string>("全部");
//选中的菜单按钮
let switchTagBtnName = ref<string>("推荐");
//loading
let isLoading = ref<boolean>(true);

//map定义
interface map {
  [propname: string]: any;
}

//map 标签 按钮
let mapTag: map = {
  area: checkTag,
  type: switchTagBtnName,
};

//查询条件
let form = reactive<{
  limit: number;
  offset: number;
  area: string;
  type: string;
  result: Array<TopAlbumItem>;
  hasMore: boolean;
  [propname: string]: any;
}>({
  limit: 50,
  offset: 0,
  area: "ALL",
  type: "hot",
  //页面
  result: [],
  hasMore: true,
});

//总数据
let queryRes = reactive<Array<TopAlbumItem>>([]);

//处理菜单标签点击事件
let handleClickTag = (key: string, name: string, val: string) => {
  mapTag[key].value = name;
  form[key] = val;
  isLoading.value = true;
  queryRes.length = 0;
  form.result.length = 0;
  form.offset = 0;
  getAlbumList();
};

//请求专辑列表
let getAlbumList = async () => {
  try {
    let res = await getTopAlbum(form.limit, form.offset, form.area, form.type);
    //先将返回的结果装到form.queryRes上  这样以后就不用发请求了 直接取里面的数据就可以了
    //先判断有月数据还是周数据 周数据优先
    if (res.weekData) {
      queryRes.push(...res.weekData);
    } else {
      queryRes.push(...res.monthData);
    }

    //先取里面的三十个数据 然后更新limit
    form.result.push(...queryRes.slice(0, 30));
    //更新limit
    form.offset += 30;
    form.hasMore = res.hasMore;
    if (isLoading.value) {
      setTimeout(() => {
        isLoading.value = false;
      }, 100);
    }
  } catch (e: any) {
    elMessage.error(e?.message || "请求专辑列表失败 请检查你的网络是否有问题?");
  }
};

//用于加载后续的无限滚动列表事件
let handleInfiteQueryList = () => {
  try {
    //先记录上一次的offset
    let oldOffset = form.offset;

    //更新offset
    //先判断offset是否 小于 30 ?
    if (queryRes.length - form.result.length < 20) {
      form.offset += queryRes.length - form.result.length;
    } else {
      form.offset += 20;
    }

    //取数据
    form.result.push(...queryRes.slice(oldOffset, form.offset));
  } catch (e: any) {
    elMessage.error(e?.message || "发生了错误！");
  }
};

//跳转到歌手页
let jumpArtists = (id: number) => {
  if (!id) return;
  router.push({
    path: "/artists",
    query: {
      type: 1,
      id,
    },
  });
};

//跳转
let jumpAlbum = (id: number) => {
  router.push({
    path: "/albumDetail",
    query: {
      id,
    },
  });
};

onMounted(() => {
  getAlbumList();
});
</script>

<style scoped lang="scss">
/**样式复用 */
//列表
@mixin list {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 15px;
}

//列表 作品名
@mixin list__item__name {
  height: 40px;
  margin-top: 10px;
  text-align: left;
}

//列表 作者
@mixin list__item__author {
  height: 20px;
  margin-top: 10px;
  font-size: 12px;
  text-align: left;
}

/**导航栏 */
.newPlate--nav {
  display: flex;
  align-items: center;
}

/**导航栏标签 */
.newPlate--nav--tag {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/**导航栏标签 激活 */
.newPlate--nav--tag--active {
  color: #676767 !important;
  font-weight: 700;
}

/**导航栏按钮 */
.newPlate--nav--btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: end;
}

/**导航栏标签 激活 */
.newPlate--nav--tag--active {
  color: #676767 !important;
  font-weight: 700;
}

/**新碟列表 */
.newPlate--list {
  @include list;
}

/**新碟列表 元素 */
.newPlate--list__item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/**新碟列表 元素 作品名字 */
.newPlate--list__item__name {
  @include list__item__name;
}

/**新碟列表 元素 作者 */
.newPlate--list__item__author {
  @include list__item__author;
  font-size: 12px;
}

/**骨架屏 */
//列表外层
.newPlate--listWrap {
  margin-top: 20px;
}

/**固钉*/
.newPlate--affix {
  margin-right: 10px;
  font-size: 20px;
  word-wrap: break-word;
  width: 25px;
  float: left;
  position: sticky;
  top: 0;
}

:deep(.custom--list) {
  float: right;
  width: 94%;
}

/*列表*/
.el-skeleton--newPlate--list {
  @include list;
}

/**列表元素 */
.el-skeleton--newPlate--list__item {
  display: flex;
  flex-direction: column;
}

/**列表元素 封面 */
.el-skeleton--newPlate--list__item__img {
  width: 100%;
  height: 200px;
}

/**列表元素 作品名称 */
.el-skeleton--newPlate--list__item__name {
  @include list__item__name;
}

/**列表元素 歌手 */
.el-skeleton--newPlate--list__item__author {
  @include list__item__author;
}
</style>
