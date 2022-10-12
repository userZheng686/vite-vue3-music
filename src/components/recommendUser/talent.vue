<template>
    <section class="talent">
        <div class="tags">
            <el-check-tag @click="switchTag(item)" :checked="checkTag === item" class="ml-2" type="danger" v-for="item in tagList" :key="item">{{item}}</el-check-tag>
        </div>
        <div class="talent--list">
            <RecommendUserListItem v-for="item in talentList" :key="item.userId" :item="item" :SubscribedCount="true" :detailDescription="false"/>
        </div>
         <el-button v-if="isMore && talentList.length" style="margin: 10px auto; display: flex; align-items: center"
            type="danger" @click="getTalentList()">加载更多</el-button>
    </section>
</template>

<script setup lang="ts">
import { getUserPlaylistTalentTags,getUserPlaylistTalent } from '@/api/api_recommend'
import { UserPlaylistTalentItem } from 'i/api/api_recommend';

let tagList = ref<string[]>([])
let checkTag = ref<string>('华语')
let elMessage = inject('message') as any
let offset = 0
let isMore = ref<boolean>(true)
let talentList = ref<UserPlaylistTalentItem[]>([])

let getTags = async () => {
    try {
        let {tags} = await getUserPlaylistTalentTags()
        tagList.value = tags
    } catch (e: any) {
        elMessage.error('获取标签列表失败')
    }
}

let getTalentList = async () => {
    try {
        let {more,talents} = await getUserPlaylistTalent(checkTag.value,offset,50)
        talentList.value = talents
        isMore.value = more
    } catch( e : any) {
        elMessage.error('获取列表失败')
    }
}


let switchTag = (name : string) => {
    if(checkTag.value === name) return
    checkTag.value = name
    talentList.value = []
    isMore.value = true
    offset = 0
    getTalentList()
}

onActivated(() => {
    getTags()
    getTalentList()
})


</script>

<style scoped lang="scss">
.tags{
    display: flex;
    flex-wrap: wrap;

    .ml-2{
        margin-left:10px;
        margin-bottom:10px;
    }
}

.talent--list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 20px;
    row-gap: 20px;
    margin-top: 20px;
}

</style>