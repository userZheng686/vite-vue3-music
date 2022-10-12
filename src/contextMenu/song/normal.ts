import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { dislikePlaylist } from "@/api/api_playList"
import { SongDetailSongsItem } from "@/interface/api/api_song"
import { setComment, setShare } from "@/localStorage/set"
import { downloadMusic } from "@/utils/download"
import { ElMessage } from "element-plus"
import { menusEvent } from "vue3-menus"
import { handlePlaySong, handleNextPlaySong, handleCopyLink, handleCollectPlaylist, loginCallback } from "../utils"

//弹窗显示
let songMenu = useSongMenuPopupStore();

//歌曲右键菜单
export function contextMenuSong(event: MouseEvent, row: SongDetailSongsItem, musicList: SongDetailSongsItem[], rubbish: boolean) {
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(Number(row.id), 'song')
            },
            show: true
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
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('song', row.id)
            },
            show: true
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
            divided: rubbish ? true : false
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
            divided: rubbish ? true : false
        },
        {
            label: "不感兴趣",
            icon: "<i class='iconfont icon-chaping'></i>",
            tip: "",
            click: async () => {
                try {
                    let filterIds = musicList.filter(item => item.id !== row.id).map(item => Number(item.id))
                    let res = await dislikePlaylist(Number(row.id), 4, row.alg, filterIds)
                    console.log('res', res)
                } catch (e: any) {
                    ElMessage.error(e?.msg || '今天没有更多推荐了')
                }
            },
            show: rubbish ? true : false
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
