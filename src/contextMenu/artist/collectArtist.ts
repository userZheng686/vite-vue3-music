import { subArtist } from "@/api/api_artist";
import { ArtistItem } from "@/interface/api/api_artist";
import { ElMessage } from "element-plus";
import { menusEvent } from "vue3-menus";
import { routerInstance } from "../routerInstance";
import { handleCopyLink, loginCallback } from "../utils";

//刷新页面
let refreshList: Function = () => { }

//歌手的右键菜单
export function contextMenuCollectArtist(event: MouseEvent, item: ArtistItem) {
    let list = [
        {
            label: '查看歌手',
            icon: "<i class='iconfont icon-chakan'></i>",
            tip: "",
            click: () => {
                routerInstance.push({
                    path: "/artists",
                    query: {
                        id: item.id,
                        type: 1
                    },
                });
            },
        },
        {
            label: '复制链接',
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: async () => {
                handleCopyLink('artist', item.id)
            },
        },
        {
            label: "删除歌手",
            icon: "<i class='iconfont icon-shanchu'></i>",
            tip: "",
            click: () => {
                loginCallback(async () => {
                    try {
                        let res = await subArtist(item.id, 2)
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
    refreshList = callback
}   
