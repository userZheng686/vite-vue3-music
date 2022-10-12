<template>
  <!--播客首页面-->
  <div class="pod--caster">
    <el-skeleton :rows="3" animated :loading="isLoading">
      <!--骨架屏-->
      <template #template>
        <el-skeleton-item variant="image" class="el-skeleton--routerImg" />
      </template>
      <template #default>
        <div class="pod--caster--top">
          <div class="top--FM">
            <PodCasterListFM />
          </div>
          <div class="top--container">
            <el-carousel
              trigger="click"
              :autoplay="false"
              class="el-carousel--routerList"
              height="170px"
              @change="carouselChange"
            >
              <el-carousel-item v-for="item in routerListPage" :key="item">
                <!--路由导航-->
                <div class="router--list">
                  <!--列表子元素-->
                  <div
                    class="router--list__item"
                    v-for="item in routerList"
                    :key="item.id"
                    @click="handleClick(item.id, item.name)"
                  >
                    <!--图标 因为返回的列表数据是图片形式-->
                    <el-image
                      style="width: 30px; height: 30px"
                      :src="
                        item.pic56x56Url.replace(/http$/, 'https') +
                        '?param=' +
                        50 +
                        'y' +
                        50
                      "
                      fit="fill"
                    />
                    <!--图标名字-->
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </template>
    </el-skeleton>
    <!--播客列表 列表-->
    <section
      class="pod--caster--section"
      :key="index"
      v-for="(item, index) in computedListLength"
    >
      <section
        v-if="
          radioList[index]?.showType === 'VOICE_HOMEPAGE_FIXED_VOICELIST' ||
          radioList[index]?.showType === 'VOICE_HOMEPAGE_RCMDLIKE_VOICELIST'
        "
      >
        <PodCasterListWidthWise
          :showType="radioList[index]?.showType"
          :title="radioList[index]?.title"
          :id="radioList[index]?.categoryId"
          :creatives="radioList[index]?.creatives"
          :key="index"
        />
      </section>
      <section v-if="radioList[index]?.showType === 'VOICE_HOMEPAGE_WEEKNEW_VOICE'">
        <PodCasterListLongitudinal
          :showType="radioList[index]?.showType"
          :title="radioList[index]?.title"
          :id="radioList[index]?.categoryId"
          :creatives="radioList[index]?.creatives"
          :key="index"
        />
      </section>
      <section v-if="radioList[index]?.showType === 'VOICE_HOMEPAGE_BLOCK_BANNER'">
        <PodCasterListBanner :banner="radioList[index]?.banner" />
      </section>
    </section>
    <LoadingComponent
      v-if="radioCursor !== null"
      ref="loadingComponent"
      style="margin-left: 30px; margin-top: 20px; width: 85%"
    />
  </div>
</template>

<script setup lang="ts">
import { getTypeRadio, getRadioVoice } from "@/api/api_radio";
import { TypeRadioItem, RadioBannerItem, Radio } from "i/api/api_radio.d";
import { SongDetailSongsItem } from "i/api/api_song.d";
import { useIntersectionObserver } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useDownload } from "@/store/download";

interface item {
  id: number;
  title: string;
}
interface RadioList {
  title: string;
  categoryId: number | null;
  showType: string;
  creatives: Array<{
    creativeId: number;
    mainTitle: string;
    labelText: string[];
    labelType: string;
    imageurl: string;
    playCount: number;
    secondCategory: string;
    subtitle?: {
      title: string;
      titleType: string;
    };
    radio?: Radio;
    mainSong?: SongDetailSongsItem;
  }>;
  banner?: RadioBannerItem[];
}

let elMessage: any = inject("message") as any;

//路由实例
let router = useRouter();
//下载
let download = useDownload();
//菜单总列表
let routerListAll: TypeRadioItem[] = [];
//菜单列表
let routerList = ref<Array<TypeRadioItem>>([]);
//页数
let routerListPage = ref<number>(0);

//loading
let isLoading = ref<boolean>(true);

//ref loadingComponent
const loadingComponent = ref<null | HTMLElement>(null);

//播客（电台）类型 包含标题和id
let list = ref<Array<item>>([
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
]);

//radiolist
let radioList = ref<Array<RadioList>>([]);
//voice请求参数
let radioCursor = ref<string | null>("null");

//动态计算列表长度
let computedListLength = computed(() => {
  if (radioList.value.length) {
    return radioList.value.length;
  } else {
    return 8;
  }
});

//获取电台分类列表
let getRadioTypeList = async () => {
  try {
    let res = await getTypeRadio();
    routerListAll.push(...res.categories);
    routerList.value.push(...routerListAll.slice(0, 8));
    routerListPage.value = Math.ceil(routerListAll.length / 8);
    setTimeout(() => {
      isLoading.value = false;
    }, 1);
  } catch (e: any) {
    elMessage.error(e?.message || "请求电台分类列表失败 请检查你的网络是否有问题?");
  }
};

//获取电台列表
let getRadioList = async () => {
  try {
    let {
      data: { blocks, cursor },
    } = await getRadioVoice(String(radioCursor.value));
    radioCursor.value = cursor;
    blocks.forEach(async (block) => {
      if (
        block.showType === "VOICE_HOMEPAGE_FIXED_VOICELIST" ||
        block.showType === "VOICE_HOMEPAGE_RCMDLIKE_VOICELIST"
      ) {
        let obj: RadioList = {
          title: block.uiElement.mainTitle.title,
          categoryId: block.uiElement.mainTitle.categoryId,
          creatives: [],
          showType: block.showType,
        };
        block.creatives = block.creatives.slice(0, 6);
        block.creatives.forEach((createive) => {
          obj.creatives.push({
            creativeId: Number(createive.creativeId),
            mainTitle: createive.uiElement.mainTitle.title,
            labelText: createive.uiElement.labelTexts,
            labelType: createive.uiElement.labelType,
            imageurl: createive.uiElement.image.imageUrl,
            playCount: createive.creativeExtInfoVO.playCount,
            secondCategory: createive.creativeExtInfoVO.radio.secondCategory,
          });
        });
        radioList.value.push(obj);
      } else if (block.showType === "VOICE_HOMEPAGE_WEEKNEW_VOICE") {
        let obj: RadioList = {
          title: block.uiElement.mainTitle.title,
          categoryId: block.uiElement.mainTitle.categoryId,
          creatives: [],
          showType: block.showType,
        };
        block.creatives.forEach(async (createive) => {
          createive.resources.forEach((resource) => {
            let mainSong = resource.resourceExtInfo.djProgram.mainSong;
            mainSong.from = {
              path: "podCaster",
              name: "播客",
            };
            //找到已经下载好的节目索引
            let voiceIndex = download.completeDownloadVoiceItem.findIndex(
              (items) => items.id === mainSong.id
            );
            if (voiceIndex !== -1) {
              mainSong.songUrl = download.completeDownloadVoiceItem[voiceIndex].songUrl;
              mainSong.downloadStatus =
                download.completeDownloadVoiceItem[voiceIndex].downloadStatus;
            }
            mainSong.radio = resource.resourceExtInfo.djProgram.radio;
            mainSong.radio.listenerCount = resource.resourceExtInfo.playCount;
            mainSong.radio.programId = Number(resource.resourceId);
            //发布时间
            mainSong.radio.scheduledPublishTime =
              resource.resourceExtInfo.djProgram.scheduledPublishTime;
            obj.creatives.push({
              creativeId: Number(resource.resourceId),
              mainTitle: resource.uiElement.mainTitle.title,
              labelText: resource.uiElement.labelTexts,
              labelType: resource.uiElement.labelType,
              imageurl: resource.uiElement.image.imageUrl,
              playCount: resource.resourceExtInfo.playCount,
              secondCategory: "",
              subtitle: {
                title: resource.uiElement.subTitle.title,
                titleType: resource.uiElement.subTitle.titleType,
              },
              mainSong,
              radio: resource.resourceExtInfo.djProgram.radio,
            });
          });
        });
        radioList.value.push(obj);
      } else if (block.blockCode === "VOICE_HOMEPAGE_BLOCK_BANNER") {
        let obj: RadioList = {
          title: "",
          categoryId: 0,
          creatives: [],
          showType: block.showType,
          banner: block.creatives[0].creativeExtInfoVO.banners,
        };
        radioList.value.push(obj);
      }
    });
  } catch (e: any) {
    elMessage.error(e?.message || "请求电台列表失败 请检查你的网络是否有问题?");
  }
};

//走马灯切换分页
let carouselChange = (index: number) => {
  let start = index * 8;
  let end = start + 8;
  routerList.value = routerListAll.slice(start, end);
};

//监听 是否翻到了loading组件
const { stop } = useIntersectionObserver(
  loadingComponent,
  ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
      getRadioList();
    }
  }
);

//如果没有内容 就停止监听事件
watch(
  () => radioCursor.value,
  (val) => {
    if (val === null) {
      stop();
    }
  }
);

//处理跳转链接
let handleClick = (id: number, name: string) => {
  router.push({ name: `Category`, query: { id, name } });
};

onMounted(() => {
  getRadioTypeList();
});
</script>

<style scoped lang="scss">
/**播客首页面 */
.pod--caster {
  max-width: 1200px;
  margin: auto;
  min-width: 750px;
  width: 90%;
  text-align: center;
}

/**骨架屏 */
//路由
.el-skeleton--routerImg {
  height: 170px;
  margin-top: 20px;
}

//播客列表 头部
.pod--caster--top {
  margin-top: 20px;
  display: flex;
}

//FM
.top--FM {
  flex: 1;
  margin-right: 30px;
  display: flex;
  height: 170px;
  min-width: 448px;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgb(60, 57, 55);
}

//走马灯
.top--container {
  width: 400px;
}

.el-carousel--routerList {
  background-color: var(--dark-carousel-backgroundColor, rgb(254, 244, 244));
}

/**路由导航 */
.router--list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 30px;
  margin-top: 10px;
  font-size: 12px;
}

/**路由导航子元素 */
.router--list__item {
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

/**播客专区 */
.pod--caster--section {
  margin-top: 30px;
}
</style>
