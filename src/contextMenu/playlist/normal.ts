import { menusEvent } from "vue3-menus";
import { dislikePlaylist } from "@/api/api_playList";
import {
    FriendEliteSongMenuItem,
    RecommendSongMenuPersonalizedItem,
} from "i/api/api_playList";
import { routerInstance } from "@/localStorage/instance";
import { useLISTShare } from "@/utils/dialogShare";
import { ElMessage } from "element-plus";
import {
    handlePlayPlaylist,
    handleNextPlayPlaylist,
    handleCollectOnePlaylist,
    handleIsSubPlaylist,
    handleCopyLink,
    handleDownloadPlaylistAll,
    loginCallback
} from "../utils";

//歌单id
let playListIds: number[] = [];
//歌单列表
let playList: RecommendSongMenuPersonalizedItem[] = [];

/**
 * 歌单的右键菜单
 * @param item 歌单元素
 * @param rubbish 是否带不感兴趣
 */
export function contextMenuPlaylist(
    event: MouseEvent,
    item: FriendEliteSongMenuItem | RecommendSongMenuPersonalizedItem,
    rubbish?: boolean
) {
    let list = [
        {
            label: "查看歌单",
            icon: "<i class='iconfont icon-chakan'></i>",
            tip: "",
            click: () => {
                if (routerInstance) {
                    routerInstance.push({
                        path: "/songMenuDetail",
                        query: {
                            id: item.id,
                        },
                    });
                }
            },
            show: true,
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: async () => {
                handlePlayPlaylist(item.id, item.name);
            },
            show: true,
        },
        {
            label: "下一首播放",
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: async () => {
                handleNextPlayPlaylist(item.id, item.name);
            },
            divided: true,
            show: true,
        },
        {
            label: "收藏",
            icon: "<i class='iconfont icon-shoucang1'></i>",
            tip: "",
            click: async () => {
                loginCallback(() => handleCollectOnePlaylist(item.id))
            },
            show: handleIsSubPlaylist(item.id),
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    let img = item.picUrl || item.coverImgUrl;
                    useLISTShare(item.id, img, item.name, (status: { status: string }) => {
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
            divided: rubbish ? true : false,
            show: true,
        },
        {
            label: "不感兴趣",
            icon: "<i class='iconfont icon-chaping'></i>",
            tip: "",
            click: async () => {
                try {
                    playListIds = playListIds.filter(
                        (items) => items !== item.id && items !== 0
                    );
                    let { result } = await dislikePlaylist(
                        item.id,
                        1,
                        item.alg,
                        playListIds
                    );
                    let index = playList.findIndex((items) => items.id === item.id);
                    if (index !== -1) {
                        playList[index] = result[0];
                    }
                } catch (e: any) {
                    ElMessage.error(e?.msg || "今天没有更多推荐了");
                }
                return false;
            },
            show: rubbish,
        },
    ];
    list = list.filter((item) => item.show);
    menusEvent(event, list, item);
}

export function getPlayList(list: Array<RecommendSongMenuPersonalizedItem>) {
    playListIds = list.map((item) => item.id);
    playList = list;
}

