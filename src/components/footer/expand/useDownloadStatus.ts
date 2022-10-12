import { computed } from 'vue'
//接口声明
import { SongDetailSongsItem } from 'i/api/api_song.d'
//用户信息
import { useUserInformation } from "@/store/user";
//下载
import { useDownload } from '@/store/download';
//用户信息
let userInfo = useUserInformation();
//下载
let download = useDownload()



//判断文件下载状态（是否可以下载 是否已经下载过了）
let downloadStatus = computed(() => {
    return function (item: SongDetailSongsItem) {
        if (item) {
            let {
                id,
                fee,
                from: { path },
            } = item;
            //取出已经下载完的声音id
            let voiceId = download?.completeDownloadVoiceItem?.map(item => item.id)
            if (
                fee !== 0 &&
                userInfo.user_profile.vipType === 0 &&
                path !== "我的音乐云盘" &&
                path !== "本地"
            ) {
                return "icon-vip";
            } else if (download?.completeDownloadSongsIds?.includes(Number(id)) || path === "本地") {
                return "icon-xiazaiwancheng";
            } else if (voiceId?.includes(Number(id))) {
                return "icon-xiazaiwancheng";
            } else {
                return "icon-xiazai-wenjianxiazai-07";
            }
        }

    }
});

let downloadStatusTitle = computed(() => {
    return function (item: SongDetailSongsItem) {
        if (item) {
            let {
                id,
                fee,
                from: { path },
            } = item;
            //取出已经下载完的声音id
            let voiceId = download?.completeDownloadVoiceItem?.map(item => item.id)
            if (
                fee === 8 &&
                userInfo.user_profile.vipType === 0 &&
                path !== "我的音乐云盘" &&
                path !== "本地"
            ) {
                return "vip才能下载噢~";
            } else if (download?.completeDownloadSongsIds?.includes(Number(id)) || path === "本地") {
                return "下载完成";
            } else if (voiceId?.includes(Number(id))) {
                return "下载完成";
            } else {
                return "下载";
            }
        }

    }
});

export {
    downloadStatus,
    downloadStatusTitle
}