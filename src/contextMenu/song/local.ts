import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { SongDetailSongsItem } from "@/interface/api/api_song"
import { menusEvent } from "vue3-menus"
import { handlePlaySong, handleNextPlaySong, handleCopyLink, handleCollectPlaylist, loginCallback } from "../utils"


//歌曲右键菜单
export function contextMenuLocalSong(event: MouseEvent, row: SongDetailSongsItem) {
    let list = [
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
        },
    ]
    list = list.filter(item => item.show)

    menusEvent(event, list, row);
}
