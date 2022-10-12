//更新本地下载的文件数据
import { SongDetailSongsItem } from 'i/api/api_song.d';


export const patchUpdateRadioSubed = async (radioId: number, subed: boolean) => {
    let voiceList = await window.downloadAPI.getCustomDownload(2);
    voiceList.forEach((item: SongDetailSongsItem) => {
        if (item.radio.id === radioId) {
            item.radio.subed = subed
        }
    })
    window.downloadAPI.patchUpdateCustomDownload(2, JSON.stringify(voiceList))
}

export const updateRadioProgramLiked = async (programId: number, liked: boolean) => {
    let voiceList = await window.downloadAPI.getCustomDownload(2);
    voiceList.forEach((item: SongDetailSongsItem) => {
        if (item.radio.programId === programId) {
            item.liked = liked
        }
    })
    window.downloadAPI.patchUpdateCustomDownload(2, JSON.stringify(voiceList))
}