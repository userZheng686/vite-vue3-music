import { CollectSubListItem } from "@/interface/api/api_album";
import { useAlbumShare } from "@/utils/dialogShare";
import { menusEvent } from "vue3-menus";
import { routerInstance } from "@/contextMenu/routerInstance";
import { handlePlayAlbumlist, handleNextPlayAlbumlist, handleCollectAlbum, handleCopyLink, handleDownloadAlbumlistAll, loginCallback } from "../utils";
import { collectAlbumSub } from "@/api/api_album";
import { ElMessage } from 'element-plus';


//刷新页面
let refreshList: Function = () => { }

//专辑的右键菜单
export function contextMenuCollectAlbum(event: MouseEvent, item: CollectSubListItem) {
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
        },
        {
            label: '播放',
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: async () => {
                handlePlayAlbumlist(item.id, item.name)
            },
        },
        {
            label: '下一首播放',
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: async () => {
                handleNextPlayAlbumlist(item.id, item.name)
            },
            divided: true,
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
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('album', item.id)
            },
        },
        {
            label: "下载全部",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: async () => {
                loginCallback(() => {
                    handleDownloadAlbumlistAll(item.id, item.name)
                })
            },
            divided: true
        },
        {
            label: "删除专辑",
            icon: "<i class='iconfont icon-shanchu'></i>",
            tip: "",
            click: () => {
                loginCallback(async () => {
                    try {
                        let res = await collectAlbumSub(item.id, 2)
                        ElMessage.success('删除成功')
                        refreshList(item.id)
                    } catch (e: any) {
                        ElMessage.success('删除失败')
                    }
                })
            },
        },
    ]
    menusEvent(event, list, item);
}

export function refreshCallback(callback: Function) {
    refreshList = callback;
}