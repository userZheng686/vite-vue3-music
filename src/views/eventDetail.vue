<template>
    <!--动态详情（包括评论 点赞等）-->
    <section class="event--detail">
        <EventListItem v-if="eventDetail" :item="eventDetail"/>
        <Comment :id="Number(route.query.id)+'_'+Number(route.query.uid)" :inputType="1" 
            :resourceType="6"
        />
    </section>
</template>

<script setup lang="ts">
import { getUserEventDetail } from '@/api/api_event'
import { UserEvenEvents } from 'i/api/api_event';
import { useRoute } from 'vue-router'

let route = useRoute()
let elMessage = inject('message') as any
let eventDetail = ref<UserEvenEvents>()
let getEventDetailBatch = async () => {
    try {
        let { event } = await getUserEventDetail(Number(route.query.uid), Number(route.query.id))
        initEvent(event)
        eventDetail.value = event
        console.log('event', event)
    } catch (e: any) {
        elMessage.error(e?.message || "获取动态详情失败");
    }
}

let initEvent = (event: UserEvenEvents) => {
    event.parseJson = JSON.parse(event.json);
    if (event.parseJson.song) {
        event.parseJson.song.progress = 0;
        event.parseJson.song.stauts = 'play'
        event.parseJson.song.from = {
            path: "Event",
            name: "动态",
            val: {
                uid: Number(route.query.uid),
                id: Number(route.query.id),
            },
        };
    }
    if (event.parseJson.program) {
        //电台
        event.parseJson.program.mainSong.radio = event.parseJson.program.radio;
        //电台节目id
        event.parseJson.program.mainSong.radio.programId = event.parseJson.program.id;
        //是否点赞
        event.parseJson.program.mainSong.liked = event.parseJson.program.canReward;
        //图片
        event.parseJson.program.mainSong.album.picUrl = event.parseJson.program.coverUrl;
        event.parseJson.program.mainSong.progress = 0;
        event.parseJson.program.mainSong.from = {
            path: "Event",
            name: event.parseJson.program.radio.name,
            val: {
                id: Number(route.query.id),
            },
        };
    }
    if (event.parseJson.event) {
        event.parseJson.event.parseJson = JSON.parse(event.parseJson.event.json);
    }
}

onActivated(() => {
    getEventDetailBatch()
})
</script>

<style scoped lang="scss">
.event--detail{
    padding-left: 40px;
    padding-top: 20px;
}
</style>