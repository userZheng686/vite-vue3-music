import { subArtist } from "@/api/api_artist";
import { ArtistItem } from "@/interface/api/api_artist";
import { menusEvent } from "vue3-menus";
import { routerInstance } from "../routerInstance";
import { handleCopyLink, loginCallback } from "../utils";
import { ElMessage } from 'element-plus';

//歌手的右键菜单
export function contextMenuArtist(event: MouseEvent, item: ArtistItem) {
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
            show: true
        },
        {
            label: '收藏',
            icon: "<i class='iconfont icon-shoucang1'></i>",
            tip: "",
            click: () => {
                loginCallback(async () => {
                    try {
                        let res = await subArtist(item.id, 1)
                        ElMessage.success('收藏成功')
                        item.followed = true
                    } catch (e: any) {
                        ElMessage.success('收藏失败')
                    }
                })

            },
            show: item.followed ? false : true
        },
        {
            label: '复制链接',
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: async () => {
                handleCopyLink('artist', item.id)
            },
            show: true
        },
    ]
    list = list.filter(item => item.show)
    menusEvent(event, list, item);
}