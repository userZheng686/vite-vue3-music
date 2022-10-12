import { removeTrash } from '@/api/api_private'
import { SongDetailSongsItem } from "i/api/api_song";
import { menusEvent } from "vue3-menus";

let removeCallback: Function
const menus = shallowRef({
    menus: [
        {
            label: "还原",
            tip: "",
            click: async (menu, arg: SongDetailSongsItem) => {
                let res = await removeTrash(`[${arg.id}]`)
                removeCallback && removeCallback()
            },
        },
    ]
})

export function removeTrashCallback(callback: Function) {
    removeCallback = callback
}

export function contextMenuRubbish(event: MouseEvent, row: SongDetailSongsItem) {
    if (event.target instanceof HTMLElement) {
        if (event.target?.offsetParent?.tagName === "TH") return;
        let menu = document.querySelector(".v3-menus");
        if (menu) menu.outerHTML = "";
        menusEvent(event, menus.value, row);
        event.preventDefault();
    }
}