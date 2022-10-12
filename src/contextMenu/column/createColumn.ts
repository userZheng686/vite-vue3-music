import { ColumnCreateListItem } from "i/api/api_column";
import { useColumnShare } from "@/utils/dialogShare";
import { menusEvent } from "vue3-menus";
import { handleCopyLink, loginCallback } from "../utils";

//播客的右键菜单
export async function contextMenuCreateColumn(event: MouseEvent, item: ColumnCreateListItem) {
    event.preventDefault()
    let list = [
        {
            label: '查看专栏文章',
            icon: "<i class='iconfont icon-dakai'></i>",
            tip: "",
            click: () => {
                //跳转
                if (window.desktopMainAPI) {
                    window.desktopMainAPI.href(`https://music.163.com/#/topic?id=${item.id}`);
                } else {
                    window.open(`https://music.163.com/#/topic?id=${item.id}`);
                }
            },
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    useColumnShare(item.id, item.name, item.coverUrl)
                })

            },
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('topic', item.id)
            },
        },
    ]
    menusEvent(event, list, item);
}