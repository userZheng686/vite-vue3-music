import { menusEvent } from "vue3-menus";
import {
    playlist,
} from "i/api/api_playList";
import { routerInstance } from "@/localStorage/instance";
import { useLISTShare } from "@/utils/dialogShare";
import { ElMessage } from "element-plus";
import {
    handlePlayPlaylist,
    handleNextPlayPlaylist,
    handleCopyLink,
    handleDownloadPlaylistAll,
    handleDeletePlaylist,
    loginCallback,
} from "../utils";



/**
 * 歌单的右键菜单
 * @param item 歌单元素
 * @param isUserLike 是否是用户喜欢的音乐
 * @param isUserCreate 是否是用户自己创建的歌单
 */
export function contextMenuNavigationPlaylist(
    event: MouseEvent,
    item: {
        coverImgUrl: string;
        id: number;
        title: string;
    },
    isUserLike: boolean,
    isUserCreate: boolean,
) {
    let list = [
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: async () => {
                handlePlayPlaylist(item.id, item.title);
            },
            show: true,
        },
        {
            label: "下一首播放",
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: async () => {
                handleNextPlayPlaylist(item.id, item.title);
            },
            divided: true,
            show: true,
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    let img = item.coverImgUrl;
                    useLISTShare(item.id, img, item.title, (status: { status: string }) => {
                        console.log(status);
                    });
                })
            },
            show: true,
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink("playlist", item.id);
            },
            show: true,
        },
        {
            label: "下载全部",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: async () => {
                loginCallback(() => {
                    handleDownloadPlaylistAll(item.id);
                })
            },
            divided: true,
            show: true,
        },
        {
            label: "编辑歌单信息",
            icon: "<i class='iconfont icon-xiezi'></i>",
            tip: "",
            click: async () => {
                loginCallback(() => {
                    routerInstance?.push({
                        path: '/updateSongMenuDetail',
                        query: {
                            id: item.id
                        }
                    })
                })
            },
            show: isUserCreate && !isUserLike,
        }, {
            label: "删除歌单",
            icon: "<i class='iconfont icon-shanchu'></i>",
            tip: "",
            click: async () => {
                loginCallback(() => {
                    handleDeletePlaylist(item.id);
                })
            },
            show: !isUserLike,
        },
    ];
    list = list.filter((item) => item.show);
    menusEvent(event, list, item);
}


