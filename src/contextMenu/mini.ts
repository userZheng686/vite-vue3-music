//mini模式

import { menusEvent } from "vue3-menus";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { ResourceCommentInfoItem } from "i/api/api_comment";
import { SongDetailSongsItem } from "i/api/api_song.d";
import { getResouceCommentInfo } from "@/api/api_comment";
import { setComment, playSong, setAlbum, setShare, setDownload, removeItem } from '@/localStorage/set'
import { handleAlbum, handleArtists, handleCollectPlaylist, handleCopyLink, handleCreatorPlaylist, handleFrom } from './utils'
import { changeMode, currentListIndex, list, openLyric, rule } from "@/localStorage/init";

//歌单歌曲评论
let songItem: ResourceCommentInfoItem[] = [];
//电台节目评论
let radioProgramItem: ResourceCommentInfoItem[] = [];
//弹窗显示
let songMenu = useSongMenuPopupStore();


//列表菜单
const menus: any = shallowRef({
    menus: [
    ],
    itemClass: "menus-item single-clamp"
})

//外层菜单
const menusWrap: any = shallowRef({
    menus: [
        {
            label: '完整模式',
            icon: "<i class='iconfont icon-full'></i>",
            tip: "",
            click: () => {
                changeMode.value = 0
            },
        },
        {
            label: '顺序播放',
            icon: "<i class='iconfont icon-shunxubofang'></i>",
            tip: "",
            click: () => {
                return false
            },
            children: [{
                label: '列表循环',
                icon: "<i class='iconfont icon-liebiaoxunhuan'></i>",
                tip: "",
                click: () => {
                    rule.value = '1'
                },
            }, {
                label: '单曲循环',
                icon: "<i class='iconfont icon-hanhan-01-01'></i>",
                tip: "",
                click: () => {
                    rule.value = '2'
                },
            }, {
                label: '随机播放',
                icon: "<i class='iconfont icon-22_suijibofang'></i>",
                tip: "",
                click: () => {
                    rule.value = '3'
                },
            }, {
                label: '顺序播放',
                icon: "<i class='iconfont icon-shunxubofang'></i>",
                tip: "",
                click: () => {
                    rule.value = '0'
                },
            }]
        },
        {
            label: '打开桌面歌词',
            icon: "<i class='iconfont icon-dakai'></i>",
            tip: "",
            click: () => {
                if (!list.value[currentListIndex.value]) return;
                openLyric.value = !openLyric.value;
            },
        },
        {
            label: '退出',
            icon: "<i class='iconfont icon-tuichu'></i>",
            tip: "",
            click: () => {
                window.desktopMainAPI.exit();
            },
        },
    ],
    itemClass: "menus-item single-clamp"
})

/*右键点击时  一共有好几种情况  分别如下
1.歌曲来源为歌单
2.歌曲来源为专辑
3.歌曲来源为云盘
4.歌曲来源为FM
5.歌曲来源为播客节目（声音）
6.歌曲来源为本地下载的音乐（正常匹配/未知信息）

简化以上的情况 那就分为歌曲/播客节目（声音）
*/

//处理歌曲
function handleTypeSong(row: SongDetailSongsItem) {
    let list = [
        {
            label: handleComment(row),
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(Number(row.id), 'song')
            },
            show: row.publishTime === 0 ? false : true
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: (menu: typeof menus, { row, index }: { row: SongDetailSongsItem, index: number }) => {
                playSong(index)
            },
            show: true,
            divided: true
        },
        {
            label: handleAlbum(row),
            icon: "<i class='iconfont icon-zhuanji'></i>",
            tip: "",
            click: () => {
                if (row.publishTime === 0) return false
                else {
                    let albumId = row.album?.id || row.al?.id
                    setAlbum(albumId)
                }
            },
            show: handleAlbum(row) ? true : false
        },
        {
            label: handleArtists(row),
            icon: "<i class='iconfont icon-gerenxinxi'></i>",
            tip: "",
            click: () => {
                if (row.publishTime === 0) return false
                else {
                    return false
                }
            },
            show: handleArtists(row) ? true : false
        },
        {
            label: `${handleFrom(row)}`,
            icon: "<i class='iconfont icon-laiyuan'></i>",
            tip: "",
            click: () => {
                return false
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
                        songMenu.createSongMenuShow = true
                    }
                },
            ],
            show: typeof row.id === "number" ? true : false
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                let ar = (row.ar || row.artists).map(item => item.name)
                setShare({
                    id: Number(row.id),
                    type: row.radio ? 'radioProgram' : 'song',
                    currentSongImg: row?.al?.picUrl || row?.album?.picUrl,
                    title: row.name,
                    ar
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
                setDownload(row)
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
                removeItem(row.id)
            },
            show: true
        },
    ]
    /**
    菜单列表全部为
    1.查看评论
    2.播放
    3.专辑 ： xxx
    4.歌手 :  xxx
    5.来自 ： xxx
    6.收藏到歌单
    7.分享
    8.复制链接
    9.下载
     */
    list = list.filter(item => item.show)
    //收藏到歌单
    let index = list.findIndex(item => item.label === '收藏到歌单')
    if (index !== -1 && list[index].children) {
        handleCollectPlaylist(list[index].children, row)
    }
    menus.value.menus = list
}

//处理电台节目
function handleTypeRadioProgram(row: SongDetailSongsItem) {
    let list = [
        {
            label: handleComment(row),
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(Number(row.radio.programId), 'djProgram')
            },
            show: true
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: (menu: typeof menus, { row, index }: { row: SongDetailSongsItem, index: number }) => {
                playSong(index)
            },
            show: true,
            divided: true
        },
        {
            label: handleArtists(row),
            icon: "<i class='iconfont icon-gerenxinxi'></i>",
            tip: "",
            click: (menu: typeof menus, { row, index }: { row: SongDetailSongsItem, index: number }) => {
                playSong(index)
            },
            show: true,
        },
        {
            label: `${handleFrom(row)}`,
            icon: "<i class='iconfont icon-laiyuan'></i>",
            tip: "",
            click: () => {
                return false
            },
            show: true,
            divided: true
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                let ar = (row.ar || row.artists).map(item => item.name)
                setShare({
                    id: Number(row.id),
                    type: row.radio ? 'radioProgram' : 'song',
                    currentSongImg: row?.al?.picUrl || row?.album?.picUrl,
                    title: row.name,
                    ar
                })
            },
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('dj', row.id)
            },
            show: typeof row.id === "number" ? true : false
        },
        {
            label: "下载",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: () => {
                setDownload(row)
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
                removeItem(row.id)
            },
            show: true
        },
    ]
    list = list.filter(item => item.show)
    menus.value.menus = list
}

//处理评论
function handleComment(row: SongDetailSongsItem) {
    let resourceSong = songItem.findIndex((item) => item.resourceId === row?.id);
    let resourceRadioProgram = radioProgramItem.findIndex((item) => item.resourceId === row?.radio?.programId);
    if (row.radio && resourceRadioProgram !== -1) {
        return `查看评论(${radioProgramItem[resourceRadioProgram].commentCount})`
    } else if (resourceSong !== -1) {
        return `查看评论(${songItem[resourceSong].commentCount})`
    } else {
        return ''
    }
}






//获取歌单列表里面的评论
export const getCommentInfo = async (type: number, ids: Array<string | number>, router: any) => {
    let { data } = await getResouceCommentInfo(type, `[${ids}]`);
    switch (type) {
        case 1: {
            radioProgramItem = data
        }; break;
        case 4: {
            songItem = data
        }; break;
    }
}



export function contextMenuMini(event: MouseEvent, row: SongDetailSongsItem, index: number) {
    if (event.target instanceof HTMLElement) {
        if (event.target?.offsetParent?.tagName === "TH") return;
        let menu = document.querySelector(".v3-menus");
        if (menu) menu.outerHTML = "";
        if (row?.radio) {
            handleTypeRadioProgram(row)
        } else {
            handleTypeSong(row)
        }
        menusEvent(event, menus.value, { row, index });
        event.preventDefault();
    }
}

export function contextMenuMiniWrap(event: MouseEvent) {
    if (event.target instanceof HTMLElement) {
        if (event.target?.offsetParent?.tagName === "TH") return;
        let menu = document.querySelector(".v3-menus");
        if (menu) menu.outerHTML = "";
        menusEvent(event, menusWrap.value, "");
        event.preventDefault();
    }
}