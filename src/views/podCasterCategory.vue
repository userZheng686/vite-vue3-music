<template>
  <!--播客分区-->
  <div class="podCaster--category">
    <div class="category--title">{{ route.query.name }}</div>
    <div class="category--subTitleList">
      <div
        class="category--subtitle gray"
        v-for="(item, index) in category"
        :key="item.id"
        :class="{ 'category--subtitle__active': index === checkCategory }"
        @click="handleCheckCategory(item, index)"
      >
        {{ item.name }}
      </div>
    </div>
    <el-skeleton :rows="3" animated :loading="loading">
      <!--骨架屏-->
      <template #template>
        <!--分类 列表-->
        <div class="el-skeleton--category--list">
          <!--分类 列表元素-->
          <div
            class="el-skeleton--category--list__item"
            v-for="(item, index) in 10"
            :key="index"
          >
            <!--分类 列表元素 封面-->
            <el-skeleton-item
              variant="image"
              class="el-skeleton--category--list__item__img"
            />
            <!--分类 列表元素 信息-->
            <div class="el-skeleton--category--list__item__info">
              <el-skeleton-item
                variant="image"
                class="el-skeleton--category--list__item__info__text"
              />
              <el-skeleton-item
                variant="image"
                class="el-skeleton--category--list__item__info__text"
              />
              <el-skeleton-item
                variant="image"
                class="el-skeleton--category--list__item__info__text"
              />
            </div>
          </div>
        </div>
      </template>
      <!--内容区域-->
      <template #default>
        <!--无限滚动-->
        <InfiniteList
          :request="computedRequest"
          :hasMore="params.hasMore"
          columns="1fr 1fr"
          rows="1fr 1fr"
        >
          <!--类别列表 元素-->
          <div class="category--list__item" v-for="(item, index) in list" :key="index" 
          @contextmenu="contextMenuDj($event, item)"
          >
            <!--类别列表 元素 封面-->
            <DefaultImage
              :picUrl="item.picUrl"
              :param="133"
              :y="136"
              @click="jumpBroadCastDetail(item.id)"
              class="category--list__item__img"
            />
            <!--类别列表 元素 信息-->
            <div class="category--list__item__info">
              <!--类别列表 元素 信息 名称-->
              <div
                class="category--list__item__info__name single-clamp gray"
                @click="jumpBroadCastDetail(item.id)"
              >
                {{ item.name }}
              </div>
              <!--类别列表 元素 信息 备注-->
              <div
                class="category--list__item__info__name name__gray single-clamp"
                v-title
              >
                {{ item.rcmdtext }}
              </div>
              <!--类别列表 元素 信息 声音 收藏-->
              <div class="category--list__item__info__name name__gray">
                声音：{{ item.programCount }},收藏：{{ item.subCount }}
              </div>
            </div>
          </div>
        </InfiniteList>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { getHotTypeRadio, getRadioBatch, getSecondTypeRadio } from "@/api/api_radio";
import { HotTypeRadioItem, RadioBatchGetItem } from "i/api/api_radio.d";
import {contextMenuDj} from '@/contextMenu/dj/normal'
import { useRoute, useRouter } from "vue-router";
let elMessage: any = inject("message") as any;

//取标题
let titleArr = [
  { title: "创作翻唱", id: 2001 },
  { title: "二次元", id: 3001 },
  { title: "音乐推荐", id: 2 },
  { title: "相声曲艺", id: 3088098 },
  { title: "故事", id: 3080097 },
  { title: "新闻资讯", id: 3087096 },
  { title: "电音", id: 10002 },
  { title: "知识", id: 11 },
  { title: "情感", id: 3 },
  { title: "人文历史", id: 3080098 },
  { title: "脱口秀", id: 8 },
  { title: "娱乐", id: 3083097 },
  { title: "明星专区", id: 14 },
  { title: "生活", id: 6 },
  { title: "有声书", id: 10001 },
  { title: "亲子", id: 13 },
  { title: "广播剧", id: 3088097 },
  { title: "其他", id: 3081098 },
  { title: "文学出版", id: 3148096 },
];

//当前路由对象
let route = useRoute();
let router = useRouter();

/**分类列表 */
let category = ref<
  Array<{
    type: string;
    id: number;
    name: string;
  }>
>([]);
//选择的分类
let checkCategory = ref<number>(0);
//对应分类的列表数据
let list = ref<Array<HotTypeRadioItem>>([]);
//请求的参数
let params = {
  total: 0,
  offset: 0,
  limit: 0,
  id: 0,
  //是否还有更多
  hasMore: true,
};

//计算列表长度
let computedListLength = computed<number>(() => list.value.length);

/**loading */
let loading = ref<boolean>(true);

/**
请求分类（热门分类和二级分类）
然后请求热门分类下面的数据
 */
let getCategoryList = async () => {
  try {
    let {
      "/api/dj/radio/category/second/get": { data: second },
      "/api/djradio/hot": { djRadios: hot, count, hasMore },
    } = await getRadioBatch(
      {
        cateId: Number(route.query.id),
        limit: 30,
        offset: 0,
      },
      {
        categoryId: Number(route.query.id),
      }
    );
    //填充热门分类
    category.value.push({
      type: "hot",
      id: Number(route.query.id),
      name: "热门",
    });
    //二级分类
    for (let i = 0; i < second.length; i++) {
      category.value.push({
        type: "second",
        id: second[i].id,
        name: second[i].name,
      });
    }
    //设置当前的列表数据为热门分类的数据
    list.value = hot.slice(0, 30);
    //更新参数
    params.hasMore = hasMore;
    params.offset += list.value.length;
    params.id = Number(route.query.id);
    params.total = count;
    params.limit = list.value.length;
    setTimeout(() => {
      loading.value = false;
    }, 100);
  } catch (e: any) {
    elMessage.error(e?.message || "请求列表失败 请检查你的网络是否有问题?");
  }
};

//请求热门分类的列表
let getHotCategoryList = async () => {
  try {
    let { djRadios, hasMore } = await getHotTypeRadio(
      params.limit,
      params.offset,
      params.id
    );
    if (djRadios.length) {
      list.value.push(...djRadios);
      params.offset += 30;
    }
    params.hasMore = hasMore;
  } catch (e: any) {
  } finally {
    //关闭loading
    setTimeout(() => {
      loading.value = false;
    }, 100);
  }
};

//请求二级分类
let getSecondCategoryList = async () => {
  try {
    let {
      data: { list: secondList, hasMore },
    } = await getSecondTypeRadio(params.id, params.limit, params.offset, "true");
    //设置当前的列表数据为二级分类的数据
    if (secondList.length) {
      list.value.push(...secondList);
      params.offset += 30;
    }
    params.hasMore = hasMore;
  } catch (e: any) {
  } finally {
    //关闭loading
    setTimeout(() => {
      loading.value = false;
    }, 100);
  }
};

//根据当前的分类（热门还是二级）自动选择加载请求的函数
let computedRequest = computed(() => {
  if (category.value[checkCategory.value]?.type === "hot") {
    return getHotCategoryList;
  } else {
    return getSecondCategoryList;
  }
});

//选中分类
let handleCheckCategory = async (
  item: { type: string; id: number; name: string },
  index: number
) => {
  try {
    checkCategory.value = index;
    //初始化之前的参数
    params.offset = 0;
    params.total = 0;
    params.limit = 30;
    params.id = category.value[checkCategory.value].id;
    //清空列表
    list.value = [];
    loading.value = true;
    //判断是热门分类还是二级分类
    if (item.type === "hot") {
      getHotCategoryList();
    } else {
      getSecondCategoryList();
    }
  } catch (e: any) {}
};

//跳转到播客详情
let jumpBroadCastDetail = (id: number | undefined | null) => {
  if (id) {
    router.push({
      path: "/broadCastDetail",
      query: { id },
    });
  }
};

onActivated(() => {
  //打开页面的时候 重置部分数据
  category.value = [];
  list.value = [];
  checkCategory.value = 0;
  getCategoryList();
});
</script>

<style lang="scss" scoped>
/**灰色 */
.name__gray {
  color: rgb(114 113 114);
}

/**样式复用 */
@mixin list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 30px;
  margin-top: 20px;
}

@mixin list__item {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  height: 133px;
}

@mixin list__item__img {
  width: 133px !important;
  height: 133px !important;
}

@mixin list__item__info {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 10px;
  align-items: flex-start;
  justify-content: center;
  height: 133px;
}

@mixin list__item__info__name {
  width: 200px;
  height: 20px;
  margin-bottom: 15px;
}

/**播客分区 */
.podCaster--category {
  flex: 1;
  margin-left: 30px;
  text-align: left;
}
/**播客分区 标题 */
.category--title {
  font-size: 24px;
  font-weight: 700;
  margin-top: 20px;
}

/**播客分区 类别列表 */
.category--subTitleList {
  display: flex;
  align-items: center;
}

/**播客分区 副标题 */
.category--subtitle {
  border-radius: 8px;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-right: 10px;
}

/**播客分区 副标题 激活 */
.category--subtitle__active {
  color: rgb(254, 141, 158) !important;
  background-color: rgb(254, 248, 250);
}

/**骨架屏 */
/**类别 列表 */
.el-skeleton--category--list {
  @include list;
}
/**类别 列表元素 */
.el-skeleton--category--list__item {
  @include list__item;
}
/**类别 列表元素 封面 */
.el-skeleton--category--list__item__img {
  @include list__item__img;
}
/**类别 列表元素 信息 */
.el-skeleton--category--list__item__info {
  @include list__item__info;
}
/**类别 列表元素 信息 文本 */
.el-skeleton--category--list__item__info__text {
  @include list__item__info__name;
}

/**列表区域 */
.category--list {
  @include list;
}

/**列表区域 元素 */
.category--list__item {
  @include list__item;
}

/**列表区域 元素 封面 */
.category--list__item__img {
  @include list__item__img;
}
/**列表区域 元素  信息*/
.category--list__item__info {
  @include list__item__info;
}
/**列表区域 元素 信息 名字 */
.category--list__item__info__name {
  @include list__item__info__name;
}
</style>
