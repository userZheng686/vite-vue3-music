import { isOpenComment, commentId, isChangeCurrentListIndex, currentListIndex, isOpenAlbum, albumId, isShare, shareParam, isDownload, downloadParam, isRemoveItem, removeItemId, isPrevSong, isPlayMusic, isNextSong, isEnterSongDetail, isRewind, isForward, isPlay, commentType, isOperateRadio, isOperateMusic } from './init'
import { SongDetailSongsItem } from 'i/api/api_song.d';

/**
 * 打开评论
 * @param id 资源id 
 */
export function setComment(id: number | string, type: string) {
    commentId.value = id
    commentType.value = type
    isOpenComment.value = true
}

/**
 * 播放歌曲
 * @param id 索引 
 */
export function playSong(index: number) {
    currentListIndex.value = index
    isPlay.value = true
    isChangeCurrentListIndex.value = true
}

/**打开专辑 */
export function setAlbum(id: number) {
    albumId.value = id
    isOpenAlbum.value = true
}

/**分享 */
export function setShare(param: {
    id: number,
    type: string,
    currentSongImg: string,
    title: string,
    ar : string[]
}) {
    Object.assign(shareParam.value, param)
    isShare.value = true
}

/**下载 */
export function setDownload(item: SongDetailSongsItem) {
    downloadParam.value = JSON.stringify(item)
    isDownload.value = true
}

/**从列表中移除歌曲 */
export function removeItem(id: number | string) {
    removeItemId.value = id
    isRemoveItem.value = true
}

export function setPrevSong() {
    isPrevSong.value = true
}

export function setPlayMusic() {
    isPlayMusic.value = true
}

export function setNextSong() {
    isNextSong.value = true
}

export function setEnterSongDetail() {
    isEnterSongDetail.value = true
}

export function setForward() {
    isForward.value = true
}

export function setRewind() {
    isRewind.value = true
}

export function setOperateRadio() {
    isOperateRadio.value = true
}

export function setOperateMusic() {
    isOperateMusic.value = true
}

