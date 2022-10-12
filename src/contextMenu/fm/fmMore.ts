//下载音乐
import { downloadMusic } from "@/utils/download";
import { useUserInformation } from "@/store/user";
import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { ElMessage } from 'element-plus';
import { useClipboard } from '@vueuse/core'
import { menusEvent } from "vue3-menus";
import { SongDetailSongsItem } from "i/api/api_song";
import { setShare } from "@/localStorage/set";
import { handleCollectPlaylist, loginCallback } from "../utils";

//拷贝vue-router里面的router实例 因为router是通过inject的方式来继承的
let routerInstance: any = null
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
//用户信息
let userInfo = useUserInformation();
//弹窗显示
let songMenu = useSongMenuPopupStore();
//复制粘贴
const source = ref('Hello')
const { text, copy, copied, isSupported } = useClipboard({ source })



export function getRouteInstance(router: any) {
    routerInstance = router
}

export function contextMenuFmMore(event: MouseEvent, row: SongDetailSongsItem) {
    if (event.target instanceof HTMLElement) {
        if (event.target?.offsetParent?.tagName === "TH") return;
        let menu = document.querySelector(".v3-menus");
        if (menu) menu.outerHTML = "";
        let list = [
            {
                label: "收藏到歌单",
                icon: "<i class='iconfont icon-shoucang1'></i>",
                tip: "",
                click: () => {

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
            },
            {
                label: "分享......",
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

            },
            {
                label: "复制链接",
                icon: "<i class='iconfont icon-fuzhilianjie'></i>",
                tip: "",
                click: () => {
                    source.value = `http://music.163.com/song?id=${row.id}&userid=${userInfo.user_profile.userId}`
                    copy()
                    ElMessage.success('复制链接成功')
                },
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
            },
            {
                label: "跳转到垃圾桶列表",
                icon: "<i class='iconfont icon-menu'></i>",
                tip: "",
                click: () => {
                    loginCallback(() => {
                        routerInstance.push({
                            path: '/rubbish'
                        })
                    })

                },
            }
        ]
        //收藏到歌单
        let index = list.findIndex(item => item.label === '收藏到歌单')
        if (index !== -1 && list[index].children) {
            handleCollectPlaylist(list[index].children, row)
        }
        menusEvent(event, list, row);
        event.preventDefault();
    }
}
