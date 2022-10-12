<template>
    <section class="new--song">
        <div style="display:flex;align-items:center">
            <h1 class="title">新歌发布</h1>
            <span class="subTitle info">近三个月上线的新歌</span>
        </div>
        <el-button round :icon="VideoPlay" type="danger" @click="play(newWorksListAll,newWorksListAll[0].id)">
            播放最新50
        </el-button>
        <NewSongListItem v-for="item in newWorksList" :key="item.publishTime" :item="item" />
        <el-button v-if="isMore && newWorksList.length" class="button" type="danger" @click="getArtistNewSongList()">
            加载更多</el-button>
    </section>
</template>

<script setup lang="ts">
import { VideoPlay } from "@element-plus/icons-vue";
import { getArtistNewSong, getArtistNewSongPlayall } from '@/api/api_artist';
import { ArtistNewSongItem } from "i/api/api_artist";
import { SongDetailSongsItem } from "i/api/api_song";
import {play} from '@/utils/play'

let elMessage = inject("message") as any;
let startTimestamp = new Date().getTime()
let firstRequest = true
let newWorksList = ref<ArtistNewSongItem[]>([])
let newWorksListAll = ref<SongDetailSongsItem[]>([])
let isMore = ref<boolean>(true)

let getArtistNewSongList = async () => {
    try {
        let { data: { hasMore, newWorks, latestVisitTime } } = await getArtistNewSong(startTimestamp, 1, 10, firstRequest)
        let { data: { songList } } = await getArtistNewSongPlayall();
        startTimestamp = newWorks[newWorks.length - 1]?.publishTime
        firstRequest = false
        isMore.value = hasMore
        newWorks.forEach(item => {
            item.info.songLists.forEach(i => {
                i.from = {
                    path: '/newSong',
                    name: "新歌发布",
                }
                i.status = 'play'
                i.progress = 0
            })
        })
        songList.forEach(item => {
            item.from = {
                path: '/newSong',
                name: "新歌发布",
            }
            item.status = 'play'
            item.progress = 0
        })
        newWorksListAll.value = songList
        newWorksList.value = newWorksList.value.concat(newWorks)
    } catch (e: any) {
        elMessage.error(e?.message || "获取新歌列表失败")
    }
}



onMounted(() => {
    getArtistNewSongList()
})
</script>

<style scoped lang="scss">
.new--song {
    padding-left: 40px;
    padding-right: 40px;

    .title {
        font-size: 22px;
        font-weight: bold;
    }

    .subTitle {
        margin-left: 10px;
    }
}

.button {
    margin: 10px auto;
    display: flex;
    align-items: center;
}
</style>