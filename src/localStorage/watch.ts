
import { useRadioProgramShare, useSongShare, } from '@/utils/dialogShare'
import { downloadMusic } from '@/utils/download'
import { isOpenComment, commentId, isChangeCurrentListIndex, currentListIndex, isOpenAlbum, albumId, isShare, shareParam, isDownload, downloadParam, isRemoveItem, removeItemId, isPrevSong, isForward, isNextSong, isPlay, isPlayMusic, isRewind, isEnterSongDetail, commentType, isOperateRadio, isOperateMusic, changeMode, openLyric } from './init'
import { routerInstance } from './instance'
import { useSongStore } from '@/store/playList'
import { useUserInformation } from '@/store/user'
import { playCallbackOption } from './callback'
import { ElMessage } from 'element-plus';
import { isPlay } from '@/localStorage/init';


let songList = useSongStore()
let userInfo = useUserInformation()
watch(() => isOpenComment.value, (val) => {
    if (val && routerInstance) {
        routerInstance.push({
            path: "/resourceComment",
            query: {
                id: commentId.value,
                type: commentType.value
            },
        })
        isOpenComment.value = false
    }
})

watch(() => isChangeCurrentListIndex.value, (val) => {
    if (val && routerInstance) {
        songList.setListIndex(currentListIndex.value)
        isChangeCurrentListIndex.value = false
    }
})

watch(() => isOpenAlbum.value, (val) => {
    if (val && routerInstance) {
        routerInstance.push({
            path: "/albumDetail",
            query: {
                id: albumId.value,
            },
        })
        isOpenAlbum.value = false
    }
})

watch(() => isShare.value, (val) => {
    if (val) {
        if (shareParam.value.type === 'song') {
            useSongShare(shareParam.value.id, shareParam.value.currentSongImg, shareParam.value.title)

        } else {
            useRadioProgramShare(shareParam.value.id, shareParam.value.currentSongImg, shareParam.value.title, (res: { status: string }) => {
                console.log(res);
            })

        }
        isShare.value = false
    }
})


watch(() => isDownload.value, (val) => {
    if (val && downloadParam.value) {
        downloadMusic(JSON.parse(downloadParam.value))
        isDownload.value = false
    }
})

watch(() => isRemoveItem.value, (val) => {
    if (val) {
        songList.removeListItem(removeItemId.value)
        isRemoveItem.value = false
    }
})

watch(() => isPrevSong.value, (val) => {
    if (val) {
        playCallbackOption.prevSong()
        isPrevSong.value = false
    }
})

if(window.ipcRenderer) {
    window.ipcRenderer.prev(() => {
        playCallbackOption.prevSong()
    })
    window.ipcRenderer.next(() => {
        playCallbackOption.nextSong()
    })
    window.ipcRenderer.play(() => {
        isPlay.value = true
    })
    window.ipcRenderer.pause(() => {
        isPlay.value = false
    })
}

watch(() => isPlayMusic.value, (val) => {
    if (val) {
        playCallbackOption.playMusic()
        isPlayMusic.value = false
    }
})

watch(() => isNextSong.value, (val) => {
    if (val) {
        playCallbackOption.nextSong()
        isNextSong.value = false
    }
})

watch(() => isForward.value, (val) => {
    if (val) {
        playCallbackOption.forward()
        isForward.value = false
    }
})

watch(() => isRewind.value, (val) => {
    if (val) {
        playCallbackOption.rewind()
        isRewind.value = false
    }
})

watch(() => isEnterSongDetail.value, (val) => {
    if (val) {
        playCallbackOption.enterSongDetail()
        isEnterSongDetail.value = false
    }
})

watch(() => isOperateRadio.value, (val) => {
    if (val) {
        playCallbackOption.operateRadio(songList, ElMessage)
        isOperateRadio.value = false
    }
})

watch(() => isOperateMusic.value, (val) => {
    if (val) {
        playCallbackOption.operateMusic(songList, ElMessage, userInfo)
        isOperateMusic.value = false
    }
})

watch(() => openLyric.value,(val) => {
    if(val) {
        window.desktopLyricAPI.show();
    } else {
        window.desktopLyricAPI.hide();
    }
})


watch(() => changeMode.value, (val) => {
    switch (val) {
        case 0: {
            window.desktopMainAPI.show();
            window.desktopMiniAPI.hide();
        }; break;
        case 1: {
            window.desktopMainAPI.hide();
            window.desktopMiniAPI.show();
        }; break;
        case 2: {
            window.desktopMainAPI.minimize();
        }; break;
    }
})

