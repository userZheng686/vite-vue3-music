import { ArtistAlbumItem } from "@/interface/api/api_album";
import { useAlbumShare } from "@/utils/dialogShare";
import { menusEvent } from "vue3-menus";
import { routerInstance } from "@/contextMenu/routerInstance";
import { handlePlayAlbumlist, handleNextPlayAlbumlist, handleCollectAlbum, handleCopyLink, handleDownloadAlbumlistAll, loginCallback } from "../utils";


//专辑的右键菜单
export function contextMenuAlbum(event: MouseEvent, item: ArtistAlbumItem) {
    let list = [
        {
            label: '查看专辑',
            icon: "<i class='iconfont icon-chakan'></i>",
            tip: "",
            click: () => {
                routerInstance.push({
                    path: "/albumDetail",
                    query: {
                        id: item.id,
                    },
                });
            },
            show: true
        },
        {
            label: '播放',
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: async () => {
                handlePlayAlbumlist(item.id,item.name)
            },
            show: true
        },
        {
            label: '下一首播放',
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: async () => {
                handleNextPlayAlbumlist(item.id, item.name)
            },
            divided: true,
            show: true
        },
        {
            label: '收藏',
            icon: "<i class='iconfont icon-shoucang1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    handleCollectAlbum(item.id)
                    item.isSub = true
                })
            },
            show: !item.isSub
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => { 
                    useAlbumShare(item.id, item.picUrl, item.name, (status: { status: string }) => { console.log(status) })
                })
            },
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('album', item.id)
            },
            show: true
        },
        {
            label: "下载全部",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: async () => {
                loginCallback(() => {
                    handleDownloadAlbumlistAll(item.id,item.name)
                })
            },
            show: true
        },
    ]
    list = list.filter(item => item.show)
    menusEvent(event, list, item);
}