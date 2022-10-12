import { SongDetailSongsItem } from "i/api/api_song";
import { menusEvent } from "vue3-menus";
import { fmTrash, fmDislike } from '@/api/api_private'

let skip: Function
const menus = shallowRef({
    menus: [
        {
            label: "推荐重复",
            tip: "",
            click: async (menu, arg: SongDetailSongsItem) => {
                let res = await fmTrash(Number(arg.id), "alg_fm_red_i2i", 3)
                skip && skip()
            },
        },
        {
            label: "推荐不感兴趣",
            tip: "",
            click: async (menu, arg: SongDetailSongsItem) => {
                let res = await fmTrash(Number(arg.id), "alg_fm_red_i2i", 3)
                let resources = [{
                    resourceId: arg.id, resourceType: 4, targetUrl: '', encId: String(arg.id),
                }]
                let res2 = await fmDislike(JSON.stringify(resources))
                skip && skip()
            },
        }
    ]
})

export function skipCallback(callback: Function) {
    skip = callback
}

export function contextMenuFM(event: MouseEvent, row: SongDetailSongsItem) {
    if (event.target instanceof HTMLElement) {
        if (event.target?.offsetParent?.tagName === "TH") return;
        let menu = document.querySelector(".v3-menus");
        if (menu) menu.outerHTML = "";
        if (menus.value.menus.length > 2) {
            menus.value.menus.splice(2, menus.value.menus.length - 1)
        }
        row.artists.forEach(item => {
            menus.value.menus.push({
                label: `屏蔽歌手：${item.name}`,
                tip: "",
                click: async (menu, arg: SongDetailSongsItem) => {
                    let res = await fmTrash(Number(arg.id), "alg_fm_sdm_v3_sub", 3)
                    let resources = [{
                        resourceId: arg.id, resourceType: 4, targetUrl: '', encId: String(arg.id),
                    }]
                    let res2 = await fmDislike(JSON.stringify(resources))
                    skip && skip()
                },

            })
        })
        menusEvent(event, menus.value, row);
        event.preventDefault();
    }
}