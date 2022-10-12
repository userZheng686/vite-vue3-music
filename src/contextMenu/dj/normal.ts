import { useRadioShare } from "@/utils/dialogShare";
import { menusEvent } from "vue3-menus";
import { routerInstance } from "../routerInstance";
import { handleIsSubRadio, handleCollectDj, handleCopyLink, loginCallback } from "../utils";

//播客的右键菜单
export async function contextMenuDj(event: MouseEvent, item: {
    id: number;
    name: string;
    picUrl: string;
}) {
    event.preventDefault()
    let isCollect = await handleIsSubRadio(item.id)
    let list = [
        {
            label: '查看播客',
            icon: "<i class='iconfont icon-chakan'></i>",
            tip: "",
            click: () => {
                routerInstance.push({
                    path: '/broadCastDetail',
                    query: {
                        id: item.id
                    }
                })
            },
            show: true
        },
        {
            label: '收藏',
            icon: "<i class='iconfont icon-shoucang1'></i>",
            tip: "",
            click: async () => {
                loginCallback(() => {
                    handleCollectDj(item.id)
                })

            },
            show: isCollect
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    useRadioShare(item.id, item.picUrl, item.name, (status: { status: string }) => { console.log(status) })

                })

            },
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('radio', item.id)
            },
            show: true
        },
    ]
    list = list.filter(item => item.show)
    menusEvent(event, list, item);
}