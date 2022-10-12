import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { SongDetailSongsItem } from "i/api/api_song"
import { setComment, setShare } from "@/localStorage/set"
import { downloadMusic } from "@/utils/download"
import { menusEvent } from "vue3-menus"
import { routerInstance } from "@/contextMenu/routerInstance";
import { handlePlaySong, handleNextPlaySong, handleCopyLink, handleCollectPlaylist, loginCallback } from "../utils"
import { historyList } from "@/localStorage/init";

//弹窗显示
let songMenu = useSongMenuPopupStore();


//歌曲右键菜单
export function contextMenuRecentlyPlaySong(event: MouseEvent, row: SongDetailSongsItem) {
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(Number(row.id), 'song')
            },
            show: typeof row.commentCount === 'number' ? true : false
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
            label: `专辑：${row?.al?.name || row?.album?.name}`,
            icon: "<i class='iconfont icon-zhuanji'></i>",
            tip: "",
            click: () => {
                let id = row?.al?.id || row?.album?.id
                if (!id) return
                routerInstance.push({
                    path: "/albumDetail",
                    query: {
                        id,
                    },
                });
            },
            show: true,
        },
        {
            label: `歌手：${row?.artists && row?.artists[0].name || row?.ar && row?.ar[0]?.name}`,
            icon: "<i class='iconfont icon-geren'></i>",
            tip: "",
            click: () => {
                let id = row?.artists && row?.artists[0].id || row?.ar && row?.ar[0]?.id
                if (!id) return
                routerInstance.push({
                    path: "/artists",
                    query: {
                        type: 1,
                        id,
                    },
                });
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
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('song', row.id)
            },
            show: typeof row.commentCount === 'number' ? true : false
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
            divided: true
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
            divided: true
        },
        {
            label: "从列表中删除",
            icon: "<i class='iconfont icon-shanchu'></i>",
            tip: "",
            click: () => {
                let index = historyList.value.findIndex(item => item.id === row.id)
                if (index !== -1) {
                    historyList.value.splice(index, 1)
                }
            },
            show: true,
        },
    ]
    list = list.filter(item => item.show)
    //收藏到歌单
    let index = list.findIndex(item => item.label === '收藏到歌单')
    if (index !== -1 && list[index].children) {
        handleCollectPlaylist(list[index].children, row)
    }
    menusEvent(event, list, row);
}
