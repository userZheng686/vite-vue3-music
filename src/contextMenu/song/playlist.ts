//针对歌单
import { downloadMusic } from "@/utils/download";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { SongDetailSongsItem } from "i/api/api_song.d";
import { menusEvent } from "vue3-menus";
import { ElMessage } from 'element-plus';
import { setComment, setShare } from '@/localStorage/set'
import { handleCopyLink, handleNextPlaySong, handlePlaySong, handleDelPlaylistSong, handleCollectPlaylist, handleCreatorPlaylist, loginCallback } from '../utils'


//弹窗显示
let songMenu = useSongMenuPopupStore();
//歌单详情
let playlistDetail: {
    createUserId: number,
    playlistId: number,
    refresh: Function
} = {
    createUserId: 0,
    playlistId: 0,
    refresh: () => { }
}


const menus = shallowRef({
    menusClass: "my-menus",
    itemClass: "menus-item",
});



//处理歌曲
function handleTypeSong(row: SongDetailSongsItem) {
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(Number(row.id), 'song')
            },
            show: typeof row.id === 'number' ? true : false
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: () => {
                handlePlaySong(row)
            },
            show: true,
        },
        {
            label: "下一首播放",
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: () => {
                handleNextPlaySong(row)
            },
            show: true,
            divided: true
        },
        {
            label: "收藏到歌单",
            icon: "<i class='iconfont icon-shoucang1'></i>",
            tip: "",
            click: () => {
                return false
            },
            children: [
                {
                    label: "创建新歌单",
                    icon: "<i class='iconfont icon-plus-circle'>",
                    click: () => {
                        loginCallback(() => {
                            songMenu.createSongMenuShow = true
                        })

                    }
                },
            ],
            show: true
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    let ar = (row.ar || row.artists).map(item => item.name)
                    setShare({
                        id: Number(row.id),
                        type: row.radio ? 'radioProgram' : 'song',
                        currentSongImg: row?.al?.picUrl || row?.album?.picUrl,
                        title: row.name,
                        ar
                    })
                })

            },
            show: typeof row.id === "number" ? true : false
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('song', row.id)
            },
            show: typeof row.id === "number" ? true : false
        },
        {
            label: "下载",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    downloadMusic(row)
                })

            },
            show: row.songUrl ? false : true,
            divided: handleCreatorPlaylist(playlistDetail.createUserId)
        },
        {
            label: "打开文件所在目录",
            icon: "<i class='iconfont icon-sixin'></i>",
            tip: "",
            click: () => {
                if (window.desktopMainAPI) {
                    window.desktopMainAPI.openPathFolder(row.songUrl)
                }
            },
            show: row.songUrl ? true : false,
            divided: handleCreatorPlaylist(playlistDetail.createUserId)
        },
        {
            label: "从歌单中删除",
            icon: "<i class='iconfont icon-shanchu'></i>",
            tip: "",
            click: () => {
                loginCallback(async () => {
                    handleDelPlaylistSong(row, playlistDetail.playlistId).then(res => {
                        ElMessage.success("删除成功");
                        playlistDetail.refresh()
                    }).catch(err => {
                        ElMessage.error(err || "删除失败");
                        return false;
                    })
                })

            },
            show: handleCreatorPlaylist(playlistDetail.createUserId)
        },
    ]
    list = list.filter(item => item.show)
    //收藏到歌单
    let index = list.findIndex(item => item.label === '收藏到歌单')
    if (index !== -1 && list[index].children) {
        handleCollectPlaylist(list[index].children, row)
    }
    return list
}


//初始化配置
export const getSongsInfo = async (detail: {
    createUserId: number,
    playlistId: number,
    refresh?: Function
}) => {
    Object.assign(playlistDetail, detail)
}

export function contextMenuPlaylist(event: MouseEvent, row: SongDetailSongsItem, index: number) {
    let list = handleTypeSong(row)
    menusEvent(event, list, { row, index });
    event.preventDefault();
}
