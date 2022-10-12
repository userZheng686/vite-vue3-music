//菜单列表里面的公共方法

import { SongDetailSongsItem } from "i/api/api_song";
import { useSongStore } from "@/store/playList";
import { useUserInformation } from "@/store/user";
import { setComment, playSong, setAlbum, setShare, setDownload, removeItem } from '@/localStorage/set'
import { addSongToSongMenu, collectSongMenu, deletePlaylist, getRecommendSongs, getSongMenuDetail } from "@/api/api_playList";
import { getSongDetail } from "@/api/api_song";
import { play } from "@/utils/play";
import { ElMessage } from "element-plus";
import { useClipboard } from '@vueuse/core'
import { downloadMusic } from "@/utils/download";
import { ResourceCommentInfoItem } from "i/api/api_comment";
import { getCollectMv, getCollectVideo } from "@/api/api_collect";
import initMvUrlOption from "c/mvDetail/useMvUrl";
import useDownloadMV from "c/mvDetail/useDownloadMV";
import { getRadioSublist, RadioSub } from "@/api/api_radio";
import { collectAlbumSub, getArtistAlbumSongs } from "@/api/api_album";
import { getSubMV } from "@/api/api_mv";
import { useDownload } from "@/store/download";
import { usePopupStore } from "@/store/popup";

//列表
let songList = useSongStore();
//用户
let userInfo = useUserInformation()
//mv store
let download = useDownload()
let popup = usePopupStore();

//复制粘贴
const source = ref('Hello')
const { text, copy, copied, isSupported } = useClipboard({ source })


//处理资源评论
export function handleComment(item: any, resource: ResourceCommentInfoItem[]) {
    let index = resource.findIndex((items) => items.resourceId === item.id);
    if (index !== -1) {
        return `查看评论(${resource[index].commentCount})`
    } else {
        return ''
    }
}


//处理播放(歌曲)
export function handlePlaySong(row: SongDetailSongsItem) {
    songList.setSongList(row)
    let index = songList.list.findIndex(item => item.id === row.id)
    if (index !== -1) {
        playSong(index)
    }
}

//处理播放（歌单）
export async function handlePlayPlaylist(id: number, name: string) {
    if (id) {
        let { privileges } = await getSongMenuDetail(id);
        let ids = privileges.map(item => item.id)
        let { songs } = await getSongDetail(ids.join(','))
        songs.forEach((item, index) => {
            item.from = {
                path: "recommendPlaylist",
                name,
            };
            item.status = 'play'
            item.progress = 0;
            //音质
            item.plLevel = privileges[index].plLevel;
        });
        play(songs, songs[0].id)
    } else {
        let list: SongDetailSongsItem[] = []
        let { recommend } = await getRecommendSongs(0);
        recommend.forEach((item) => {
            item.from = {
                path: "recommendPlaylist",
                name,
            };
            item.status = 'play'
            item.progress = 0;
        });
        list = recommend;
        play(list, list[0].id)
    }
}

//处理播放（专辑）
export async function handlePlayAlbumlist(id: number, name: string) {
    let { songs, album } = await getArtistAlbumSongs(id);
    songs.forEach((item) => {
        item.from = {
            path: 'albumDetail',
            name,
            val: {
                id
            }
        };
        item.progress = 0;
        item.status = 'play'
    });
    play(songs, songs[0].id)
}

//下一首播放(歌曲)
export function handleNextPlaySong(row: SongDetailSongsItem) {
    let index = songList.list.findIndex(item => item.id === row.id)
    row.status = 'play'
    if (index !== -1) {
        let item = songList.list.splice(index, 1)
        songList.list.splice(songList.currentListIndex + 1, 0, item[0])
    } else {
        if (songList.currentListIndex > songList.list.length) {
            songList.setSongList(row)
        } else {
            songList.list.splice(songList.currentListIndex + 1, 0, row)
        }
    }
    if (songList.currentListIndex > songList.list.length) {
        nextTick(() => {
            songList.setListIndex(0)
        })
    }
}

//下一首播放（歌单）
export async function handleNextPlayPlaylist(id: number, name: string) {
    if (id) {
        let { privileges } = await getSongMenuDetail(id);
        let ids = privileges.map(item => item.id)
        let { songs } = await getSongDetail(ids.join(','))
        songs.forEach((item, index) => {
            item.from = {
                path: "recommendPlaylist",
                name,
            };
            item.status = 'play'
            item.progress = 0;
            //音质
            item.plLevel = privileges[index].plLevel;
        });
        if (songList.list.length) {
            let start = songList.list.slice(0, songList.currentListIndex + 1)
            let middle = songs
            let end = songList.list.slice(songList.currentListIndex + 1, songList.list.length)
            songList.list = [...start, ...middle, ...end]
        } else {
            songList.list = songs
            songList.setListIndex(0)
        }
    } else {
        let list: SongDetailSongsItem[] = []
        let { recommend } = await getRecommendSongs(0);
        recommend.forEach((item) => {
            item.from = {
                path: "recommendPlaylist",
                name,
            };
            item.status = 'play'
            item.progress = 0;
        });
        list = recommend;
        if (songList.list.length) {
            let start = songList.list.slice(0, songList.currentListIndex + 1)
            let middle = list
            let end = songList.list.slice(songList.currentListIndex + 1, songList.list.length)
            songList.list = [...start, ...middle, ...end]
        } else {
            songList.list = list
            songList.setListIndex(0)
        }
    }
}

//下一首播放（专辑）
export async function handleNextPlayAlbumlist(id: number, name: string) {
    let { songs } = await getArtistAlbumSongs(id);
    songs.forEach((item) => {
        item.from = {
            path: 'albumDetail',
            name,
            val: {
                id
            }
        };
        item.status = 'play'
        item.progress = 0;
    });
    if (songList.list.length) {
        let start = songList.list.slice(0, songList.currentListIndex + 1)
        let middle = songs
        let end = songList.list.slice(songList.currentListIndex + 1, songList.list.length)
        songList.list = [...start, ...middle, ...end]
    } else {
        songList.list = songs
        songList.setListIndex(0)
    }
}

//处理收藏到歌单
export async function handleCollectPlaylist(children: Array<any>, row: SongDetailSongsItem) {
    let createSongMenuList = userInfo.songMenu.filter(
        (item) => item.userId === userInfo.user_profile.userId
    );
    createSongMenuList.forEach((item) => {
        children.push({
            label: item.name,
            icon: `<i class='iconfont icon-${item.privacy === 10 ? "simi" : "gedan"}'>`,
            tip: "",
            click: async (menu: any) => {
                if (!userInfo.user_profile.isLogin) {
                    ElMessage.warning('请先登录 在完成后续操作')
                    popup.isOpenLoginPopup = true
                }
                try {
                    let res = await addSongToSongMenu(
                        "add",
                        Number(item.id),
                        Number(row.id),
                    );
                    ElMessage.success("收藏成功");
                    userInfo.refreshUserInfo()
                } catch (e: any) {
                    ElMessage.error(e?.message || "收藏失败");
                    return false;
                }
            },
        });
    })
}


//收藏歌单
export async function handleCollectOnePlaylist(id: number) {
    let res = await collectSongMenu(1, id);
    userInfo.updateSoneMenu();
    ElMessage.success('收藏成功')
}

//收藏视频
export async function handleCollectVideo(id: string) {
    try {
        let res = await getCollectVideo(id, 1)
        ElMessage.success('收藏成功')
    } catch (e: any) {
        ElMessage.error('收藏失败');
    }
}

//收藏MV
export async function handleCollectMV(id: number) {
    try {
        let res = await getCollectMv(id, 1)
        ElMessage.success('收藏成功')
    } catch (e: any) {
        ElMessage.error('收藏失败');
    }
}

//收藏电台
export async function handleCollectDj(id: number) {
    try {
        let res = await RadioSub(id, 1)
        ElMessage.success('收藏成功')
    } catch (e: any) {
        ElMessage.error(e?.msg || '收藏失败')
    }
}

//判断是否登录
export function loginCallback(callback : Function){
    if(userInfo.user_profile.isLogin) {
        callback()
    } else {
        ElMessage.warning('请先登录 在完成后续操作')
        popup.isOpenLoginPopup = true
    }
}

//收藏专辑
export async function handleCollectAlbum(id: number) {
    try {
        let res = await collectAlbumSub(id, 1)
        ElMessage.success('收藏成功')
    } catch (e: any) {
        ElMessage.error('收藏失败')
    }

}


//处理拷贝链接
export function handleCopyLink(type: string, id: number | string) {
    source.value = `http://music.163.com/${type}?id=${id}&userid=${userInfo.user_profile.userId}`
    copy()
    ElMessage.success('复制链接成功')
}

//处理从歌单中删除
export function handleDelPlaylistSong(row: SongDetailSongsItem, playlistId: number) {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await addSongToSongMenu(
                "del",
                playlistId,
                Number(row.id),
            );
            resolve('删除成功')
        } catch (e: any) {
            reject('删除失败')
        }
    })
}

//判断当前是否是属于用户创建的歌单
export function handleCreatorPlaylist(createUserId: number) {
    if (createUserId === userInfo.user_profile?.userId) return true
    else return false
}

//处理来源
export function handleFrom(row: SongDetailSongsItem) {
    let from = row?.from?.name || ''
    return `来自 ：${from}`
}

//处理歌手/主播
export function handleArtists(row: SongDetailSongsItem) {
    let artists = ''
    if (row.artists) {
        row.artists.forEach((item, index) => {
            if (index > 0) {
                artists += ' / ' + item.name
            } else {
                artists += item.name
            }
        })
    } else if (row.ar) {
        row.ar.forEach((item, index) => {
            if (index > 0) {
                artists += ' / ' + item.name
            } else {
                artists += item.name
            }
        })
    }
    if (artists) {
        return `${row?.radio ? '主播：' : '歌手：'}${artists}`
    } else {
        return artists
    }
}

//处理专辑
export function handleAlbum(row: SongDetailSongsItem) {
    let al = ''
    if (row.album) {
        al = row.album.name
    } else if (row.al) {
        al = row.al.name
    }
    if (al) {
        return `专辑 ：${al}`
    } else {
        return al
    }
}


//下载全部(歌单)
export async function handleDownloadPlaylistAll(id: number) {
    let { privileges } = await getSongMenuDetail(id);
    let ids = privileges.map(item => item.id)
    let { songs } = await getSongDetail(ids.join(','))
    songs.forEach((item, index) => {
        item.from = {
            path: "songMenuDetail",
            name: item.name,
            val: {
                id
            }
        };
        item.status = 'play'
        item.progress = 0;
        //音质
        item.plLevel = privileges[index].plLevel;
    });
    //找出没有下载过的歌曲 并且歌曲不是vip
    let downloadList = songs.filter((item) => {
        if (!item.songUrl && item.fee === 0) {
            return true;
        } else {
            return false;
        }
    });
    downloadList.forEach((item) => {
        downloadMusic(item);
    });
    let vipSize = songs.length - downloadList.length
    if (vipSize) {
        ElMessage.warning(`总共有${vipSize}首歌曲需要会员才能下载，请先开通会员在进行下载`)
    }
}

//下载全部(专辑)
export async function handleDownloadAlbumlistAll(id: number, name: string) {
    let { songs, album } = await getArtistAlbumSongs(id);
    songs.forEach((item) => {
        item.from = {
            path: 'albumDetail',
            name,
            val: {
                id
            }
        };
        item.progress = 0;
        item.status = 'play'
    });
    //找出没有下载过的歌曲 并且歌曲不是vip
    let downloadList = songs.filter((item) => {
        if (!item.songUrl && item.fee === 0) {
            return true;
        } else {
            return false;
        }
    });
    downloadList.forEach((item) => {
        downloadMusic(item);
    });
    let vipSize = songs.length - downloadList.length
    if (vipSize) {
        ElMessage.warning(`总共有${vipSize}首歌曲需要会员才能下载，请先开通会员在进行下载`)
    }
}

/**
 * 删除歌单
 * @param id 歌单id
 */
export async function handleDeletePlaylist(id: number) {
    try {
        let res = await deletePlaylist(id)
        let index = userInfo.songMenu.findIndex(item => item.id === id)
        if (index !== -1) {
            userInfo.songMenu.splice(index, 1)
        }
        ElMessage.success('删除成功')
    } catch (e: any) {
        ElMessage.error('删除失败')
    }
}

//判断是否已经收藏歌单
export function handleIsSubPlaylist(id: number) {
    let index = userInfo.songMenu.findIndex(item => item.id === Number(id))
    if (index !== -1) {
        return false
    } else {
        return true
    }
}

//判断是否已经收藏电台
export async function handleIsSubRadio(id: number) {
    let { djRadios } = await getRadioSublist(userInfo.user_profile.userId, 0, 1000)
    let index = djRadios.findIndex(item => item.id === Number(id))
    if (index !== -1) return false
    else return true
}

//判断是否已经收藏过mv
export async function handleIsSubMV(id: number) {
    let { data } = await getSubMV()
    data = data.filter(item => item.type === 0)
    let index = data.findIndex(item => item.vid === String(id))
    if (index !== -1) return false
    else return true
}

//获取已经下载的MV地址
export function getDownloadMVUrl(id: number) {
    let index = download.completeDownloadMVItems.findIndex(item => item.mvId === id)
    if (index !== -1) {
        if (download.completeDownloadMVItems[index].downloadStatus === 'complete') {
            return download.completeDownloadMVItems[index].videoParam[0]
        } else {
            return ''
        }
    } else {
        return ''
    }
}

//下载MV
export async function handleDownloadMV(id: number) {
    let { artists,
        cover,
        downloadStatus,
        name,
        urlParam } = await initMvUrlOption(id)
    let isDownload = ref<boolean>(true)
    let progress = ref<number>(0)
    let item = {
        name,
        fileName: name + '.mp4',
        mvId: id,
        cover: cover,
        userInfo: artists,
        currentProgress: 0,
        downloadStatus: 'begin',
        downloadReceivedBytes: 0,
        downloadUrl: urlParam[0],
        videoParam: ['', 'video/mp4', urlParam[2]],
    }
    useDownloadMV(urlParam[0], item, progress, isDownload)
}