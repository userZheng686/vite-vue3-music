<template>
    <section class="musician">
        <div class="musician--list">
            <RecommendUserListItem v-for="item in list" :key="item.userId" :item="item" :SubscribedCount="false" :detailDescription="true" />
        </div>
        <el-button v-if="isMore && list.length" style="margin: 10px auto; display: flex; align-items: center"
            type="danger" @click="getMusicianList()">加载更多</el-button>
    </section>
</template>

<script setup lang="ts">
import { getUserRecommendCelebrities } from '@/api/api_recommend';
import { UserPlaylistTalentItem } from 'i/api/api_recommend';

let elMessage = inject('message') as any
let list = ref<UserPlaylistTalentItem[]>([])
let offset = 0
let isMore = ref<boolean>(true)

let getMusicianList = async () => {
    try {
        let { celebrities, more } = await getUserRecommendCelebrities(4, offset, 60);
        offset += celebrities.length
        list.value = list.value.concat(celebrities)
        isMore.value = more
    } catch (e: any) {
        elMessage.error('获取明星列表失败')
    }
}


onActivated(() => {
    getMusicianList()
})
</script>

<style scoped lang="scss">
.musician--list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 20px;
    row-gap: 20px;
}
</style>