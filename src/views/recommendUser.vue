<template>
  <!--发现音乐-->
  <div class="recommend--user">
    <!--导航路由-->
    <div class="router--list">
      <ul class="menu">
        <li
          class="menu--item gray"
          :class="menu.active === index ? 'is-active' : ''"
          v-for="(item, index) in menu.list"
          :key="index"
          @click="handlerClick(index, item.key)"
        >
          <span>{{ item.title }}</span>
        </li>
      </ul>
    </div>
    <!--组件-->
    <section class="component-wrap">
      <transition name="el-fade-in-linear">
        <keep-alive>
          <component
            class="component"
            :is="componentMap.list.get(componentMap.key)"
          ></component>
        </keep-alive>
      </transition>
      <div class="toplist">
        <div>{{week.title}}</div>
        <div class="info">更新时间：<span >{{week.updateTime}}</span></div>
        <div class="item" v-for="(item,index) in week.list" :key="item.userId">
          <span>{{index + 1}}</span>
          <span class="single-clamp">{{item.nickname}}</span>
          <el-button :icon="Plus" circle/>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {getDiscoveryTopUserlist} from '@/api/api_recommend'
import { DiscoveryTopUserlistItem } from "i/api/api_recommend";
import { Plus } from "@element-plus/icons-vue";

//路由实例
let route = useRoute();
let router = useRouter();

//这里要用markraw标记异步导入的组件 不然会有warning

//明星
let shallowStar = markRaw(
  defineAsyncComponent(() => import("@/components/recommendUser/stars.vue"))
);
//音乐达人
let shallowTalent = markRaw(
  defineAsyncComponent(() => import("c/recommendUser/talent.vue"))
);
//DJ
let shallowDj = markRaw(
  defineAsyncComponent(() => import("c/recommendUser/dj.vue"))
);
//网易音乐人
let shallowMusician = markRaw(
  defineAsyncComponent(() => import("c/recommendUser/musician.vue"))
);

//菜单
let menu = reactive<{
  active: number;
  list: Array<{
    key: string;
    title: string;
  }>;
}>({
  active: 0,
  list: [
    {
      key: "star",
      title: "明星",
    },
    {
      key: "talent",
      title: "音乐达人",
    },
    {
      key: "dj",
      title: "DJ",
    },
    {
      key: "musician",
      title: "网易音乐人",
    },
  ],
});
//map component
let componentMap = reactive<{
  key: String;
  list: Map<string, any>;
}>({
  key: "star",
  list: new Map(),
});

//周榜数据
let week = reactive<{
  title : string,
  updateTime : string,
  list : DiscoveryTopUserlistItem[]
}>({
  title : '明星用户总榜',
  updateTime: '',
  list : []
})

//根据路由记录匹配组件
let setupComponent = () => {
  if (route.query.component && route.query.index) {
    handleComponent(String(route.query.component), Number(route.query.index));
  }
};

let handleComponent = (key: string, index: number) => {
  if (componentMap.list.get(String(key))) {
    componentMap.key = String(key);
    menu.active = index;
  }
};

watch(
  () => route.query,
  (Query) => {
    if (Query.component && Query.index) {
      handleComponent(String(Query.component), Number(Query.index));
      getWeekList()
    }
  }
);

//设置路由map
let setMap = () => {
  componentMap.list.set("star", shallowStar);
  componentMap.list.set("talent", shallowTalent);
  componentMap.list.set("dj", shallowDj);
  componentMap.list.set("musician", shallowMusician);
};

//打开组件
let handlerClick = (index: number, key: string) => {
  router.push({
    path: "/recommendUser",
    query: {
      component: key,
      index,
    },
  });
};

//请求周榜数据
let getWeekList = async () => {
  try {
    switch(menu.active) {
      case 0 : {
        week.title = '明星用户周榜'
      } ;break;
      case 1 : {
        week.title = '音乐达人周榜'
      } ;break;
      case 2 : {
        week.title = 'DJ周榜'
      } ;break;
      case 3 : {
        week.title = '网易音乐人周榜'
      } ;break;
    }
    let type = menu.active === 3 ? 6 : menu.active + 1
    let {users,updateTime} = await getDiscoveryTopUserlist(type,0,100,-1)
    week.list = users
    week.updateTime = `${new Date(updateTime).getMonth() + 1}月${new Date(updateTime).getDate()}日` 
  } catch (e : any) {
    
  }
}

onMounted(() => {
  setMap();
  setupComponent();
  getWeekList()
});
</script>

<style scoped lang="scss">
.recommend--user {
  margin-left:20px;
}


.component-wrap{
  display:flex;

  .component{
    width : 100%;
    margin-right: 20px;
  }

  .toplist{
    width : 290px;
    display : flex;
    align-items: center;
    flex-direction: column;
    border-left: 1px solid #eee;
    .item {
      display: flex;
      align-items: center;
      margin-top:10px;
      width : 80%;
      justify-content: space-between;
    }
  }
}
</style>
