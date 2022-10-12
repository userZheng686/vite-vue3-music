import { menusEvent } from "vue3-menus";
import { routerInstance } from "@/localStorage/instance";
import { handleNextPlayPlaylist, handlePlayPlaylist } from "../utils";

//每日推荐歌曲
export function contextMenuRecommendPlaylist(event: MouseEvent) {
    let list = [
        {
            label: '查看列表',
            icon: "<i class='iconfont icon-chakan'></i>",
            tip: "",
            click: () => {
                if (routerInstance) {
                    routerInstance.push({
                        path: '/recommendPlaylist'
                    })
                }
            },
        },
        {
            label: '播放',
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: async () => {
                handlePlayPlaylist(0, "每日歌曲推荐")
            },
        },
        {
            label: '下一首播放',
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: async () => {
                handleNextPlayPlaylist(0, "每日歌曲推荐")
            },
        },
    ]
    menusEvent(event, list,'');
}