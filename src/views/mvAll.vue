<template>
  <!--全部MV-->
  <div class="mv--all">
    <!--标题-->
    <div class="all__title">全部MV</div>
    <!--类别-->
    <div class="all__category">
      <!--地区-->
      <div class="category__wrap">
        <div class="category__title">地区：</div>
        <!--地区分类-->
        <div class="category__list">
          <el-tag
            style="cursor: pointer; transition: all 0.2s; margin-right: 15px"
            @click="handlerClick('area', item)"
            round
            :effect="area === item ? 'dark' : 'plain'"
            :type="area === item ? 'danger' : ''"
            v-for="(item, index) in areaList"
            :key="index"
            >{{ item }}</el-tag
          >
        </div>
      </div>
      <!--类型-->
      <div class="category__wrap">
        <div class="category__title">类型：</div>
        <!--类型分类-->
        <div class="category__list">
          <el-tag
            style="cursor: pointer; transition: all 0.2s; margin-right: 15px"
            @click="handlerClick('type', item)"
            round
            :effect="type === item ? 'dark' : 'plain'"
            :type="type === item ? 'danger' : ''"
            v-for="(item, index) in typeList"
            :key="index"
            >{{ item }}</el-tag
          >
        </div>
      </div>
      <!--排序-->
      <div class="category__wrap">
        <div class="category__title">排序：</div>
        <!--排序分类-->
        <div class="category__list">
          <el-tag
            style="cursor: pointer; transition: all 0.2s; margin-right: 15px"
            @click="handlerClick('order', item)"
            round
            :effect="order === item ? 'dark' : 'plain'"
            :type="order === item ? 'danger' : ''"
            v-for="(item, index) in orderList"
            :key="index"
            >{{ item }}</el-tag
          >
        </div>
      </div>
    </div>
    <!--列表-->
    <el-skeleton :rows="3" animated :loading="mvList.isLoading">
      <!--骨架屏-->
      <template #template>
        <!--视频列表-->
        <div class="el-skeleton--video--list">
          <!--视频列表 元素-->
          <div
            class="el-skeleton--video--list__item"
            v-for="(item, index) in 12"
            :key="index"
          >
            <!--视频列表 元素 封面 标题 作者-->
            <el-skeleton-item
              variant="image"
              class="el-skeleton--video--list__item__img"
            />
            <el-skeleton-item
              class="el-skeleton--video--list__item__name"
              style="height: 20px"
              variant="text"
            />
            <el-skeleton-item
              class="el-skeleton--video--list__item__name"
              style="height: 20px"
              variant="text"
            />
          </div>
        </div>
      </template>
      <!--内容区域-->
      <template #default>
        <div class="mv--list">
          <InfiniteList
            :request="getMvList"
            :hasMore="mvList.hasMore"
            columns="1fr 1fr 1fr 1fr"
          >
            <MvListItem
              v-for="(item) in mvList.list"
              :key="item.id"
              :item="item"
              :isShowAuthor="true"
              titleClass="single-clamp"
              paddingBottom="50%"
              :contextMenu="contextMenuMVList"
            />
          </InfiniteList>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { getAllMv } from "@/api/api_mv";
import { NewMvItem } from "i/api/api_mv.d";
import {contextMenuMVList} from '@/contextMenu/mv/normal'

let elMessage = inject("message") as any;

//路由实例
let route = useRoute();

//地区列表
let areaList = ["全部", "内地", "港台", "欧美", "日本", "韩国"];
//类型列表
let typeList = ["全部", "官方版", "原声", "现场版", "网易出品"];
//排序列表
let orderList = ["上升最快", "最热", "最新"];
//最新地区分类
let area = ref<string>("内地");
let type = ref<string>("全部");
let order = ref<string>("上升最快");
//分页
let offset = 0;

//mv列表
let mvList = reactive<{
  list: NewMvItem[];
  count: number;
  isLoading: boolean;
  hasMore: boolean;
}>({
  list: [],
  count: 0,
  isLoading: true,
  hasMore: true,
});

//监听url改变
watch(
  () => route.query,
  (toQuery) => {
    toQuery;
    if (toQuery.area) {
      area.value = String(toQuery.area);
    }
    if (toQuery.type) {
      type.value = String(toQuery.type);
    }
    if (toQuery.order) {
      order.value = String(toQuery.order);
    }
  }
);

//根据url初始化配置
let setupListenerRoute = () => {
  if (route.query.area) {
    area.value = String(route.query.area);
  }
  if (route.query.type) {
    type.value = String(route.query.type);
  }
  if (route.query.order) {
    order.value = String(route.query.order);
  }
};

//处理地区分类点击事件
let handlerClick = (types: string, item: string) => {
  if (types === "area") {
    if (area.value === item) return;
    area.value = item;
  } else if (types === "type") {
    if (type.value === item) return;
    type.value = item;
  } else {
    if (order.value === item) return;
    order.value = item;
  }

  mvList.isLoading = true;
  offset = 0;
  mvList.list = [];
  getMvList();
};

//获取mv列表
let getMvList = async () => {
  try {
    let { data, count, hasMore } = await getAllMv(
      area.value,
      type.value,
      order.value,
      20,
      offset
    );
    mvList.hasMore = hasMore;
    //这里拿总数量减去数组里面的数量 来判断是否请求完毕
    if (mvList.count) {
      let total = mvList.count - mvList.list.length;
      //如果total大于20 那么就继续请求
      //如果小于20  那么下次请求就已经完毕了
      if (total >= 20) {
        offset += 20;
      } else {
        offset += total;
      }
    } else {
      if (count > 20) {
        offset += 20;
      } else {
        offset += count;
      }
    }
    //更新count
    if (count) {
      mvList.count = count;
    }
    mvList.list.push(...data);
    if (mvList.isLoading) {
      setTimeout(() => {
        mvList.isLoading = false;
      }, 100);
    }
  } catch (e: any) {
    elMessage.error(e?.message || "请求MV列表出错 请检查你的网络是否有问题?");
  }
};

setupListenerRoute();
getMvList();
</script>

<style scoped lang="scss">
/**样式复用 */
@mixin list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  row-gap: 10px;
}

@mixin list__item {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

@mixin list__item__img {
  width: 100%;
  height: 200px;
}

@mixin list__item__name {
  height: 20px;
  margin-top: 10px;
}

//全部MV
.mv--all {
  max-width: 1200px;
  width: 90%;
  margin: auto;
}
//标题
.all__title {
  font-size: 24px;
  margin-top: 20px;
}
//分类
.all__category {
  margin-top: 20px;
}
//分类外层
.category__wrap {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
//分类列表
.category__list {
  width: 20%;
  display: flex;

  margin-left: 10px;
}

//mv列表
.mv--list {
  margin-top: 20px;
}

/**骨架屏 */
/**视频列表 */
.el-skeleton--video--list {
  @include list;
}

/**视频列表元素 */
.el-skeleton--video--list__item {
  @include list__item;
}

/**视频列表封面 */
.el-skeleton--video--list__item__img {
  @include list__item__img;
}
/**视频列表元素 标题 作者  */
.el-skeleton--video--list__item__name {
  @include list__item__name;
}
</style>
