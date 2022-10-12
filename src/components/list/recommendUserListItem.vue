<template>
    <el-card :body-style="{ padding: '0px'}" shadow="hover" >
        <DefaultImage :picUrl="props.item.avatarUrl" :param="1024" :y="1024" :radius="false"  @click="jumpUserHomePage"  />
        <div style="padding: 14px">
            <div class="name single-clamp">
                <span class="name single-clamp">
                    <span class="single-clamp">{{props.item.nickname}}</span>
                    <img :src="item?.avatarDetail?.identityIconUrl" width="15" height="15" alt=""/>
                </span>
                <el-button size="small" :icon="Plus" round type="danger" v-if="!props.item.followed" @click="follow(1)">关注</el-button>
                <el-button size="small" round type="danger" v-if="props.item.followed" @click="follow(2)">取消关注</el-button>
            </div>
            <div class="subscribed" v-if="props.SubscribedCount">歌单被收藏{{props.item.playlistBeSubscribedCount}}次</div>
            <div class="detailDescription single-clamp info" v-if="props.detailDescription">{{props.item.detailDescription}}</div>
            <div class="signature single-clamp info" v-if="props.item.signature">{{props.item.signature}}</div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { UserPlaylistTalentItem } from 'i/api/api_recommend';
import {  Plus } from "@element-plus/icons-vue";
import {useRouter} from 'vue-router'
import { getFollow } from '@/api/api_user';

interface Props {
    item : UserPlaylistTalentItem
    SubscribedCount : boolean;
    detailDescription : boolean;
}

let router = useRouter()
let props = defineProps<Props>()
let elMessage = inject("message") as any;

let jumpUserHomePage = () => {
    router.push({
        path : '/homePage',
        query : {
            id : props.item.userId
        }
    })
}

let follow = async (type : number) => {
    try {
        let res = await getFollow(props.item.userId,type)
        props.item.followed = !props.item.followed 
        elMessage.success(`${type === 1 ? '关注成功' : '取消关注成功'}`)
    } catch (e : any) {
        elMessage.success('关注失败')
    }
}



</script>

<style scoped lang="scss">
.name{
    display: flex;
    align-items: center;
    justify-content:space-between;
    img {
        margin-left:5px;
        margin-right:10px;
    }
}

.subscribed,.signature,.detailDescription{
    margin-top:10px;
}
</style>