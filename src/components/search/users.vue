<template>
  <section>
    <tableEmpty v-if="count === 0 && !loading">
      <template #empty
        >未能找到与<span class="like">"{{ keyword }}"</span>相关的任何用户</template
      >
    </tableEmpty>
    <template v-else>
      <div class="info ml_30">找到{{ count }}位用户</div>
      <div
        class="list__item"
        v-for="item in userList"
        :key="item.userId"
        @click="jumpUserHomePage(item.userId)"
        @contextmenu="contextMenuUser($event, item.userId)"
      >
        <DefaultImage
          :picUrl="item.avatarUrl"
          loadingWidth="25px"
          loadingHeight="25px"
          :lazy="false"
          class="ml_30"
          style="width: 50px; height: 50px"
        />
        <div class="name">
          <span v-brightenKeyword:[keyword,item.nickname]>{{ item.nickname }}</span>
          <img
            class="ml_10"
            v-if="item?.avatarDetail?.identityIconUrl"
            :src="item.avatarDetail.identityIconUrl"
            width="20"
            height="20"
            alt="identify"
          />
          <el-icon
            class="ml_10"
            v-if="item.gender === 2"
            style="color: rgb(255, 205, 232); transform: rotate(45deg)"
          >
            <Female />
          </el-icon>
          <el-icon class="ml_10" v-if="item.gender === 1" style="color: #409eff">
            <Male />
          </el-icon>
        </div>
        <div class="signature info">{{ item.signature }}</div>
      </div>
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="50"
        :pager-count="9"
        :hide-on-single-page="count <= 50"
        layout="prev, pager, next"
        :total="count"
        class="pagination"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { getSearch } from "@/api/api_search";
import { contextMenuUser } from "@/contextMenu/user/normal";
import { UserSearch } from "i/api/api_user";
import { useRoute, useRouter } from "vue-router";
let elMessage = inject("message") as any;
let route = useRoute();
let router = useRouter();
let offset = 0;
let count = ref<number>(0);
let userList = ref<UserSearch[]>([]);
let currentPage = ref<number>(1);
let loading = ref<boolean>(true);

let keyword = computed(() => {
  return String(route.query.keyword) || "";
});

let getArtistList = async () => {
  try {
    let {
      result: { userprofileCount, userprofiles },
    } = await getSearch(String(route.query.keyword), 1002, 50, offset);
    if (userprofileCount && userprofiles?.length) {
      count.value = userprofileCount;
      userList.value = userprofiles;
    }
  } catch (e: any) {
    elMessage.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
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

watch(currentPage, (val) => {
  offset = val * 50 - 50;
  getArtistList();
});

//监听当前的keyword
watch(
  () => route?.query?.keyword,
  () => {
    getArtistList();
  }
);

onActivated(() => {
  getArtistList();
});
</script>

<style scoped lang="scss">
.ml_30 {
  margin-left: 30px;
}

.ml_10 {
  margin-left: 10px;
}

.list__item {
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: var(--dark-item-backgroundHover, rgb(245, 245, 245));
  }

  .name {
    margin-left: 10px;
    display: flex;
    align-items: center;
  }

  .signature {
    flex: 1;
    text-align: right;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}
</style>
