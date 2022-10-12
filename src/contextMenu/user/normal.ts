import { menusEvent } from "vue3-menus";
import { routerInstance } from "../routerInstance";
import { handleCopyLink } from "../utils";

//播客的右键菜单
export async function contextMenuUser(event: MouseEvent, id: number) {
    event.preventDefault()
    let list = [
        {
            label: '查看用户',
            icon: "<i class='iconfont icon-chakan'></i>",
            tip: "",
            click: () => {
                routerInstance.push({
                    path: "/homePage",
                    query: {
                        id,
                    },
                })
            },
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('user', id)
            },
            show: true
        },
    ]
    menusEvent(event, list,'');
}