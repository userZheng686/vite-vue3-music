import { routerInstance } from "@/localStorage/instance";
import { menusEvent } from "vue3-menus";

export function contextMenuPrivatecontent(event: MouseEvent, id: number) {
    let list = [
        {
            label: "播放MV",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: () => {
                if (routerInstance) {
                    routerInstance.push({
                        path: '/mvDetail',
                        query: {
                            mvid: id
                        }
                    })
                }

            }
        }
    ]
    menusEvent(event, list, id);
}